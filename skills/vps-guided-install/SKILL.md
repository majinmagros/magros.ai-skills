---
name: vps-guided-install
description: "Use when installing a 24/7 AI agent on a bare-metal VPS without Docker, from SSH keys to hardening to Telegram to systemd persistence. Triggers on \"vps guided install\", \"hermes vps\", \"claude 24/7 vps\", \"bare-metal agent\", \"kvm1 vs kvm2\". Non-triggers: one-click managed host or Docker-based deploy (use cloud-code-vps-deploy). Outcome: a hardened Ubuntu 24.04 VPS with subscription-login brain, Telegram allowlist, systemd services, cron smoke test, backup and reboot persistence verified."
metadata:
  origin: ECC
---

# VPS Guided Install

Guided bare-metal install for 24/7 agents on a VPS, with no Docker and
no tmux. Covers one machine from empty Ubuntu to a hardened host that
survives reboot, notifies over Telegram, and runs agents as systemd
services. This is the operational companion to `cloud-code-vps-deploy`,
which covers only the generic one-click path in a few lines.

## When To Activate

- The user says VPS, KVM1, KVM2, Hermes on VPS, Claude 24/7, agent on
  phone, bare-metal install, or guided VPS playbook.
- The goal is an always-on agent that keeps running with the PC off,
  with crons inside the plan and remote control from mobile.
- A previous VPS attempt failed on SSH, hardening, Telegram wiring,
  reboot persistence, or secret migration.
- The user must choose between a small single-agent box and a larger
  multi-agent box before provisioning.

## Sizing Matrix

- **KVM1 4GB**: one Claude-style agent, remote control plus a few
  crons. Cheapest box that stays responsive. Pick this for a single
  brain with light scheduled work.
- **KVM2 8GB**: Hermes plus Claude side by side, or several crons with
  browser and scraping steps. Pick this for multi-agent or daily
  content plus traffic routines.
- Rule: start on the smaller box only for a single passive agent. Move
  to the larger box before adding a second active brain or heavy cron
  set. Box sizes and prices in videos are author measurements, not
  benchmarks - re-check the host catalog before buying.

## Workflow

### 1. Provision and SSH access

- Provision Ubuntu 24.04 LTS on the chosen box.
- Create a non-root ops user with sudo, disable root login.
- Generate an SSH key pair locally, copy the public key to the VPS,
  and add a short alias in the SSH config:

```text
Host vps-agent
  HostName <vps-ip>
  User <ops-user>
  IdentityFile <path-to-private-key>
```

- Verify `ssh vps-agent` works without a password prompt before
  continuing. No further step runs over password auth.

### 2. Harden the box

- Enable the firewall with default-deny inbound, allow only SSH plus
  explicitly required ports.
- Set SSH to key-only: disable password auth and challenge-response.
- Keep any agent dashboard on localhost only. Reach it through an SSH
  tunnel, never by exposing a public port:

```text
ssh -N -L 8080:127.0.0.1:8080 vps-agent
```

- Set the timezone explicitly and verify with `date`:

```text
sudo timedatectl set-timezone America/Sao_Paulo
date
```

### 3. Attach the brain via subscription login

- Log in with the chat subscription (ChatGPT/Codex or Claude
  subscription), not an API key. API billing burns fast on 24/7 loops.
- Verify the login survives a new shell: reopen SSH and run a minimal
  agent command that prints identity or status.
- Record which account owns the brain so renewal and rotation stay
  unambiguous.

### 4. Wire Telegram via BotFather with allowlist

- Create the bot with BotFather, store the token as a secret.
- Resolve your numeric Telegram user ID and write it into an
  allowlist file. The agent answers only IDs on that list.
- Send a hello test in both directions: chat -> agent and agent ->
  chat. Drop any sender not on the allowlist with a logged reject.

### 5. Write the identity files

- Create three files in the agent home: `soul.md` (who it is),
  `agents.md` (how it works), `user.md` (who it serves).
- Keep each file short: purpose, scope, approval rules, and routing.
  Long prose belongs in repo docs, not in identity files.

### 6. Persist with systemd, not tmux

- One systemd unit per agent or cron worker. tmux sessions die on
  reboot and hide failures; units restart and log.
- Minimal unit shape:

```text
[Unit]
Description=ai-agent
After=network-online.target

[Service]
ExecStart=<agent-start-command>
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

- Enable and start each unit, then run `systemctl is-enabled` and
  `systemctl is-active` and keep the output as evidence.

### 7. Add the cron smoke test

- Add one cheap scheduled probe (the radar pattern runs near 07:00):
  wake, fetch one source, write one line of output, exit.
- Gate real work behind an approval word in chat. The probe never
  executes spend or publish steps on its own.
- Confirm the first three runs from logs before adding heavier crons.

### 8. Connect VS Code Remote-SSH

- Attach VS Code with Remote-SSH to the `vps-agent` alias.
- Edit identity files and units remotely instead of copying by hand.
- Verify always-on remote control: close the laptop, reopen from
  mobile, confirm the agent and logs are still live.

### 9. Migrate skills, MCPs, and keys via deploy key

- Create a GitHub deploy key for the VPS, read-only where possible.
- Clone the ops repo over SSH with that key.
- Migrate local skills, MCP configs, and memories through the repo,
  never by pasting secrets into chat. Rotate any key that touched an
  insecure channel.

### 10. Backup and reboot proof

- Snapshot or script a backup of identity files, units, cron tables,
  and the allowlist before declaring done.
- Reboot the VPS, then verify: SSH alias works, units are active,
  Telegram hello round-trips, and the last cron log exists.
- No reboot test means no done. A box that cannot survive reboot is
  not a 24/7 employee.

## Anti-Patterns

- Docker or tmux for persistence -> use systemd units with restart.
- API key as the 24/7 brain -> use subscription login, track spend.
- Password SSH or public dashboard port -> key-only plus tunnel.
- Telegram bot without user ID allowlist -> anyone can drive it.
- Skipping the cheap cron smoke test -> heavy crons fail silently.
- Pasting secrets into chat for migration -> deploy key plus repo.
- Declaring done without a reboot test -> unproven persistence.

## Relations

- `cloud-code-vps-deploy`: generic one-click path; use this skill for
  the guided bare-metal path it does not cover.
- `autonomous-agent-harness`: runbook for 24/7 operation layered on
  top of the installed box.
- `routines`: cron and scheduled-task design once the box is alive.
- `agent-guardrails`: approval gates for spend and publish steps.
- `terminal-ops`: evidence-first command runs during install.

## Sources

- Guided Hermes bare-metal playbook, Ubuntu 24.04, SSH plus alias,
  hardening, subscription login, BotFather plus allowlist, identity
  files, cron smoke test (2026-09-05,
  `https://www.youtube.com/watch?v=IozlWf2A5AA`).
- Claude Code 24/7 on VPS, no Docker, no tmux, systemd persistence,
  VS Code Remote-SSH, deploy-key migration step (2026-09-05,
  `https://www.youtube.com/watch?v=vsBQqysVnY8`).
- Box sizes, prices, and token or cost figures in those videos are
  anecdotal author measurements, not benchmarks - do not quote as facts.
