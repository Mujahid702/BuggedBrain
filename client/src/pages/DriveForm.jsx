import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Youtube, 
  Save, 
  ChevronLeft,
  AlertCircle,
  FileUp,
  Settings,
  Plus,
  Trash2,
  MapPin,
  Briefcase
} from 'lucide-react';

const DriveForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    company_name: '',
    job_role: '',
    description: '',
    youtube_link: '',
    deadline: '',
    tags: '',
    is_featured: false,
    location: '',
    job_type: ''
  });

  const [checklistItems, setChecklistItems] = useState([
    'Resume Optimization',
    'DSA Foundations',
    'System Architecture',
    'Behavioral Skills'
  ]);

  const [files, setFiles] = useState({
    placement_kit: null,
    logo: null
  });

  const [previews, setPreviews] = useState({
    logo: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchDriveData();
    }
  }, [id]);

  const fetchDriveData = async () => {
    try {
      const res = await axios.get(`/api/drives/${id}`);
      const data = res.data;
      setFormData({
        company_name: data.company_name,
        job_role: data.job_role,
        description: data.description,
        youtube_link: data.youtube_link ? `https://youtube.com/watch?v=${data.youtube_link}` : '',
        deadline: data.deadline || '',
        tags: data.tags || '',
        is_featured: data.is_featured === 1,
        location: data.location || '',
        job_type: data.job_type || ''
      });
      
      if (data.checklist) {
        try {
          setChecklistItems(JSON.parse(data.checklist));
        } catch (e) {
          console.error("Failed to parse checklist", e);
        }
      }

      if (data.logo_path) {
        setPreviews({ logo: data.logo_path });
      }
    } catch (err) {
      setError('Failed to fetch drive data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
      
      if (name === 'logo') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(uploadedFiles[0]);
      }
    }
  };

  const addChecklistItem = () => {
    setChecklistItems(prev => [...prev, '']);
  };

  const updateChecklistItem = (index, value) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  const removeChecklistItem = (index) => {
    setChecklistItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    submitData.append('checklist', JSON.stringify(checklistItems));

    if (files.placement_kit) {
      submitData.append('placement_kit', files.placement_kit);
    }
    if (files.logo) {
      submitData.append('logo', files.logo);
    }

    try {
      if (isEditMode) {
        await axios.put(`/api/drives/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/drives', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to preserve drive data. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-12">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center text-navy-400 dark:text-navy-400 hover:text-blue-600 font-black tracking-widest text-[10px] uppercase transition-all mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Control Center
          </button>
          <h1 className="text-4xl lg:text-5xl font-outfit font-black text-navy-900 dark:text-white">
            {isEditMode ? 'Modify Mission' : 'Initiate New Drive'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-8 py-4 rounded-[2rem] flex items-center shadow-lg animate-fade-in">
          <AlertCircle size={24} className="mr-4 shrink-0" />
          <span className="font-bold tracking-tight">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12 animate-slide-up">
        {/* Foundation Block */}
        <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-premium space-y-10">
          <div className="flex items-center space-x-4">
             <div className="bg-navy-900 dark:bg-blue-600 p-3 rounded-2xl shadow-lg">
                <Settings className="text-white w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Core Specifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1">Company Identity *</label>
              <input 
                type="text" 
                name="company_name"
                required
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="e.g. Google Cloud"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1">Deployment Role *</label>
              <input 
                type="text" 
                name="job_role"
                required
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.job_role}
                onChange={handleInputChange}
                placeholder="e.g. Solutions Architect"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center">
                <MapPin size={14} className="mr-2 text-blue-500" />
                Mission Location
              </label>
              <input 
                type="text" 
                name="location"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Remote / Hybrid (Bangalore)"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center">
                <Briefcase size={14} className="mr-2 text-indigo-500" />
                Employment Classification
              </label>
              <input 
                type="text" 
                name="job_type"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.job_type}
                onChange={handleInputChange}
                placeholder="e.g. Full-Time / 6 Month Intern"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1">Application Deadline</label>
              <input 
                type="date" 
                name="deadline"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1">Classification Tags</label>
              <input 
                type="text" 
                name="tags"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="FTE, ON-CAMPUS, HYDERABAD"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1">Comprehensive Mission Description (Markdown) *</label>
            <textarea 
              name="description"
              required
              rows={12}
              className="w-full px-8 py-8 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-[2rem] text-navy-900 dark:text-white font-bold outline-none transition-all shadow-inner resize-none font-mono text-sm leading-relaxed"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="# Mission Overview... \n\n### Requirements\n- Point 1"
            />
          </div>

          {/* Checklist Builder */}
          <div className="pt-8 border-t border-gray-100 dark:border-navy-900 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500/10 p-2 rounded-lg">
                    <Settings size={18} className="text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-black text-navy-900 dark:text-white uppercase tracking-widest">Recruitment Prep Checklist</h3>
                </div>
                <button 
                  type="button"
                  onClick={addChecklistItem}
                  className="px-4 py-2 bg-blue-600/10 text-blue-600 rounded-xl text-xs font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center"
                >
                  <Plus size={14} className="mr-2" />
                  Add Step
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="group relative flex items-center">
                    <input 
                      type="text"
                      className="w-full pl-6 pr-12 py-4 bg-gray-50/50 dark:bg-navy-900/40 border border-transparent focus:border-emerald-500/30 rounded-2xl text-navy-900 dark:text-white font-bold outline-none transition-all text-sm"
                      value={item}
                      onChange={(e) => updateChecklistItem(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}...`}
                    />
                    <button 
                      type="button"
                      onClick={() => removeChecklistItem(idx)}
                      className="absolute right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
             </div>
          </div>

          <label className="flex items-center group cursor-pointer w-fit p-4 bg-gray-50 dark:bg-navy-900/30 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all">
            <div className={`w-6 h-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-all ${
              formData.is_featured ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/30' : 'border-gray-200 dark:border-navy-800'
            }`}>
              {formData.is_featured && <X size={12} className="text-white rotate-45" />}
            </div>
            <input 
              type="checkbox" 
              name="is_featured"
              className="hidden"
              checked={formData.is_featured}
              onChange={handleInputChange}
            />
            <span className="text-sm font-black text-navy-900 dark:text-white uppercase tracking-widest">Pin to Featured Slots</span>
          </label>
        </div>

        {/* Assets & Media Block */}
        <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-premium space-y-12">
          <div className="flex items-center space-x-4">
             <div className="bg-navy-900 dark:bg-blue-600 p-3 rounded-2xl shadow-lg">
                <FileUp className="text-white w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black text-navy-900 dark:text-white uppercase tracking-tight">Resources & Multimedia</h2>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center">
                <Youtube size={14} className="mr-2 text-red-500" />
                Live Product/Culture Video
              </label>
              <input 
                type="url" 
                name="youtube_link"
                className="w-full px-8 py-5 bg-gray-50 dark:bg-navy-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl text-navy-900 dark:text-white font-bold outline-none"
                value={formData.youtube_link}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* PDF Kit */}
              <div className="space-y-4">
                <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center">
                  <FileText size={14} className="mr-2 text-blue-500" />
                  PDF Preparation Suite
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="placement_kit"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="kit_upload"
                  />
                  <label 
                    htmlFor="kit_upload"
                    className="flex flex-col items-center justify-center border-[3px] border-dashed border-gray-100 dark:border-navy-900 rounded-[2rem] p-12 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer bg-gray-50/50 dark:bg-navy-900/20 group"
                  >
                    <Upload className="text-gray-300 dark:text-navy-700 group-hover:text-blue-500 mb-4 w-10 h-10 transition-colors" />
                    <span className="text-sm font-black text-navy-900 dark:text-white text-center">
                      {files.placement_kit ? files.placement_kit.name : 'UPLOAD PDF KIT'}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-navy-500 font-bold mt-2 uppercase">PDF only max 10MB</span>
                  </label>
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-4">
                <label className="text-sm font-black text-navy-400 uppercase tracking-widest ml-1 flex items-center">
                  <ImageIcon size={14} className="mr-2 text-emerald-500" />
                  Corporate Identity Logo
                </label>
                <div className="flex gap-6 items-start">
                  <div className="relative flex-grow">
                    <input 
                      type="file" 
                      name="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo_upload"
                    />
                    <label 
                      htmlFor="logo_upload"
                      className="flex flex-col items-center justify-center border-[3px] border-dashed border-gray-100 dark:border-navy-900 rounded-[2rem] p-12 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer bg-gray-50/50 dark:bg-navy-900/20 group"
                    >
                      <Upload className="text-gray-300 dark:text-navy-700 group-hover:text-blue-500 mb-4 w-10 h-10 transition-colors" />
                      <span className="text-sm font-black text-navy-900 dark:text-white text-center truncate max-w-[200px]">
                        {files.logo ? files.logo.name : 'UPLOAD LOGO'}
                      </span>
                    </label>
                  </div>
                  {previews.logo && (
                    <div className="w-40 h-40 rounded-[2rem] border border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-900 p-6 flex items-center justify-center shrink-0 shadow-premium">
                      <img src={previews.logo} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-grow bg-blue-600 text-white py-6 rounded-3xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-500/40 disabled:opacity-50 flex items-center justify-center group"
          >
            {loading ? (
              <div className="w-8 h-8 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                {isEditMode ? 'COMMIT CHANGES' : 'DEPLOY DRIVE MISSION'}
              </>
            )}
          </button>
          <button 
           type="button"
           onClick={() => navigate('/admin')}
           className="px-12 bg-white dark:bg-navy-900 text-navy-900 dark:text-white border border-gray-200 dark:border-navy-800 rounded-3xl font-black hover:bg-gray-50 dark:hover:bg-navy-800 transition-all"
          >
           CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriveForm;
