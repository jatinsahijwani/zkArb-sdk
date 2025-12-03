# 🚀 zkArb — Full Local Reproduction Guide  
### *Run Local Arbitrum Orbit L2 + Local ETH L1 + SDK + Relayer*

This guide explains exactly how to reproduce the **local L1 + local L2 environment** needed to test zkArb *without any real networks*.  
Everything here is **deterministic and reproducible**.

---

# 📦 Prerequisites

Install the following:

- Node.js ≥ 18  
- PNPM or NPM  
- Docker  
- Foundry (Anvil)  
- Git  

---

# 🏗 1. Start Local Ethereum (L1)

We will run an L1 using **Anvil**:

```bash
anvil --port 8547 --chain-id 1337
```

This gives you:
Local RPC → http://127.0.0.1:8547

You may use any default anvil private key, but in our system the relayer always uses:
0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659

# 🏗 2. Start Local Arbitrum Orbit L2 Node

Clone the official Orbit dev node:

```
git clone https://github.com/OffchainLabs/nitro-devnode.git
cd nitro-devnode
./run-dev-node.sh
```

When the node boots, you get:
Purpose	URL
L2 RPC (HTTP)	http://localhost:8545

Orbit local comes with a deterministic signer:

```
Address: 0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E
Private key: 0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659
```

This is the same key used to deploy ALL contracts on local Orbit L2.

# 🔧 3. Update RPC URLs in the SDK + Relayer

```
L1 RPC : http://127.0.0.1:8547
L2 RPC : http://localhost:8545
```

⚠️ Important:
Do NOT use wss:// — Orbit local dev node does not expose WebSockets.
The relayer must use HTTP polling mode.

# ⚠️ Notes & Limitations

- Orbit local node does NOT support WebSockets
→ always use HTTP polling
- Both chains mine instantly
- Orbit default private key is always the same
- No bridging needed between L1/L2 in dev mode

🎉 You’re Done!

You now have a fully working:

✔ Local Orbit L2
✔ Local Ethereum L1
✔ zkArb SDK wired to localhost
✔ Verifier & Receiver deployed
✔ Relayer working via HTTP polling
✔ Full Proof → Event → Relay → L1 workflow