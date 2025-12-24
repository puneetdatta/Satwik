
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Share2, 
  History, 
  Star, 
  Bell,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  User,
  Wallet,
  Settings,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Send
} from 'lucide-react';
import { Associate, Referral } from '../types';
import QRCodeComponent from './QRCodeComponent';
import { getAssociateWelcomeTip } from '../services/geminiService';
import { APP_CONFIG, SERVICES_LIST } from '../constants';

interface AssociateDashboardProps {
  associate: Associate;
  referrals: Referral[];
  onUpdateProfile: (updates: Partial<Associate>) => void;
}

const AssociateDashboard: React.FC<AssociateDashboardProps> = ({ associate, referrals, onUpdateProfile }) => {
  const [tab, setTab] = useState<'HOME' | 'PROFILE' | 'WALLET' | 'SERVICES'>('HOME');
  const [welcomeTip, setWelcomeTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(true);
  
  // Referral Form
  const [refData, setRefData] = useState({ clientName: '', service: 'Tank Cleaning', note: '' });

  // Profile Form
  const [profileData, setProfileData] = useState({
    shopName: associate.shopName,
    phone: associate.phone || '',
    panNumber: associate.panNumber || '',
    bankAccount: associate.bankAccount || '',
    bankIFSC: associate.bankIFSC || ''
  });

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getAssociateWelcomeTip(associate.name);
      setWelcomeTip(tip);
      setLoadingTip(false);
    };
    fetchTip();
  }, [associate.name]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ 
      ...profileData, 
      kycStatus: profileData.panNumber ? 'Pending' : associate.kycStatus 
    });
    alert("Profile and KYC details updated for verification!");
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Referral for ${refData.clientName} for ${refData.service} submitted successfully!`);
    setRefData({ clientName: '', service: 'Tank Cleaning', note: '' });
  };

  const myReferrals = referrals.filter(r => r.associateId === associate.id);
  const earnings = associate.points * APP_CONFIG.pointToInrRatio;
  const canRedeem = associate.points >= APP_CONFIG.redemptionThreshold && associate.kycStatus === 'Verified';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {[
          { id: 'HOME', label: 'Overview', icon: Star },
          { id: 'SERVICES', label: 'Service Referral', icon: PlusCircle },
          { id: 'WALLET', label: 'Redemption', icon: Wallet },
          { id: 'PROFILE', label: 'KYC & Profile', icon: User }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`flex items-center gap-2 px-8 py-5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
              tab === item.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'HOME' && (
        <>
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="max-w-xl">
                <p className="text-indigo-200 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Partner Dashboard</p>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Welcome back, <br/>{associate.name.split(' ')[0]}!</h2>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 text-sm font-medium">
                  <Sparkles size={18} className="text-indigo-200 shrink-0" />
                  <span className="leading-relaxed">{loadingTip ? "Synthesizing business tip..." : welcomeTip}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/20 text-center min-w-[200px] shadow-inner">
                <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-2">Wallet Balance</p>
                <h3 className="text-5xl font-black mb-1">{associate.points}</h3>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Verified Referral Points</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4"><Trophy size={24} /></div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Value</p>
                  <p className="text-3xl font-black text-slate-800">₹ {earnings.toLocaleString()}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4"><ShieldCheck size={24} /></div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Partner Status</p>
                  <p className={`text-3xl font-black ${associate.kycStatus === 'Verified' ? 'text-indigo-600' : 'text-amber-500'}`}>
                    {associate.kycStatus.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800">Referral Ledger</h3>
                  <button onClick={() => setTab('SERVICES')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
                    Quick Refer <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Item</th>
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myReferrals.length > 0 ? (
                        myReferrals.map(ref => (
                          <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5 text-sm font-bold text-slate-800">{ref.clientName}</td>
                            <td className="px-6 py-5">
                               <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{ref.serviceInterest}</span>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-indigo-600">+{ref.pointsAwarded}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-6 py-20 text-center text-slate-400 italic">No referral data. Start referring clients to earn.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <QRCodeComponent url={associate.qrCodeUrl} shopName={associate.shopName} />
            </div>
          </div>
        </>
      )}

      {tab === 'SERVICES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2"><PlusCircle size={28} className="text-indigo-600" /> Refer New Client</h3>
              <form onSubmit={handleReferralSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Full Name</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all" 
                      placeholder="e.g. Rahul Sharma"
                      value={refData.clientName}
                      onChange={e => setRefData({...refData, clientName: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Service Interest</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                      value={refData.service}
                      onChange={e => setRefData({...refData, service: e.target.value})}
                    >
                       {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Additional Notes (Optional)</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all" 
                      rows={4}
                      placeholder="e.g. Prefer evening visit..."
                      value={refData.note}
                      onChange={e => setRefData({...refData, note: e.target.value})}
                    />
                 </div>
                 <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                    <Send size={18} /> Submit Referral
                 </button>
              </form>
           </div>
           
           <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden h-full flex flex-col justify-center">
                 <div className="absolute top-0 right-0 p-8 opacity-10"><Send size={120} /></div>
                 <h3 className="text-xl font-black mb-4 relative z-10 text-indigo-400">Referral Program Rule</h3>
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
                    Each successful referral for <b>Tank Cleaning</b> or <b>Deep Cleaning</b> earns you 100 points immediately upon service completion.
                 </p>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                       <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">01</div>
                       <p className="text-xs font-bold">Submit client details via portal or QR scan.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                       <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">02</div>
                       <p className="text-xs font-bold">Our team visits the client and completes service.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                       <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">03</div>
                       <p className="text-xs font-bold">Points credited instantly to your partner wallet.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {tab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2"><Settings size={28} className="text-indigo-600" /> Profile Settings</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business/Shop Name</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white" 
                    value={profileData.shopName}
                    onChange={e => setProfileData({...profileData, shopName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Phone</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white" 
                    value={profileData.phone}
                    onChange={e => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                <h4 className="text-indigo-600 font-black mb-6 flex items-center gap-2 text-sm uppercase tracking-widest"><ShieldCheck size={18}/> KYC Verification Kit</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Government PAN Number</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-mono uppercase font-bold text-slate-700 outline-none" 
                      placeholder="ABCDE1234F"
                      value={profileData.panNumber}
                      onChange={e => setProfileData({...profileData, panNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Account No.</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none font-bold" 
                        value={profileData.bankAccount}
                        onChange={e => setProfileData({...profileData, bankAccount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank IFSC Code</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-mono uppercase outline-none font-bold" 
                        value={profileData.bankIFSC}
                        onChange={e => setProfileData({...profileData, bankIFSC: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black shadow-2xl shadow-slate-200 transition-all">
                Submit Profile & KYC
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-[2rem] border-2 ${associate.kycStatus === 'Verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${associate.kycStatus === 'Verified' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                  {associate.kycStatus === 'Verified' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Status: {associate.kycStatus}</h4>
                  <p className="text-xs font-medium opacity-80 leading-relaxed">
                    {associate.kycStatus === 'Verified' ? 'Verified Account. Full redemption access enabled.' : 'Pending Verification. Please ensure PAN and Bank details are accurate for payout.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] relative overflow-hidden">
              <ShieldCheck className="absolute bottom-0 right-0 opacity-5 -mr-4 -mb-4" size={140} />
              <h3 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">Security Notice</h3>
              <p className="text-indigo-700/80 text-sm leading-relaxed font-medium">
                Satwik Universe takes data privacy seriously. Your KYC documents are encrypted and only used for processing payouts as per RBI guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'WALLET' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Liquid Balance</p>
                <div className="flex items-baseline gap-2 mb-6">
                   <span className="text-3xl font-bold text-slate-400">₹</span>
                   <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{earnings.toLocaleString()}</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><CreditCard size={20} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Settlement Bank</p>
                      <p className="text-sm font-bold text-slate-500">**** **** {associate.bankAccount?.slice(-4) || 'XXXX'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-80 bg-slate-50 rounded-3xl p-8 border border-slate-200">
                <p className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4">Payout Eligibility</p>
                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden mb-4 p-1 shadow-inner">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${Math.min(100, (associate.points / APP_CONFIG.redemptionThreshold) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-6">
                   <span className="text-slate-400">Min 500 Pts</span>
                   <span className="text-emerald-600">Verified: ₹ 1.00 / Pt</span>
                </div>
                <button
                  disabled={!canRedeem}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                    canRedeem ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-300 text-slate-100 cursor-not-allowed shadow-none'
                  }`}
                >
                  Withdraw to Bank
                </button>
                {!canRedeem && (
                   <p className="mt-4 text-[10px] text-rose-400 font-bold text-center leading-relaxed">
                      {associate.kycStatus !== 'Verified' ? 'Verification Required' : `Need ${APP_CONFIG.redemptionThreshold - associate.points} more points to redeem`}
                   </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs"><History size={18} className="text-indigo-600" /> Payout Log</h3>
              <div className="text-center py-16 flex flex-col items-center gap-3">
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200"><Wallet size={24} /></div>
                 <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">No transaction history</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociateDashboard;
