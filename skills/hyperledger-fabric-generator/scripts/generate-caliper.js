#!/usr/bin/env node
/**
 * generate-caliper.js — Generate Hyperledger Caliper benchmark configuration.
 * 
 * Uso: node scripts/generate-caliper.js --chaincode assettransfer --tps 100
 */

const fs = require('fs');
const path = require('node:path');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        chaincodeName: 'assettransfer',
        contractVersion: '1.0',
        channelName: 'mychannel',
        tps: 100,
        duration: 60,
        workload: 'simple',
        initialAssets: 1000
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--chaincodeName':
                config.chaincodeName = args[++i];
                break;
            case '--contractVersion':
                config.contractVersion = args[++i];
                break;
            case '--channelName':
                config.channelName = args[++i];
                break;
            case '--tps':
                config.tps = parseInt(args[++i]);
                break;
            case '--duration':
                config.duration = parseInt(args[++i]);
                break;
            case '--workload':
                config.workload = args[++i];
                break;
            case '--initialAssets':
                config.initialAssets = parseInt(args[++i]);
                break;
        }
    }
    return config;
}

function generateCaliperConfig(config) {
    return `caliper:
  blockchain: fabric

fabric:
  fabricNetwork: ./connection-profile/org1-network.json
  contractID: ${config.chaincodeName}
  contractVersion: "${config.contractVersion}"
  txDuration: ${config.duration}
  rateControl:
    type: fixed-rate
    opts:
      tps: ${config.tps}
  workload:
    module: ./workload/${config.chaincodeName}.js
    arguments:
      initialAssets: ${config.initialAssets}
      numberOfAssets: 10000`;
}

function generateWorkloadSimple(config) {
    return `'use strict';

module.exports.info = 'Asset Transfer Workload';

let bc, contx;

module.exports.init = async (blockchain, context, args) => {
    bc = blockchain;
    contx = context;
    
    // Create initial assets
    for (let i = 0; i < args.initialAssets; i++) {
        await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'CreateAsset', [\`asset\${i}\`, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.run = async () => {
    // Read asset (90% reads)
    if (Math.random() < 0.9) {
        const assetId = \`asset\${Math.floor(Math.random() * 1000)}\`;
        await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'ReadAsset', [assetId]);
    } else {
        // Write asset (10% writes)
        const assetId = \`asset\${Date.now()}\`;
        await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'CreateAsset', [assetId, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.end = async () => {
    // Cleanup
};`;
}

function generateWorkloadComplex(config) {
    return `'use strict';

module.exports.info = 'Complex Fabric Workload';

let bc, contx;

const OPERATIONS = [
    { name: 'CreateAsset', weight: 10 },
    { name: 'ReadAsset', weight: 50 },
    { name: 'UpdateAsset', weight: 20 },
    { name: 'TransferAsset', weight: 15 },
    { name: 'QueryAllAssets', weight: 5 }
];

module.exports.init = async (blockchain, context, args) => {
    bc = blockchain;
    contx = context;
    
    for (let i = 0; i < args.initialAssets; i++) {
        await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'CreateAsset', [\`asset\${i}\`, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.run = async () => {
    const totalWeight = OPERATIONS.reduce((sum, op) => sum + op.weight, 0);
    let rand = Math.random() * totalWeight;
    
    for (const op of OPERATIONS) {
        rand -= op.weight;
        if (rand <= 0) {
            switch (op.name) {
                case 'CreateAsset':
                    await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'CreateAsset', [\`asset\${Date.now()}\`, 'red', 10, 'Org2', 500]);
                    break;
                case 'ReadAsset':
                    await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'ReadAsset', [\`asset\${Math.floor(Math.random() * 1000)}\`]);
                    break;
                case 'UpdateAsset':
                    await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'UpdateAsset', [\`asset\${Math.floor(Math.random() * 1000)}\`, 'green', 15, 'Org1', 400]);
                    break;
                case 'TransferAsset':
                    await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'TransferAsset', [\`asset\${Math.floor(Math.random() * 1000)}\`, 'Org2']);
                    break;
                case 'QueryAllAssets':
                    await bc.invokeSmartContract(contx, '${config.chaincodeName}', 'v1', 'QueryAllAssets', []);
                    break;
            }
            break;
        }
    }
};

module.exports.end = async () => {
    // Cleanup
};`;
}

function generateNetworkConfig(config) {
    return `caliper:
  blockchain: fabric

fabric:
  admin:
    id: admin
    password: adminpw
  
  networkConfig: ./connection-profile/org1-network.json
  
  channels:
    - ${config.channelName}
  
  organizations:
    Org1:
      mspid: Org1MSP
      peers:
        - peer0.org1.example.com
      certificateAuthorities:
        - ca-org1
    Org2:
      mspid: Org2MSP
      peers:
        - peer0.org2.example.com
      certificateAuthorities:
        - ca-org2`;
}

function main() {
    const config = parseArgs();
    
    console.log('Generating Caliper benchmark config...');
    
    const outputDir = path.resolve('generated-fabric-network/caliper');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    if (!fs.existsSync(path.join(outputDir, 'workload'))) {
        fs.mkdirSync(path.join(outputDir, 'workload'), { recursive: true });
    }
    
    const caliperConfig = generateCaliperConfig(config);
    fs.writeFileSync(path.join(outputDir, 'caliper-config.yaml'), caliperConfig, 'utf8');
    
    const workload = config.workload === 'complex' ? generateWorkloadComplex(config) : generateWorkloadSimple(config);
    fs.writeFileSync(path.join(outputDir, 'workload', `${config.chaincodeName}.js`), workload, 'utf8');
    
    const networkConfig = generateNetworkConfig(config);
    fs.writeFileSync(path.join(outputDir, 'network-config.yaml'), networkConfig, 'utf8');
    
    // Copy connection profile
    const srcProfile = path.resolve('generated-fabric-network/explorer/connection-profile/org1-network.json');
    const destProfile = path.join(outputDir, 'connection-profile');
    if (!fs.existsSync(destProfile)) {
        fs.mkdirSync(destProfile, { recursive: true });
    }
    if (fs.existsSync(srcProfile)) {
        fs.copyFileSync(srcProfile, path.join(destProfile, 'org1-network.json'));
    }
    
    console.log('✅ Caliper config generated');
    console.log('📁 Files:');
    console.log('  - caliper-config.yaml');
    console.log('  - network-config.yaml');
    console.log('  - workload/${config.chaincodeName}.js');
    console.log('  - connection-profile/org1-network.json');
}

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        chaincodeName: 'assettransfer',
        contractVersion: '1.0',
        channelName: 'mychannel',
        tps: 100,
        duration: 60,
        workload: 'simple',
        initialAssets: 1000
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--chaincodeName':
                config.chaincodeName = args[++i];
                break;
            case '--contractVersion':
                config.contractVersion = args[++i];
                break;
            case '--channelName':
                config.channelName = args[++i];
                break;
            case '--tps':
                config.tps = parseInt(args[++i]);
                break;
            case '--duration':
                config.duration = parseInt(args[++i]);
                break;
            case '--workload':
                config.workload = args[++i];
                break;
            case '--initialAssets':
                config.initialAssets = parseInt(args[++i]);
                break;
        }
    }
    return config;
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});