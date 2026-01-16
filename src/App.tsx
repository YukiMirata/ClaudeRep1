import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/layout/Navigation';
import EventManagement from './pages/EventManagement';
import Timeline from './pages/Timeline';
import Settings from './pages/Settings';
import NotificationManager from './components/notifications/NotificationManager';
import { useSettingsStore } from './stores/useSettingsStore';

type Page = 'events' | 'timeline' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('timeline');
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  // Initialize settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventManagement key="events" />;
      case 'timeline':
        return <Timeline key="timeline" />;
      case 'settings':
        return <Settings key="settings" />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Event Manager
              </h1>
              <p className="text-sm text-slate-400 mt-1">Never miss a moment</p>
            </div>
            <div className="flex gap-2">
              <motion.div
                className="h-2 w-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-xs text-slate-400">Active</span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Page content with animations */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Event Notification Popups */}
      <NotificationManager />
    </div>
  );
}

export default App;
