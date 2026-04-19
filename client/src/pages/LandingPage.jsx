import { useState, useEffect } from 'react';
import axios from 'axios';
import DriveCard from '../components/DriveCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { Search, Filter, Sparkles, TrendingUp, Users, ArrowRight, Rocket, Map, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [roadmapData, setRoadmapData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDrives();
    if (user) {
      fetchRoadmap();
    }
  }, [user]);

  const fetchRoadmap = async () => {
    try {
      const res = await axios.get('/api/profile');
      setRoadmapData(res.data);
    } catch (err) {
      console.error('Failed to fetch roadmap', err);
    }
  };

  const fetchDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/drives');
      setDrives(res.data);
    } catch (err) {
      console.error('Failed to fetch drives', err);
      setError('Failed to load drives. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const allTags = ['All', ...new Set((drives || []).flatMap(d => (d && d.tags) ? d.tags.split(',').map(t => t.trim()) : []))];

  const filteredDrives = (drives || []).filter(drive => {
    if (!drive) return false;
    const matchesSearch = (drive.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (drive.job_role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || (drive.tags && drive.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const featuredDrives = filteredDrives.filter(d => d.is_featured === 1);
  const regularDrives = filteredDrives.filter(d => d.is_featured !== 1);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full">
          <Sparkles className="text-red-500 w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! {error}</h2>
          <p className="text-gray-500 dark:text-gray-400">Our servers might be taking a quick break.</p>
        </div>
        <button 
          onClick={fetchDrives}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-12 mt-20">
        <div className="h-96 bg-gray-200 dark:bg-navy-800 rounded-[3rem] w-full animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-32">
      {/* Premium Hero Section */}
      <section className="relative mt-12 rounded-[3.5rem] overflow-hidden bg-navy-950 p-8 md:p-20 shadow-premium">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse-slow"></div>
        
        <div className="relative z-10 max-w-4xl space-y-8 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2">
            <TrendingUp size={16} className="text-indigo-400" />
            <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">BuggedBrain Intelligence 2024</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-outfit font-black text-white leading-tight">
            Crack top company drives with <span className="text-blue-500 italic">clarity</span>, not chaos.
          </h1>
          
          <p className="text-xl text-navy-200 max-w-2xl font-medium leading-relaxed">
            Curated placement drives, battle-tested prep kits, and real strategies — all in one place, built for serious aspirants.
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <Link 
              to={roadmapData?.roadmap ? "/roadmap" : "/onboarding"}
              className="group flex items-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95"
            >
              <Map className="mr-3" />
              {roadmapData?.roadmap ? "View My Roadmap" : "Get Personalized Roadmap"}
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            {!roadmapData?.roadmap && (
              <div className="flex items-center text-navy-400 font-bold px-4">
                <Sparkles size={16} className="text-yellow-400 mr-2" />
                Wait, it's <span className="text-white ml-1">FREE</span> for everyone.
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <Users className="text-blue-400" />
                <div>
                  <div className="text-white font-black text-xl leading-none">10k+</div>
                  <div className="text-navy-400 text-xs font-bold uppercase tracking-tighter">Students Placed</div>
                </div>
             </div>
             <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <Sparkles className="text-yellow-400" />
                <div>
                  <div className="text-white font-black text-xl leading-none">500+</div>
                  <div className="text-navy-400 text-xs font-bold uppercase tracking-tighter">Active Drives</div>
                </div>
             </div>
          </div>
        </div>

        {/* Floating Icon Decoration */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block animate-float">
           <div className="p-4 rounded-[3rem] shadow-2xl rotate-12 bg-white/5 backdrop-blur-3xl border border-white/10">
              <img src="/logo.png" alt="BuggedBrain" className="w-40 h-40 object-contain drop-shadow-2xl" />
           </div>
        </div>
      </section>

      {/* Modern Search & Filters */}
      <section className="sticky top-[102px] z-40">
        <div className="glass-card rounded-[2.5rem] p-4 flex flex-col lg:flex-row gap-4 items-center shadow-premium bg-[#e0e7ff] dark:bg-navy-950/80 backdrop-blur-3xl border border-indigo-100 dark:border-navy-900 transition-all">
          <div className="relative flex-grow group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search companies, roles, or keywords..." 
              className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-navy-900 border border-transparent focus:border-blue-500/50 rounded-[2rem] text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto p-2 no-scrollbar">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`
                  px-6 py-4 rounded-[1.5rem] text-sm font-black whitespace-nowrap transition-all duration-300
                  ${selectedTag === tag 
                    ? "bg-navy-900 dark:bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                    : "bg-white dark:bg-navy-800 text-gray-600 dark:text-navy-300 hover:bg-gray-100 dark:hover:bg-navy-700"}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section (Only if Roadmap exists) */}
      {user && roadmapData?.roadmap && (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-xl shadow-indigo-500/20">
                <Rocket className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white">Recommended for You</h2>
                <p className="text-gray-500 dark:text-navy-400 font-bold text-sm">Based on your <span className="text-indigo-600 dark:text-indigo-400">{roadmapData.profile.preferred_role}</span> path</p>
              </div>
            </div>
            <Link to="/roadmap" className="text-indigo-600 dark:text-indigo-400 font-black flex items-center group">
              View Full Roadmap <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Find relevant drives from state or re-fetch matching ones */}
            {drives
              .filter(d => d.job_role && roadmapData?.profile?.preferred_role && d.job_role.toLowerCase().includes(roadmapData.profile.preferred_role.toLowerCase()))
              .slice(0, 3)
              .map(drive => (
                <DriveCard key={drive.id} drive={drive} />
              ))
            }
            {/* If no exact matches, show featured */}
            {(drives.filter(d => d.job_role && roadmapData?.profile?.preferred_role && d.job_role.toLowerCase().includes(roadmapData.profile.preferred_role.toLowerCase())).length === 0) && (
                <div className="col-span-full p-12 text-center bg-gray-50 dark:bg-navy-900/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-navy-800">
                   <p className="text-gray-500 font-bold">Checking for new matching drives. In the meantime, focus on your skill building steps!</p>
                </div>
              )
            }
          </div>
        </section>
      )}

      {/* Featured Grid */}
      {featuredDrives.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg shadow-yellow-400/20">
                <Sparkles className="text-navy-950 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white">Featured Drives</h2>
                <p className="text-gray-500 dark:text-navy-400 font-bold text-sm">Most important recruitment opportunities for you</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredDrives.map(drive => (
              <DriveCard key={drive.id} drive={drive} />
            ))}
          </div>
        </section>
      )}

      {/* Regular Drives */}
      <section className="space-y-10">
        <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white">
          {searchTerm || selectedTag !== 'All' ? 'Matched Opportunities' : 'Latest Openings'}
        </h2>
        
        {filteredDrives.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-navy-800 bg-transparent">
            <div className="bg-gray-100 dark:bg-navy-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="text-gray-300 dark:text-navy-600 w-12 h-12" />
            </div>
            <p className="text-gray-500 dark:text-navy-400 text-xl font-black">No drives found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedTag('All');}}
              className="mt-6 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center mx-auto hover:gap-2 transition-all"
            >
              Clear filters <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {regularDrives.map(drive => (
              <DriveCard key={drive.id} drive={drive} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
