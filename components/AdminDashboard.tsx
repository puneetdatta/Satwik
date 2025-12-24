
import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  FileBarChart, 
  BrainCircuit,
  Loader2,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  Phone,
  Mail,
  Store
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Associate, Referral, KYCStatus } from '../types';
import { analyzeReferralPerformance } from '../services/geminiService';

interface AdminDashboardProps {
  associates: Associate[];
  referrals: Referral[];
  onAddAssociate: (a: Associate) => void;
  onUpdateAssociate: (id: string, updates: Partial<Associate>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ associates, referrals, onAddAssociate, onUpdateAssociate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<'OVERVIEW' | 'KYC'>('OVERVIEW');
  
  // Manual Onboarding State
  const [newAssoc, setNewAssoc] = useState({ name: '', shopName: '', email: '', phone: '' });

  const totalPoints = associates.reduce((acc, curr) => acc + curr.points, 0);
  const totalReferrals = referrals.length;
  const pendingKYC = associates.filter(a => a.kycStatus === 'Pending');

  const chartData = associates.map(a => ({
    name: a.shopName,
    referrals: a.referralCount,
  })).sort((a, b) => b.referrals - a.referrals).slice(0, 5);

  const filteredAssociates = associates.filter(a => 
    a.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeReferralPerformance(associates, referrals);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleUpdateKYC = (id: string, status: KYCStatus) => {
    onUpdateAssociate(id, { kycStatus: status });
  };

  const handleManualOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `AS${String(associates.length + 1).padStart(3, '0')}`;
    const associate: Associate = {
      ...newAssoc,
      id,
      points: 0,
      referralCount: 0,
      qrCodeUrl: `https://satwikgroup.com/ref?id=${id}`,
      joinedDate: new Date().toISOString().split('T')[0],
      kycStatus: 'Not Started'
    };
    onAddAssociate(associate);
    setNewAssoc({ name: '', shopName: '', email: '', phone: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* View Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit shadow-inner">
        <button 
          onClick={() => setView('OVERVIEW')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'OVERVIEW' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Partner Overview
        </button>
        <button 
          onClick={() => setView('KYC')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === 'KYC' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          KYC Requests
          {pendingKYC.length > 0 && <span className="w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{pendingKYC.length}</span>}
        </button>
      </div>

      {view === 'OVERVIEW' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Users size={24} /></div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Partners</p>
                  <h4 className="text-2xl font-black text-slate-800">{associates.length}</h4>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gross Referrals</p>
                  <h4 className="text-2xl font-black text-slate-800">{totalReferrals}</h4>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24} /></div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending KYC</p>
                  <h4 className="text-2xl font-black text-slate-800">{pendingKYC.length}</h4>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><FileBarChart size={24} /></div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Reward Liability</p>
                  <h4 className="text-2xl font-black text-slate-800">₹ {totalPoints.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-lg font-bold text-slate-800">Managed Associates</h3>
                  <button 
                    onClick={() => setShowAddForm(true)} 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold text-sm shadow-lg shadow-indigo-100"
                  >
                    <UserPlus size={18} /> Onboard Partner
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Details</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC</th>
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAssociates.map((assoc) => (
                        <tr key={assoc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">{assoc.shopName.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{assoc.shopName}</p>
                              <p className="text-xs text-slate-400">{assoc.name} • {assoc.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-emerald-100 text-emerald-800 tracking-tighter">ACTIVE</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tighter ${
                              assoc.kycStatus === 'Verified' ? 'bg-indigo-100 text-indigo-800' : 
                              assoc.kycStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                            }`}>{assoc.kycStatus.toUpperCase()}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-slate-700">{assoc.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
                <BrainCircuit className="absolute top-2 right-2 opacity-10" size={100} />
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10"><BrainCircuit size={22} className="text-indigo-400" /> Strategic Analysis</h3>
                <p className="text-slate-400 text-xs mb-6 relative z-10 leading-relaxed">Deep dive into referral trends and associate health metrics using Gemini AI.</p>
                <button 
                  disabled={isAnalyzing}
                  onClick={handleRunAnalysis}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 relative z-10 transition-all"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Analyze Ecosystem"}
                </button>
                {analysisResult && (
                  <div className="mt-6 p-4 bg-white/5 rounded-2xl text-[11px] max-h-48 overflow-y-auto border border-white/10 text-slate-300 leading-relaxed font-medium">
                    {analysisResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-black text-slate-800 mb-8">Pending KYC Verifications</h3>
          {pendingKYC.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShieldCheck className="text-slate-300" size={40} />
              </div>
              <p className="text-slate-400 font-medium">No pending verification requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingKYC.map(assoc => (
                <div key={assoc.id} className="border border-slate-100 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{assoc.shopName}</h4>
                      <p className="text-sm text-slate-500">Proprietor: {assoc.name}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Awaiting Approval</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">PAN Account</p>
                      <p className="font-mono text-slate-700 font-bold">{assoc.panNumber || 'NOT SUBMITTED'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Aadhaar ID</p>
                      <p className="font-mono text-slate-700 font-bold">{assoc.aadhaarNumber || 'NOT SUBMITTED'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleUpdateKYC(assoc.id, 'Verified')}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                    >
                      <CheckCircle size={18} /> Confirm Identity
                    </button>
                    <button 
                      onClick={() => handleUpdateKYC(assoc.id, 'Rejected')}
                      className="px-4 border border-rose-100 text-rose-500 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-rose-50 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Onboarding Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-800">Manual Partner Onboarding</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">×</button>
            </div>
            <form onSubmit={handleManualOnboard} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Store size={12}/> Shop/Business Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" value={newAssoc.shopName} onChange={e => setNewAssoc({...newAssoc, shopName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users size={12}/> Owner Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" value={newAssoc.name} onChange={e => setNewAssoc({...newAssoc, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Mail size={12}/> Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" value={newAssoc.email} onChange={e => setNewAssoc({...newAssoc, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Phone size={12}/> Contact Number</label>
                <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" value={newAssoc.phone} onChange={e => setNewAssoc({...newAssoc, phone: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
