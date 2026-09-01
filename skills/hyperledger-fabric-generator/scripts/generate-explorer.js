#!/usr/bin/env node
/**
 * generate-explorer.js — Generate Fabric Explorer configuration.
 * 
 * Uso: node scripts/generate-explorer.js --orgCount 2
 */

const fs = require('fs');
const path = require('node:path');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        orgCount: 2,
        peerPerOrg: 1,
        ordererCount: 1,
        channelName: 'mychannel',
        enableExplorer: true
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
        }
    }
    return config;
}

function generateExplorerConfig(config) {
    return `{
  "network-configs": {
    "org1-network": {
      "name": "Org1 Network",
      "profile": "./connection-profile/org1-network.json",
      "adminCredential": {
        "id": "admin",
        "password": "adminpw"
      }
    }
  },
  "license": "Apache-2.0",
  "host": "localhost",
  "port": 8080,
  "channel": "${config.channelName}",
  "keyValueStore": "/tmp/fabric-explorer",
  "sync": {
    "blocks": true,
    "transactions": true,
    "chaincodes": true
  },
  "persistence": "postgres",
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "explorer",
    "username": "postgres",
    "password": "postgrespw"
  }
}`;
}

function generateConnectionProfile(config) {
    return `{
  "name": "org1-network",
  "version": "1.0.0",
  "client": {
    "organization": "Org1",
    "connection": {
      "timeout": {
        "peer": {
          "endorser": "300",
          "eventHub": "300",
          "eventReg": "300"
        },
        "orderer": "300"
      }
    }
  },
  "organizations": {
    "Org1": {
      "mspid": "Org1MSP",
      "peers": ["peer0.org1.example.com"],
      "certificateAuthorities": ["ca-org1"],
      "adminPrivateKey": {
        "path": "crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/priv_sk"
      },
      "signedCert": {
        "path": "crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
      }
    }
  },
  "peers": {
    "peer0.org1.example.com": {
      "url": "grpcs://localhost:7051",
      "tlsCACerts": {
        "path": "crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
      },
      "grpcOptions": {
        "ssl-target-name-override": "peer0.org1.example.com",
        "request-timeout": 120000
      }
    }
  },
  "certificateAuthorities": {
    "ca-org1": {
      "url": "https://localhost:7054",
      "caName": "ca-org1",
      "tlsCACerts": {
        "path": "crypto-config/peerOrganizations/org1.example.com/ca/ca.crt"
      },
      "httpOptions": {
        "verify": false
      },
      "registrar": {
        "enrollId": "admin",
        "enrollSecret": "adminpw"
      }
    }
  }`;
}

function generateDockerComposeExplorer(config) {
    return `# docker-compose-explorer.yaml
services:
  explorerdb:
    image: postgres:13
    container_name: explorerdb
    environment:
      - POSTGRES_DB=explorer
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgrespw
    volumes:
      - explorerdb:/var/lib/postgresql/data
    networks:
      - fabric_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  explorer:
    image: hyperledger/blockchain-explorer:latest
    container_name: explorer
    environment:
      - DATABASE_HOST=explorerdb
      - DATABASE_DATABASE=explorer
      - DATABASE_USERNAME=postgres
      - DATABASE_PASSWD=postgrespw
      - NETWORK_CONFIG_PATH=/opt/explorer/network-config.json
      - EXPLORER_CONFIG_PATH=/opt/explorer/config.json
    volumes:
      - ./config.json:/opt/explorer/config.json
      - ./connection-profile:/opt/explorer/connection-profile
      - ./crypto-config:/opt/explorer/crypto-config
      - ./channel-artifacts:/opt/explorer/channel-artifacts
    ports:
      - "8080:8080"
    networks:
      - fabric_network
    depends_on:
      explorerdb:
        condition: service_healthy
    restart: unless-stopped

volumes:
  explorerdb:

networks:
  fabric_network:
    external: true`;
}

function main() {
    const config = parseArgs();
    
    console.log('Generating Fabric Explorer config...');
    
    const outputDir = path.resolve('generated-fabric-network/explorer');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    if (!fs.existsSync(path.join(outputDir, 'connection-profile'))) {
        fs.mkdirSync(path.join(outputDir, 'connection-profile'), { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'config.json'), generateExplorerConfig(config), 'utf8');
    fs.writeFileSync(path.join(outputDir, 'connection-profile', 'org1-network.json'), generateConnectionProfile(config), 'utf8');
    fs.writeFileSync(path.join(outputDir, 'docker-compose-explorer.yaml'), generateDockerComposeExplorer(config), 'utf8');
    
    console.log('✅ Explorer config generated');
    console.log('📁 Files:');
    console.log('  - config.json');
    console.log('  - connection-profile/org1-network.json');
    console.log('  - docker-compose-explorer.yaml');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});