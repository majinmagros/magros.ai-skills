---
name: defi-amm-security
description: "Use when security checklist for Solidity AMM contracts, liquidity pools, and swap flows. Covers reentrancy, CEI ordering, donation or inflation attacks, oracle manipulation, slippage, admin controls, and integer math. Triggers on \"defi-amm-security\", \"defi amm security\", \"security\"."
metadata:
  origin: ECC direct-port adaptation
version: "1.0.0"
---

# DeFi AMM Security

Critical vulnerability patterns and hardened implementations for Solidity AMM contracts, LP vaults, and swap functions.

## When to Use

- Writing or auditing a Solidity AMM or liquidity-pool contract
- Implementing swap, deposit, withdraw, mint, or burn flows that hold token balances
- Reviewing any contract that uses `token.balanceOf(address(this))` in share or reserve math
- Adding fee setters, pausers, oracle updates, or other admin functions to a DeFi protocol

## How It Works

Use this as a checklist-plus-pattern library. Review every user entrypoint against the categories below and prefer the hardened examples over hand-rolled variants.

## Execution Safety

The shell commands in this skill are local audit examples. Run them only in a trusted checkout or disposable sandbox, and do not splice untrusted contract names, paths, RPC URLs, private keys, or user-supplied flags into shell commands. Ask before installing tools or running long fuzzing/static-analysis jobs that may consume significant local or paid resources.

Never include secrets, private keys, seed phrases, API tokens, or mainnet signing credentials in command examples, logs, or reports.

## Examples

### Reentrancy: enforce CEI order

Vulnerable:

```solidity
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    token.transfer(msg.sender, amount);
    balances[msg.sender] -= amount;
}
```

Safe:

```solidity
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient");
    balances[msg.sender] -= amount;
    token.safeTransfer(msg.sender, amount);
}
```

Do not write your own guard when a hardened library exists.

### Donation or inflation attacks

Using `token.balanceOf(address(this))` directly for share math lets attackers manipulate the denominator by sending tokens to the contract outside the intended path.

```solidity