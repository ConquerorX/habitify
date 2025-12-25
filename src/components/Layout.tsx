import { useState } from 'react';
import { Home, List, PieChart, Settings, Plus } from 'lucide-react';
import HabitForm from './HabitForm';

export type TabType = 'dashboard' | 'habits' | 'stats' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="layout">
      {/* Mobile Top Header */}
      <header className="mobile-header glass">
        <h2 className="title-gradient">Hilal-ify ♥</h2>
        <button className="mobile-add-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={24} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <nav className="sidebar glass">
        <div className="logo">
          <h2 className="title-gradient">Hilal-ify ♥</h2>
        </div>
        <div className="nav-items">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem
            icon={<List size={20} />}
            label="Alışkanlıklar"
            active={activeTab === 'habits'}
            onClick={() => setActiveTab('habits')}
          />
          <NavItem
            icon={<PieChart size={20} />}
            label="İstatistikler"
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Ayarlar"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
        <button className="btn btn-primary add-habit-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={20} />
          <span>Yeni Alışkanlık</span>
        </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav glass">
        <div className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Home size={24} />
          <span>Giriş</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveTab('habits')}>
          <List size={24} />
          <span>Liste</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <PieChart size={24} />
          <span>Analiz</span>
        </div>
        <div className={`bottom-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={24} />
          <span>Ayarlar</span>
        </div>
      </nav>

      <main className="content">
        {children}
      </main>

      {isFormOpen && <HabitForm onClose={() => setIsFormOpen(false)} />}

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-color);
        }
        
        .mobile-header {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 60px;
          padding: 0 1.5rem;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-add-btn {
          background: var(--accent-primary);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb), 0.3);
        }

        .sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          z-index: 100;
        }

        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 70px;
          padding: 0 1rem;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          border-top: 1px solid var(--border-color);
          padding-bottom: env(safe-area-inset-bottom);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .bottom-nav-item span {
          font-size: 0.7rem;
          font-weight: 500;
        }

        .bottom-nav-item.active {
          color: var(--accent-primary);
        }

        .content {
          margin-left: 280px;
          flex: 1;
          padding: 2.5rem;
          min-height: 100vh;
          width: 100%;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(var(--accent-primary-rgb), 0.1);
          color: var(--accent-primary);
        }

        .add-habit-btn {
          margin-top: auto;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .sidebar { width: 240px; }
          .content { margin-left: 240px; }
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-header { display: flex; }
          .bottom-nav { display: flex; }
          .content {
            margin-left: 0;
            padding: 1rem;
            padding-top: 80px;
            padding-bottom: 90px;
          }
        }
      `}</style>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span className="label">{label}</span>
  </div>
);

export default Layout;
