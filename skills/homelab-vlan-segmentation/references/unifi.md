# UniFi Configuration

## Create Networks in UniFi Controller

```
Settings → Networks → Create New Network

For each VLAN:
  Name: IoT
  Purpose: Corporate  (gives DHCP + routing)
  VLAN ID: 20
  Network: 192.168.20.0/24
  Gateway IP: 192.168.20.1
  DHCP: Enable
  DHCP Range: 192.168.20.100 – 192.168.20.254
```

## Map SSIDs to VLANs (UniFi)

```
Settings → WiFi → Create New WiFi

  Name: IoT-Network
  Password: <separate password>
  Network: IoT  ← select your VLAN here
  # All devices connecting to this SSID land in VLAN 20

  Name: Guest
  Password: <guest password>
  Network: Guest
  Guest Policy: Enable  ← isolates guests from each other too
```

## UniFi Firewall Rules (Traffic Rules)

```
Settings → Traffic & Security → Traffic Rules

# Block IoT from reaching Trusted VLAN
  Action: Block
  Category: Local Network
  Source: IoT (192.168.20.0/24)
  Destination: Trusted (192.168.10.0/24)

# Allow IoT to reach internet only
  Action: Allow
  Source: IoT
  Destination: Internet

# Block Guest from all local networks
  Action: Block
  Source: Guest
  Destination: Local Networks
```
