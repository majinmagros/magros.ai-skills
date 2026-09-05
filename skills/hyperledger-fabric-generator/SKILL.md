---
name: hyperledger-fabric-generator
description: Use when scaffolding Hyperledger Fabric blockchain networks — CA → peers → orderers → channels → chaincode → Explorer → Caliper → API Node.js. Based on Pavan Adhav video "Custom Hyperledger Fabric Network Code Generator". Only for Hyperledger Fabric — not for other blockchains. Triggers: "hyperledger fabric generator", "fabric network scaffolding", "fabric CA peers orderers", "chaincode deployment", "fabric explorer caliper", "blockchain network generator".
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
| Fabric chaincode (Go/Node.js) | ✅ | Context7 `/hyperledger-caliper/caliper` |
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

## Quando NÃO usar

- Outras blockchains (Ethereum, Solana → skills especificas)
- Chaincode Go puro sem rede (use docs oficiais + `golang-patterns`)

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

## Etapas (resumo — detalhe em references/)

| Etapa | Reference |
|---|---|
| 1. CA — Certificate Authority | `references/fabric-ca.md` |
| 2. Peers — orgs, MSP, anchor | `references/fabric-peers.md` |
| 3. Orderers — Raft/Etcd | `references/fabric-orderers.md` |
| 4. Channels — configtx, artifacts | `references/fabric-channels.md` |
| 5. Chaincode — package/install/approve/commit | `references/fabric-chaincode.md` |
| 6. Explorer — dashboard | `references/fabric-explorer.md` |
| 7. Caliper — benchmark | `references/fabric-caliper.md` |
| 8. API Node.js — Gateway SDK + REST | `references/fabric-gateway-sdk.md` |
| Web UI generator (Pavan Adhav style) | `references/fabric-web-generator.md` |

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
