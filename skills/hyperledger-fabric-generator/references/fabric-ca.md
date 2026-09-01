# Fabric CA Reference (Validado via Context7)

## Library: Hyperledger Fabric (`/hyperledger/fabric`)

### Fabric CA Server Config

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
      - name: peer0
        pass: peer0pw
        type: peer
        affiliation: org1
      - name: orderer
        pass: ordererpw
        type: orderer
        affiliation: org1
  intermediates:
    - certfile: /etc/hyperledger/fabric-ca-server-config/intermediate-cert.pem
      keyfile: /etc/hyperledger/fabric-ca-server-config/intermediate-key.pem
  ldap:
    enabled: false
  db:
    type: sqlite3
    datasource: /etc/hyperledger/fabric-ca-server/fabric-ca-server.db
  tls:
    enabled: true
    certfiles:
      - /etc/hyperledger/fabric-ca-server-config/ca.org1-cert.pem
    keyfile: /etc/hyperledger/fabric-ca-server-config/ca.org1-key.pem
```

### Fabric CA Client Commands

```bash
# Set environment
export FABRIC_CA_CLIENT_HOME=$PWD/fabric-ca-client
export FABRIC_CA_CLIENT_TLS_CERTFILES=/path/to/ca-cert.pem

# Enroll admin
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-org1

# Register identities
fabric-ca-client register --id.name peer0 --id.secret peer0pw --id.type peer --id.affiliation org1 --id.attrs 'hf.Revoker=true,hf.IntermediateCA=true'
fabric-ca-client register --id.name user1 --id.secret user1pw --id.type client --id.affiliation org1
fabric-ca-client register --id.name appuser --id.secret appuserpw --id.type client --id.affiliation org1 --id.attrs 'hf.Registrar.Roles=peer,user'

# Enroll peer
fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-org1 -M $PWD/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp

# Get CA info
fabric-ca-client getcainfo -u https://localhost:7054

# Re-enroll
fabric-ca-client reenroll -M $PWD/msp

# Revoke certificate
fabric-ca-client revoke -e peer0 --revoke-reason superseded
```

### Docker Compose for CA

```yaml
# docker-compose-ca.yaml
services:
  ca-org1:
    image: hyperledger/fabric-ca:1.5
    container_name: ca-org1
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-org1
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_TLS_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1-cert.pem
      - FABRIC_CA_SERVER_TLS_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1-key.pem
      - FABRIC_CA_SERVER_PORT=7054
    volumes:
      - ./fabric-ca-server-config:/etc/hyperledger/fabric-ca-server-config
      - ./crypto-config/ca:/etc/hyperledger/fabric-ca-server
    ports:
      - "7054:7054"
    networks:
      - fabric_network
```

### Enrollment Script (Node.js)

```javascript
// scripts/enroll-identities.js
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function enrollAdmin() {
    const walletPath = path.join(__dirname, '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    
    // Check if already enrolled
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
        console.log('Admin already enrolled');
        return;
    }
    
    // Enroll via fabric-ca-client
    const caUrl = 'https://localhost:7054';
    const enrollment = await execSync(`fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-org1 -M ${walletPath}/admin`);
    
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toString());
    await wallet.import('admin', identity);
    console.log('Admin enrolled successfully');
}

async function registerAndEnrollPeer(peerName, orgName) {
    const wallet = new FileSystemWallet(path.join(__dirname, '../wallet'));
    
    // Register with CA
    execSync(`fabric-ca-client register --id.name ${peerName} --id.secret ${peerName}pw --id.type peer --id.affiliation ${orgName} -u https://admin:adminpw@localhost:7054 --caname ca-${orgName}`);
    
    // Enroll
    execSync(`fabric-ca-client enroll -u https://${peerName}:${peerName}pw@localhost:7054 --caname ca-${orgName} -M ${path.join(__dirname, `../crypto-config/peerOrganizations/${orgName}.example.com/peers/${peerName}.${orgName}.example.com/msp`)}`);
    
    console.log(`Peer ${peerName} enrolled`);
}

async function main() {
    await enrollAdmin();
    
    // Enroll peers for each org
    await registerAndEnrollPeer('peer0', 'org1');
    await registerAndEnrollPeer('peer1', 'org1');
    await registerAndEnrollPeer('peer0', 'org2');
    await registerAndEnrollPeer('peer1', 'org2');
    
    console.log('All identities enrolled');
}

main().catch(console.error);
```

---

## Referências Oficiais

- Fabric CA Docs: https://hyperledger-fabric-ca.readthedocs.io/
- GitHub: https://github.com/hyperledger/fabric-ca
- Context7: `/hyperledger/fabric`
- Benchmark: 72.68