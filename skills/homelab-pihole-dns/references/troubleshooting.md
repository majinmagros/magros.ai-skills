# Troubleshooting, Anti-Patterns, Practices

## Troubleshooting

```bash
# Pi-hole blocking something it should not
pihole -q example.com          # Check if domain is blocked and which list
pihole -w example.com          # Whitelist immediately

# DNS not resolving at all
pihole status                  # Check if pihole-FTL is running
dig @192.168.3.2 google.com   # Test DNS directly against Pi-hole

# Restart Pi-hole DNS
pihole restartdns

# Check query logs for a specific device
pihole -t                      # Live tail of all queries
# Or filter by client in the web admin Query Log

# Pi-hole gravity update (refresh blocklists)
pihole -g
```

## Anti-Patterns

```
# BAD: Depending on one Pi-hole without a recovery path
# If Pi-hole crashes or the Pi loses power, DNS can stop working
# GOOD: Keep a documented router fallback for rollback during setup
# BETTER: Run two Pi-hole instances for redundancy; avoid public fallback DNS for strict blocking

# BAD: Installing Pi-hole without a static IP
# If the Pi gets a new DHCP IP, all devices lose DNS
# GOOD: Set static IP first, then install Pi-hole

# BAD: Enabling Pi-hole DHCP without disabling the router's DHCP first
# Two DHCP servers on the same network hand out conflicting IPs
# GOOD: Disable router DHCP, then enable Pi-hole DHCP

# BAD: Never updating gravity (blocklists)
# New ad and malware domains accumulate — stale lists miss them
# GOOD: Schedule weekly gravity update: pihole -g (or enable in Settings → API)
```

## Best Practices

- Give the Pi a static IP or DHCP reservation before installing Pi-hole
- Use Pi-hole as primary DNS; for redundancy, add a second Pi-hole instead of a
  public resolver if you need strict blocking
- Enable DoH (DNS-over-HTTPS) with cloudflared for encrypted upstream queries
- Set `home.lan` as your local domain and create DNS records for all your services
- Review the Query Log occasionally — blocked queries show you what devices are doing

## Related Skills

- homelab-network-setup
- homelab-vlan-segmentation
- homelab-wireguard-vpn
