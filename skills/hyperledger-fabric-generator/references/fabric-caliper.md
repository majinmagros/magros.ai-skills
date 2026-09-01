# Fabric Caliper Reference (Validado via Context7)

## Library: Hyperledger Caliper (`/hyperledger-caliper/caliper`)

### Caliper Config

```yaml
# caliper-config.yaml
caliper:
  blockchain: fabric

fabric:
  # Network configuration
  fabricNetwork: ./connection-profile/org1-network.json
  
  # Chaincode
  contractID: assettransfer
  contractVersion: "1.0"
  
  # Transaction settings
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

### Rate Control Types

```yaml
# Fixed rate
rateControl:
  type: fixed-rate
  opts:
    tps: 100

# Fixed load
rateControl:
  type: fixed-load
  opts:
    workers: 10
    transactionLoad: 1000

# Feedback
rateControl:
  type: feedback
  opts:
    targetTps: 200
    adjustmentInterval: 10
    minTxPerBatch: 1
    maxTxPerBatch: 100
```

### Workload Module (workload/assettransfer.js)

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
    // Read asset (90% reads)
    if (Math.random() < 0.9) {
        const assetId = `asset${Math.floor(Math.random() * 1000)}`;
        await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'ReadAsset', [assetId]);
    } else {
        // Write asset (10% writes)
        const assetId = `asset${Math.floor(Math.random() * 10000)}`;
        await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'CreateAsset', [`asset${Date.now()}`, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.end = async () => {
    // Cleanup
};
```

### Complex Workload (Multiple Operations)

```javascript
// workload/complex.js
'use strict';

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
    
    // Initialize assets
    for (let i = 0; i < args.initialAssets; i++) {
        await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'CreateAsset', [`asset${i}`, 'blue', 5, 'Org1', 300]);
    }
};

module.exports.run = async () => {
    // Weighted random operation
    const totalWeight = OPERATIONS.reduce((sum, op) => sum + op.weight, 0);
    let rand = Math.random() * totalWeight;
    
    for (const op of OPERATIONS) {
        rand -= op.weight;
        if (rand <= 0) {
            switch (op.name) {
                case 'CreateAsset':
                    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'CreateAsset', [`asset${Date.now()}`, 'red', 10, 'Org2', 500]);
                    break;
                case 'ReadAsset':
                    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'ReadAsset', [`asset${Math.floor(Math.random() * 1000)}`]);
                    break;
                case 'UpdateAsset':
                    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'UpdateAsset', [`asset${Math.floor(Math.random() * 1000)}`, 'green', 15, 'Org1', 400]);
                    break;
                case 'TransferAsset':
                    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'TransferAsset', [`asset${Math.floor(Math.random() * 1000)}`, 'Org2']);
                    break;
                case 'QueryAllAssets':
                    await bc.invokeSmartContract(contx, 'assettransfer', 'v1', 'QueryAllAssets', []);
                    break;
            }
            break;
        }
    }
};

module.exports.end = async () => {
    // Cleanup
};
```

### Network Configuration for Caliper

```yaml
# network-config.yaml
caliper:
  blockchain: fabric

fabric:
  # Admin credentials
  admin:
    id: admin
    password: adminpw
  
  # Connection profile
  networkConfig: ./connection-profile/org1-network.json
  
  # Channels
  channels:
    - mychannel
  
  # Organizations
  organizations:
    Org1:
      mspid: Org1MSP
      peers:
        - peer0.org1.example.com
      certificateAuthorities:
        - ca-org1
```

### Run Benchmark

```bash
# Install Caliper
npm install -g @hyperledger/caliper-cli
npx caliper bind --caliper-bind-sut fabric:2.5

# Run benchmark
npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig caliper-config.yaml \
  --caliper-networkconfig network-config.yaml \
  --caliper-flow-only-test

# With custom workspace
npx caliper launch manager \
  --caliper-workspace /path/to/workspace \
  --caliper-benchconfig caliper-config.yaml \
  --caliper-networkconfig network-config.yaml
```

### Output Reports

```bash
# HTML report
# Generated at: ./caliper-report-<timestamp>.html

# JSON results
# Generated at: ./caliper-report-<timestamp>.json

# View in browser
open caliper-report-20260901-120000.html
```

### Custom Metrics Collection

```javascript
// custom-metrics.js
module.exports = {
    // Custom latency percentile calculation
    customMetrics: {
        latencyP99: (latencies) => {
            const sorted = latencies.sort((a, b) => a - b);
            const idx = Math.floor(sorted.length * 0.99);
            return sorted[idx];
        },
        
        throughput: (txCount, durationMs) => {
            return (txCount / durationMs) * 1000; // TPS
        }
    }
};
```

### Docker Compose for Caliper

```yaml
# docker-compose-caliper.yaml
services:
  caliper:
    image: hyperledger/caliper:latest
    container_name: caliper
    volumes:
      - ./:/workspace
      - ./crypto-config:/workspace/crypto-config
      - ./channel-artifacts:/workspace/channel-artifacts
      - ./connection-profile:/workspace/connection-profile
    working_dir: /workspace
    command: >
      sh -c "npx caliper launch manager 
        --caliper-workspace /workspace 
        --caliper-benchconfig caliper-config.yaml 
        --caliper-networkconfig network-config.yaml"
    networks:
      - fabric_network
    depends_on:
      - orderer.example.com
      - peer0.org1.example.com
      - peer0.org2.example.com

networks:
  fabric_network:
    external: true
```

### Results Interpretation

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| TPS | > 100 | 50-100 | < 50 |
| Latency (avg) | < 100ms | 100-500ms | > 500ms |
| Latency P99 | < 500ms | 500ms-1s | > 1s |
| Success Rate | > 99.9% | 99-99.9% | < 99% |
| Resource Usage | < 70% | 70-90% | > 90% |

### Caliper Metrics Export

```bash
# Export to Prometheus
caliper report --format prometheus --output metrics.prom

# Export to JSON
caliper report --format json --output results.json

# Export to CSV
caliper report --format csv --output results.csv
```

---

## Referências Oficiais

- GitHub: https://github.com/hyperledger/caliper
- Documentation: https://hyperledger.github.io/caliper/
- Context7: `/hyperledger-caliper/caliper`
- Benchmark: 42.6
- Source Reputation: Medium