# Network, Blocklists, DoH, Local DNS

## Pointing Your Network at Pi-hole

```
# Method 1: Change DNS in your router DHCP settings (recommended)
  Router admin UI → DHCP Settings → DNS Server
  Primary DNS: 192.168.3.2  (Pi-hole IP)
  Secondary DNS: leave blank for strict blocking, or use a second Pi-hole.
                 A public fallback such as 1.1.1.1 improves availability during
                 rollout but can bypass blocking because clients may query it.

  All devices get Pi-hole as DNS automatically on next DHCP renewal.
  Force renewal: reconnect Wi-Fi or run 'sudo dhclient -r && sudo dhclient' on Linux

# Method 2: Per-device DNS (useful for testing before network-wide rollout)
  Windows: Control Panel → Network Adapter → IPv4 Properties → set DNS manually
  macOS: System Settings → Network → Details → DNS → set manually
  Linux: /etc/resolv.conf or NetworkManager

# Method 3: Pi-hole as DHCP server (replaces router DHCP)
  Pi-hole admin → Settings → DHCP → Enable
  Disable DHCP on your router first — two DHCP servers on the same network cause conflicts
  Advantage: hostname resolution works automatically (devices register their names)
```

## Blocklist Management

```
# Pi-hole admin → Adlists → Add new adlist

# Recommended blocklists:
  https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
  # default — 200k+ domains

  https://blocklistproject.github.io/Lists/malware.txt
  # malware domains

  https://blocklistproject.github.io/Lists/tracking.txt
  # tracking/telemetry

# After adding a list:
  Tools → Update Gravity  (downloads and compiles all blocklists)

# If a site is blocked that should not be (false positive):
  Pi-hole admin → Whitelist → Add domain
  Example: api.my-legitimate-service.com

# Check what is being blocked in real time:
  Dashboard → Query Log  (live DNS query stream with block/allow status)
```

## DNS-over-HTTPS Upstream

DNS-over-HTTPS encrypts your DNS queries so your ISP cannot see what sites you resolve.

```bash
# Install cloudflared (Cloudflare's DoH proxy).
# Prefer Cloudflare's package repository for automatic signed package verification.
# If you download a binary directly, pin a release version and verify its checksum.
CLOUDFLARED_VERSION="<pinned-version>"
curl -LO "https://github.com/cloudflare/cloudflared/releases/download/${CLOUDFLARED_VERSION}/cloudflared-linux-arm64"
# Verify the checksum/signature from Cloudflare's release notes before installing.
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Create cloudflared config
sudo mkdir -p /etc/cloudflared
sudo tee /etc/cloudflared/config.yml << EOF
proxy-dns: true
proxy-dns-port: 5053
proxy-dns-upstream:
  - https://1.1.1.1/dns-query
  - https://1.0.0.1/dns-query
EOF

# Create systemd service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Now point Pi-hole at the local DoH proxy:
# Pi-hole admin → Settings → DNS → Custom upstream DNS
# Set to: 127.0.0.1#5053
# Uncheck all other upstream resolvers
```

## Local DNS Records

Make your services reachable by name (e.g. `nas.home.lan`, `grafana.home.lan`).

> **Domain name note:** `.home.lan` is widely used in homelabs and works in practice.
> The IETF-reserved suffix for local use is `.home.arpa` (RFC 8375) — use that to
> follow the standard. Avoid `.local` for Pi-hole DNS records as it conflicts with
> mDNS/Bonjour.

```
# Pi-hole admin → Local DNS → DNS Records

  Domain              IP
  nas.home.lan        192.168.30.10
  pi.home.lan         192.168.30.2
  grafana.home.lan    192.168.30.3
  proxmox.home.lan    192.168.30.4

# From any device on your network:
  ping nas.home.lan        → 192.168.30.10
  http://grafana.home.lan  → your Grafana dashboard

# For subdomains, add a CNAME:
  Pi-hole admin → Local DNS → CNAME Records
  Domain: portainer.home.lan → Target: pi.home.lan
```
