import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Target, 
  Cpu, 
  Clock, 
  Zap,
  Code2,
  Database,
  Globe,
  BrainCircuit
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Your Level', icon: Zap },
  { id: 2, title: 'Desired Role', icon: Target },
  { id: 3, title: 'Current Skills', icon: Cpu },
  { id: 4, title: 'Your Goal', icon: Rocket }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    level: 'Beginner',
    preferred_role: 'Full Stack Developer',
    skills: [],
    goal: 'Crack product-based companies',
    time_availability: '1–3 months'
  });

  const skillOptions = [
    'DSA', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'Python', 'Java', 'System Design'
  ];

  const roleOptions = [
    { label: 'Full Stack Developer', icon: Globe },
    { label: 'Backend Developer', icon: Database },
    { label: 'Data Scientist', icon: BrainCircuit },
    { label: 'Other', icon: Code2 }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/profile', formData);
      navigate('/roadmap');
    } catch (err) {
      console.error('Failed to save profile', err);
      alert('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Progress Stepper */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-navy-900 -translate-y-1/2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${
                    isActive 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-110' 
                    : 'bg-white dark:bg-navy-950 text-gray-400 border-2 border-gray-100 dark:border-navy-900'
                  } ${isCurrent ? 'ring-4 ring-indigo-500/10' : ''}`}
                >
                  <Icon size={20} />
                </div>
                <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-navy-950 rounded-3xl p-8 md:p-12 shadow-2xl shadow-navy-100/50 dark:shadow-none border border-gray-100 dark:border-navy-900/50 min-h-[400px] flex flex-col">
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white mb-2">What's your current level?</h2>
            <p className="text-gray-500 dark:text-navy-400 mb-8 font-medium">Be honest! This helps us tailor the foundation of your roadmap.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFormData({ ...formData, level: lvl })}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left relative group ${
                    formData.level === lvl 
                    ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' 
                    : 'border-gray-100 dark:border-navy-900 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    formData.level === lvl ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-navy-900 text-gray-500'
                  }`}>
                    {lvl === 'Beginner' ? <Zap size={24} /> : lvl === 'Intermediate' ? <Zap size={24} /> : <Zap size={24} />}
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">{lvl}</h3>
                  <p className="text-sm text-gray-500 dark:text-navy-400 leading-relaxed">
                    {lvl === 'Beginner' && 'Just starting out. Need a solid foundation.'}
                    {lvl === 'Intermediate' && 'Good basics. Ready for advanced topics.'}
                    {lvl === 'Advanced' && 'Expert. Focus on mock interviews.'}
                  </p>
                  {formData.level === lvl && (
                    <div className="absolute top-4 right-4 text-indigo-600">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white mb-2">What is your dream role?</h2>
            <p className="text-gray-500 dark:text-navy-400 mb-8 font-medium">We'll map skills and drives specifically for this career path.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roleOptions.map(role => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.label}
                    onClick={() => setFormData({ ...formData, preferred_role: role.label })}
                    className={`flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left relative group ${
                      formData.preferred_role === role.label 
                      ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' 
                      : 'border-gray-100 dark:border-navy-900 hover:border-indigo-400'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl mr-6 flex items-center justify-center transition-all ${
                      formData.preferred_role === role.label ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-navy-900 text-gray-500'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white">{role.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-navy-400">Curated path for this career</p>
                    </div>
                    {formData.preferred_role === role.label && (
                      <div className="absolute top-4 right-4 text-indigo-600">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white mb-2">Technical Skills</h2>
            <p className="text-gray-500 dark:text-navy-400 mb-8 font-medium">Select the skills you already know. We'll focus on what's missing.</p>
            <div className="flex flex-wrap gap-4">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-6 py-4 rounded-xl border-2 font-bold transition-all duration-300 flex items-center gap-3 ${
                    formData.skills.includes(skill)
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                    : 'border-gray-100 dark:border-navy-900 text-gray-600 dark:text-navy-400 hover:border-indigo-400'
                  }`}
                >
                  {formData.skills.includes(skill) && <CheckCircle2 size={18} />}
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-outfit font-black text-navy-900 dark:text-white mb-2">Final Details</h2>
            <p className="text-gray-500 dark:text-navy-400 mb-8 font-medium">Almost there! Tell us your primary goal and timeline.</p>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mb-4">Ultimate Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Crack product-based companies', 'Get internship', 'Off-campus placement'].map(goal => (
                    <button
                      key={goal}
                      onClick={() => setFormData({ ...formData, goal })}
                      className={`px-6 py-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                        formData.goal === goal
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-100 dark:border-navy-900 text-gray-600 dark:text-navy-400'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mb-4">Time Availability</label>
                <div className="flex bg-gray-100 dark:bg-navy-900 p-1.5 rounded-2xl">
                  {['< 1 month', '1–3 months', '3+ months'].map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, time_availability: time })}
                      className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                        formData.time_availability === time
                        ? 'bg-white dark:bg-navy-800 text-indigo-600 shadow-sm'
                        : 'text-gray-500 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
                      }`}
                    >
                      <Clock size={16} className="inline-block mr-2 -mt-0.5" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-auto pt-12 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center font-bold px-6 py-3 rounded-xl transition-all ${
              currentStep === 1 
              ? 'opacity-0 cursor-default' 
              : 'text-gray-500 dark:text-navy-400 hover:bg-gray-100 dark:hover:bg-navy-900'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={loading}
            className="group flex items-center bg-navy-900 dark:bg-white text-white dark:text-navy-900 font-bold px-10 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-navy-200 dark:shadow-none"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-3" />
            ) : (
              <>
                {currentStep === steps.length ? 'Generate My Roadmap' : 'Continue'}
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
