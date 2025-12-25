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
      <nav className="sidebar glass">
        <div className="logo">
          <h2 className="title-gradient">Habitify</h2>
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
            label="My Habits"
            active={activeTab === 'habits'}
            onClick={() => setActiveTab('habits')}
          />
          <NavItem
            icon={<PieChart size={20} />}
            label="Statistics"
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
        <button className="btn btn-primary add-habit-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={20} />
          <span>New Habit</span>
        </button>
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
        .content {
          margin-left: 280px;
          flex: 1;
          padding: 2rem;
          min-height: 100vh;
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
          background: rgba(var(--accent-primary-rgb, 139, 92, 246), 0.1);
          color: var(--accent-primary);
        }
        .add-habit-btn {
          margin-top: auto;
          width: 100%;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 80px;
            padding: 1.5rem 0.5rem;
          }
          .sidebar .label, .sidebar h2, .sidebar span {
            display: none;
          }
          .content {
            margin-left: 80px;
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
