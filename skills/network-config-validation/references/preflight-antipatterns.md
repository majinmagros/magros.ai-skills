# Method, Preflight Examples, Anti-Patterns

## How It Works

Treat config validation as layered evidence, not as a complete parser. Regex
checks are useful for pre-flight warnings, but final approval still needs a
network engineer to review intent, platform syntax, and rollback steps.

Validate in this order:

1. Destructive commands.
2. Credential and management-plane exposure.
3. Duplicate addresses and overlapping subnets.
4. Stale references to ACLs, route-maps, prefix-lists, and interfaces.
5. Operational hygiene such as NTP, timestamps, remote logging, and banners.

## Examples

### Change-Window Preflight

1. Run dangerous-command checks on the exact snippet to be pasted.
2. Run duplicate IP and subnet overlap checks against the full candidate config.
3. Confirm every referenced ACL, route-map, and prefix-list exists.
4. Confirm rollback commands and out-of-band access before any management-plane
   change.

### Automation Preflight

Use validation as a blocking gate before Netmiko, NAPALM, Ansible, or vendor API
automation pushes a generated config. Fail closed on dangerous commands and
credentials. Warn on best-practice gaps that are outside the change scope.

## Anti-Patterns

- Treating regex validation as a device parser.
- Applying generated config without a dry-run diff.
- Recommending SNMPv2 community strings as a monitoring requirement.
- Checking VTY blocks with regex that can accidentally span unrelated sections.
- Testing firewall behavior by disabling ACLs instead of reading counters/logs.

## See Also

- Agent: `network-config-reviewer`
- Agent: `network-troubleshooter`
- Skill: `network-interface-health`
