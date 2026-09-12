---
name: homelab-pihole-dns
description: "Use when pi-hole installation, blocklist management, DNS-over-HTTPS setup, DHCP integration, local DNS records, and troubleshooting broken DNS resolution on a home network. Triggers on \"homelab-pihole-dns\", \"homelab pihole dns\"."
metadata:
  origin: ECC
---

# Homelab Pi-hole DNS

Network-wide DNS ad blocking for every device, no browser extension needed. Detalhes em `references/`.

## When to Use

- Installing Pi-hole on a Raspberry Pi or Linux host
- Configuring Pi-hole as the DNS server for a home network
- Adding or managing blocklists
- Setting up DNS-over-HTTPS (DoH) upstream resolvers
- Creating local DNS records (e.g. `nas.home.lan`, `pi.home.lan`)
- Troubleshooting devices that lose internet after Pi-hole install

## Core Principles

1. **Static IP first** — install nothing before the Pi's address is fixed
2. **Pin versions** — release tags for image and cloudflared, never `latest`
3. **One DHCP server** — disable the router's before enabling Pi-hole's
4. **Strict blocking = no public fallback** — second Pi-hole for redundancy
5. **Gravity stays fresh** — weekly `pihole -g`; whitelist false positives

## Example

```bash
# Whitelist a false positive, verify, refresh lists
pihole -q example.com && pihole -w example.com
dig @192.168.3.2 google.com
pihole -g
```

## References

- `references/installation.md` — how it works, Docker compose, bare-metal install
- `references/network-config.md` — router/per-device/DHCP pointing, blocklists, DoH, local DNS
- `references/troubleshooting.md` — diagnostics, anti-patterns, best practices, related skills

## Checklist

- [ ] Static IP or DHCP reservation before install; password in `.env` (600), not git
- [ ] Router DHCP points at Pi-hole; no competing public fallback for strict blocking
- [ ] Blocklists added + gravity updated; Query Log reviewed
- [ ] DoH proxy pinned, checksum-verified, Pi-hole upstream set to `127.0.0.1#5053`
- [ ] Local DNS records created; rollback path documented (or second Pi-hole)
