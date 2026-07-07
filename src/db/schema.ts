import { pgTable, serial, text, integer, numeric, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export const holders = pgTable('holders', {
  id: serial('id').primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  walletLabel: text('wallet_label'),
  snapshotDate: timestamp('snapshot_date').defaultNow(),
  tokensHeld: numeric('tokens_held').notNull(),
  tokensBought: numeric('tokens_bought').notNull().default('0'),
  tokensSold: numeric('tokens_sold').notNull().default('0'),
  airdropAmount: numeric('airdrop_amount').notNull().default('0'),
  status: text('status').notNull().default('holding'), // holding, sold, faded
  entryPrice: numeric('entry_price').notNull().default('0'),
  currentValue: numeric('current_value').notNull().default('0'),
  pnl: numeric('pnl').notNull().default('0'),
  isWinner: boolean('is_winner').default(false),
  tier: text('tier'), // whale, dolphin, shark, fish, shrimp
  metadata: json('metadata'),
});

export const airdropStats = pgTable('airdrop_stats', {
  id: serial('id').primaryKey(),
  snapshotDate: timestamp('snapshot_date').defaultNow(),
  totalSupply: numeric('total_supply').notNull(),
  circulatingSupply: numeric('circulating_supply').notNull(),
  totalHolders: integer('total_holders').notNull(),
  totalAirdropped: numeric('total_airdropped').notNull().default('0'),
  totalFaded: integer('total_faded').notNull().default(0),
  totalSold: integer('total_sold').notNull().default(0),
  totalHolding: integer('total_holding').notNull().default(0),
  currentPrice: numeric('current_price').notNull(),
  marketCap: numeric('market_cap').notNull(),
  ansemWalletHoldings: numeric('ansem_wallet_holdings').notNull().default('0'),
});

export const priceHistory = pgTable('price_history', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  price: numeric('price').notNull(),
  marketCap: numeric('market_cap').notNull(),
  volume24h: numeric('volume_24h').notNull().default('0'),
  holders: integer('holders').notNull().default(0),
});
