# WireGuard VPN — Troubleshooting, Anti-Patterns, Best Practices

## Troubleshooting

```bash
# Check WireGuard status and last handshake
sudo wg show

# If "latest handshake" is never or very old, the tunnel is not connected.
# Check:
# 1. Is UDP port 51820 open on the router/firewall?
sudo ufw status  # or check pfSense/UniFi firewall rules

# 2. Is the server public key in the client config correct?
sudo wg show wg0 public-key   # Compare to what is in the client config

# 3. Is IP forwarding enabled on the server?
cat /proc/sys/net/ipv4/ip_forward  # Should be 1

# 4. Does the client AllowedIPs cover the IP you are trying to reach?
# If AllowedIPs = 192.168.1.0/24 and you are trying to reach 192.168.3.5, it will not route.

# Check kernel logs for WireGuard errors
dmesg | grep wireguard

# Restart WireGuard
sudo wg-quick down wg0 && sudo wg-quick up wg0
```

## Anti-Patterns

```
# BAD: Storing private keys in version control or sharing them
# Private keys are equivalent to passwords — never commit them to git

# BAD: Using AllowedIPs = 0.0.0.0/0 on mobile without considering the impact
# Full tunnel routes all mobile traffic through your home upload — usually slow

# BAD: Not setting PersistentKeepalive on mobile clients
# Mobile clients behind NAT drop idle tunnels without it

# BAD: Opening port 51820 in the firewall but forgetting IP forwarding on the server
# Tunnel connects but no traffic routes — confusing to debug

# BAD: Sharing a keypair across multiple client devices
# Each device must have its own unique keypair — shared keys break the security model

# BAD: Using a broad "FORWARD ACCEPT" iptables rule
# Scope forwarding rules to the wg0 interface and direction only
```

## Best Practices

- Generate a unique keypair per client device — never reuse keys
- Use split tunneling (`AllowedIPs = <home subnets>`) for mobile
- Set `PersistentKeepalive = 25` on all mobile clients
- Use DDNS if your ISP assigns a dynamic IP; store credentials in env files, not inline
- Use scoped iptables forwarding rules (inbound on wg0 only) rather than a blanket FORWARD ACCEPT
- Add Pi-hole's IP as `DNS =` in client configs to get ad blocking over the VPN
- Rotate the server keypair periodically and update all client configs

## Related Skills

- homelab-network-setup
- homelab-vlan-segmentation
- homelab-pihole-dns
