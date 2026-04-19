import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Youtube, 
  FileText, 
  ExternalLink, 
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Map as MapIcon
} from 'lucide-react';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await axios.get('/api/profile');
      if (!res.data.roadmap) {
        navigate('/onboarding');
      } else {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching roadmap', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = async (stepId) => {
    const isCurrentlyCompleted = data.progress[stepId];
    setUpdating(true);
    try {
      await axios.post('/api/profile/progress', {
        step_id: stepId,
        is_completed: !isCurrentlyCompleted
      });
      // Optimistic update
      setData(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          [stepId]: !isCurrentlyCompleted
        }
      }));
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Personalizing your path...</p>
      </div>
    );
  }

  const { roadmap, profile, progress } = data;
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const totalSteps = roadmap.steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-navy-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-grow">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} />
              <span>Personalized Path Generated</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-outfit font-black mb-4 leading-tight">
              Roadmap to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{profile.preferred_role}</span>
            </h1>
            <p className="text-indigo-200/80 font-medium text-lg max-w-2xl">
              Success isn't accidental. It's built step by step. We've crafted this path based on your {profile.level} level and goal to {profile.goal}.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (364.4 * progressPercentage) / 100}
                  className="transition-all duration-1000 ease-in-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{progressPercentage}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Complete</span>
              </div>
            </div>
            <Link 
              to="/onboarding"
              className="text-indigo-300 hover:text-white transition-colors text-sm font-bold flex items-center group"
            >
              Update Preferences
              <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-100 dark:bg-navy-900 -translate-x-1/2 rounded-full" />

        <div className="space-y-16">
          {roadmap.steps.map((step, index) => {
            const isCompleted = progress[step.id];
            const isAccessible = index === 0 || progress[roadmap.steps[index - 1].id];

            return (
              <div key={step.id} className={`relative pl-24 group transition-all duration-500 ${!isAccessible ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                {/* Step Marker */}
                <button
                  onClick={() => isAccessible && handleToggleProgress(step.id)}
                  disabled={!isAccessible || updating}
                  className={`absolute left-8 -translate-x-1/2 w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                    isCompleted 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 scale-110' 
                    : isAccessible 
                      ? 'bg-white dark:bg-navy-950 border-4 border-indigo-600 text-indigo-600 shadow-xl' 
                      : 'bg-gray-200 dark:bg-navy-900 border-4 border-gray-300 dark:border-navy-800 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                {/* Content Card */}
                <div className={`bg-white dark:bg-navy-950 rounded-3xl p-8 border hover:border-indigo-500/50 transition-all duration-500 shadow-lg shadow-navy-100/20 dark:shadow-none ${
                    isCompleted ? 'border-green-100 dark:border-green-900/30' : 'border-gray-100 dark:border-navy-900'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-2xl font-outfit font-black text-navy-900 dark:text-white mb-2 flex items-center">
                        {step.title}
                        {isCompleted && <span className="ml-3 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg uppercase tracking-widest leading-none">Completed</span>}
                      </h3>
                      <p className="text-gray-500 dark:text-navy-400 font-medium">
                        {step.description}
                      </p>
                    </div>
                    {!isAccessible && (
                      <div className="flex items-center text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl">
                        <Lock size={14} className="mr-2" />
                        LOCKED
                      </div>
                    )}
                  </div>

                  {/* Resources */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-2xl bg-gray-50 dark:bg-navy-900/50 hover:bg-gray-100 dark:hover:bg-navy-900 transition-all group/res border border-transparent hover:border-gray-200 dark:hover:border-navy-800"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all ${
                          res.type === 'YouTube' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {res.type === 'YouTube' ? <Youtube size={24} /> : <FileText size={24} />}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <h4 className="font-bold text-navy-900 dark:text-white text-sm truncate">{res.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{res.type} Resource</span>
                        </div>
                        <ExternalLink size={16} className="text-gray-300 group-hover/res:text-indigo-600 transition-colors ml-2" />
                      </a>
                    ))}
                    
                    {/* Related Drives */}
                    {step.drives && step.drives.map((drive, i) => (
                      <Link
                        key={i}
                        to={`/drive/${drive.id}`}
                        className="flex items-center p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group/drive border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-950 flex items-center justify-center mr-4 shadow-sm">
                          {drive.logo_path ? (
                            <img src={drive.logo_path} alt="" className="w-8 h-8 object-contain" />
                          ) : (
                            <MapIcon size={24} className="text-indigo-600" />
                          )}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <h4 className="font-bold text-navy-900 dark:text-white text-sm truncate">{drive.company_name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{drive.job_role}</span>
                        </div>
                        <ChevronRight size={16} className="text-indigo-400 group-hover/drive:translate-x-1 transition-transform ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Banner */}
      <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-indigo-500/20">
        <TrendingUp size={48} className="mx-auto mb-6 opacity-30" />
        <h2 className="text-2xl font-outfit font-black mb-2">Consistency is the game changer.</h2>
        <p className="text-indigo-100 font-medium mb-0">
          Check off your progress every day to stay on track. Small wins lead to big results.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
