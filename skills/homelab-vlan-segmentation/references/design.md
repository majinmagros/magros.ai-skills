# How It Works, Design Template, Full Example

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

## Full Example: Homelab with UniFi AP and Managed Switch

```
Scenario: 3-bedroom house, UniFi Dream Machine + UniFi 8-port switch + 2 APs

VLAN 10 — Trusted    192.168.10.0/24   MacBook, iPhones, iPad
VLAN 20 — IoT        192.168.20.0/24   Nest thermostat, Philips Hue, Ring doorbell, smart TVs
VLAN 30 — Servers    192.168.30.0/24   Synology NAS (192.168.30.10), Pi-hole (192.168.30.2)
VLAN 40 — Guest      192.168.40.0/24   Visitor Wi-Fi — internet only

SSID → VLAN mapping:
  "Home"      → VLAN 10 (WPA2, strong password, trusted devices only)
  "IoT"       → VLAN 20 (WPA2, separate password, printed on router for setup)
  "Guest"     → VLAN 40 (WPA2, simple password you can share freely)

Switch port behavior:
  Port 1  → trunk to router (tagged VLANs 10,20,30,40,99)
  Port 2  → trunk to APs (tagged VLANs 10,20,40; AP handles per-SSID tagging)
  Port 3  → access VLAN 30 (NAS — untagged, no VLAN awareness needed)
  Port 4  → access VLAN 30 (Pi-hole — untagged)
  Port 5–8 → access VLAN 10 (wired workstations)

Firewall rules applied (all rules add isolation, none remove existing protections):
  IoT → Trusted: BLOCK
  IoT → Servers: BLOCK except 192.168.30.2:53 (Pi-hole DNS allowed)
  IoT → Internet: ALLOW
  Guest → Local networks: BLOCK
  Guest → Internet: ALLOW
  Trusted → everywhere: ALLOW
```

All firewall rules shown here add isolation between segments — they do not remove
existing protections. Apply changes in a maintenance window and verify connectivity
between segments after each step before moving on.
