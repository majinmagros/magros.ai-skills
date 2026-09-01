# Fabric Explorer Reference (Validado via Context7)

## Library: Hyperledger Blockchain Explorer (`hyperledger/blockchain-explorer`)

### Explorer Config (config.json)

```json
{
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
  "channel": "mychannel",
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
}
```

### Connection Profile (org1-network.json)

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
  }
}
```

### Docker Compose for Explorer

```yaml
# docker-compose-explorer.yaml
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
    external: true
```

### Deploy Explorer

```bash
# Initialize database
docker-compose -f docker-compose-explorer.yaml up -d explorerdb

# Run migrations
docker exec explorerdb psql -U postgres -d explorer -f /opt/explorer/app/persistence/fabric/postgreSQL/db/updatepg.sql

# Start explorer
docker-compose -f docker-compose-explorer.yaml up -d explorer

# Access: http://localhost:8080
```

### Explorer Features

| Feature | Description |
|---------|-------------|
| Dashboard | Overview of blocks, transactions, chaincodes |
| Blocks | Browse blocks with filters |
| Transactions | View transaction details |
| Chaincodes | List deployed chaincodes |
| Nodes | View peer/orderer status |
| Channels | Channel info and membership |
| Organizations | MSP and CA info |
| Charts | TPS, block time, peer status |

### PostgreSQL Schema (Auto-created)

```sql
-- Blocks table
CREATE TABLE blocks (
    blocknum BIGINT PRIMARY KEY,
    channelname VARCHAR(255),
    blockhash VARCHAR(255),
    previoushash VARCHAR(255),
    datalength INTEGER,
    prehash VARCHAR(255),
    txcount INTEGER,
    createdt TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    txid VARCHAR(255) PRIMARY KEY,
    blockid BIGINT REFERENCES blocks(blocknum),
    channelname VARCHAR(255),
    txstatus VARCHAR(50),
    txnType VARCHAR(50),
    chaincodename VARCHAR(255),
    createdt TIMESTAMP
);

-- Chaincodes table
CREATE TABLE chaincodes (
    name VARCHAR(255) PRIMARY KEY,
    version VARCHAR(50),
    channelname VARCHAR(255),
    path VARCHAR(255),
    chaincodetype VARCHAR(50)
);
```

### Sync Script

```bash
# Sync script (run periodically)
#!/bin/bash
# sync-explorer.sh

EXPLORER_PATH="/opt/explorer"
cd $EXPLORER_PATH

# Sync blocks
node app/sync/blocksync.js

# Sync transactions
node app/sync/transactionsync.js

# Sync chaincodes
node app/sync/chaincodesync.js
```

### Monitoring & Metrics

```bash
# Prometheus metrics endpoint
curl http://localhost:8080/metrics

# Health check
curl http://localhost:8080/health
```

---

## Referências Oficiais

- GitHub: https://github.com/hyperledger/blockchain-explorer
- Documentation: https://github.com/hyperledger/blockchain-explorer/blob/main/README.md
- Context7: Search for "Fabric Explorer"
- License: Apache-2.0