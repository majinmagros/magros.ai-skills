---
name: network-bgp-diagnostics
description: "Use when diagnostics-only BGP troubleshooting patterns for neighbor state, route exchange, prefix policy, AS path inspection, and safe evidence collection. Triggers on \"network-bgp-diagnostics\", \"network bgp diagnostics\", \"diagnostics\"."
metadata:
  origin: community
---

# Network BGP Diagnostics

Use this skill when a BGP session is down, flapping, established with missing
routes, or advertising unexpected prefixes. The default workflow is read-only
evidence collection; policy and reset actions belong in a reviewed change
window.

## When to Use

- BGP neighbors are stuck in Idle, Connect, Active, OpenSent, or OpenConfirm.
- A session is Established but expected prefixes are missing.
- A route-map, prefix-list, max-prefix limit, or AS path policy may be filtering
  routes.
- You need before/after evidence for a BGP change.
- You are reviewing automation that parses BGP summary output.

## Read-Only Triage Flow

1. Identify the exact neighbor, address family, VRF, and local/remote ASNs.
2. Capture summary state and last reset reason.
3. Prove reachability to the peer source address.
4. Check route policy references before assuming transport failure.
5. Compare advertised, received, and installed routes where the platform
   supports those commands.

```text
show bgp summary
show bgp neighbors <peer>
show ip route <peer>
show tcp brief | include <peer>|:179
show logging | include BGP|<peer>
show running-config | section router bgp
show ip prefix-list
show route-map
```

Use platform-specific address-family commands when the device uses VRFs, IPv6,
VPNv4, or EVPN. Do not assume global IPv4 unicast.

## State Interpretation

| State | First checks |
| --- | --- |
| Established with prefix count | Route exchange is up; inspect policy and table selection |
| Established with zero prefixes | Check inbound policy, max-prefix, advertised routes, and AFI/SAFI |
| Active | TCP session is not completing; check routing, source, ACLs, and peer reachability |
| Connect | TCP connection is in progress; check path and remote listener |
| OpenSent/OpenConfirm | TCP works; check ASN, authentication, timers, capabilities, and logs |
| Idle | Neighbor may be disabled, missing config, blocked by policy, or backoff timer |

## Transport Checks

```text
ping <peer> source <local-source>
traceroute <peer> source <local-source>
show ip route <peer>
show bgp neighbors <peer> | include BGP state|Last reset|Local host|Foreign host
```