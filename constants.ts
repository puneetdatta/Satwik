
import { Associate, Referral } from './types';

export const SERVICES_LIST = [
  "Tank Cleaning",
  "Deep Cleaning",
  "Home Loan",
  "Insurance",
  "Investment Plan",
  "Real Estate"
];

export const INITIAL_ASSOCIATES: Associate[] = [
  {
    id: 'AS001',
    name: 'Rajesh Kumar',
    shopName: 'Kumar Electronics',
    email: 'rajesh@example.com',
    phone: '9876543210',
    points: 1250,
    referralCount: 15,
    qrCodeUrl: 'https://satwikgroup.com/ref?id=AS001',
    joinedDate: '2023-10-12',
    kycStatus: 'Verified',
    panNumber: 'ABCDE1234F'
  },
  {
    id: 'AS002',
    name: 'Priya Sharma',
    shopName: 'Sharma General Stores',
    email: 'priya@example.com',
    phone: '9876543211',
    points: 800,
    referralCount: 8,
    qrCodeUrl: 'https://satwikgroup.com/ref?id=AS002',
    joinedDate: '2023-11-05',
    kycStatus: 'Pending'
  },
  {
    id: 'AS003',
    name: 'Amit Patel',
    shopName: 'Patel Hardware',
    email: 'amit@example.com',
    points: 2100,
    referralCount: 22,
    qrCodeUrl: 'https://satwikgroup.com/ref?id=AS003',
    joinedDate: '2023-08-20',
    kycStatus: 'Not Started'
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  { id: 'REF001', associateId: 'AS001', clientName: 'Suresh V', serviceInterest: 'Tank Cleaning', status: 'Completed', pointsAwarded: 100, timestamp: '2024-03-01' },
  { id: 'REF002', associateId: 'AS001', clientName: 'Meena R', serviceInterest: 'Deep Cleaning', status: 'Pending', pointsAwarded: 0, timestamp: '2024-03-15' },
  { id: 'REF003', associateId: 'AS002', clientName: 'John Doe', serviceInterest: 'Deep Cleaning', status: 'Completed', pointsAwarded: 150, timestamp: '2024-03-10' },
  { id: 'REF004', associateId: 'AS003', clientName: 'Vikram Singh', serviceInterest: 'Tank Cleaning', status: 'Completed', pointsAwarded: 200, timestamp: '2024-02-28' },
];

export const APP_CONFIG = {
  companyName: 'Satwik Universe Private Limited',
  website: 'www.satwikgroup.com',
  referralPointsBase: 100,
  redemptionThreshold: 500, // Minimum points to redeem
  pointToInrRatio: 1, // 1 Point = 1 Rupee
  adminPassKey: 'satwik2025' // Simple password for admin demo
};
