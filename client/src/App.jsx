import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DriveDetail from './pages/DriveDetail';
import AdminDashboard from './pages/AdminDashboard';
import DriveForm from './pages/DriveForm';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import RoadmapPage from './pages/RoadmapPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Rocket, Heart } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen transition-colors duration-500 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/drive/:id" element={<DriveDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            } />

            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />

            <Route path="/roadmap" element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/new" element={
              <ProtectedRoute adminOnly>
                <DriveForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit/:id" element={
              <ProtectedRoute adminOnly>
                <DriveForm />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <footer className="mt-20 border-t border-gray-100 dark:border-navy-900 bg-white/50 dark:bg-navy-950/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-lg">
                <img src="/logo.png" alt="BuggedBrain" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-outfit font-black text-navy-900 dark:text-white">
                BuggedBrain
              </span>
            </div>
            
            <p className="text-gray-500 dark:text-navy-400 text-sm font-bold flex items-center">
              Designed and built with <Heart size={14} className="mx-2 text-red-500 fill-red-500" /> for the student community.
            </p>
            
            <div className="text-gray-400 dark:text-navy-500 text-xs font-black uppercase tracking-widest">
              © {new Date().getFullYear()} BUGGEDBRAIN SYSTEM v2.0
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
