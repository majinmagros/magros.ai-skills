# Fabric Orderers Reference (Validado via Context7)

## Library: Hyperledger Fabric (`/hyperledger/fabric`)

### Orderer Types

| Type | Description | Use Case |
|------|-------------|----------|
| `etcdraft` | Raft-based consensus (recommended) | Production |
| `kafka` | Kafka-based (deprecated) | Legacy |
| `solo` | Single orderer (dev only) | Development |

### Etcd/Raft Cluster Config

```yaml
# docker-compose-orderer.yaml
services:
  orderer.example.com:
    image: hyperledger/fabric-orderer:2.5
    container_name: orderer.example.com
    environment:
      # General
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_LISTENPORT=7050
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/etc/hyperledger/fabric/channel-artifacts/genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/etc/hyperledger/fabric/msp
      
      # TLS
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/etc/hyperledger/fabric/tls/ca.crt]
      - ORDERER_GENERAL_TLS_CLIENTAUTHREQUIRED=true
      - ORDERER_GENERAL_TLS_CLIENTCERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_TLS_CLIENTKEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_TLS_CLIENTROOTCAS_FILES=[/etc/hyperledger/fabric/tls/ca.crt]
      
      # Cluster (Raft)
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_CLUSTER_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_CLUSTER_LISTENPORT=7050
      
      # Consensus
      - ORDERER_CONSENSUS_TYPE=etcdraft
      
      # File Ledger
      - ORDERER_FILELEDGER_LOCATION=/var/hyperledger/production/orderer
      
      # Logging
      - ORDERER_LOGGING_LEVEL=INFO
      - ORDERER_LOGGING_FORMAT=json
      
    volumes:
      - ./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com:/etc/hyperledger/fabric
      - ./channel-artifacts:/etc/hyperledger/configtx
      - orderer.example.com:/var/hyperledger/production/orderer
    ports:
      - "7050:7050"
    networks:
      - fabric_network
```

### Multi-Orderer Raft Cluster (3 nodes)

```yaml
# docker-compose-orderer-raft.yaml
services:
  orderer1.example.com:
    image: hyperledger/fabric-orderer:2.5
    container_name: orderer1.example.com
    environment:
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_LISTENPORT=7050
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/etc/hyperledger/fabric/channel-artifacts/genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/etc/hyperledger/fabric/msp
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/etc/hyperledger/fabric/tls/ca.crt]
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/etc/hyperledger/fabric/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/etc/hyperledger/fabric/tls/server.key
      - ORDERER_GENERAL_CLUSTER_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_CLUSTER_LISTENPORT=7050
      - ORDERER_CONSENSUS_TYPE=etcdraft
      - ORDERER_CONSENSUS_ETCDRAFT_OPTIONS={"tls":true,"tick_interval":"500ms","election_tick":10,"heartbeat_tick":1,"max_inflight_blocks":5,"snapshot_interval_size":20971520}
    volumes:
      - ./crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com:/etc/hyperledger/fabric
      - ./channel-artifacts:/etc/hyperledger/configtx
      - orderer1.example.com:/var/hyperledger/production/orderer
    ports:
      - "7050:7050"
    networks:
      - fabric_network

  orderer2.example.com:
    # Similar config, different ports
    environment:
      - ORDERER_GENERAL_LISTENPORT=8050
      - ORDERER_GENERAL_CLUSTER_LISTENPORT=8050
    ports:
      - "8050:8050"
    # ...

  orderer3.example.com:
    # Similar config, different ports
    environment:
      - ORDERER_GENERAL_LISTENPORT=9050
      - ORDERER_GENERAL_CLUSTER_LISTENPORT=9050
    ports:
      - "9050:9050"
    # ...
```

### Consensus Configuration (configtx.yaml)

```yaml
Orderer: &OrdererDefaults
  OrdererType: etcdraft
  Addresses:
    - orderer1.example.com:7050
    - orderer2.example.com:8050
    - orderer3.example.com:9050
  BatchTimeout: 2s
  BatchSize:
    MaxMessageCount: 10
    AbsoluteMaxBytes: 99 MB
    PreferredMaxBytes: 512 KB
  EtcdRaft:
    Consenters:
      - Host: orderer1.example.com
        Port: 7050
        ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/server.crt
        ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/server.crt
      - Host: orderer2.example.com
        Port: 8050
        ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
        ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
      - Host: orderer3.example.com
        Port: 9050
        ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
        ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
  Organizations:
    - *OrdererOrg
  Policies: *OrdererPolicies
  Capabilities: *OrdererCapabilities
```

### Raft Consenters Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_TLS` | Enable TLS for Raft | true |
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_TICK_INTERVAL` | Tick interval | 500ms |
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_ELECTION_TICK` | Election timeout | 10 |
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_HEARTBEAT_TICK` | Heartbeat interval | 1 |
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_MAX_INFLIGHT_BLOCKS` | Max inflight blocks | 5 |
| `ORDERER_CONSENSUS_ETCDRAFT_OPTIONS_SNAPSHOT_INTERVAL_SIZE` | Snapshot size | 20MB |

### Orderer Crypto Config (cryptogen)

```yaml
# crypto-config.yaml
OrdererOrgs:
  - Name: Orderer
    Domain: example.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer1
        SANS:
          - "localhost"
      - Hostname: orderer2
        SANS:
          - "localhost"
      - Hostname: orderer3
        SANS:
          - "localhost"
```

### Orderer Lifecycle Commands

```bash
# Generate genesis block
configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

# Create channel tx
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel

# Create anchor peer updates
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

# Create channel
peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --tls --cafile $ORDERER_CA

# Join channel
peer channel join -b mychannel.block

# Update anchor peers
peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile $ORDERER_CA
```

### Raft Cluster Management

```bash
# Check cluster status
peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile $ORDERER_CA
configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config.channel_group.groups.Orderer.groups.OrdererOrg.values.ConsensusType.value.metadata.consenters

# Add new orderer (dynamic membership)
# 1. Generate crypto for new orderer
# 2. Update configtx.yaml with new consenter
# 3. Generate config update
# 4. Sign and submit config update
# 5. Start new orderer node
```

### Orderer Logs & Monitoring

```bash
# View logs
docker logs orderer.example.com -f

# Check metrics (if enabled)
curl http://orderer.example.com:7050/metrics

# Check ledger
ls -la /var/hyperledger/production/orderer/chains/mychannel/
```

---

## Referências Oficiais

- Fabric Orderer Docs: https://hyperledger-fabric.readthedocs.io/en/latest/orderer/ordering_service.html
- Raft Consensus: https://hyperledger-fabric.readthedocs.io/en/latest/orderer/etcdraft.html
- Context7: `/hyperledger/fabric`
- Benchmark: 72.68