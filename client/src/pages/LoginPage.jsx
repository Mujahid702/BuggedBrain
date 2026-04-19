import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication sequence failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32">
       {/* Background Glow */}
       <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10 blur-[120px]"></div>

      <div className="w-full max-w-lg bg-white dark:bg-navy-950 border border-gray-100 dark:border-navy-900 rounded-[3rem] p-10 md:p-16 shadow-premium relative overflow-hidden group">
        {/* Animated Accent */}
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        
        <div className="text-center space-y-6">
          <div className="p-1 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <img src="/logo.png" alt="BuggedBrain" className="w-12 h-12 object-contain rounded-lg" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-outfit font-black text-navy-900 dark:text-white tracking-tight">Access Dashboard</h1>
            <p className="text-navy-400 font-bold uppercase tracking-widest text-[10px]">Secure Authentication Sequence Required</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center text-sm shadow-sm mt-8 animate-fade-in">
            <AlertCircle size={20} className="mr-3 shrink-0" />
            <span className="font-bold tracking-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 mt-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="email" 
                required
                className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@buggedbrain.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-2">Secure Link Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="password" 
                required
                className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-navy-900 dark:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-500/30 disabled:opacity-50 group"
          >
            {loading ? (
              <div className="w-8 h-8 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                AUTHENTICATE
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-gray-100 dark:border-navy-900 mt-10">
          <p className="text-navy-400 font-bold text-sm">
            Unregistered?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-black hover:underline underline-offset-4 decoration-2">Create Global Account</Link>
          </p>
        </div>
      </div>
      
      {/* Demo Credentials Alert */}
      <div className="mt-12 glass-card border-blue-500/20 dark:border-blue-500/10 p-6 rounded-[2rem] max-w-lg w-full flex items-center space-x-6 backdrop-blur-xl">
        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
          <ShieldCheck className="text-blue-500" />
        </div>
    <div>
      <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">Master Admin Identity</p>
      <p className="text-navy-900 dark:text-white font-bold text-sm">
        admin@buggedbrain.com / admin123
      </p>
    </div>
      </div>
    </div>
  );
};

export default LoginPage;
