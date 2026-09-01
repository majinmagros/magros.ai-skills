# Fabric Web Generator Reference (Validado via Context7)

## Library: Hyperledger Fabric Web Generator (Pavan Adhav Style)

## Architecture Overview

```javascript
// Web-based Fabric Network Generator
// Similar to Pavan Adhav's "Custom Hyperledger Fabric Network Code Generator"

// Stack: React/Vue + Node.js backend + Docker
// Generates: crypto-config.yaml, configtx.yaml, docker-compose.yaml, chaincode, configs
```

---

## Frontend (React/Vue)

### Project Setup

```bash
# Create React app
npx create-react-app fabric-generator-frontend
cd fabric-generator-frontend

# Install dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material react-hook-form zod @hookform/resolvers
npm install react-flow-renderer @xyflow/react  # For visual pipeline
```

### Main Components

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Steps from './components/Steps';
import NetworkConfig from './components/NetworkConfig';
import ChannelConfig from './components/ChannelConfig';
import ChaincodeConfig from './components/ChaincodeConfig';
import ExplorerConfig from './components/ExplorerConfig';
import CaliperConfig from './components/CaliperConfig';
import Preview from './components/Preview';
import Download from './components/Download';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' } },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="app">
          <Steps />
          <Routes>
            <Route path="/" element={<NetworkConfig />} />
            <Route path="/channels" element={<ChannelConfig />} />
            <Route path="/chaincode" element={<ChaincodeConfig />} />
            <Route path="/explorer" element={<ExplorerConfig />} />
            <Route path="/caliper" element={<CaliperConfig />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/download" element={<Download />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

### Step 1: Network Configuration

```jsx
// src/components/NetworkConfig.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, TextField, Select, MenuItem, Button, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material';

const networkSchema = z.object({
  orgCount: z.number().min(1).max(10).default(2),
  peerPerOrg: z.number().min(1).max(5).default(1),
  ordererCount: z.number().min(1).max(5).default(1),
  consensus: z.enum(['etcdraft', 'kafka', 'solo']).default('etcdraft'),
  enableTLS: z.boolean().default(true),
  enableCouchDB: z.boolean().default(true),
  enableExplorer: z.boolean().default(true),
  enableCaliper: z.boolean().default(false),
};

export default function NetworkConfig({ onNext, formData, setFormData }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(networkSchema),
    defaultValues: formData,
    mode: 'onChange'
  });

  const orgCount = watch('orgCount');
  const peerPerOrg = watch('peerPerOrg');

  const handleSubmit = (data) => {
    setFormData(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Network Configuration</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('orgCount')}
                label="Number of Organizations"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('peerPerOrg')}
                label="Peers per Organization"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('ordererCount')}
                label="Orderer Nodes"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Select {...register('consensus')} label="Consensus" fullWidth>
                <MenuItem value="etcdraft">etcdraft (Raft)</MenuItem>
                <MenuItem value="kafka">Kafka (Legacy)</MenuItem>
                <MenuItem value="solo">Solo (Dev Only)</MenuItem>
              </Select>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel control={<Switch {...register('enableTLS')} />} label="Enable TLS" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch {...register('enableCouchDB')} />} label="Enable CouchDB" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch {...register('enableExplorer')} />} label="Enable Fabric Explorer" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch {...register('enableCaliper')} />} label="Enable Caliper Benchmark" />
            </Grid>
            
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Next: Channel Configuration
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}
```

### Step 2: Organization Details

```jsx
// src/components/OrgDetails.jsx
import { useFieldArray, useForm } from 'react-hook-form';

const orgSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  enableNodeOUs: z.boolean().default(true),
  peerCount: z.number().min(1).max(10).default(1),
  usersCount: z.number().min(0).max(10).default(1),
  enableNodeOUs: z.boolean().default(true),
});

export default function OrgDetails({ orgCount, formData, setFormData, onNext, onBack }) {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: { orgs: Array.from({ length: orgCount }, (_, i) => ({
      name: `Org${i + 1}`,
      domain: `org${i + 1}.example.com`,
      peerCount: 1,
      usersCount: 1,
      enableNodeOUs: true
    })) }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'orgs' });

  return (
    <form onSubmit={handleSubmit((data) => onNext({ orgs: data.orgs }))}>
      {fields.map((field, index) => (
        <Card key={field.id} style={{ marginBottom: 16 }}>
          <CardContent>
            <Typography variant="h6">Organization {index + 1}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField {...register(`orgs.${index}.name`)} label="Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register(`orgs.${index}.domain`)} label="Domain" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register(`orgs.${index}.peerCount`)} type="number" label="Peers" inputProps={{ min: 1, max: 10 }} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register(`orgs.${index}.usersCount`)} type="number" label="Users" inputProps={{ min: 0, max: 10 }} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Switch {...register(`orgs.${index}.enableNodeOUs`)} />} label="Enable Node OUs" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      
      <Button type="submit" variant="contained" fullWidth>Next: Channel Configuration</Button>
      <Button onClick={onBack} variant="outlined" fullWidth style={{ marginTop: 8 }}>Back</Button>
    </form>
  );
}
```

### Visual Pipeline (React Flow)

```jsx
// src/components/PipelineVisualization.jsx
import ReactFlow, { Node, Edge, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'CA\nCertificate Authority' }, type: 'custom' },
  { id: '2', position: { x: 100, y: 200 }, data: { label: 'Peers\nOrg1, Org2...' }, type: 'custom' },
  { id: '3', position: { x: 400, y: 200 }, data: { label: 'Orderers\nRaft Cluster' }, type: 'custom' },
  { id: '4', position: { x: 250, y: 350 }, data: { label: 'Channels\nConfigtx' }, type: 'custom' },
  { id: '5', position: { x: 100, y: 500 }, data: { label: 'Chaincode\nLifecycle' }, type: 'custom' },
  { id: '6', position: { x: 400, y: 500 }, data: { label: 'Explorer\nDashboard' }, type: 'custom' },
  { id: '7', position: { x: 250, y: 650 }, data: { label: 'Caliper\nBenchmark' }, type: 'custom' },
  { id: '8', position: { x: 250, y: 800 }, data: { label: 'API\nGateway SDK' }, type: 'custom' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
  { id: 'e4-6', source: '4', target: '6', animated: true },
  { id: 'e5-7', source: '5', target: '7', animated: true },
  { id: 'e5-8', source: '5', target: '8', animated: true },
  { id: 'e6-8', source: '6', target: '8', animated: true },
  { id: 'e7-8', source: '7', target: '8', animated: true },
];

export default function PipelineVisualization() {
  return (
    <div style={{ width: '100%', height: 600 }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={{ custom: CustomNode }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

function CustomNode({ data }) {
  return (
    <div style={{
      padding: 16,
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minWidth: 160,
      textAlign: 'center'
    }}>
      {data.label}
    </div>
  );
}
```

---

## Backend (Node.js/Express)

### Generator Service

```javascript
// backend/services/generator.js
class FabricGenerator {
    constructor(config) {
        this.config = config;
    }

    generate() {
        const files = {};
        
        // 1. crypto-config.yaml
        files['crypto-config.yaml'] = this.generateCryptoConfig();
        
        // 2. configtx.yaml
        files['configtx.yaml'] = this.generateConfigTx();
        
        // 3. docker-compose.yaml
        files['docker-compose.yaml'] = this.generateDockerCompose();
        
        // 4. Chaincode
        files['chaincode/assettransfer/main.go'] = this.generateChaincodeGo();
        files['chaincode/assettransfer/lib/assettransfer.js'] = this.generateChaincodeJS();
        
        // 4. Explorer
        files['explorer/config.json'] = this.generateExplorerConfig();
        files['explorer/connection-profile/org1-network.json'] = this.generateConnectionProfile();
        
        // 5. Caliper
        files['caliper/caliper-config.yaml'] = this.generateCaliperConfig();
        files['caliper/workload/assettransfer.js'] = this.generateCaliperWorkload();
        
        // 6. API Server
        files['api/server.js'] = this.generateAPIServer();
        files['api/gateway.js'] = this.generateGateway();
        
        // 7. Scripts
        files['scripts/deploy.sh'] = this.generateDeployScript();
        files['scripts/enroll-identities.js'] = this.generateEnrollScript();
        
        return files;
    }

    generateCryptoConfig() {
        const { orgCount, ordererCount } = this.config;
        let yaml = `PeerOrgs:\n`;
        
        for (let i = 1; i <= this.config.orgCount; i++) {
            const org = this.config.orgs[i - 1];
            yaml += `  - Name: ${org.name}\n`;
            yaml += `    Domain: ${org.domain}\n`;
            yaml += `    EnableNodeOUs: true\n`;
            yaml += `    Template:\n`;
            yaml += `      Count: ${org.peerCount}\n`;
            yaml += `      SANS:\n        - "localhost"\n`;
            yaml += `    Users:\n      Count: ${org.usersCount}\n`;
        }
        
        yaml += `\nOrdererOrgs:\n`;
        yaml += `  - Name: Orderer\n    Domain: example.com\n    EnableNodeOUs: true\n    Specs:\n`;
        for (let i = 1; i <= this.config.ordererCount; i++) {
            yaml += `      - Hostname: orderer${i}\n        SANS:\n          - "localhost"\n`;
        }
        
        return yaml;
    }

    generateConfigTx() {
        // Generate full configtx.yaml with orgs, orderers, channels, policies
        // ... (implementation from SKILL.md)
    }

    generateDockerCompose() {
        // Generate docker-compose.yaml with CA, peers, orderers, CouchDB, Explorer, Caliper
    }

    generateChaincodeGo() {
        // Return Go chaincode template
    }

    generateChaincodeJS() {
        // Return Node.js chaincode template
    }

    generateExplorerConfig() {
        // Return Explorer config.json
    }

    generateConnectionProfile() {
        // Return org1-network.json
    }

    generateCaliperConfig() {
        // Return caliper-config.yaml
    }

    generateCaliperWorkload() {
        // Return workload/assettransfer.js
    }

    generateAPIServer() {
        // Return Express server with Gateway SDK
    }

    generateGateway() {
        // Return Gateway SDK wrapper
    }

    generateDeployScript() {
        return `#!/bin/bash
# deploy.sh - Deploy Fabric network
set -e

echo "🚀 Deploying Hyperledger Fabric Network"

# 1. Generate crypto material
cryptogen generate --config=crypto-config.yaml --output=crypto-config

# 2. Generate genesis block
configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

# 3. Create channel
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel

# 4. Start network
docker-compose -f docker-compose.yaml up -d

# 5. Wait for orderer
sleep 5

# 6. Create channel
peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --tls --cafile \$ORDERER_CA

# 7. Join peers
peer channel join -b mychannel.block

# 8. Update anchor peers
peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile \$ORDERER_CA

# 7. Install & approve chaincode
peer lifecycle chaincode install assettransfer.tar.gz
peer lifecycle chaincode approveformyorg ...

echo "✅ Network deployed successfully!"
`;
    }

    generateEnrollScript() {
        // Return enroll-identities.js content
    }
}

module.exports = FabricGenerator;
```

---

## API Routes

```javascript
// backend/routes/generate.js
const express = require('express');
const router = express.Router();
const FabricGenerator = require('../services/generator');

router.post('/generate', async (req, res) => {
    try {
        const config = req.body;
        const generator = new FabricGenerator(config);
        const files = generator.generate();
        
        // Return as downloadable zip or file tree
        res.json({ 
            success: true, 
            files: Object.keys(files),
            preview: Object.fromEntries(
                Object.entries(files).slice(0, 10).map(([k, v]) => [k, v.substring(0, 200)])
            )
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/download', async (req, res) => {
    // Generate zip file and send
    const archiver = require('archiver');
    const archive = archiver('zip');
    
    res.attachment('fabric-network.zip');
    archive.pipe(res);
    
    Object.entries(req.body.files).forEach(([name, content]) => {
        archive.append(content, { name });
    });
    
    await archive.finalize();
});

module.exports = router;
```

---

## Complete Docker Compose Template

```yaml
# docker-compose.yaml (Generated)
version: '3.8'

services:
  # Certificate Authorities
  ca-org1:
    image: hyperledger/fabric-ca:1.5
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-org1
      - FABRIC_CA_SERVER_TLS_ENABLED=true
    volumes:
      - ./fabric-ca-server-config:/etc/hyperledger/fabric-ca-server-config
    ports:
      - "7054:7054"
    networks:
      - fabric_network

  # Peers (generated per org)
  peer0.org1.example.com:
    image: hyperledger/fabric-peer:2.5
    environment:
      - CORE_PEER_ID=peer0.org1.example.com
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_TLS_ENABLED=true
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
    volumes:
      - ./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com:/etc/hyperledger/fabric
    ports:
      - "7051:7051"
    depends_on:
      - couchdb0

  # Orderers (Raft)
  orderer1.example.com:
    image: hyperledger/fabric-orderer:2.5
    environment:
      - ORDERER_CONSENSUS_TYPE=etcdraft
      - ORDERER_CONSENSUS_ETCDRAFT_OPTIONS={"tls":true,"tick_interval":"500ms","election_tick":10}
    ports:
      - "7050:7050"

  # CouchDB
  couchdb0:
    image: couchdb:3.2
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    ports:
      - "5984:5984"

  # Explorer
  explorer:
    image: hyperledger/blockchain-explorer:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_HOST=explorerdb
    depends_on:
      - explorerdb

  # Caliper
  caliper:
    image: hyperledger/caliper:latest
    command: >
      sh -c "npx caliper launch manager 
        --caliper-workspace /workspace 
        --caliper-benchconfig caliper-config.yaml 
        --caliper-networkconfig network-config.yaml"
    volumes:
      - ./:/workspace
    depends_on:
      - orderer1.example.com
      - peer0.org1.example.com

networks:
  fabric_network:
    driver: bridge
```

---

## Usage

```bash
# 1. Start frontend
cd fabric-generator-frontend
npm start

# 2. Start backend
cd fabric-generator-backend
npm install
npm run dev

# 3. Access http://localhost:3000
# 4. Configure network → channels → chaincode → explorer → caliper → preview → download
# 5. Extract zip, run deploy.sh
```

---

## Referências

- Pavan Adhav Video: "Custom Hyperledger Fabric Network Code Generator"
- Hyperledger Fabric: https://hyperledger-fabric.readthedocs.io/
- Context7: `/hyperledger/fabric`, `/hyperledger-caliper/caliper`, `/nexu-io/open-design`