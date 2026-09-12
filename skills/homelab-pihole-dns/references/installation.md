# How It Works & Installation

## How Pi-hole Works

```
Normal flow (without Pi-hole):
  Device → requests ads.tracker.com → ISP DNS → real IP → ads load

With Pi-hole:
  Device → requests ads.tracker.com → Pi-hole DNS → blocked (returns 0.0.0.0) → no ad

All DNS queries go through Pi-hole first.
Pi-hole checks against blocklists.
Blocked domains return a null response — the ad/tracker never loads.
Allowed domains get forwarded to your upstream resolver (Cloudflare, Google, etc.).
```

## Installation

### Docker (Recommended)

Docker is the easiest way to install Pi-hole and makes updates and backups
straightforward.

```yaml
# docker-compose.yml
services:
  pihole:
    image: pihole/pihole:<pinned-release-tag>
    container_name: pihole
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"          # Web admin
    environment:
      TZ: "America/New_York"
      WEBPASSWORD: "${PIHOLE_WEBPASSWORD}"   # set via .env file or secret
      PIHOLE_DNS_: "1.1.1.1;1.0.0.1"
      DNSMASQ_LISTENING: "all"
    volumes:
      - "./etc-pihole:/etc/pihole"
      - "./etc-dnsmasq.d:/etc/dnsmasq.d"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN              # only needed if Pi-hole will serve DHCP
```

Replace `<pinned-release-tag>` with a current Pi-hole release tag before deploying.
Avoid `latest` for long-lived DNS infrastructure so upgrades are deliberate and
reviewable.

Set `PIHOLE_WEBPASSWORD` in a `.env` file next to `docker-compose.yml`, chmod it to
`600`, and keep it out of git — do not put the password directly in the compose file.

Access web admin at: `http://<pi-ip>/admin`

### Bare-Metal Install (Raspberry Pi OS / Debian / Ubuntu)

Pi-hole requires a static IP before installing.

```bash
# Step 1: Assign a static IP (edit /etc/dhcpcd.conf on Pi OS)
sudo nano /etc/dhcpcd.conf
# Add at the bottom:
interface eth0
static ip_address=192.168.3.2/24
static routers=192.168.3.1
static domain_name_servers=192.168.3.1

# Step 2: Download and inspect the installer before running it.
# Prefer the package or installer path documented by Pi-hole for your OS/version.
curl -sSL https://install.pi-hole.net -o pi-hole-install.sh
less pi-hole-install.sh   # review before proceeding

# Step 3: Run
bash pi-hole-install.sh

# Follow the interactive installer:
# 1. Select network interface (eth0 for wired — recommended)
# 2. Select upstream DNS (Cloudflare or leave default — can change later)
# 3. Confirm static IP
# 4. Install the web admin interface (recommended)
# 5. Note the admin password shown at the end
```
