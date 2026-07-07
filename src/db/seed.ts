import { db } from '@/db';
import { holders, airdropStats, priceHistory } from '@/db/schema';

const mockHolders = [
  { walletAddress: 'GV6U...', walletLabel: "Ansem's Wallet", tokensHeld: '50000000', tokensBought: '50000000', tokensSold: '0', airdropAmount: '0', status: 'holding', entryPrice: '0.001', currentValue: '19544000', pnl: '19544000', isWinner: true, tier: 'whale' },
  { walletAddress: '8xF2...', walletLabel: 'Early Believer', tokensHeld: '15000000', tokensBought: '15000000', tokensSold: '0', airdropAmount: '500000', status: 'holding', entryPrice: '0.002', currentValue: '5863200', pnl: '5860200', isWinner: true, tier: 'whale' },
  { walletAddress: '3mR9...', walletLabel: 'Diamond Hands', tokensHeld: '8500000', tokensBought: '8500000', tokensSold: '0', airdropAmount: '350000', status: 'holding', entryPrice: '0.005', currentValue: '3322480', pnl: '3301980', isWinner: true, tier: 'dolphin' },
  { walletAddress: '7kP4...', walletLabel: 'Trench Warrior', tokensHeld: '5200000', tokensBought: '6000000', tokensSold: '800000', airdropAmount: '200000', status: 'holding', entryPrice: '0.008', currentValue: '2032576', pnl: '2027576', isWinner: true, tier: 'dolphin' },
  { walletAddress: '2nQ7...', walletLabel: 'Loyal Degen', tokensHeld: '3800000', tokensBought: '4000000', tokensSold: '200000', airdropAmount: '175000', status: 'holding', entryPrice: '0.01', currentValue: '1485344', pnl: '1481344', isWinner: true, tier: 'shark' },
  { walletAddress: '9wL1...', walletLabel: 'Paper Hands', tokensHeld: '0', tokensBought: '3000000', tokensSold: '3000000', airdropAmount: '0', status: 'sold', entryPrice: '0.015', currentValue: '0', pnl: '-45000', isWinner: false, tier: 'fish' },
  { walletAddress: '4hB6...', walletLabel: 'Jeet Alert', tokensHeld: '0', tokensBought: '2500000', tokensSold: '2500000', airdropAmount: '0', status: 'sold', entryPrice: '0.012', currentValue: '0', pnl: '-30000', isWinner: false, tier: 'fish' },
  { walletAddress: '6vN3...', walletLabel: 'Missed Out', tokensHeld: '0', tokensBought: '0', tokensSold: '0', airdropAmount: '0', status: 'faded', entryPrice: '0', currentValue: '0', pnl: '0', isWinner: false, tier: 'shrimp' },
  { walletAddress: '5jT8...', walletLabel: 'FOMO Buyer', tokensHeld: '2000000', tokensBought: '5000000', tokensSold: '3000000', airdropAmount: '50000', status: 'holding', entryPrice: '0.02', currentValue: '781760', pnl: '681760', isWinner: false, tier: 'shark' },
  { walletAddress: '1aK5...', walletLabel: 'Smart Money', tokensHeld: '12000000', tokensBought: '12000000', tokensSold: '0', airdropAmount: '450000', status: 'holding', entryPrice: '0.003', currentValue: '4690560', pnl: '4686960', isWinner: true, tier: 'whale' },
  { walletAddress: '3cD2...', walletLabel: 'CT KOL', tokensHeld: '7500000', tokensBought: '7500000', tokensSold: '0', airdropAmount: '300000', status: 'holding', entryPrice: '0.006', currentValue: '2931600', pnl: '2927100', isWinner: true, tier: 'dolphin' },
  { walletAddress: '8eG9...', walletLabel: 'Alpha Caller', tokensHeld: '4500000', tokensBought: '5000000', tokensSold: '500000', airdropAmount: '150000', status: 'holding', entryPrice: '0.009', currentValue: '1758960', pnl: '1753460', isWinner: true, tier: 'shark' },
  { walletAddress: '2fH4...', walletLabel: 'Sold Top', tokensHeld: '500000', tokensBought: '4000000', tokensSold: '3500000', airdropAmount: '25000', status: 'holding', entryPrice: '0.018', currentValue: '195440', pnl: '-654560', isWinner: false, tier: 'shark' },
  { walletAddress: '7gJ1...', walletLabel: 'Regretful Seller', tokensHeld: '100000', tokensBought: '2000000', tokensSold: '1900000', airdropAmount: '10000', status: 'holding', entryPrice: '0.014', currentValue: '39088', pnl: '-28012', isWinner: false, tier: 'fish' },
  { walletAddress: '4iK7...', walletLabel: 'Never Faded', tokensHeld: '6000000', tokensBought: '6000000', tokensSold: '0', airdropAmount: '250000', status: 'holding', entryPrice: '0.007', currentValue: '2345280', pnl: '2341080', isWinner: true, tier: 'dolphin' },
  { walletAddress: '9lM2...', walletLabel: 'Whale Watcher', tokensHeld: '9000000', tokensBought: '9000000', tokensSold: '0', airdropAmount: '375000', status: 'holding', entryPrice: '0.004', currentValue: '3517920', pnl: '3514320', isWinner: true, tier: 'whale' },
  { walletAddress: '6nO8...', walletLabel: 'Quick Flip', tokensHeld: '0', tokensBought: '1500000', tokensSold: '1500000', airdropAmount: '0', status: 'sold', entryPrice: '0.011', currentValue: '0', pnl: '-16500', isWinner: false, tier: 'fish' },
  { walletAddress: '1pQ3...', walletLabel: 'Bag Holder', tokensHeld: '1500000', tokensBought: '3500000', tokensSold: '2000000', airdropAmount: '30000', status: 'holding', entryPrice: '0.025', currentValue: '586320', pnl: '-513680', isWinner: false, tier: 'shark' },
  { walletAddress: '5rS6...', walletLabel: 'Community OG', tokensHeld: '10000000', tokensBought: '10000000', tokensSold: '0', airdropAmount: '400000', status: 'holding', entryPrice: '0.003', currentValue: '3908800', pnl: '3905800', isWinner: true, tier: 'whale' },
  { walletAddress: '8tU4...', walletLabel: 'Never Believed', tokensHeld: '0', tokensBought: '0', tokensSold: '0', airdropAmount: '0', status: 'faded', entryPrice: '0', currentValue: '0', pnl: '0', isWinner: false, tier: 'shrimp' },
  { walletAddress: '3vW7...', walletLabel: 'DCA King', tokensHeld: '7000000', tokensBought: '7000000', tokensSold: '0', airdropAmount: '275000', status: 'holding', entryPrice: '0.006', currentValue: '2736160', pnl: '2731960', isWinner: true, tier: 'dolphin' },
  { walletAddress: '2xY1...', walletLabel: 'Sniper Bot', tokensHeld: '2500000', tokensBought: '2500000', tokensSold: '0', airdropAmount: '100000', status: 'holding', entryPrice: '0.001', currentValue: '977200', pnl: '976950', isWinner: true, tier: 'shark' },
  { walletAddress: '7zA5...', walletLabel: 'Late Entry', tokensHeld: '800000', tokensBought: '2000000', tokensSold: '1200000', airdropAmount: '15000', status: 'holding', entryPrice: '0.03', currentValue: '312704', pnl: '-387296', isWinner: false, tier: 'fish' },
  { walletAddress: '4bC9...', walletLabel: 'Convicted Hold', tokensHeld: '11000000', tokensBought: '11000000', tokensSold: '0', airdropAmount: '425000', status: 'holding', entryPrice: '0.004', currentValue: '4299680', pnl: '4296080', isWinner: true, tier: 'whale' },
  { walletAddress: '9dE2...', walletLabel: 'Sold Early', tokensHeld: '200000', tokensBought: '5000000', tokensSold: '4800000', airdropAmount: '5000', status: 'holding', entryPrice: '0.008', currentValue: '78176', pnl: '-31824', isWinner: false, tier: 'shark' },
];

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingStats = await db.select().from(airdropStats).limit(1);
    if (existingStats.length > 0) {
      console.log('Database already seeded');
      return;
    }

    // Insert holders
    for (const holder of mockHolders) {
      await db.insert(holders).values({
        ...holder,
        snapshotDate: new Date(),
      });
    }

    // Insert airdrop stats
    await db.insert(airdropStats).values({
      snapshotDate: new Date(),
      totalSupply: '1000000000',
      circulatingSupply: '390000000',
      totalHolders: 24892,
      totalAirdropped: '25000000',
      totalFaded: 8453,
      totalSold: 4128,
      totalHolding: 12311,
      currentPrice: '0.39088',
      marketCap: '390880000',
      ansemWalletHoldings: '50000000',
    });

    // Insert price history
    const priceData = [
      { price: '0.001', marketCap: '1000000', volume24h: '50000', holders: 150, timestamp: new Date('2025-01-01') },
      { price: '0.005', marketCap: '5000000', volume24h: '200000', holders: 500, timestamp: new Date('2025-02-01') },
      { price: '0.012', marketCap: '12000000', volume24h: '800000', holders: 2000, timestamp: new Date('2025-03-01') },
      { price: '0.025', marketCap: '25000000', volume24h: '1500000', holders: 5000, timestamp: new Date('2025-04-01') },
      { price: '0.045', marketCap: '45000000', volume24h: '3000000', holders: 8000, timestamp: new Date('2025-05-01') },
      { price: '0.085', marketCap: '85000000', volume24h: '5500000', holders: 12000, timestamp: new Date('2025-06-01') },
      { price: '0.150', marketCap: '150000000', volume24h: '12000000', holders: 18000, timestamp: new Date('2025-07-01') },
      { price: '0.220', marketCap: '220000000', volume24h: '18000000', holders: 22000, timestamp: new Date('2025-08-01') },
      { price: '0.310', marketCap: '310000000', volume24h: '25000000', holders: 24000, timestamp: new Date('2025-09-01') },
      { price: '0.39088', marketCap: '390880000', volume24h: '35000000', holders: 24892, timestamp: new Date('2025-10-01') },
    ];

    for (const p of priceData) {
      await db.insert(priceHistory).values({
        ...p,
        timestamp: p.timestamp!,
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
