/**
 * Database Seed Script
 * Initializes the database with fresh data starting from 0
 * Run this script after migrations to start with a clean state
 */

import { PrismaClient, Role, KYCStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear all existing data
    console.log('🧹 Clearing existing data...');
    await prisma.auditLog.deleteMany({});
    await prisma.referral.deleteMany({});
    await prisma.airdrop.deleteMany({});
    await prisma.withdrawal.deleteMany({});
    await prisma.deposit.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.presale.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ All existing data cleared');

    // Create initial presale stage with all values at 0
    console.log('📊 Creating initial presale stage...');
    const presale = await prisma.presale.create({
      data: {
        stage: 1,
        price_inr: 0.50, // ₹0.50 per token
        price_usd: 0.006, // $0.006 per token
        tokens_sold: 0, // Start from 0
        tokens_available: 2000000000, // 2 billion tokens for stage 1
        total_raised: 0, // Start from 0
        participants: 0, // Start from 0
        start_date: new Date(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        is_active: true,
      },
    });

    console.log('✅ Initial presale stage created:', {
      stage: presale.stage,
      tokens_sold: presale.tokens_sold,
      total_raised: presale.total_raised,
      participants: presale.participants,
    });

    // Create default admin user (optional)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vncblockchain.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('👤 Creating default admin user...');
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash: hashedPassword,
        name: 'Super Admin',
        role: Role.SUPER_ADMIN,
        wallet_address: '0x0000000000000000000000000000000000000000', // Placeholder
        kyc_status: KYCStatus.APPROVED,
        total_invested: 0, // Start from 0
        tokens_owned: 0, // Start from 0
        inr_balance: 0, // Start from 0
        vnc_balance: 0, // Start from 0
        eth_balance: 0, // Start from 0
        usdt_balance: 0, // Start from 0
        is_active: true,
        is_suspended: false,
      },
    });

    console.log('✅ Default admin user created:', {
      email: admin.email,
      role: admin.role,
      balances: {
        inr: admin.inr_balance,
        vnc: admin.vnc_balance,
        eth: admin.eth_balance,
        usdt: admin.usdt_balance,
      },
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('  - Presale Stage:', presale.stage);
    console.log('  - Tokens Sold:', presale.tokens_sold);
    console.log('  - Total Raised:', presale.total_raised);
    console.log('  - Participants:', presale.participants);
    console.log('  - Admin User:', admin.email);
    console.log('  - All balances initialized to 0');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
