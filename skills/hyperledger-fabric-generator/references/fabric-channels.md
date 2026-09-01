# Fabric Channels Reference (Validado via Context7)

## Library: Hyperledger Fabric (`/hyperledger/fabric`)

### Channel Configuration (configtx.yaml)

```yaml
# Channel profiles
Profiles:
  TwoOrgsOrdererGenesis:
    <<: *OrdererDefaults
    Organizations:
      - *OrdererOrg
    Capabilities: *OrdererCapabilities
    Consortiums:
      SampleConsortium:
        Organizations:
          - *Org1
          - *Org2

  TwoOrgsChannel:
    Consortium: SampleConsortium
    <<: *ChannelDefaults
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
        - *Org2
```

### Channel Artifacts Generation

```bash
# Generate channel creation transaction
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel

# Generate anchor peer updates
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

# Create channel
peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --tls --cafile $ORDERER_CA

# Join channel
peer channel join -b mychannel.block

# Update anchor peers
peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile $ORDERER_CA
peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile $ORDERER_CA

# List channels
peer channel list

# Fetch channel config
peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile $ORDERER_CA

# Decode config
configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config
```

### Channel Policies

```yaml
# configtx.yaml policies
Policies: &ChannelPolicies
  Readers:
    Type: ImplicitMeta
    Rule: "ANY Readers"
  Writers:
    Type: ImplicitMeta
    Rule: "ANY Writers"
  Admins:
    Type: ImplicitMeta
    Rule: "MAJORITY Admins"

# Application policies
Application: &ApplicationDefaults
  Organizations:
  Policies: &ApplicationPolicies
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    LifecycleEndorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
```

### Multi-Channel Setup

```yaml
# Multiple channels in configtx.yaml
Profiles:
  TwoOrgsChannel:
    Consortium: SampleConsortium
    <<: *ChannelDefaults
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
        - *Org2

  ThreeOrgsChannel:
    Consortium: SampleConsortium
    <<: *ChannelDefaults
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
        - *Org2
        - *Org3
```

### Channel Lifecycle Commands

```bash
# Create channel
peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --tls --cafile $ORDERER_CA

# Join peers to channel
peer channel join -b mychannel.block

# List joined channels
peer channel list

# Get channel info
peer channel getinfo -c mychannel

# Update channel config (add org, modify policies)
# 1. Fetch config
peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile $ORDERER_CA

# 2. Decode
configtxlator proto_decode --input config_block.pb --type common.Block > config.json

# 3. Modify config.json (add org, change policies)

# 4. Encode modified config
configtxlator proto_encode --input config.json --type common.Config --output modified_config.pb

# 5. Compute delta
configtxlator compute_update --channel_id mychannel --original config_block.pb --updated modified_config.pb --output config_update.pb

# 6. Wrap in envelope
configtxlator proto_encode --input config_update.pb --type common.ConfigUpdate --output config_update_envelope.pb

# 7. Sign and submit
peer channel signconfigtx -f config_update_envelope.pb
peer channel update -f config_update_envelope.pb -c mychannel -o orderer.example.com:7050 --tls --cafile $ORDERER_CA
```

### Channel Capabilities

```yaml
Capabilities:
  Channel: &ChannelCapabilities
    V2_0: true
  Orderer: &OrdererCapabilities
    V2_0: true
  Application: &ApplicationCapabilities
    V2_0: true
```

---

## Referências Oficiais

- Fabric Channel Docs: https://hyperledger-fabric.readthedocs.io/en/latest/channels.html
- Configtxgen: https://hyperledger-fabric.readthedocs.io/en/latest/configtxgen.html
- Context7: `/hyperledger/fabric`
- Benchmark: 72.68