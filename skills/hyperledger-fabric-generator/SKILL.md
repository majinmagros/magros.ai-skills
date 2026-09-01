---
name: hyperledger-fabric-generator
description: Use when scaffolding Hyperledger Fabric blockchain networks — CA → peers → orderers → channels → chaincode → Explorer → Caliper → API Node.js. Based on Pavan Adhav video "Custom Hyperledger Fabric Network Code Generator". Triggers: "hyperledger fabric generator", "fabric network scaffolding", "fabric CA peers orderers", "chaincode deployment", "fabric explorer caliper", "blockchain network generator".
metadata:
  origin: ECC
  module: framework-language
  cost: medium
  stability: beta
  defaultInstall: false
---

# Skill: hyperledger-fabric-generator — Scaffolding Hyperledger Fabric Networks

Ferramenta web que gera boilerplate completo Hyperledger Fabric: CA, peers, orderers, canais, chaincode, Explorer, Caliper, API Node.js. Baseado no vídeo do Pavan Adhav "Custom Hyperledger Fabric Network Code Generator".

## Validação Oficial

| Claim | Status | Fonte |
|---|---|---|
| Hyperledger Fabric platform | ✅ | Context7 `/hyperledger/fabric` |
| Fabric CA (certificate authority) | ✅ | Context7 `/hyperledger/fabric` |
| Fabric chaincode (Go/Node.js) | ✅ | Context7 `/hyperledger/fabric` |
| Fabric Explorer (dashboard) | ✅ | GitHub `hyperledger/blockchain-explorer` |
| Fabric Caliper (benchmark) | ✅ | Context7 `/hyperledger-caliper/caliper` |
| Fabric Gateway SDK (Node.js) | ✅ | Context7 `/hyperledger/fabric` |

---

## Quando usar

- "Quero gerar rede Hyperledger Fabric completa"
- "Scaffolding: CA, peers, orderers, canais, chaincode"
- "Gerar boilerplate: artifacts, crypto-config, docker-compose"
- "Configurar Fabric Explorer + Caliper + API Node.js"
- "Deploy rede Fabric em VPS/Kubernetes"

---

## Pipeline (8 etapas)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. CA       │───▶│ 2. PEERS    │───▶│ 3. ORDERERS │───▶│ 4. CHANNELS │───▶│ 5. CHAINCODE│───▶│ 6. EXPLORER │───▶│ 7. CALIPER  │───▶│ 8. API NODE │
│ Certificate │    │ Peer orgs   │    │ Raft/Etcd   │    │ Configtx    │    │ Lifecycle   │    │ Dashboard   │    │ Benchmark   │    │ Gateway SDK │
│ Authority   │    │ MSP/Anchor  │    │ Consensus   │    │ Profiles    │    │ Install/    │    │ Monitoring  │    │ Performance │    │ REST API    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Etapa 1: CA — Certificate Authority

**Componentes:** Fabric CA Server + Client
**Gera:** Crypto material (certs, keys) para todas as identidades

```yaml
# fabric-ca-server-config.yaml
ca:
  name: ca-org1
  host: 0.0.0.0
  port: 7054
  ca:
    certfile: /etc/hyperledger/fabric-ca-server-config/ca.org1-cert.pem
    keyfile: /etc/hyperledger/fabric-ca-server-config/ca.org1-key.pem
  csr:
    cn: ca-org1
    names:
      - C: BR
        ST: Sao Paulo
        L: Sao Paulo
        O: Org1
        OU: CA
  registry:
    identities:
      - name: admin
        pass: adminpw
        type: client
        affiliation: org1
        attrs:
          hf.Registrar.Roles: "*"
          hf.Revoker: true
          hf.IntermediateCA: true
```

**Client enrollment:**
```bash
# Enroll admin
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-org1

# Register peer identity
fabric-ca-client register --id.name peer0 --id.secret peer0pw --id.type peer --id.affiliation org1
```

---

## Etapa 2: PEERS — Peer Organizations

**Estrutura por organização:**
```yaml
# docker-compose-peer.yaml
services:
  peer0.org1.example.com:
    image: hyperledger/fabric-peer:2.5
    environment:
      - CORE_PEER_ID=peer0.org1.example.com
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_network
      - CORE_LOGGING_LEVEL=INFO
    volumes:
      - ./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com:/etc/hyperledger/fabric
      - ./channel-artifacts:/etc/hyperledger/configtx
    networks:
      - fabric_network
```

**Anchor peers config:**
```json
// anchor-peers.json
{
  "Org1MSP": ["peer0.org1.example.com:7051"],
  "Org2MSP": ["peer0.org2.example.com:9051"]
}
```

---

## Etapa 3: ORDERERS — Ordering Service (Raft)

**Etcd/Raft cluster:**
```yaml
# docker-compose-orderer.yaml
services:
  orderer.example.com:
    image: hyperledger/fabric-orderer:2.5
    environment:
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_LISTENPORT=7050
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/etc/hyperledger/fabric/tls/ca.crt]
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_CLUSTER_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_CLUSTER_LISTENPORT=7050
      - ORDERER_CONSENSUS_TYPE=etcdraft
      - ORDERER_CONSENSUS_ETCDRAFT_OPTIONS=...
    volumes:
      - ./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com:/etc/hyperledger/fabric
```

---

## Etapa 4: CHANNELS — Channel Configuration

**configtx.yaml:**
```yaml
Organizations:
  - &Org1
    Name: Org1MSP
    ID: Org1MSP
    MSPDir: crypto-config/peerOrganizations/org1.example.com/msp
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
      Writers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
      Admins:
        Type: Signature
        Rule: "OR('Org1MSP.admin')"
    AnchorPeers:
      - Host: peer0.org1.example.com
        Port: 7051

  - &Org2
    Name: Org2MSP
    ID: Org2MSP
    MSPDir: crypto-config/peerOrganizations/org2.example.com/msp
    # ... similar policies

Capabilities:
  Channel: &ChannelCapabilities
    V2_0: true
  Orderer: &OrdererCapabilities
    V2_0: true
  Application: &ApplicationCapabilities
    V2_0: true

Application: &ApplicationDefaults
  Organizations:
  Policies: *ApplicationPolicies
  Capabilities: *ChannelCapabilities

Orderer: &OrdererDefaults
  OrdererType: etcdraft
  Addresses:
    - orderer.example.com:7050
  BatchTimeout: 2s
  BatchSize:
    MaxMessageCount: 10
    AbsoluteMaxBytes: 99 MB
    PreferredMaxBytes: 512 KB
  Organizations:
  Policies: *OrdererPolicies
  Capabilities: *OrdererCapabilities

Channel: &ChannelDefaults
  Policies: *ChannelPolicies
  Capabilities: *ChannelCapabilities

Profiles:
  TwoOrgsOrdererGenesis:
    <<: *OrdererDefaults
    Organizations:
      - *OrdererOrg
    Capabilities: *OrdererCapabilities
  TwoOrgsChannel:
    Consortium: SampleConsortium
    <<: *ChannelDefaults
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
        - *Org2
```

**Channel creation:**
```bash
# Generate channel artifacts
configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
```

---

## Etapa 5: CHAINCODE — Lifecycle Management

**Chaincode structure (Go):**
```go
// chaincode/assettransfer/main.go
package main

import (
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Asset struct {
	ID             string `json:"ID"`
	Color          string `json:"color"`
	Size           int    `json:"size"`
	Owner          string `json:"owner"`
	AppraisedValue int    `json:"appraisedValue"`
}

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
	asset := Asset{ID: id, Color: color, Size: size, Owner: owner, AppraisedValue: appraisedValue}
	assetJSON, _ := json.Marshal(asset)
	return ctx.GetStub().PutState(id, assetJSON)
}

func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil { return nil, err }
	if assetJSON == nil { return nil, fmt.Errorf("asset %s does not exist", id) }
	var asset Asset
	json.Unmarshal(assetJSON, &asset)
	return &asset, nil
}

func main() {
	chaincode, _ := contractapi.NewChaincode(new(SmartContract))
	chaincode.Start()
}
```

**Lifecycle commands:**
```bash
# Package
peer lifecycle chaincode package assettransfer.tar.gz --path ./chaincode/assettransfer --lang golang --label assettransfer_1.0

# Install
peer lifecycle chaincode install assettransfer.tar.gz

# Approve
peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --channelID mychannel --name assettransfer --version 1.0 --package-id $(peer lifecycle chaincode queryinstalled | grep assettransfer_1.0 | awk '{print $1}') --sequence 1 --tls --cafile $ORDERER_CA

# Commit
peer lifecycle chaincode commit -o orderer.example.com:7050 --channelID mychannel --name assettransfer --version 1.0 --sequence 1 --tls --cafile $ORDERER_CA --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA
```

---

## Etapa 6: EXPLORER — Blockchain Dashboard

**Fabric Explorer (hyperledger/blockchain-explorer):**
```yaml
# explorer/config.json
{
  "network-config": {
    "org1": {
      "name": "Org1",
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
  "channel": "mychannel",
  "keyValueStore": "/tmp/fabric-explorer"
}
```

**Connection profile (org1-network.json):**
```json
{
  "name": "org1-network",
  "version": "1.0.0",
  "client": {
    "organization": "Org1",
    "connection": { "timeout": { "peer": { "endorser": "300" } } }
  },
  "organizations": {
    "Org1": { "mspid": "Org1MSP", "peers": ["peer0.org1.example.com"], "certificateAuthorities": ["ca-org1"] }
  },
  "peers": {
    "peer0.org1.example.com": {
      "url": "grpcs://localhost:7051",
      "tlsCACerts": { "path": "crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" }
    }
  },
  "certificateAuthorities": {
    "ca-org1": { "url": "https://localhost:7054", "caName": "ca-org1", "tlsCACerts": { "path": "crypto-config/peerOrganizations/org1.example.com/ca/ca.crt" } }
  }
}
```

**Deploy Explorer:**
```bash
# Docker compose
docker-compose -f docker-compose-explorer.yaml up -d

# Access: http://localhost:8080
```

---

## Etapa 7: CALIPER — Performance Benchmark

**Caliper config:**
```yaml
# caliper-config.yaml
caliper:
  blockchain: fabric

fabric:
  # Network config
  fabricNetwork: ./connection-profile/org1-network.json
  # Chaincode
  contractID: assettransfer
  contractVersion: "1.0"
  # TX config
  txDuration: 60
  rateControl:
    type: fixed-rate
    opts:
      tps: 100
  # Workload
  workload:
    module: ./workload/assettransfer.js
    arguments:
      initialAssets: 1000
      numberOfAssets: 10000
```

**Workload module (workload/assettransfer.js):**
```javascript
'use strict';

module.exports.info = 'Asset Transfer Workload';

let bc, contx;

module.exports.init = async (blockchain, context, args) => {
    bc = blockchain;
    contx = context;
    // Create initial assets
    for (let i = 0; i < args.initialAssets; i++) {
        await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'CreateAsset', [`asset${i}`, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.run = async () => {
    // Read asset
    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'ReadAsset', [`asset${Math.floor(Math.random() * 1000)}`]);
    
    // Transfer asset
    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'TransferAsset', [`asset${Math.floor(Math.random() * 1000)}`, 'Org2']);
};

module.exports.end = async () => {
    // Cleanup
};
```

**Run benchmark:**
```bash
npx caliper launch manager --caliper-workspace ./ --caliper-benchconfig caliper-config.yaml --caliper-networkconfig ./network-config.yaml
```

---

## Etapa 8: API NODE.JS — Gateway SDK + REST

**Fabric Gateway (Node.js):**
```javascript
// api/gateway.js
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function getGateway(userId) {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    const connectionProfile = JSON.parse(fs.readFileSync('./connection-profile/org1-network.json', 'utf8'));
    
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
    });
    
    return gateway;
}

async function submitTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('assettransfer');
    
    const result = await contract.submitTransaction(functionName, ...args);
    gateway.disconnect();
    return result;
}

async function evaluateTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('assettransfer');
    
    const result = await contract.evaluateTransaction(functionName, ...args);
    gateway.disconnect();
    return JSON.parse(result.toString());
}
```

**REST API (Express):**
```javascript
// api/server.js
const express = require('express');
const app = express();
app.use(express.json());

// Create asset
app.post('/assets', async (req, res) => {
    try {
        const { id, color, size, owner, appraisedValue } = req.body;
        await submitTransaction('admin', 'assettransfer', 'CreateAsset', id, color, size, owner, appraisedValue);
        res.json({ success: true, message: 'Asset created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read asset
app.get('/assets/:id', async (req, res) => {
    try {
        const asset = await evaluateTransaction('admin', 'assettransfer', 'ReadAsset', req.params.id);
        res.json(asset);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Transfer asset
app.put('/assets/:id/transfer', async (req, res) => {
    try {
        const { newOwner } = req.body;
        await submitTransaction('admin', 'assettransfer', 'TransferAsset', req.params.id, newOwner);
        res.json({ success: true, message: 'Asset transferred' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Query all assets
app.get('/assets', async (req, res) => {
    try {
        const result = await evaluateTransaction('admin', 'assettransfer', 'QueryAllAssets');
        res.json(JSON.parse(result));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Fabric API running on port 3000'));
```

---

## Web UI Generator (Pavan Adhav Style)

```javascript
// scripts/generate-fabric-network.js
class FabricNetworkGenerator {
    constructor(config) {
        this.config = {
            orgCount: config.orgCount || 2,
            peerPerOrg: config.peerPerOrg || 1,
            ordererCount: config.ordererCount || 1,
            channelName: config.channelName || 'mychannel',
            chaincodeName: config.chaincodeName || 'assettransfer',
            chaincodeLang: config.chaincodeLang || 'golang',
            consensus: config.consensus || 'etcdraft',
            ...config
        };
    }

    generate() {
        // 1. crypto-config.yaml
        this.generateCryptoConfig();
        
        // 2. configtx.yaml
        this.generateConfigTx();
        
        // 3. docker-compose.yaml
        this.generateDockerCompose();
        
        // 4. chaincode
        this.generateChaincode();
        
        // 5. Explorer config
        this.generateExplorerConfig();
        
        // 6. Caliper config
        this.generateCaliperConfig();
        
        // 7. API server
        this.generateAPIServer();
        
        // 8. Scripts
        this.generateScripts();
    }

    generateCryptoConfig() {
        // Generate crypto-config.yaml for cryptogen
    }

    generateConfigTx() {
        // Generate configtx.yaml with orgs, orderers, channels
    }

    generateDockerCompose() {
        // Generate docker-compose.yaml with CA, peers, orderers, explorer, caliper
    }
}

// CLI
const args = process.argv.slice(2);
if (args[0] === 'generate') {
    const generator = new FabricNetworkGenerator({
        orgCount: parseInt(args[1]) || 2,
        peerPerOrg: parseInt(args[2]) || 1,
        channelName: args[3] || 'mychannel'
    });
    generator.generate();
    console.log('✅ Fabric network generated!');
}
```

---

## Referências

- `references/fabric-ca.md` — Fabric CA config + enrollment
- `references/fabric-peers.md` — Peer orgs, MSP, anchor peers
- `references/fabric-orderers.md` — Etcd/Raft consensus config
- `references/fabric-channels.md` — configtx.yaml, channel creation
- `references/fabric-chaincode.md` — Chaincode lifecycle (package, install, approve, commit)
- `references/fabric-explorer.md` — Explorer dashboard + connection profiles
- `references/fabric-caliper.md` — Caliper benchmark config + workloads
- `references/fabric-gateway-sdk.md` — Node.js Gateway SDK + REST API
- `references/fabric-web-generator.md` — Web UI generator (Pavan Adhav style)

---

## Scripts

- `scripts/generate-network.js` — Main generator (orgs, peers, orderers, channels)
- `scripts/generate-chaincode.js` — Chaincode templates (Go/Node.js)
- `scripts/generate-explorer.js` — Explorer dashboard config
- `scripts/generate-caliper.js` — Caliper benchmark config
- `scripts/generate-api.js` — Gateway SDK + REST API
- `scripts/deploy-network.sh` — Deploy scripts (Docker/K8s)