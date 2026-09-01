#!/usr/bin/env node
/**
 * generate-api.js — Generate Fabric Gateway SDK + REST API.
 * 
 * Uso: node scripts/generate-api.js --chaincode assettransfer
 */

const fs = require('fs');
const path = require('node:path');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        chaincodeName: 'assettransfer',
        channelName: 'mychannel',
        orgMSP: 'Org1MSP',
        caUrl: 'https://localhost:7054'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--chaincodeName':
                config.chaincodeName = args[++i];
                break;
            case '--channelName':
                config.channelName = args[++i];
                break;
            case '--orgMSP':
                config.orgMSP = args[++i];
                break;
            case '--caUrl':
                config.caUrl = args[++i];
                break;
        }
    }
    return config;
}

function generateGateway(config) {
    return `const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function getGateway(userId) {
    // Load connection profile
    const connectionProfile = JSON.parse(
        fs.readFileSync('./connection-profile/org1-network.json', 'utf8')
    );
    
    // Load wallet
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    // Connect
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
        wallet,
        identity: userId,
        discovery: { 
            enabled: true, 
            asLocalhost: true 
        }
    });
    
    return gateway;
}

async function submitTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    
    try {
        const network = await gateway.getNetwork('${config.channelName}');
        const contract = network.getContract('${config.chaincodeName}');
        
        // Submit transaction (writes to ledger)
        const result = await contract.submitTransaction(functionName, ...args);
        
        return result.toString();
    } finally {
        gateway.disconnect();
    }
}

async function evaluateTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    
    try {
        const network = await gateway.getNetwork('${config.channelName}');
        const contract = network.getContract('${config.chaincodeName}');
        
        // Evaluate transaction (read-only, no ledger write)
        const result = await contract.evaluateTransaction(functionName, ...args);
        
        return JSON.parse(result.toString());
    } finally {
        gateway.disconnect();
    }
}

// Usage
// await submitTransaction('admin', '${config.chaincodeName}', 'CreateAsset', 'asset1', 'blue', 5, 'Org1', 300);
// await submitTransaction('admin', '${config.chaincodeName}', 'TransferAsset', 'asset1', 'Org2');
//
// const asset = await evaluateTransaction('admin', '${config.chaincodeName}', 'ReadAsset', 'asset1');
// const allAssets = await evaluateTransaction('admin', '${config.chaincodeName}', 'QueryAllAssets');

module.exports = { submitTransaction, evaluateTransaction, getGateway };
`;
}

function generateAPIServer(config) {
    return `const express = require('express');
const { submitTransaction, evaluateTransaction } = require('./gateway');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create asset
app.post('/assets', async (req, res) => {
    try {
        const { id, color, size, owner, appraisedValue } = req.body;
        await submitTransaction('admin', '${config.chaincodeName}', 'CreateAsset', id, color, size, owner, appraisedValue);
        res.json({ success: true, message: 'Asset created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read asset
app.get('/assets/:id', async (req, res) => {
    try {
        const asset = await evaluateTransaction('admin', '${config.chaincodeName}', 'ReadAsset', req.params.id);
        res.json(asset);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Update asset
app.put('/assets/:id', async (req, res) => {
    try {
        const { color, size, owner, appraisedValue } = req.body;
        await submitTransaction('admin', '${config.chaincodeName}', 'UpdateAsset', req.params.id, color, size, owner, appraisedValue);
        res.json({ success: true, message: 'Asset updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete asset
app.delete('/assets/:id', async (req, res) => {
    try {
        await submitTransaction('admin', '${config.chaincodeName}', 'DeleteAsset', req.params.id);
        res.json({ success: true, message: 'Asset deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Transfer asset
app.put('/assets/:id/transfer', async (req, res) => {
    try {
        const { newOwner } = req.body;
        await submitTransaction('admin', '${config.chaincodeName}', 'TransferAsset', req.params.id, newOwner);
        res.json({ success: true, message: 'Asset transferred' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Query all assets
app.get('/assets', async (req, res) => {
    try {
        const result = await evaluateTransaction('admin', '${config.chaincodeName}', 'QueryAllAssets');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Query asset history
app.get('/assets/:id/history', async (req, res) => {
    try {
        const history = await evaluateTransaction('admin', '${config.chaincodeName}', 'GetAssetHistory', req.params.id);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit private data
app.post('/private-data', async (req, res) => {
    try {
        const { collection, key, value } = req.body;
        await submitTransaction('admin', '${config.chaincodeName}', 'PutPrivateData', collection, key, value);
        res.json({ success: true, message: 'Private data stored' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get private data
app.get('/private-data/:collection/:key', async (req, res) => {
    try {
        const result = await evaluateTransaction('admin', '${config.chaincodeName}', 'GetPrivateData', req.params.collection, req.params.key);
        res.json({ value: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Fabric API server running on port \${PORT}\`);
    console.log(\`Endpoints:\`);
    console.log(\`  POST   /assets\`);
    console.log(\`  GET    /assets\`);
    console.log(\`  GET    /assets/:id\`);
    console.log(\`  PUT    /assets/:id\`);
    console.log(\`  DELETE /assets/:id\`);
    console.log(\`  PUT    /assets/:id/transfer\`);
    console.log(\`  GET    /assets/:id/history\`);
    console.log(\`  POST   /private-data\`);
    console.log(\`  GET    /private-data/:collection/:key\`);
});
`;
}

function generateOpenAPISpec(config) {
    return `openapi: 3.0.0
info:
  title: ${config.chaincodeName} Fabric API
  version: 1.0.0
  description: REST API for ${config.chaincodeName} chaincode on Hyperledger Fabric
servers:
  - url: http://localhost:3000
    description: Development server
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
  /assets:
    get:
      summary: List all assets
      responses:
        '200':
          description: List of assets
  /assets:
    post:
      summary: Create new asset
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [id, color, size, owner, appraisedValue]
              properties:
                id: { type: string }
                color: { type: string }
                size: { type: integer }
                owner: { type: string }
                appraisedValue: { type: integer }
      responses:
        '200':
          description: Asset created
  /assets/{id}:
    get:
      summary: Get asset by ID
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Asset found
        '404':
          description: Not found
    put:
      summary: Update asset
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                color: { type: string }
                size: { type: integer }
                owner: { type: string }
                appraisedValue: { type: integer }
      responses:
        '200':
          description: Asset updated
    delete:
      summary: Delete asset
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Asset deleted
  /assets/{id}/transfer:
    put:
      summary: Transfer asset
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [newOwner]
              properties:
                newOwner: { type: string }
      responses:
        '200':
          description: Asset transferred
  /assets/{id}/history:
    get:
      summary: Get asset history
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Asset history
  /private-data:
    post:
      summary: Store private data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [collection, key, value]
              properties:
                collection: { type: string }
                key: { type: string }
                value: { type: string }
      responses:
        '200':
          description: Private data stored
  /private-data/{collection}/{key}:
    get:
      summary: Get private data
      parameters:
        - name: collection
          in: path
          required: true
          schema: { type: string }
        - name: key
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Private data retrieved
`;
}

function main() {
    const config = parseArgs();
    
    console.log('Generating Fabric API server...');
    
    const outputDir = path.resolve('generated-fabric-network/api');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'gateway.js'), generateGateway(config), 'utf8');
    fs.writeFileSync(path.join(outputDir, 'server.js'), generateAPIServer(config), 'utf8');
    fs.writeFileSync(path.join(outputDir, 'openapi.yaml'), generateOpenAPISpec(config), 'utf8');
    
    // Package.json
    const packageJson = {
        name: 'fabric-api',
        version: '1.0.0',
        description: 'REST API for Fabric chaincode',
        main: 'server.js',
        scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js'
        },
        dependencies: {
            express: '^4.18.2',
            'fabric-network': '^2.2.20',
            'fabric-ca-client': '^2.2.20',
            'fabric-ca-client': '^2.2.20',
            js-yaml: '^4.1.0'
        },
        devDependencies: {
            nodemon: '^3.0.1'
        }
    };
    
    fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
    
    console.log('✅ API server generated');
    console.log('📁 Files:');
    console.log('  - gateway.js (Gateway SDK wrapper)');
    console.log('  - server.js (Express REST API)');
    console.log('  - openapi.yaml (OpenAPI 3.0 spec)');
    console.log('  - package.json');
}

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        chaincodeName: 'assettransfer',
        channelName: 'mychannel',
        orgMSP: 'Org1MSP',
        caUrl: 'https://localhost:7054'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--chaincodeName':
                config.chaincodeName = args[++i];
                break;
            case '--channelName':
                config.channelName = args[++i];
                break;
            case '--orgMSP':
                config.orgMSP = args[++i];
                break;
            case '--caUrl':
                config.caUrl = args[++i];
                break;
        }
    }
    return config;
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});