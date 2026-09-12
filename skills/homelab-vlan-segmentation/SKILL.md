---
name: homelab-vlan-segmentation
description: "Use when segmenting home networks into VLANs for IoT, guest, trusted, and server traffic using UniFi, pfSense/OPNsense, and MikroTik — including switch trunk config, firewall rules, and wireless SSID mapping. Triggers on \"homelab-vlan-segmentation\", \"homelab vlan segmentation\", \"segmentation\"."
metadata:
  origin: community
---

# Homelab VLAN Segmentation

How to split a home network into isolated VLANs so IoT devices, guests, and your main
PCs cannot talk to each other. The most impactful security upgrade for a home network.

All firewall rules shown here add isolation between segments — they do not remove
existing protections. Apply changes in a maintenance window and verify connectivity
between segments after each step before moving on.

## When to Use

- Setting up VLANs on a home network for the first time
- Isolating IoT devices (smart bulbs, cameras, TVs) from trusted devices
- Creating a guest Wi-Fi network that cannot reach home devices
- Explaining how VLANs work to someone unfamiliar with the concept
- Configuring trunk ports, access ports, and SSID-to-VLAN mapping
- Troubleshooting inter-VLAN routing or firewall rule issues on pfSense/OPNsense/UniFi

## How It Works

```
Without VLANs — flat network:
  All devices on 192.168.1.0/24
  Smart TV (potential malware) → can reach your NAS, PCs, everything

With VLANs:
  VLAN 10 — Trusted    192.168.10.0/24  (PCs, phones, laptops)
  VLAN 20 — IoT        192.168.20.0/24  (smart TV, bulbs, cameras)
  VLAN 30 — Servers    192.168.30.0/24  (NAS, Pi, VMs)
  VLAN 40 — Guest      192.168.40.0/24  (visitor Wi-Fi)
  VLAN 99 — Management 192.168.99.0/24  (switch/AP web UIs)

  Smart TV → blocked from reaching 192.168.10.0/24 and 192.168.30.0/24
  Guests → internet only, cannot see any home devices
```

## VLAN Design Template

```
VLAN  Name        Subnet              Gateway         Purpose
10    trusted     192.168.10.0/24     192.168.10.1    PCs, phones, laptops
20    iot         192.168.20.0/24     192.168.20.1    Smart home devices
30    servers     192.168.30.0/24     192.168.30.1    NAS, Pi, self-hosted
40    guest       192.168.40.0/24     192.168.40.1    Visitor Wi-Fi
99    management  192.168.99.0/24     192.168.99.1    Network gear web UIs
```

## Examples

**Typical homelab with UniFi AP and managed switch:**

```
Scenario: 3-bedroom house, UniFi Dream Machine + UniFi 8-port switch + 2 APs

VLAN 10 — Trusted    192.168.10.0/24   MacBook, iPhones, iPad
VLAN 20 — IoT        192.168.20.0/24   Nest thermostat, Philips Hue, Ring doorbell, smart TVs
VLAN 30 — Servers    192.168.30.0/24   Synology NAS (192.168.30.10), Pi-hole (192.168.30.2)
VLAN 40 — Guest      192.168.40.0/24   Visitor Wi-Fi — internet only