import { Link } from 'react-router-dom';
import { Calendar, Tag, ChevronRight, Star, ExternalLink, Clock } from 'lucide-react';

const DriveCard = ({ drive }) => {
  const isExpired = drive.deadline && new Date(drive.deadline) < new Date();
  const isUrgent = drive.deadline && !isExpired && (new Date(drive.deadline) - new Date()) < (3 * 24 * 60 * 60 * 1000); // 3 days
  const tags = drive.tags ? drive.tags.split(',') : [];

  return (
    <div className="group relative glass-card rounded-[2rem] p-6 hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-fade-in">
      {/* Featured Badge */}
      {drive.is_featured === 1 && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-navy-950 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform">
          <Star size={12} className="mr-1 fill-navy-950" />
          FEATURED
        </div>
      )}

      {/* Card Header: Logo & Name */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 dark:bg-navy-800 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
          {drive.logo_path ? (
            <img src={drive.logo_path} alt={drive.company_name} className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{drive.company_name[0]}</span>
          )}
        </div>
        
        {isUrgent && (
           <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center animate-pulse">
             <Clock size={12} className="mr-1" />
             ENDS SOON
           </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-outfit font-bold text-navy-900 dark:text-white line-clamp-1">
          {drive.company_name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide line-clamp-1 uppercase">
          {drive.job_role}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 min-h-[60px]">
        {tags.slice(0, 3).map((tag, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-lg tracking-wider"
          >
            {tag.trim()}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-3 py-1 bg-gray-50 dark:bg-navy-900 text-gray-400 text-[10px] font-bold rounded-lg border border-dashed border-gray-200 dark:border-navy-800">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 dark:text-navy-400 font-black uppercase tracking-widest">Deadline</span>
          <div className={`flex items-center text-sm font-bold ${isExpired ? 'text-red-500' : 'text-navy-900 dark:text-gray-300'}`}>
            <Calendar size={14} className="mr-1.5 opacity-50" />
            {drive.deadline || 'OPEN'}
          </div>
        </div>
        
        <Link 
          to={`/drive/${drive.id}`} 
          className="w-12 h-12 bg-navy-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all hover:rotate-90 duration-500"
        >
          <ChevronRight size={24} />
        </Link>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
    </div>
  );
};

export default DriveCard;
