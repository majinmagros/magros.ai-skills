# WireGuard VPN — Client Config, Split vs Full Tunnel, Key Management

## Client Configuration

```bash
# Generate a unique keypair for each client device
# Run on the client, or on the server and transfer the private key securely — never in plaintext
umask 077
wg genkey | tee phone_private.key | wg pubkey > phone_public.key

# Client config file (phone_wg0.conf):
[Interface]
PrivateKey = <phone_private_key>
Address = 10.8.0.2/32
DNS = 192.168.1.2                  # Optional: use Pi-hole for DNS over the tunnel

[Peer]
PublicKey = <server_public_key>
Endpoint = your-home-ip.ddns.net:51820  # Your public IP or DDNS hostname
AllowedIPs = 192.168.1.0/24            # Split tunnel: only home network traffic
# AllowedIPs = 0.0.0.0/0, ::/0        # Full tunnel: all traffic through VPN

PersistentKeepalive = 25              # Keep NAT hole open (required for mobile clients)
```

## Split Tunnel vs Full Tunnel

```
# Split tunnel: AllowedIPs = 192.168.1.0/24
  Only traffic destined for your home network goes through the VPN.
  Internet traffic (YouTube, Spotify) goes directly — better performance on mobile.
  Best for: "I just want to reach my NAS and Pi from anywhere."

# Full tunnel: AllowedIPs = 0.0.0.0/0, ::/0
  ALL traffic goes through your home internet connection.
  Useful for: piggybacking home DNS/Pi-hole ad blocking.
  Downside: home upload speed becomes your bottleneck everywhere.

# Multi-subnet split tunnel (most common homelab use case):
  AllowedIPs = 192.168.10.0/24, 192.168.20.0/24, 192.168.30.0/24, 10.8.0.0/24
  Routes all your VLANs through the tunnel; internet stays direct.
```

## Key Generation and Peer Management

```python
import subprocess

def generate_keypair() -> tuple[str, str]:
    """Generate a WireGuard keypair. Returns (private_key, public_key)."""
    private = subprocess.check_output(["wg", "genkey"]).decode().strip()
    public = subprocess.run(
        ["wg", "pubkey"], input=private.encode(), capture_output=True
    ).stdout.decode().strip()
    return private, public

def generate_preshared_key() -> str:
    return subprocess.check_output(["wg", "genpsk"]).decode().strip()

def build_client_config(
    client_private_key: str,
    client_vpn_ip: str,       # e.g. "10.8.0.3"
    server_public_key: str,
    server_endpoint: str,     # e.g. "home.example.com:51820"
    allowed_ips: str = "192.168.1.0/24",
    dns: str = "",
) -> str:
    dns_line = f"DNS = {dns}\n" if dns else ""
    return f"""[Interface]
PrivateKey = {client_private_key}
Address = {client_vpn_ip}/32
{dns_line}
[Peer]
PublicKey = {server_public_key}
Endpoint = {server_endpoint}
AllowedIPs = {allowed_ips}
PersistentKeepalive = 25
"""

def build_server_peer_block(
    client_public_key: str,
    client_vpn_ip: str,
    comment: str = "",
) -> str:
    comment_line = f"# {comment}\n" if comment else ""
    return f"""
{comment_line}[Peer]
PublicKey = {client_public_key}
AllowedIPs = {client_vpn_ip}/32
"""
```

Keep private keys out of source control. If you use this script, write key material
to files with mode 600 and never log or print it.
