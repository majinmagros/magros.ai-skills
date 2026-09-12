---
name: network-config-validation
description: "Use when pre-deployment checks for router and switch config: dangerous commands, duplicate IPs, VTY and hygiene. Triggers on \"network-config-validation\", \"network config validation\", \"validation\"."
metadata:
  origin: ECC
---

# Network Config Validation

Layered pre-flight warnings for IOS-style config before change windows or automation runs. Detalhes em `references/`.

## When to Activate

- Reviewing Cisco IOS or IOS-XE style snippets before deployment
- Auditing generated config from scripts or templates
- Looking for dangerous commands, duplicate IP addresses, or subnet overlaps
- Checking whether ACLs, route-maps, prefix-lists, or line policies are referenced but not defined
- Building lightweight pre-flight scripts for network automation

## Core Principles

1. **Destructive first** — reload, erase, format, routing removal block the gate
2. **Credentials second** — SNMP defaults, SSHv1, enable password, VTY Telnet fail closed
3. **Addresses third** — duplicate IPs and overlapping subnets against full config
4. **Stale refs fourth** — every ACL/route-map/prefix-list referenced must exist
5. **Regex warns, engineer decides** — never treat pre-flight as a device parser

## Example

```python
bad = find_dangerous_commands(candidate_lines)
dups = find_duplicate_ips(full_config)
vty = check_vty_blocks(full_config)
gate = not bad and not dups and not [i for i in vty if "Telnet" in i]
```

## References

- `references/dangerous-commands.md` — destructive-pattern regex with line findings
- `references/ips-management.md` — duplicate IPs, subnet overlaps, VTY block checks
- `references/security-hygiene.md` — SNMP/SSH/enable checks plus missing-hygiene scan
- `references/preflight-antipatterns.md` — validation order, change/automation preflight, anti-patterns

## Checklist

- [ ] Dangerous-command scan run on the exact snippet to be pasted
- [ ] Duplicate IP + overlap scan run against the full candidate config
- [ ] All referenced ACLs/route-maps/prefix-lists confirmed to exist
- [ ] Rollback commands and out-of-band access confirmed before deploy
