# $ANSEM Live Holder Dashboard

**Real-time holder intelligence for $ANSEM token (9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump)**

Live dashboard to track holder distribution, whale concentration, LP wallets, and wallet positions for the $ANSEM token on Solana.

![Dashboard Preview](https://i.imgur.com/XYZ1234.png)

## ✨ Features

### 🔍 **Live Holder Intelligence**
- Real-time aggregation from Solana Token-2022 program
- Deduplicated by wallet address (not token accounts)
- Tier classification (whale, dolphin, shark, fish, shrimp)
- LP wallet detection

### 📊 **Market Data**
- Live price, market cap, volume, and liquidity from DexScreener
- 24h change tracking
- Primary DEX identification

### 🔎 **Wallet Checker**
- Check any wallet's live $ANSEM holdings
- See rank, tier, tokens held, and USD value
- LP vs community wallet identification

### 🏆 **Holder Leaderboard**
- Full table of all holders with sorting and filtering
- Rank, address, tier, tokens held, % supply, token accounts, USD value
- Filter by tier (whale, dolphin, etc.) and wallet type (LP/community)

### 🧮 **Position Calculator**
- Estimate upside based on target market cap
- Compare your holdings to average community balance
- Projected value and upside percentage

### 📈 **Visualizations**
- Top holder concentration chart
- Holder tier distribution
- Supply share analysis

## 🚀 Live Demo
👉 (https://ansem-dashboard-plbsqcb2b-helmis-projects-89219aeb.vercel.app/#)

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Sources**:
  - Solana RPC (Token-2022 program)
  - DexScreener API

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ansem-dashboard.git
cd ansem-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file:
```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

For better reliability, use a private RPC endpoint:
```env
SOLANA_RPC_URL=https://your-rpc-endpoint.quiknode.pro/your-api-key/
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project into [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- **Netlify**: Import from Git and set environment variables
- **Railway**: Connect Git repository and set environment variables
- **Self-hosting**: `npm run build && npm run start`

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `SOLANA_RPC_URL` | Solana RPC endpoint for fetching token accounts | `https://api.mainnet-beta.solana.com` |

### Customization
- **Token Mint**: Change `ANSEM_TOKEN_MINT` in `src/lib/ansem-live.ts`
- **Cache TTL**: Adjust `CACHE_TTL_MS` in `src/lib/ansem-live.ts`
- **Tier Thresholds**: Modify `classifyTier()` in `src/lib/ansem-live.ts`

## ⚡ Performance Notes
- **First load**: Aggregates ~120,000+ token accounts (may take 5-10 seconds)
- **Subsequent loads**: Uses 60-second cache
- **Rate limits**: Public Solana RPC may throttle requests (use private RPC for production)
- **Data freshness**: Market data updates every 60 seconds from DexScreener

## 📜 License
MIT

## 👤 Made by
[@Seung_ha_](https://x.com/Seung_ha_)

## 📧 Contact
For questions or suggestions, open an issue or contact via X/Twitter.

---
🐂 **Built for the $ANSEM community**
