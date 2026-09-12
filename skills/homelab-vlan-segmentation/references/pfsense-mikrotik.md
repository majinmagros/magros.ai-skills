# pfSense / OPNsense and MikroTik Configuration

## pfSense / OPNsense: Create VLANs

```
Interfaces → Assignments → VLANs → Add

  Parent Interface: em1  (your LAN NIC)
  VLAN Tag: 20
  Description: IoT

# Repeat for each VLAN, then assign each VLAN to an interface:
Interfaces → Assignments → Add
  Select the VLAN you created → click Add
  Enable the interface, set IP to gateway address (192.168.20.1/24)
```

## pfSense / OPNsense: DHCP for Each VLAN

```
Services → DHCP Server → Select your VLAN interface

  Enable DHCP
  Range: 192.168.20.100 to 192.168.20.254
  DNS Servers: 192.168.30.2  ← Pi-hole IP if you have one
```

## pfSense / OPNsense: Firewall Rules

```
# Rules are processed top-to-bottom, first match wins.

# On the IoT interface (VLAN 20):
  Rule 1: Allow IoT → Pi-hole DNS  ← MUST come before the RFC1918 block rule
    Protocol: UDP/TCP
    Source: IoT net
    Destination: 192.168.30.2 port 53
    Action: Allow

  Rule 2: Block IoT → RFC1918 (all private IP ranges)
    Protocol: any
    Source: IoT net
    Destination: RFC1918  (192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12)
    Action: Block

  Rule 3: Allow IoT → internet
    Protocol: any
    Source: IoT net
    Destination: any
    Action: Allow

# On the Trusted interface (VLAN 10):
  Allow all (trusted devices can reach everything)
    Source: Trusted net
    Destination: any
    Action: Allow

# Additional exceptions for IoT devices that need specific local services:
  Insert before Rule 2 (the RFC1918 block):
    Protocol: TCP
    Source: IoT net
    Destination: 192.168.30.x port 8123  ← Home Assistant
    Action: Allow
```

## MikroTik Configuration

```
# Step 1: Create a bridge with VLAN filtering enabled
/interface bridge
add name=bridge vlan-filtering=yes

# Step 2: Add physical ports to the bridge
# Trunk port to router/uplink (tagged for all VLANs)
/interface bridge port
add bridge=bridge interface=ether1 frame-types=admit-only-vlan-tagged

# Access port for trusted devices (untagged VLAN 10)
/interface bridge port
add bridge=bridge interface=ether2 pvid=10 frame-types=admit-only-untagged-and-priority-tagged

# Access port for IoT devices (untagged VLAN 20)
/interface bridge port
add bridge=bridge interface=ether3 pvid=20 frame-types=admit-only-untagged-and-priority-tagged

# Step 3: Define which VLANs are allowed on which ports
/interface bridge vlan
add bridge=bridge tagged=ether1 untagged=ether2 vlan-ids=10
add bridge=bridge tagged=ether1 untagged=ether3 vlan-ids=20

# Step 4: Create VLAN interfaces on the bridge (gateway IPs)
/interface vlan
add interface=bridge name=vlan10 vlan-id=10
add interface=bridge name=vlan20 vlan-id=20

# Step 5: Assign gateway IPs
/ip address
add interface=vlan10 address=192.168.10.1/24
add interface=vlan20 address=192.168.20.1/24

# Step 6: DHCP pools and servers
/ip pool
add name=pool-trusted ranges=192.168.10.100-192.168.10.254
add name=pool-iot ranges=192.168.20.100-192.168.20.254

/ip dhcp-server
add interface=vlan10 address-pool=pool-trusted name=dhcp-trusted
add interface=vlan20 address-pool=pool-iot name=dhcp-iot

/ip dhcp-server network
add address=192.168.10.0/24 gateway=192.168.10.1
add address=192.168.20.0/24 gateway=192.168.20.1

# Step 7: Firewall — block IoT from reaching trusted VLAN
/ip firewall filter
add chain=forward src-address=192.168.20.0/24 dst-address=192.168.10.0/24 \
    action=drop comment="Block IoT to Trusted"
```
