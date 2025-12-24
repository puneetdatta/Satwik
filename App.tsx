
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronDown,
  Globe,
  Store,
  ShieldCheck,
  UserCircle,
  Lock
} from 'lucide-react';
import { Associate, Referral, UserRole } from './types';
import { INITIAL_ASSOCIATES, INITIAL_REFERRALS, APP_CONFIG } from './constants';
import AdminDashboard from './components/AdminDashboard';
import AssociateDashboard from './components/AssociateDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('NONE');
  const [activeAssociateId, setActiveAssociateId] = useState<string | null>(null);
  const [associates, setAssociates] = useState<Associate[]>(INITIAL_ASSOCIATES);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Persistence
  useEffect(() => {
    const savedRole = localStorage.getItem('satwik_role') as UserRole;
    const savedId = localStorage.getItem('satwik_assoc_id');
    if (savedRole) setRole(savedRole);
    if (savedId) setActiveAssociateId(savedId);
  }, []);

  const handleAdminLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === APP_CONFIG.adminPassKey) {
      handleLogin('ADMIN');
      setShowAdminLogin(false);
      setAdminPassword('');
      setLoginError('');
    } else {
      setLoginError('Incorrect access key. Please try again.');
    }
  };

  const handleLogin = (selectedRole: UserRole, id?: string) => {
    setRole(selectedRole);
    localStorage.setItem('satwik_role', selectedRole);
    if (id) {
      setActiveAssociateId(id);
      localStorage.setItem('satwik_assoc_id', id);
    }
  };

  const handleLogout = () => {
    setRole('NONE');
    setActiveAssociateId(null);
    localStorage.removeItem('satwik_role');
    localStorage.removeItem('satwik_assoc_id');
  };

  const handleUpdateAssociate = (id: string, updates: Partial<Associate>) => {
    setAssociates(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const currentAssociate = associates.find(a => a.id === activeAssociateId);

  // Landing / Login Screen
  if (role === 'NONE') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm">
              <ShieldCheck size={18} />
              <span>Official Partner Portal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
              Satwik Universe <span className="text-indigo-600">Partner Program</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Earn ₹ 1.00 for every reward point. Share, track, and redeem with our unique referral ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href={`https://${APP_CONFIG.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors">
                <Globe size={20} /> Visit Website
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Associate Access</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {associates.map(assoc => (
                <button
                  key={assoc.id}
                  onClick={() => handleLogin('ASSOCIATE', assoc.id)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-slate-100 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                      <Store size={20} className="text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">{assoc.shopName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{assoc.name}</p>
                    </div>
                  </div>
                  <UserCircle size={18} className="text-slate-300 group-hover:text-indigo-400" />
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Lock size={16} /> Admin Portal
              </button>
            </div>
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800">Admin Gate</h3>
                <button onClick={() => setShowAdminLogin(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              <p className="text-slate-500 text-sm mb-6">This area is restricted to Satwik Universe administrators. Enter access key to continue.</p>
              <form onSubmit={handleAdminLoginAttempt} className="space-y-4">
                <input 
                  autoFocus
                  type="password"
                  placeholder="Access Key"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                />
                {loginError && <p className="text-rose-500 text-xs font-bold text-center">{loginError}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100">
                  Authenticate
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white"><Building2 size={24} /></div>
          <div>
            <h1 className="font-black text-slate-900 leading-none">SATWIK UNIVERSE</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">
              {role === 'ADMIN' ? 'Admin Controller' : 'Partner Ecosystem'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{role === 'ADMIN' ? 'System Administrator' : currentAssociate?.shopName}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">
                {role === 'ADMIN' ? 'Root Access' : `ID: ${activeAssociateId}`}
              </p>
            </div>
            <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {role === 'ADMIN' ? (
          <AdminDashboard 
            associates={associates} 
            referrals={referrals} 
            onAddAssociate={(newA) => setAssociates([newA, ...associates])}
            onUpdateAssociate={handleUpdateAssociate}
          />
        ) : (
          currentAssociate && (
            <AssociateDashboard 
              associate={currentAssociate} 
              referrals={referrals} 
              onUpdateProfile={(updates) => handleUpdateAssociate(currentAssociate.id, updates)}
            />
          )
        )}
      </main>

      <footer className="border-t border-slate-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">&copy; 2025 {APP_CONFIG.companyName}. SECURE PORTAL</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
