import { useState, useEffect } from 'react';
import axios from 'axios';
import DriveCard from '../components/DriveCard';
import { Bookmark, Search, ArrowRight, Save } from 'lucide-react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('/api/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(drive => 
    drive.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drive.job_role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="animate-pulse space-y-12 mt-20">
      <div className="h-40 bg-gray-200 dark:bg-navy-800 rounded-[3rem] w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200 dark:bg-navy-800 rounded-[2rem]"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-32 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 bg-blue-600 dark:bg-blue-600/10 p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 uppercase"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 bg-white/20 dark:bg-blue-500/20 w-fit px-4 py-1.5 rounded-full border border-white/20 dark:border-blue-500/20">
            <Save size={14} className="text-white dark:text-blue-400" />
            <span className="text-[10px] font-black tracking-widest text-white dark:text-blue-400 uppercase">Personal Archive</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black text-white leading-tight uppercase">Saved Missions</h1>
          <p className="text-blue-50 dark:text-navy-300 font-bold max-w-md">Access and track the recruitment opportunities you've marked as high priority.</p>
        </div>

        <div className="relative w-full md:w-96 z-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 dark:text-navy-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search within saved..." 
            className="w-full pl-16 pr-6 py-5 bg-white/10 dark:bg-navy-950/50 backdrop-blur-md border border-white/20 dark:border-navy-900 focus:border-white/50 rounded-[2rem] text-white font-bold outline-none shadow-premium placeholder:text-white/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-navy-800 bg-transparent flex flex-col items-center">
          <div className="bg-gray-100 dark:bg-navy-900 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 rotate-12">
            <Bookmark className="text-gray-300 dark:text-navy-700 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Archive Empty</h3>
          <p className="text-navy-400 font-bold mt-2">Start exploring the marketplace and save your first mission.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-10 px-8 py-4 bg-navy-900 dark:bg-blue-600 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
          >
            DISCOVER DRIVES <ArrowRight size={20} className="inline ml-2" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBookmarks.map(drive => (
            <DriveCard key={drive.id} drive={drive} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
