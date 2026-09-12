---
name: homelab-network-setup
description: "Use when practical home and homelab network planning for gateways, switches, access points, IP ranges, DHCP reservations, DNS, cabling, and common beginner mistakes. Triggers on \"homelab-network-setup\", \"homelab network setup\", \"setup\"."
metadata:
  origin: community
---

# Homelab Network Setup

Use this skill to design a home or small-lab network that can grow without
needing a full rebuild.

## When to Use

- Planning a new home network or redesigning an ISP-router-only setup.
- Choosing gateway, switch, and access point roles.
- Designing IP ranges, DHCP scopes, static reservations, and DNS.
- Preparing for future VLANs, Pi-hole, NAS, lab servers, or VPN access.
- Troubleshooting a new network that has double NAT, unstable Wi-Fi, or changing
  server addresses.

## How It Works

Start by separating device roles:

```text
Internet
  |
Modem or ONT
  |
Gateway or router      NAT, firewall, DHCP, DNS, inter-VLAN routing
  |
Managed switch         wired clients, AP uplinks, optional VLAN trunks
  |
Access points          Wi-Fi only; ideally wired backhaul
Servers and NAS        stable addresses, DNS names, monitoring
Clients and IoT        DHCP pools, isolated later if VLANs are available
```

Pick a gateway that matches the operator, not just the feature checklist:

| Option | Best fit | Notes |
| --- | --- | --- |
| ISP router | Basic internet only | Limited control and often poor VLAN support |
| UniFi gateway | Managed home network | Good UI, ecosystem lock-in |
| OPNsense or pfSense | Flexible homelab | Strong VLAN, firewall, VPN, and DNS control |
| MikroTik | Advanced network users | Powerful, but easy to misconfigure |
| Linux router | Tinkerers | Document rollback before using as primary gateway |

## IP Plan

Avoid the most common default, `192.168.1.0/24`, when you expect to use VPNs.
It often conflicts with hotels, offices, and ISP routers.

```text
Example small homelab plan:

192.168.10.0/24  trusted clients
192.168.20.0/24  IoT and media devices
192.168.30.0/24  servers and NAS
192.168.40.0/24  guest Wi-Fi
192.168.99.0/24  network management

Gateway convention: .1
Infrastructure reservations: .2 through .49