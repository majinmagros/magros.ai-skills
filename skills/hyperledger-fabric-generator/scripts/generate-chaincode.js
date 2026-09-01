#!/usr/bin/env node
/**
 * generate-chaincode.js — Generate chaincode templates (Go/Node.js).
 * 
 * Uso: node scripts/generate-chaincode.js --name assettransfer --lang golang
 */

const fs = require('fs');
const path = require('node:path');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        name: 'assettransfer',
        lang: 'golang',
        functions: ['CreateAsset', 'ReadAsset', 'UpdateAsset', 'DeleteAsset', 'TransferAsset', 'QueryAllAssets'],
        privateData: false
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--name':
                config.name = args[++i];
                break;
            case '--lang':
                config.lang = args[++i];
                break;
            case '--functions':
                config.functions = args[++i].split(',');
                break;
            case '--private-data':
                config.privateData = args[++i] === 'true';
                break;
        }
    }
    return config;
}

function generateGoChaincode(config) {
    const funcs = config.functions.map(f => {
        const camel = f.charAt(0).toLowerCase() + f.slice(1);
        return `
func (s *SmartContract) ${f}(ctx contractapi.TransactionContextInterface${f.includes('Create') || f.includes('Update') ? ', id string, color string, size int, owner string, appraisedValue int' : f.includes('Read') || f.includes('Delete') || f.includes('Transfer') ? ', id string' : ''}${f === 'TransferAsset' ? ', newOwner string' : ''}) error {
    // TODO: Implement ${f}
    return nil
}`;
    }).join('\n');

    return `package main

import (
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"encoding/json"
)

type SmartContract struct {
	contractapi.Contract
}

type Asset struct {
	ID             string \\`json:"ID"\\`
	Color          string \\`json:"color"\\`
	Size           int    \\`json:"size"\\`
	Owner          string \\`json:"owner"\\`
	AppraisedValue int    \\`json:"appraisedValue"\\`
}

${funcs}

func main() {
	chaincode, _ := contractapi.NewChaincode(new(SmartContract))
	chaincode.Start()
}
`;
}

function generateJSChaincode(config) {
    const methods = config.functions.map(f => {
        const camel = f.charAt(0).toLowerCase() + f.slice(1);
        const params = f.includes('Create') || f.includes('Update') 
            ? 'id, color, size, owner, appraisedValue'
            : f.includes('Read') || f.includes('Delete') || f.includes('Transfer')
            ? 'id' + (f === 'TransferAsset' ? ', newOwner' : '')
            : '';
        const body = f.includes('Create') || f.includes('Update')
            ? `const asset = { ID: id, Color: color, Size: parseInt(size), Owner: owner, AppraisedValue: parseInt(appraisedValue) };\n        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));`
            : f.includes('Read')
            ? `const assetJSON = await ctx.stub.getState(id);\n        if (!assetJSON || assetJSON.length === 0) throw new Error(\`Asset \${id} does not exist\`);\n        return JSON.parse(assetJSON.toString());`
            : f.includes('Delete')
            ? `await ctx.stub.deleteState(id);`
            : f.includes('Transfer')
            ? `const asset = await this.ReadAsset(ctx, id);\n        asset.Owner = newOwner;\n        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));`
            : f.includes('QueryAll')
            ? `const iterator = await ctx.stub.getStateByRange('', '');\n        const results = [];\n        while (true) {\n            const res = await iterator.next();\n            if (res.value && res.value.value.toString()) {\n                results.push(JSON.parse(res.value.value.toString()));\n            }\n            if (res.done) { await iterator.close(); break; }\n        }\n        return JSON.stringify(results);`
            : '// TODO';

        return `
    async ${camel}(ctx, ${params}) {
        ${body}
    }`;
    }).join('\n');

    return `'use strict';

const { Contract } = require('fabric-contract-api');

class ${config.name.charAt(0).toUpperCase() + config.name.slice(1)} extends Contract {
${methods}
}

module.exports = ${config.name.charAt(0).toUpperCase() + config.name.slice(1)};
`;
}

function generateCollectionsConfig(config) {
    if (!config.privateData) return '';
    return `[
  {
    "name": "Org1PrivateDetails",
    "policy": "OR('Org1MSP.peer')",
    "requiredPeerCount": 0,
    "maxPeerCount": 3,
    "blockToLive": 1000,
    "memberOnlyRead": true,
    "endorsementPolicy": {
      "signaturePolicy": "OR('Org1MSP.peer')"
    }
  }
]`;
}

function main() {
    const config = parseArgs();
    
    console.log(`Generating chaincode: ${config.name} (${config.lang})`);
    
    if (config.lang === 'golang' || config.lang === 'go') {
        const content = generateGoChaincode(config);
        fs.writeFileSync(`${config.name}.go`, content, 'utf8');
        console.log(`✅ Generated ${config.name}.go`);
    } else if (config.lang === 'javascript' || config.lang === 'node' || config.lang === 'js') {
        const content = generateJSChaincode(config);
        fs.writeFileSync(`${config.name}.js`, content, 'utf8');
        console.log(`✅ Generated ${config.name}.js`);
    } else {
        console.error('Unsupported language:', config.lang);
        process.exit(1);
    }
    
    // Generate collections config if needed
    if (config.privateData) {
        const collections = generateCollectionsConfig(config);
        fs.writeFileSync('collections_config.json', collections, 'utf8');
        console.log('✅ Generated collections_config.json');
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});