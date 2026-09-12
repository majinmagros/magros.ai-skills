# Trunk vs Access Ports, Anti-Patterns, Best Practices

## Switch Trunk vs Access Ports

```
# Trunk port: carries multiple VLANs (tagged) — connects switch-to-switch, switch-to-router, switch-to-AP
# Access port: carries one VLAN (untagged) — connects to end devices (PC, camera, NAS)

# A managed switch port connected to your router should be a trunk:
  Allowed VLANs: 10, 20, 30, 40, 99

# A port connecting to a PC should be an access port:
  VLAN: 10 (trusted)
  No tagging — the PC does not know or care about VLANs

# A port connecting to an AP must be a trunk:
  The AP tags traffic from each SSID with the right VLAN ID
  Allowed VLANs: 10, 20, 40  (whichever SSIDs the AP serves)
```

## Anti-Patterns

```
# BAD: Creating VLANs without adding firewall rules
# VLANs without firewall rules do not provide security — inter-VLAN routing is open by default
# GOOD: Add explicit block rules immediately after creating VLANs

# BAD: Putting the Pi-hole in the IoT VLAN
# IoT devices can reach it but trusted devices cannot (without extra rules)
# GOOD: Pi-hole in the Servers VLAN with a rule allowing all VLANs to reach port 53

# BAD: Native VLAN equals management VLAN
# Untagged traffic landing in your management VLAN enables VLAN hopping attacks
# GOOD: Use a dedicated unused VLAN as native (e.g. VLAN 999), keep management traffic tagged

# BAD: Same Wi-Fi password for IoT SSID and trusted SSID
# Anyone who learns the password can connect IoT devices to the wrong segment
```

## Best Practices

- Start with 4 VLANs: Trusted, IoT, Servers, Guest — add more as needed
- Put Pi-hole in the Servers VLAN (192.168.30.x)
- Add a firewall rule allowing DNS (port 53) from all VLANs to the Pi-hole IP — before any RFC1918 block rule
- Test isolation after every rule change: from the IoT VLAN, try to ping a trusted device — it should fail
- Use a management VLAN for switch and AP web UIs and restrict access to the Trusted VLAN only
- Document your VLAN design in a table (VLAN ID, name, subnet, purpose)

## Related Skills

- homelab-network-setup
- homelab-pihole-dns
- homelab-wireguard-vpn
