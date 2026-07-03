import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/i18n';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import ServerDashboard from './pages/ServerDashboard';
import PlayerProfile from './pages/PlayerProfile';
import NotFound from './pages/NotFound';
import ComparePlayers from './pages/ComparePlayers';
import BlockIndex from './pages/BlockIndex';
import PlayerIndex from './pages/PlayerIndex';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import GlobalStats from './pages/GlobalStats';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/server/:slug" element={<ServerDashboard />} />
      <Route path="/server/:slug/player/:playerName" element={<PlayerProfile />} />
      <Route path="/server/:slug/compare" element={<ComparePlayers />} />
      <Route path="/server/:slug/blocks" element={<BlockIndex />} />
      <Route path="/server/:slug/players" element={<PlayerIndex />} />
      <Route path="/server/:slug/projects" element={<Projects />} />
      <Route path="/server/:slug/project/:projectSlug" element={<ProjectDetail />} />
      <Route path="/global-stats" element={<GlobalStats />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App