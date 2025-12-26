import { useState } from 'react';
import Layout from './components/Layout';
import type { TabType } from './components/Layout';
import DashboardView from './views/DashboardView';
import HabitsView from './views/HabitsView';
import StatsView from './views/StatsView';
import SettingsView from './views/SettingsView';
import AdminView from './views/AdminView';
import AuthView from './views/AuthView';
import { useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1 className="title-gradient">Habitify</h1>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'habits': return <HabitsView />;
      case 'stats': return <StatsView />;
      case 'settings': return <SettingsView />;
      case 'admin': return <AdminView />;
      default: return <DashboardView />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
