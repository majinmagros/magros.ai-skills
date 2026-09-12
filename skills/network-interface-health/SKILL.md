---
name: network-interface-health
description: "Use when diagnose interface errors, drops, CRCs, duplex mismatches, flapping, speed negotiation issues, and counter trends on routers, switches, and Linux hosts. Triggers on \"network-interface-health\", \"network interface health\", \"health\"."
metadata:
  origin: community
---

# Network Interface Health

Use this skill when a network symptom might be caused by a physical link, switch
port, cable, transceiver, duplex setting, or congested interface.

## When to Use

- A host or VLAN has packet loss, latency spikes, or intermittent reachability.
- A switch or router interface shows CRCs, runts, giants, drops, resets, or flaps.
- You need to compare both ends of a link before replacing hardware.
- A change window needs before/after interface counter evidence.
- Monitoring reports rising `ifInErrors`, `ifOutErrors`, or `ifOutDiscards`.

## How It Works

Interface counters are evidence, but the trend matters more than the absolute
number. Capture a baseline, wait a measurement interval, capture again, then
compare increments.

```text
show interfaces <interface>
show interfaces <interface> status
show logging | include <interface>|changed state|line protocol
```

On Linux hosts:

```text
ip -s link show <interface>
ethtool <interface>
ethtool -S <interface>
```

## Counter Reference

| Counter | Meaning | Common cause |
| --- | --- | --- |
| CRC | Received frame checksum failed | Bad cable, dirty fiber, bad optic, duplex mismatch |
| input errors | Aggregate receive-side errors | Check sub-counters before concluding |
| runts | Frames below minimum Ethernet size | Duplex mismatch, collision domain, faulty NIC |
| giants | Frames larger than expected MTU | MTU mismatch or jumbo-frame boundary |
| input drops | Device could not accept inbound packets | Burst, oversubscription, CPU path, queue pressure |
| output drops | Egress queue discarded packets | Congestion, QoS policy, undersized uplink |
| resets | Interface hardware reset | Flapping, keepalive, driver, optic, power |
| collisions | Ethernet collision counter | Half duplex or negotiation mismatch |

## Diagnosis Flow

### CRCs Or Input Errors

1. Confirm counters are incrementing, not just historical.
2. Check both ends of the link. Receive-side errors usually point to the signal
   arriving on that side, not necessarily the port reporting the error.
3. Replace patch cable or clean/replace fiber and optics.
4. Confirm speed/duplex settings match on both sides.
5. Check logs for flap events around the same timestamp.

### Drops