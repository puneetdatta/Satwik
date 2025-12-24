
export type KYCStatus = 'Not Started' | 'Pending' | 'Verified' | 'Rejected';

export interface Associate {
  id: string;
  name: string;
  shopName: string;
  email: string;
  phone?: string;
  points: number;
  referralCount: number;
  qrCodeUrl: string;
  joinedDate: string;
  // KYC & Profile
  kycStatus: KYCStatus;
  panNumber?: string;
  aadhaarNumber?: string;
  bankAccount?: string;
  bankIFSC?: string;
}

export interface Referral {
  id: string;
  associateId: string;
  clientName: string;
  serviceInterest: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  pointsAwarded: number;
  timestamp: string;
}

export interface PayoutRequest {
  id: string;
  associateId: string;
  points: number;
  amount: number;
  status: 'Pending' | 'Processed' | 'Cancelled';
  timestamp: string;
}

export type UserRole = 'ADMIN' | 'ASSOCIATE' | 'NONE';

export interface AppState {
  associates: Associate[];
  referrals: Referral[];
  payouts: PayoutRequest[];
}
