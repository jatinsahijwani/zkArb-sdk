# 🌀 Local Arbitrum Orbit (L3) Node Setup

This guide explains how to deploy a **fully working local Arbitrum Orbit (L3) node** using the official **Nitro testnode**, with:
- Local L1 (geth)
- Local L2 (Arbitrum Nitro)
- Local L3 (Orbit rollup on top of L2)
- Pre-funded accounts
- RPC access on `localhost:3347`

---

## 🧩 Prerequisites

Ensure the following are installed:

- Docker (v24+ recommended)
- Docker Compose
- Git
- bash
- macOS or Linux

Verify Docker:
```bash
docker --version
docker compose version
```

# Step 1 : Clone Nitro Repo

```bash
git clone --recurse-submodules https://github.com/OffchainLabs/nitro.git
cd nitro/nitro-testnode
```

# 🚀 Step 2: Initialize and Deploy Local Orbit (L3) Node

```bash
./test-node.bash --init --l3node --dev
```

### What this command does

| Component | Description |
|---------|-------------|
| **L1** | Starts a local Ethereum execution layer (geth) |
| **L2** | Deploys and runs a local Arbitrum Nitro (L2) chain |
| **L3** | Deploys an **Arbitrum Orbit rollup (L3)** on top of the local L2 |
| **Contracts** | Deploys the L3 rollup, inbox, outbox, and bridge contracts on L2 |
| **Config** | Generates `l3_chain_info.json`, required for the L3 node to start |
| **Funding** | Pre-funds development accounts on L1, L2, and L3 |
| **RPC** | Exposes JSON-RPC endpoints for L1, L2, and L3 |

> ⚠️ **Important**  
> Running with only `--dev` does **not** deploy an L3 chain.  
> The `--l3node` flag is **mandatory** to deploy and run an Arbitrum Orbit (L3) node.

### RPC Endpoints

| Chain | Description | RPC Endpoint |
|------|------------|--------------|
| **L1** | Local Ethereum (geth) | http://localhost:8545 |
| **L2** | Local Arbitrum Nitro (Arb One–like) | http://localhost:8547 |
| **L3 (Orbit)** | Local Arbitrum Orbit rollup | http://localhost:3347 |


### Pre-funded wallets

### Pre-funded Wallet (Available on L1, L2, and L3)

The following development wallet is **pre-funded and usable across all three chains**:
- L1 (geth)
- L2 (Arbitrum Nitro)
- L3 (Arbitrum Orbit)

> ⚠️ **Warning**  
> This private key is for **local development only**.  
> **Never use it on public testnets or mainnet.**

| Network | RPC Endpoint | Public Address | Private Key |
|------|-------------|----------------|-------------|
| **L1 (geth)** | http://localhost:8545 | `0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E` | `0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659` |
| **L2 (Arbitrum Nitro)** | http://localhost:8547 | `0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E` | `0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659` |
| **L3 (Orbit)** | http://localhost:3347 | `0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E` | `0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659` |
