# WireGuard VPN — pfSense/OPNsense + DDNS for Home Servers

## pfSense / OPNsense WireGuard

```
# pfSense: VPN → WireGuard → Add Tunnel
  Interface Keys: Generate (creates keypair automatically)
  Listen Port: 51820
  Interface Address: 10.8.0.1/24

# Add Peer (one per client):
  Public Key: <client public key>
  Allowed IPs: 10.8.0.2/32

# Assign the WireGuard interface:
  Interfaces → Assignments → Add (select wg0)
  Enable interface, no IP needed (it is set in the tunnel config)

# Firewall rules:
  WAN → Allow UDP port 51820 inbound (so clients can reach the server)
  WireGuard interface → Allow traffic to LAN networks you want reachable
```

## DDNS (Dynamic DNS) for Home Servers

Most home internet connections have a dynamic IP. Use DDNS so your VPN endpoint
stays reachable after an IP change.

```bash
# Option 1: Cloudflare DDNS — store credentials in a secrets file, not inline
# docker-compose entry using an env file:
  ddns-updater:
    image: qmcgaw/ddns-updater
    env_file: ./ddns.env   # store zone_id and token here, not in compose
    restart: unless-stopped

# ddns.env (chmod 600, not committed to git):
# SETTINGS_CLOUDFLARE_ZONE_ID=your_zone_id
# SETTINGS_CLOUDFLARE_TOKEN=your_api_token

# Option 2: DuckDNS (free, simple)
  Sign up at duckdns.org → get a token and subdomain (myhome.duckdns.org)
  Store token in /etc/ddns.env (mode 600), then use a small root-owned script:

  # /usr/local/bin/update-duckdns
  #!/bin/sh
  set -eu
  . /etc/ddns.env
  curl --fail --silent --show-error --max-time 10 \
    --get "https://www.duckdns.org/update" \
    --data-urlencode "domains=myhome" \
    --data-urlencode "token=${DUCKDNS_TOKEN}" \
    --data-urlencode "ip="

  # Cron job:
  */5 * * * * /usr/local/bin/update-duckdns >/dev/null 2>&1
```
