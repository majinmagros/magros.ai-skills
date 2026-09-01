#!/usr/bin/env node
/**
 * generate-network.js — Main generator for Hyperledger Fabric network.
 * 
 * Uso: node scripts/generate-network.js --orgCount 2 --peerPerOrg 1 --channelName mychannel
 */

const fs = require('fs');
const path = require('node:path');
const { FabricGenerator } = require('./generator');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        orgCount: 2,
        peerPerOrg: 1,
        ordererCount: 1,
        channelName: 'mychannel',
        chaincodeName: 'assettransfer',
        chaincodeLang: 'golang',
        consensus: 'etcdraft',
        enableTLS: true,
        enableCouchDB: true,
        enableExplorer: true,
        enableCaliper: false,
        orgs: []
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--orgCount':
                config.orgCount = parseInt(args[++i]);
                break;
            case '--peerPerOrg':
                config.peerPerOrg = parseInt(args[++i]);
                break;
            case '--ordererCount':
                config.ordererCount = parseInt(args[++i]);
                break;
            case '--channelName':
                config.channelName = args[++i];
                break;
            case '--chaincodeName':
                config.chaincodeName = args[++i];
                break;
            case '--chaincodeLang':
                config.chaincodeLang = args[++i];
                break;
            case '--consensus':
                config.consensus = args[++i];
                break;
            case '--enableTLS':
                config.enableTLS = args[++i] === 'true';
                break;
            case '--enableCouchDB':
                config.enableCouchDB = args[++i] === 'true';
                break;
            case '--enableExplorer':
                config.enableExplorer = args[++i] === 'true';
                break;
            case '--enableCaliper':
                config.enableCaliper = args[++i] === 'true';
                break;
            case '--orgs':
                // Format: name:domain:peerCount:usersCount
                const orgStr = args[++i];
                const orgs = orgStr.split(',').map(o => {
                    const [name, domain, peerCount, usersCount] = o.split(':');
                    return { name, domain, peerCount: parseInt(peerCount) || 1, usersCount: parseInt(usersCount) || 1 };
                });
                config.orgs = orgs;
                break;
        }
    }

    // Generate default orgs if not provided
    if (config.orgs.length === 0) {
        for (let i = 1; i <= config.orgCount; i++) {
            config.orgs.push({
                name: `Org${i}`,
                domain: `org${i}.example.com`,
                peerCount: config.peerPerOrg,
                usersCount: 1
            });
        }
    }

    return config;
}

async function main() {
    const config = parseArgs();
    
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║     HYPERLEDGER FABRIC NETWORK GENERATOR      ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log('\nConfiguration:');
    console.log(`  Organizations: ${config.orgCount}`);
    console.log(`  Peers per org: ${config.peerPerOrg}`);
    console.log(`  Orderers: ${config.ordererCount}`);
    console.log(`  Channel: ${config.channelName}`);
    console.log(`  Chaincode: ${config.chaincodeName} (${config.chaincodeLang})`);
    console.log(`  Consensus: ${config.consensus}`);
    console.log(`  TLS: ${config.enableTLS}`);
    console.log(`  CouchDB: ${config.enableCouchDB}`);
    console.log(`  Explorer: ${config.enableExplorer}`);
    console.log(`  Caliper: ${config.enableCaliper}`);
    console.log('');

    const generator = new (require('./generator').FabricGenerator)(config);
    const files = generator.generate();

    // Create output directory
    const outputDir = path.resolve('generated-fabric-network');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write all files
    let fileCount = 0;
    for (const [filePath, content] of Object.entries(files)) {
        const fullPath = path.join(outputDir, filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        fileCount++;
    }

    console.log(`\n✅ Generated ${fileCount} files in: ${outputDir}`);
    console.log('\nNext steps:');
    console.log('  1. cd generated-fabric-network');
    console.log('  2. chmod +x scripts/deploy.sh');
    console.log('  3. ./scripts/deploy.sh');
    console.log('\nOr use the web generator for interactive configuration.');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});