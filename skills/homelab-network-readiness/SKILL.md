---
name: homelab-network-readiness
description: "Use when readiness checklist for homelab VLAN segmentation, local DNS filtering, and WireGuard-style remote access before changing router, firewall, DHCP, or VPN configuration. Triggers on \"homelab-network-readiness\", \"homelab network readiness\", \"readiness\"."
metadata:
  origin: community
---

# Homelab Network Readiness

Use this skill before changing a home or small-lab network that mixes VLANs,
Pi-hole or another local DNS resolver, firewall rules, and remote VPN access.

This is a planning and review skill. Do not turn it into copy-paste router,
firewall, or VPN configuration unless the target platform, current topology,
rollback path, console access, and maintenance window are all known.

## When to Use

- Preparing to split a flat network into trusted, IoT, guest, server, or
  management VLANs.
- Moving DHCP clients to Pi-hole, AdGuard Home, Unbound, or another local DNS
  resolver.
- Adding WireGuard, Tailscale, ZeroTier, OpenVPN, or router-native VPN access.
- Reviewing whether a homelab change can lock the operator out of the gateway,
  switch, access point, DNS server, or VPN server.
- Turning an informal home-network idea into a staged migration plan with
  validation evidence.

## Safety Rules

- Keep the first answer read-only: inventory, risks, staged plan, validation,
  and rollback.
- Do not expose gateway admin panels, DNS resolvers, SSH, NAS consoles, or VPN
  management UIs directly to the public internet.
- Do not provide firewall, NAT, VLAN, DHCP, or VPN commands without a confirmed
  platform and a rollback procedure.
- Require out-of-band or same-room console access before changing management
  VLANs, trunk ports, firewall default policies, or DHCP/DNS settings.
- Keep a working path back to the internet before pointing the whole network at
  a new DNS resolver or VPN route.
- Treat IoT, guest, camera, and lab-server networks as different trust zones
  until the operator explicitly chooses otherwise.

## Required Inventory

Collect this before giving implementation steps:

| Area | Questions |
| --- | --- |
| Internet edge | What is the modem or ONT? Is the ISP router bridged or still routing? |
| Gateway | What routes, firewalls, handles DHCP, and terminates VPNs? |
| Switching | Which switch ports are uplinks, access ports, trunks, or unmanaged? |
| Wi-Fi | Which SSIDs map to which networks, and are APs wired or mesh? |
| Addressing | What subnets exist today, and which ranges conflict with VPN sites? |
| DNS/DHCP | Which service currently hands out leases and resolver addresses? |
| Management | How will the operator reach the gateway, switch, and AP after changes? |
| Recovery | What can be reverted locally if DNS, DHCP, VLANs, or VPN routes break? |

## VLAN And Trust-Zone Plan

Start with intent rather than vendor syntax.

| Zone | Typical contents | Default policy |
| --- | --- | --- |
| Trusted | Laptops, phones, admin workstations | Can reach shared services and management only when needed |