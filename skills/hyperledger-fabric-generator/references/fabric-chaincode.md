# Fabric Chaincode Reference (Validado via Context7)

## Library: Hyperledger Fabric (`/hyperledger/fabric`)

### Chaincode Lifecycle (Fabric 2.x+)

```bash
# 1. Package
peer lifecycle chaincode package assettransfer.tar.gz \
  --path ./chaincode/assettransfer \
  --lang golang \
  --label assettransfer_1.0

# 2. Install on peers
peer lifecycle chaincode install assettransfer.tar.gz

# Query installed
peer lifecycle chaincode queryinstalled

# 3. Approve for org
peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID mychannel \
  --name assettransfer \
  --version 1.0 \
  --package-id $(peer lifecycle chaincode queryinstalled | grep assettransfer_1.0 | awk '{print $1}') \
  --sequence 1 \
  --tls \
  --cafile $ORDERER_CA

# Check commit readiness
peer lifecycle chaincode checkcommitreadiness \
  --channelID mychannel \
  --name assettransfer \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile $ORDERER_CA \
  --output json

# 4. Commit
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --channelID mychannel \
  --name assettransfer \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile $ORDERER_CA \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles $PEER0_ORG1_CA \
  --peerAddresses peer0.org2.example.com:9051 \
  --tlsRootCertFiles $PEER0_ORG2_CA

# Query committed
peer lifecycle chaincode querycommitted --channelID mychannel --name assettransfer
```

### Chaincode Structure (Go)

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

func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
	exists, _ := s.AssetExists(ctx, id)
	if !exists { return fmt.Errorf("asset %s does not exist", id) }
	asset := Asset{ID: id, Color: color, Size: size, Owner: owner, AppraisedValue: appraisedValue}
	assetJSON, _ := json.Marshal(asset)
	return ctx.GetStub().PutState(id, assetJSON)
}

func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
	exists, _ := s.AssetExists(ctx, id)
	if !exists { return fmt.Errorf("asset %s does not exist", id) }
	return ctx.GetStub().DelState(id)
}

func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
	asset, err := s.ReadAsset(ctx, id)
	if err != nil { return err }
	asset.Owner = newOwner
	assetJSON, _ := json.Marshal(asset)
	return ctx.GetStub().PutState(id, assetJSON)
}

func (s *SmartContract) QueryAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil { return nil, err }
	defer resultsIterator.Close()

	var assets []*Asset
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		var asset Asset
		json.Unmarshal(queryResponse.Value, &asset)
		assets = append(assets, &asset)
	}
	return assets, nil
}

func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil { return false, err }
	return assetJSON != nil, nil
}

func main() {
	chaincode, _ := contractapi.NewChaincode(new(SmartContract))
	chaincode.Start()
}
```

### Chaincode Structure (Node.js)

```javascript
// chaincode/assettransfer/lib/assettransfer.js
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const asset = { ID: id, Color: color, Size: parseInt(size), Owner: owner, AppraisedValue: parseInt(appraisedValue) };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${id} does not exist`);
        }
        return JSON.parse(assetJSON.toString());
    }

    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) { throw new Error(`Asset ${id} does not exist`); }
        const asset = { ID: id, Color: color, Size: parseInt(size), Owner: owner, AppraisedValue: parseInt(appraisedValue) };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) { throw new Error(`Asset ${id} does not exist`); }
        await ctx.stub.deleteState(id);
    }

    async TransferAsset(ctx, id, newOwner) {
        const asset = await this.ReadAsset(ctx, id);
        asset.Owner = newOwner;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    async QueryAllAssets(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                results.push(JSON.parse(res.value.value.toString()));
            }
            if (res.done) { await iterator.close(); break; }
        }
        return JSON.stringify(results);
    }

    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports = AssetTransfer;
```

### Private Data Collections

```yaml
# collections_config.json
[
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
]
```

```go
// Use private data
func (s *SmartContract) CreatePrivateAsset(ctx contractapi.TransactionContextInterface, id string, privateData string) error {
    privateDetails := map[string]string{"data": privateData}
    privateJSON, _ := json.Marshal(privateDetails)
    return ctx.GetStub().PutPrivateData("Org1PrivateDetails", id, privateJSON)
}

func (s *SmartContract) ReadPrivateAsset(ctx contractapi.TransactionContextInterface, id string) (string, error) {
    privateJSON, err := ctx.GetStub().GetPrivateData("Org1PrivateDetails", id)
    if err != nil { return "", err }
    return string(privateJSON), nil
}
```

### Chaincode Endorsement Policies

```bash
# Endorsement policies in approval
peer lifecycle chaincode approveformyorg \
  --signature-policy "OR('Org1MSP.peer','Org2MSP.peer')" \
  ...

# Or in chaincode
func (s *SmartContract) EndorsementPolicy() string {
    return "OR('Org1MSP.peer','Org2MSP.peer')"
}
```

### Chaincode Events

```go
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
    asset := Asset{ID: id, Color: color, Size: size, Owner: owner, AppraisedValue: appraisedValue}
    assetJSON, _ := json.Marshal(asset)
    
    // Emit event
    ctx.GetStub().SetEvent("AssetCreated", assetJSON)
    
    return ctx.GetStub().PutState(id, assetJSON)
}
```

```javascript
// Listen to events (Node.js SDK)
const listener = async () => {
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('assettransfer');
    
    const listener = async (event) => {
        console.log('Event:', event.eventName, event.payload.toString());
    };
    
    await contract.addContractEventListener(listener, 'AssetCreated');
};
```

---

## Referências Oficiais

- Chaincode Lifecycle: https://hyperledger-fabric.readthedocs.io/en/latest/chaincode_lifecycle.html
- Chaincode APIs: https://hyperledger-fabric.readthedocs.io/en/latest/chaincode4ade.html
- Private Data: https://hyperledger-fabric.readthedocs.io/en/latest/private-data/private-data.html
- Context7: `/hyperledger/fabric`
- Benchmark: 72.68