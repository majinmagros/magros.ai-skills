# Fabric Gateway SDK Reference (Validado via Context7)

## Library: Hyperledger Fabric Node SDK (`/hyperledger/fabric`)

### Installation

```bash
npm install fabric-network
npm install fabric-ca-client
```

### Core Gateway API

```javascript
const { Gateway, Wallets } = require('fabric-network');
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
```

### Transaction Submission

```javascript
async function submitTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    
    try {
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('assettransfer');
        
        // Submit transaction (writes to ledger)
        const result = await contract.submitTransaction(functionName, ...args);
        
        return result.toString();
    } finally {
        gateway.disconnect();
    }
}

// Usage
await submitTransaction('admin', 'assettransfer', 'CreateAsset', 'asset1', 'blue', 5, 'Org1', 300);
await submitTransaction('admin', 'assettransfer', 'TransferAsset', 'asset1', 'Org2');
```

### Query (Read-Only)

```javascript
async function evaluateTransaction(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    
    try {
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('assettransfer');
        
        // Evaluate transaction (read-only, no ledger write)
        const result = await contract.evaluateTransaction(functionName, ...args);
        
        return JSON.parse(result.toString());
    } finally {
        gateway.disconnect();
    }
}

// Usage
const asset = await evaluateTransaction('admin', 'assettransfer', 'ReadAsset', 'asset1');
const allAssets = await evaluateTransaction('admin', 'assettransfer', 'QueryAllAssets');
```

### Wallet Management

```javascript
const { Wallets, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function createWallet() {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
}

async function enrollAdmin(wallet) {
    // Check if already enrolled
    const adminExists = await wallet.exists('admin');
    if (adminExists) return;
    
    // Enroll via Fabric CA
    const { FabricCAServices } = require('fabric-ca-client');
    const ca = new FabricCAServices('https://localhost:7054');
    
    const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
    });
    
    const identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes()
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    };
    
    await wallet.put('admin', identity);
}

async function registerAndEnrollUser(wallet, userId, orgName, role = 'client') {
    // Connect to CA
    const { FabricCAServices } = require('fabric-ca-client');
    const ca = new FabricCAServices('https://localhost:7054');
    
    // Register
    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    
    const registration = await ca.register({
        enrollmentID: userId,
        role: role,
        affiliation: 'org1',
        attrs: [
            { name: 'role', value: role, ecert: true }
        ]
    }, adminUser);
    
    // Enroll
    const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: registration.secret
    });
    
    // Store in wallet
    const identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes()
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    };
    
    await wallet.put(userId, identity);
}
```

### Event Listening

```javascript
async function listenToEvents(userId, chaincode, eventName) {
    const gateway = await getGateway(userId);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('assettransfer');
    
    const listener = async (event) => {
        console.log(`Event: ${event.eventName}`, event.payload.toString());
    };
    
    await contract.addContractEventListener(listener, eventName);
    
    // To remove listener later:
    // contract.removeContractEventListener(listener);
    
    return gateway; // Keep reference to disconnect later
}

// Usage
const gateway = await listenToEvents('admin', 'assettransfer', 'AssetCreated');
// ... later
gateway.disconnect();
```

### Private Data Access

```javascript
async function getPrivateData(userId, collection, key) {
    const gateway = await getGateway('admin');
    
    try {
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('assettransfer');
        
        const result = await contract.evaluateTransaction(
            'GetPrivateData', 
            'Org1PrivateDetails', 
            key
        );
        
        return result.toString();
    } finally {
        gateway.disconnect();
    }
}
```

### Connection Profile (connection-profile.json)

```json
{
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
      "certificateAuthorities": ["ca-org1"]
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
  }
}
```

### Wallet Types

```javascript
// File System Wallet (default)
const wallet = await Wallets.newFileSystemWallet('./wallet');

// In-Memory Wallet (testing)
const wallet = await Wallets.newInMemoryWallet();

// CouchDB Wallet
const wallet = await Wallets.newCouchDBWallet('http://admin:password@localhost:5984', 'wallet');

// PostgreSQL Wallet (custom)
// Implement Wallet interface for PostgreSQL
```

### Error Handling

```javascript
async function safeSubmit(userId, chaincode, functionName, ...args) {
    const gateway = await getGateway(userId);
    
    try {
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('assettransfer');
        
        const result = await contract.submitTransaction(functionName, ...args);
        return { success: true, data: result.toString() };
    } catch (error) {
        // Handle specific Fabric errors
        if (error.message.includes('MVCC_READ_CONFLICT')) {
            return { success: false, error: 'MVCC_READ_CONFLICT', retry: true };
        }
        if (error.message.includes('ENDORSEMENT_POLICY_FAILURE')) {
            return { success: false, error: 'ENDORSEMENT_POLICY_FAILURE' };
        }
        if (error.message.includes('CHAINCODE_NOT_FOUND')) {
            return { success: false, error: 'CHAINCODE_NOT_FOUND' };
        }
        
        return { success: false, error: error.message };
    } finally {
        gateway.disconnect();
    }
}
```

### Retry Logic with Backoff

```javascript
async function submitWithRetry(userId, chaincode, functionName, ...args) {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await submitTransaction(userId, chaincode, functionName, ...args);
        } catch (error) {
            lastError = error;
            
            if (error.message.includes('MVCC_READ_CONFLICT') && attempt < maxRetries) {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                continue;
            }
            throw error;
        }
    }
    
    throw lastError;
}
```

---

## Referências Oficiais

- Fabric SDK Node: https://github.com/hyperledger/fabric-sdk-node
- Fabric Gateway: https://hyperledger-fabric.readthedocs.io/en/latest/gateway.html
- Context7: `/hyperledger/fabric`
- Benchmark: 72.68