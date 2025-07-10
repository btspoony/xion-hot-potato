# Hot Potato App

This is the web frontend for the Hot Potato App.

## 🚀 Features

- **Connect Wallet** - Authenticate with XION blockchain using Abstraxion
- **Deploy Contracts** - Launch Hot Potato contracts with a single click
- **Interact with Contracts** - Interact with the deployed contracts

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io) v8+

### Development

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open your browser to the displayed URL (typically <http://localhost:5173>)

## 🔧 Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```env
VITE_RPC_URL=https://rpc.xion-testnet-2.burnt.com:443
VITE_REST_URL=https://api.xion-testnet-2.burnt.com
```

Customizable variables:

```env
VITE_TREASURY_ADDRESS="xion1mj4a2t3365q0059w6ln9kkeyyj0fjlpdt0gea0vxd79epstkq4gshxqnmp"
VITE_NFT_CODE_ID="1382"
```

## 📚 Learn More

- [XION Blockchain Documentation](https://docs.xion.burnt.com/)
- [Abstraxion Documentation](https://docs.burnt.com/abstraxion/overview)
- [CosmJS Documentation](https://cosmos.github.io/cosmjs/)
