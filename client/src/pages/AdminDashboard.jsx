import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Settings,
  Star,
  ArrowUpRight,
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axios.get('/api/drives');
      setDrives(res.data);
    } catch (err) {
      console.error('Failed to fetch drives', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('🚨 PERMANENT ACTION: Are you sure you want to delete this drive?')) {
      try {
        await axios.delete(`/api/drives/${id}`);
        setDrives(drives.filter(d => d.id !== id));
      } catch (err) {
        alert('Failed to delete drive');
      }
    }
  };

  const filteredDrives = drives.filter(drive => 
    drive.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drive.job_role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-32 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 bg-navy-950 p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 w-fit px-4 py-1.5 rounded-full">
            <Settings size={14} className="text-blue-400" />
            <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">System Administration</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black text-white leading-tight">Control Center</h1>
          <p className="text-navy-300 font-medium max-w-md">Oversee recruitment drives, manage preparation assets, and track active opportunities.</p>
        </div>

        <Link 
          to="/admin/new" 
          className="relative z-10 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/30 group"
        >
          <Plus size={24} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
          LAUNCH NEW DRIVE
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="glass-card rounded-[2.5rem] p-8 space-y-2">
            <div className="text-navy-400 text-[10px] font-black uppercase tracking-widest">Total Active Drives</div>
            <div className="text-4xl font-outfit font-black text-navy-900 dark:text-white uppercase">{drives.length}</div>
         </div>
         <div className="glass-card rounded-[2.5rem] p-8 space-y-2">
            <div className="text-navy-400 text-[10px] font-black uppercase tracking-widest">Featured Slots</div>
            <div className="text-4xl font-outfit font-black text-yellow-500 uppercase">{drives.filter(d => d.is_featured === 1).length}</div>
         </div>
         <div className="glass-card rounded-[2.5rem] p-8 space-y-2">
            <div className="text-navy-400 text-[10px] font-black uppercase tracking-widest">Expired Content</div>
            <div className="text-4xl font-outfit font-black text-red-500 uppercase">{drives.filter(d => new Date(d.deadline) < new Date()).length}</div>
         </div>
      </div>

      {/* Management Area */}
      <div className="glass-card rounded-[3rem] shadow-premium overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-navy-900 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by company or role..." 
              className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 text-navy-400 font-bold text-sm">
            <Filter size={16} />
            <span>Sort by Latest</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-navy-400 animate-pulse font-bold tracking-widest">SYNCHRONIZING RECENT DATA...</div>
          ) : filteredDrives.length === 0 ? (
            <div className="p-20 text-center text-navy-400 font-bold">NO MATCHING DRIVES RECORDED.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-navy-900/50 text-navy-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Occupation</th>
                  <th className="px-8 py-6">Timeline</th>
                  <th className="px-8 py-6">Visibility</th>
                  <th className="px-8 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-navy-900/50">
                {filteredDrives.map((drive) => (
                  <tr key={drive.id} className="hover:bg-blue-50/30 dark:hover:bg-navy-900 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-900 flex items-center justify-center p-2 mr-4 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          {drive.logo_path ? (
                            <img src={drive.logo_path} alt="" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="font-black text-blue-600">{drive.company_name[0]}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-navy-900 dark:text-white flex items-center">
                            {drive.company_name}
                            {drive.is_featured === 1 && <Star size={14} className="ml-2 text-yellow-500 fill-yellow-500" />}
                           </span>
                           <span className="text-[10px] font-bold text-navy-400 uppercase tracking-tighter">Verified Enterprise</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-navy-600 dark:text-navy-300">{drive.job_role}</td>
                    <td className="px-8 py-6">
                       <span className={`text-xs font-black uppercase ${
                        new Date(drive.deadline) < new Date() ? 'text-red-500' : 'text-emerald-500'
                       }`}>
                        {drive.deadline || 'Perpetual'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        new Date(drive.deadline) < new Date() ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'bg-green-50 dark:bg-green-500/10 text-green-600'
                      }`}>
                        {new Date(drive.deadline) < new Date() ? 'Archived' : 'Live Now'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link 
                          to={`/drive/${drive.id}`}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-navy-900 text-navy-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          to={`/admin/edit/${drive.id}`}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-navy-900 text-navy-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all rounded-xl"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(drive.id)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-navy-900 text-navy-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
