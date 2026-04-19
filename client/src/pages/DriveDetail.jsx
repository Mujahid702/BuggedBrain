import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Download, 
  Bookmark, 
  BookmarkCheck,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  Briefcase,
  Share2,
  X,
  ArrowRight,
  Lock,
  Zap
} from 'lucide-react';

const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, subscribe } = useAuth();
  const [drive, setDrive] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [applicationStatus, setApplicationStatus] = useState({ applied: false, status: null });
  const [checklistProgress, setChecklistProgress] = useState([]); // Array of {item_index, is_checked}
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchDriveDetails();
    if (user) {
      checkBookmarkStatus();
      checkApplicationStatus();
      fetchChecklistProgress();
    }
  }, [id, user]);

  const fetchDriveDetails = async () => {
    try {
      const res = await axios.get(`/api/drives/${id}`);
      setDrive(res.data);
    } catch (err) {
      console.error('Failed to fetch drive details', err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const res = await axios.get('/api/bookmarks');
      const bookmarked = res.data.some(b => b.id === parseInt(id));
      setIsBookmarked(bookmarked);
    } catch (err) {
      console.error('Failed to check bookmark status', err);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await axios.get(`/api/applications/status/${id}`);
      setApplicationStatus(res.data);
    } catch (err) {
      console.error('Failed to check application status', err);
    }
  };

  const fetchChecklistProgress = async () => {
    try {
      const res = await axios.get(`/api/checklist/${id}`);
      setChecklistProgress(res.data);
    } catch (err) {
      console.error('Failed to fetch checklist progress', err);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await axios.post(`/api/bookmarks/${id}`);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await axios.post(`/api/applications/${id}`);
      setApplicationStatus({ applied: true, status: 'pending' });
    } catch (err) {
      console.error('Application failed', err);
    } finally {
      setApplying(false);
    }
  };

  const handleChecklistToggle = async (index, currentChecked) => {
    if (!user) return navigate('/login');
    const newChecked = !currentChecked;
    
    // Optimistic UI update
    setChecklistProgress(prev => {
      const existing = prev.find(p => p.item_index === index);
      if (existing) {
        return prev.map(p => p.item_index === index ? { ...p, is_checked: newChecked ? 1 : 0 } : p);
      }
      return [...prev, { item_index: index, is_checked: newChecked ? 1 : 0 }];
    });

    try {
      await axios.patch(`/api/checklist/${id}`, {
        item_index: index,
        is_checked: newChecked
      });
    } catch (err) {
      console.error('Failed to update checklist', err);
      // Revert if failed
      fetchChecklistProgress();
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-12 max-w-7xl mx-auto mt-20">
      <div className="h-64 bg-gray-200 dark:bg-navy-800 rounded-[3rem]"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 h-screen bg-gray-200 dark:bg-navy-800 rounded-[3rem]"></div>
        <div className="h-96 bg-gray-200 dark:bg-navy-800 rounded-[3rem]"></div>
      </div>
    </div>
  );

  if (!drive) return (
    <div className="text-center py-32">
       <div className="bg-red-50 dark:bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <X className="text-red-500 w-12 h-12" />
       </div>
      <h2 className="text-3xl font-black text-navy-900 dark:text-white">Product not found</h2>
      <button onClick={() => navigate('/')} className="mt-8 text-blue-600 dark:text-blue-400 font-black hover:scale-105 transition-all">
        Return to Discovery
      </button>
    </div>
  );

  const tags = drive.tags ? drive.tags.split(',') : [];
  let checklist = [];
  try {
    checklist = drive.checklist ? JSON.parse(drive.checklist) : [];
  } catch (e) {
    console.error("Checklist parse error", e);
    checklist = [];
  }
  const isPremium = user?.is_premium === 1;

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center text-gray-500 dark:text-navy-400 hover:text-blue-600 dark:hover:text-blue-400 font-black transition-all"
      >
        <div className="bg-white dark:bg-navy-900 p-2 rounded-lg shadow-sm mr-4 group-hover:-translate-x-1 transition-transform">
          <ChevronLeft size={20} />
        </div>
        Back to Marketplace
      </button>

      {/* Cinematic Header */}
      <header className="relative glass-card rounded-[3.5rem] p-8 md:p-12 shadow-premium overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-16 items-start md:items-center">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[2.5rem] bg-gray-50 dark:bg-navy-900 flex items-center justify-center p-8 shadow-inner border border-gray-100 dark:border-navy-800 shrink-0">
            {drive.logo_path ? (
              <img src={drive.logo_path} alt={drive.company_name} className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-6xl font-black text-blue-600 dark:text-blue-400">{drive.company_name[0]}</span>
            )}
          </div>

          <div className="flex-grow space-y-6">
            <div className="flex flex-wrap gap-2">
              {(tags || []).map((tag, idx) => (
                <span key={idx} className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">
                  {tag.trim()}
                </span>
              ))}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-outfit font-black text-navy-900 dark:text-white tracking-tight">
                {drive.company_name}
              </h1>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
                {drive.job_role}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-sm pt-4 border-t border-gray-100 dark:border-navy-800">
              <div className="flex items-center text-navy-900 dark:text-navy-300">
                <div className="bg-navy-100 dark:bg-navy-800 p-2 rounded-lg mr-3">
                  <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Apply Before</div>
                  <div className="font-black">{drive.deadline || 'OPEN'}</div>
                </div>
              </div>
              <div className="flex items-center text-navy-900 dark:text-navy-300">
                <div className="bg-navy-100 dark:bg-navy-800 p-2 rounded-lg mr-3">
                  <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Location</div>
                  <div className="font-black">{drive.location || 'Global / Remote'}</div>
                </div>
              </div>
              <div className="flex items-center text-navy-900 dark:text-navy-300">
                <div className="bg-navy-100 dark:bg-navy-800 p-2 rounded-lg mr-3">
                  <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type</div>
                  <div className="font-black">{drive.job_type || 'Full-Time / FTE'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-64">
            <button 
              onClick={toggleBookmark}
              className={`flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${
                isBookmarked 
                  ? "bg-navy-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border-2 border-blue-600/30" 
                  : "bg-white dark:bg-navy-900 text-navy-900 dark:text-white border border-gray-200 dark:border-navy-800 hover:border-blue-500"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="mr-2 fill-current" /> : <Bookmark className="mr-2" />}
              {isBookmarked ? "BOOKMARKED" : "SAVE FOR LATER"}
            </button>
            
            <button 
              onClick={handleApply}
              disabled={applicationStatus.applied || applying}
              className={`flex items-center justify-center px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl ${
                applicationStatus.applied 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                  : "bg-navy-900 dark:bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/30"
              }`}
            >
              {applying ? 'PROCESSING...' : applicationStatus.applied ? `APPLICATION ${applicationStatus.status.toUpperCase()}` : 'SUBMIT APPLICATION'}
              {!applicationStatus.applied && !applying && <ArrowRight size={18} className="ml-2" />}
              {applicationStatus.applied && <CheckCircle2 size={18} className="ml-2" />}
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {drive.youtube_link && (
            <div className="glass-card rounded-[3rem] overflow-hidden shadow-premium group">
               <div className="aspect-video relative">
                 <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${drive.youtube_link}`}
                  title="Company Culture Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
               </div>
               <div className="p-8 bg-navy-900 flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <Play size={24} className="text-blue-500 mr-4" />
                    <span className="font-bold tracking-tight">Explore the company life and mission</span>
                  </div>
                  <button className="text-navy-400 hover:text-white transition-colors">
                    <Share2 size={20} />
                  </button>
               </div>
            </div>
          )}

          <article className="glass-card rounded-[3rem] p-10 md:p-16 shadow-premium">
            <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white mb-10 pb-6 border-b border-gray-100 dark:border-navy-900">
              Role Specification & Core Prerequisites
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none 
                            prose-h3:font-black prose-h3:text-navy-900 dark:prose-h3:text-white
                            prose-p:text-gray-600 dark:prose-p:text-navy-300 prose-p:leading-relaxed
                            prose-li:text-gray-600 dark:prose-li:text-navy-300 prose-strong:text-blue-600 dark:prose-strong:text-blue-400">
              <ReactMarkdown>{drive.description}</ReactMarkdown>
            </div>
          </article>
        </div>

        <aside className="space-y-8">
           <div className="sticky top-[122px] space-y-8">
              {/* Placement Kit with Premium Lock */}
              {drive.pdf_path && (
                <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl">
                   <div className={`bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white space-y-6 relative transition-all duration-500 ${!isPremium ? 'blur-md grayscale' : ''}`}>
                      <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                          <Download size={140} />
                      </div>
                      <h3 className="text-2xl font-black leading-tight">Elite Placement<br/>Preparation Kit</h3>
                      <p className="text-blue-100 font-medium">Download the exclusive PDF guide including past year interview questions and HR tips.</p>
                      <a 
                        href={isPremium ? drive.pdf_path : '#'} 
                        download={isPremium} 
                        className={`flex items-center justify-center w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-sm transition-all ${isPremium ? 'hover:shadow-xl' : 'cursor-not-allowed'}`}
                      >
                        ACCESS PDF KIT <Download size={18} className="ml-2" />
                      </a>
                   </div>

                   {!isPremium && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-[2px] text-center space-y-6">
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                          <Lock className="text-white w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-black text-white">Premium Content</h4>
                           <p className="text-xs font-bold text-gray-200">Upgrade your clearance level to unlock elite resources.</p>
                        </div>
                        <button 
                          onClick={subscribe}
                          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center shadow-lg"
                        >
                          <Zap size={14} className="mr-2 fill-current" />
                          Initialize Upgrade
                        </button>
                     </div>
                   )}
                </div>
              )}

              {/* Recruitment Checklist */}
              {checklist.length > 0 && (
                <div className="glass-card rounded-[2.5rem] p-8 shadow-premium space-y-6">
                   <h4 className="text-xl font-outfit font-black text-navy-900 dark:text-white flex items-center">
                     <CheckCircle2 size={20} className="text-emerald-500 mr-2" />
                     Prep Checklist
                   </h4>
                   <ul className="space-y-4">
                      {checklist.map((item, idx) => {
                        const progress = checklistProgress.find(p => p.item_index === idx);
                        const isChecked = progress ? progress.is_checked === 1 : false;
                        
                        return (
                          <li 
                            key={idx} 
                            onClick={() => handleChecklistToggle(idx, isChecked)}
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-lg border-2 transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30' : 'border-gray-200 dark:border-navy-900 group-hover:border-blue-500'} flex items-center justify-center`}>
                                {isChecked && <CheckCircle2 size={12} className="text-white" />}
                              </div>
                              <span className={`text-sm font-bold transition-all ${isChecked ? 'text-navy-300 line-through opacity-50' : 'text-gray-600 dark:text-navy-300 group-hover:text-blue-600'}`}>
                                {item}
                              </span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              isChecked ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-gray-50 dark:bg-navy-900 text-gray-400'
                            }`}>
                              {isChecked ? 'DONE' : 'PENDING'}
                            </span>
                          </li>
                        );
                      })}
                   </ul>
                </div>
              )}

              {drive.deadline && (
                 <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-[2.5rem] p-8 flex items-center space-x-6">
                    <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-500/30">
                      <Clock className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest">Time Remaining</div>
                      <div className="text-navy-900 dark:text-white font-black text-lg">Hurry, Ends Soon!</div>
                    </div>
                 </div>
              )}
           </div>
        </aside>
      </div>
    </div>
  );
};

export default DriveDetail;
