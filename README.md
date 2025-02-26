# 🤝 ApologyStake: On-Chain Accountability Protocol

![ApologyStake Banner](https://placehold.co/1200x400?text=ApologyStake:+The+Future+of+Social+Accountability)

[![Solana](https://img.shields.io/badge/Solana-black?style=for-the-badge&logo=solana)](https://solana.com/)
[![Anchor](https://img.shields.io/badge/Anchor-black?style=for-the-badge&logo=anchor)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge)](https://apology-stake.vercel.app/)

> Making apologies meaningful through blockchain accountability and NFT proof-of-commitment

## 🎯 Overview

ApologyStake revolutionizes personal accountability by bringing the power of blockchain to interpersonal conflict resolution. Through a unique combination of financial stakes, NFT minting, and public commitments, we create a mechanism for meaningful apologies backed by tangible proof and consequences.

## 💫 Protocol Features

### Core Mechanics

- 🔒 Stake SOL as commitment collateral
- 🎨 Automatic NFT minting as proof of apology
- ⏳ Customizable probation periods
- 🤝 Victim-controlled resolution system
- 📜 On-chain verification of commitments
- 🌐 Public accountability tracking

### NFT Integration

- **Proof of Apology NFT**: Automatically minted upon staking
- **Dynamic Metadata**: Reflects apology status and stake details
- **IPFS Storage**: Permanent, decentralized record keeping
- **Transferable Proof**: Can be shared or displayed as accountability record

## 🔄 Protocol Workflow

1. **Apology Initiation**

   - Connect wallet
   - Specify victim's address
   - Set stake amount in SOL
   - Write apology message
   - Define probation period

2. **Stake & NFT Creation**

   - SOL is staked in protocol vault
   - Proof of Apology NFT is automatically minted
   - NFT metadata includes:
     - Stake amount
     - Probation period
     - Apology message
     - Timestamp
     - Status (Active/Completed)

3. **Probation Period**

   - Stake remains locked
   - NFT status shows "Active"
   - Progress tracker visible to both parties

4. **Resolution Phase**
   - Victim can choose to:
     - Release stake (Forgiveness)
     - Claim stake (Consequence)
   - NFT status updates to "Completed"
   - Resolution is recorded on-chain

## 🛠️ Technical Architecture

### Built With

- **Blockchain**: Solana
- **Smart Contracts**: Anchor Framework (Rust)
- **Frontend**: Next.js 14, TailwindCSS
- **Authentication**: NextAuth.js
- **NFT Storage**: IPFS
- **Development**: TypeScript

### Core Components

1. **Anchor Program**

   - Stake management system
   - NFT minting integration
   - Probation period tracking
   - Resolution mechanics

2. **Next.js Frontend**

   - Wallet integration
   - NFT display and management
   - Stake tracking interface
   - Resolution dashboard

3. **NFT System**
   - Automated minting process
   - Dynamic metadata updates
   - IPFS content management
   - Status tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Rust
- Solana Tool Suite
- Anchor Framework
- Phantom or similar Solana wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/kushwahramkumar2003/ApologyStake.git

# Install dependencies
cd ApologyStake
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Environment Setup

```env
RPC_URL=
NEXTAUTH_SECRET=
NEXTAUTH_JWT_SECRET=
AUTH_TOKEN_EXPIRATION_TIME=
PINATA_API_KEY=
PINATA_API_SECRET=
PINATA_JWT=
```

## 💻 Usage Examples

### Creating an Apology with Stake

1. Connect your Solana wallet
2. Enter victim's wallet address
3. Set stake amount (minimum 0.1 SOL)
4. Write your apology message
5. Set probation period (minimum 7 day)
6. Confirm transaction to:
   - Lock stake
   - Mint Proof of Apology NFT
   - Start probation period

### Resolving an Apology (Victim)

1. Connect wallet with victim's address
2. View active apologies
3. Wait for probation period to end
4. Choose to:
   - Release stake back to offender
   - Claim stake as consequence
5. NFT updates to reflect final resolution

<!-- ## 📊 Protocol Statistics

- Total Apologies Created: [Dynamic Counter]
- Total SOL Staked: [Dynamic Amount]
- Average Probation Period: [Dynamic Calculation]
- Resolution Rate: [Dynamic Percentage] -->

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 🙏 Acknowledgments

This project is proudly supported by:

- **SuperteamIN** - For ecosystem support and guidance
- **Solana Foundation** - For technical resources and grants
- **CoinDCX** - For India Web3 grants support

Special thanks to:

- The Solana developer community
- IPFS for decentralized storage
- All our early users and supporters

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

## Like this project? Please give it a star on GitHub and share it!

<p align="center">
Built with ❤️ by Ramkumar kushwah
</p>
