import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Settings,
  Briefcase,
  History,
  AlertCircle,
  Save
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, subscribe } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications/me');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateProfile(formData);
      setSuccess('Identity profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update clearance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await subscribe();
      setSuccess('Clearance level upgraded to PREMIUM.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Upgrade sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user?.is_premium === 1;

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-12 pt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-gray-100 dark:border-navy-900 border-dashed">
         <div className="space-y-4">
            <div className="bg-navy-900 dark:bg-blue-600 w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/20">
               <User className="text-white w-10 h-10" />
            </div>
            <div className="space-y-1">
               <h1 className="text-4xl lg:text-5xl font-outfit font-black text-navy-900 dark:text-white tracking-tight">
                 Personal <span className="text-gradient">Identity</span>
               </h1>
               <p className="text-navy-400 font-bold uppercase tracking-[0.2em] text-xs">Clearance Level: {user?.role.toUpperCase()}</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {!isPremium && (
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center group"
              >
                <Zap size={16} className="mr-2 fill-current group-hover:animate-pulse" />
                Upgrade Clearance
              </button>
            )}
            {isPremium && (
              <div className="px-8 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center">
                 <ShieldCheck size={16} className="mr-2" />
                 Premium Clearance
              </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Settings */}
        <div className="space-y-8">
           <div className="glass-card rounded-[3rem] p-10 shadow-premium space-y-8">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="bg-gray-100 dark:bg-navy-900 p-2 rounded-xl">
                    <Settings size={20} className="text-blue-600" />
                 </div>
                 <h2 className="text-xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Account Parameters</h2>
              </div>

              {success && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center">
                  <CheckCircle2 size={16} className="mr-2" />
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                    <div className="relative">
                       <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                        type="text" 
                        required
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none shadow-inner text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">Communication Email</label>
                    <div className="relative">
                       <Mail size={16} className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                        type="email" 
                        required
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none shadow-inner text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                 </div>

                 <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-navy-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>Commit Updates</span>
                </button>
              </form>
           </div>
        </div>

        {/* Application History */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card rounded-[3rem] p-10 shadow-premium min-h-[500px] space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 dark:bg-navy-900 p-2 rounded-xl">
                        <History size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Mission Log (Applications)</h2>
                 </div>
                 <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest bg-gray-50 dark:bg-navy-900 px-3 py-1 rounded-full border border-gray-100 dark:border-navy-800">
                   {applications.length} Records found
                 </span>
              </div>

              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-navy-900 rounded-full flex items-center justify-center border border-gray-100 dark:border-navy-800">
                      <Briefcase size={32} className="text-gray-300 dark:text-navy-700" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-lg font-black text-navy-900 dark:text-white">No active missions found</h3>
                      <p className="text-sm font-bold text-navy-400">Head over to the Marketplace to initiate your first recruitment drive.</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((app, idx) => (
                    <div key={idx} className="group glass-card rounded-3xl p-6 border border-gray-100 dark:border-navy-900 hover:border-blue-500/30 transition-all flex items-center gap-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-bl-3xl"></div>
                       
                       <div className="w-16 h-16 rounded-2xl bg-white dark:bg-navy-900 p-3 shadow-inner border border-gray-50 dark:border-navy-800 flex items-center justify-center shrink-0">
                          {app.logo_path ? (
                            <img src={app.logo_path} alt={app.company_name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="font-black text-blue-600">{app.company_name[0]}</span>
                          )}
                       </div>

                       <div className="flex-grow space-y-1">
                          <h4 className="font-black text-navy-900 dark:text-white line-clamp-1">{app.company_name}</h4>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{app.job_role}</p>
                          <div className="flex items-center gap-3 pt-2">
                             <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                               app.status === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                             }`}>
                                {app.status}
                             </div>
                             <span className="text-[8px] font-bold text-navy-400 flex items-center">
                                <Clock size={10} className="mr-1" />
                                {new Date(app.created_at).toLocaleDateString()}
                             </span>
                          </div>
                       </div>

                       <button className="text-gray-300 group-hover:text-blue-500 transition-colors">
                          <ChevronRight size={20} />
                       </button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
