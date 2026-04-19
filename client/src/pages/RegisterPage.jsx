import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Globe, Zap, Shield, Bookmark, User } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password synchronization mismatch. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration sequence interrupted. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-32 max-w-7xl mx-auto lg:flex-row gap-16 lg:gap-32 px-4 relative">
       {/* Decorative Background */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

      {/* Left Column: Vision & Features */}
      <div className="flex-1 space-y-12 hidden lg:block animate-fade-in">
        <div className="bg-navy-900 dark:bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-6">
          <Rocket className="text-white w-10 h-10" />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-7xl font-outfit font-black text-navy-900 dark:text-white leading-[1.1] tracking-tight">
            Initiate your <span className="text-gradient">Career</span> <br/>Sequence.
          </h1>
          <p className="text-xl text-navy-400 font-bold leading-relaxed max-w-lg">Join the premier gateway for elite placement resources and world-class recruitment drives.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { i: Bookmark, t: 'Cloud Saving', d: 'Persist your favorite drives across devices.' },
            { i: Shield, t: 'Secured Kits', d: 'Access verified placement preparation suites.' },
            { i: Zap, t: 'Instant Alerts', d: 'Track upcoming deadlines in real-time.' },
            { i: Globe, t: 'Global Access', d: 'Connect with multi-national opportunities.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col space-y-3 group">
              <div className="bg-white dark:bg-navy-950 p-4 rounded-2xl w-fit shadow-sm border border-gray-100 dark:border-navy-900 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <item.i size={24} className="group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-outfit font-black text-navy-900 dark:text-white uppercase tracking-wider text-sm">{item.t}</h3>
              <p className="text-navy-400 font-bold text-xs leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: High-Fidelity Form */}
      <div className="w-full max-w-lg bg-white dark:bg-navy-950 border border-gray-100 dark:border-navy-900 rounded-[3.5rem] p-10 md:p-16 shadow-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
        
        <div className="space-y-2 mb-10">
          <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white tracking-tight">Enroll Now</h2>
          <p className="text-navy-400 font-bold uppercase tracking-widest text-[10px]">Create Your Global Identity</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center text-sm shadow-sm mb-8 animate-fade-in">
            <AlertCircle size={20} className="mr-3 shrink-0" />
            <span className="font-bold tracking-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-2">Full Legal Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="text" 
                required
                className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Capt. John Doe"
              />
            </div>
          </div>

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
                placeholder="identity@buggedbrain.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-2">Create Password</label>
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

          <div className="space-y-3 pb-4">
            <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest ml-2">Confirm Authorization</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="password" 
                required
                className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                DEPLOY IDENTITY
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-gray-100 dark:border-navy-900 mt-10">
          <p className="text-navy-400 font-bold text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-black hover:underline underline-offset-4 decoration-2">Sign In Sequence</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
