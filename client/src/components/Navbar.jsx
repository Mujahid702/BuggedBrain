import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Rocket, 
  Bookmark, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Moon, 
  Sun,
  Menu,
  X,
  Map
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-navy-900 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-1 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <img src="/logo.png" alt="RecruitDrive" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <span className="text-xl md:text-2xl font-outfit font-extrabold tracking-tight text-navy-900 dark:text-white">
            Recruit<span className="text-blue-600 dark:text-blue-400">Drive</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
            Drives
          </Link>
          <Link to="/roadmap" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors flex items-center">
            <Map size={18} className="mr-1.5" />
            Roadmap
          </Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-navy-700 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-900"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-navy-900" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-6 border-l border-gray-200 dark:border-navy-800 pl-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-black text-navy-400 uppercase tracking-widest leading-none">Identity</span>
                <span className="text-sm font-black text-navy-900 dark:text-white">{user.name || 'Student Agent'}</span>
              </div>
              
              <div className="relative group">
                <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all">
                  <User size={24} className="text-white" />
                </button>
                
                {/* Menu Dropdown */}
                <div className="absolute right-0 top-full mt-4 w-64 glass-card rounded-[2rem] p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all shadow-premium z-50">
                  <div className="space-y-2">
                    <div className="p-4 border-b border-gray-100 dark:border-navy-900 mb-2">
                      <div className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] mb-1">Clearance Level</div>
                      <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        {user.role === 'admin' ? 'Strategic Admin' : 'Active Candidate'}
                      </div>
                    </div>
                    
                    <Link to="/profile" className="flex items-center w-full px-4 py-3 text-sm font-bold text-navy-600 dark:text-navy-300 hover:bg-gray-50 dark:hover:bg-navy-900 rounded-xl transition-all">
                       Identity Profile
                    </Link>

                    <Link to="/bookmarks" className="flex items-center w-full px-4 py-3 text-sm font-bold text-navy-600 dark:text-navy-300 hover:bg-gray-50 dark:hover:bg-navy-900 rounded-xl transition-all">
                       Saved Drives
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center w-full px-4 py-3 text-sm font-bold text-navy-600 dark:text-navy-300 hover:bg-gray-50 dark:hover:bg-navy-900 rounded-xl transition-all font-black">
                         Control Center
                      </Link>
                    )}
                    
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      Terminate Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-navy-800 pl-6">
              <Link to="/login" className="px-6 py-2.5 text-navy-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-all">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-navy-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 p-4 glass-card rounded-2xl space-y-4 animate-slide-up mx-4 mb-4">
           <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300 font-bold">Drives</Link>
           <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 font-bold w-full text-left">
            {isDark ? <><Sun size={20} /> <span>Light Mode</span></> : <><Moon size={20} /> <span>Dark Mode</span></>}
           </button>
           <div className="border-t border-gray-100 dark:border-navy-900 pt-4">
            {user ? (
               <div className="space-y-4">
                  <Link to="/roadmap" onClick={() => setIsOpen(false)} className="block py-2 text-navy-900 dark:text-white font-bold flex items-center">
                    <Map size={18} className="mr-2" />
                    Preparation Roadmap
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-navy-900 dark:text-white font-bold">Profile</Link>
                  <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="block py-2 text-navy-900 dark:text-white font-bold">Saved Drives</Link>
                 {user.role === 'admin' && (
                   <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-navy-900 dark:text-white font-bold">Admin Dashboard</Link>
                 )}
                 <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left py-2 text-red-500 font-bold">Logout</button>
               </div>
            ) : (
              <div className="space-y-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300 font-bold">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full bg-navy-900 dark:bg-blue-600 text-white text-center py-3 rounded-xl font-bold">Sign Up</Link>
              </div>
            )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
