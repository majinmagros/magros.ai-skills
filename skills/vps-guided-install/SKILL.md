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