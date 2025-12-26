import { useState } from 'react';
import { Home, List, PieChart, Settings, Plus, LogOut, User as UserIcon, Shield, X } from 'lucide-react';
import HabitForm from './HabitForm';
import { useAuth } from '../context/AuthContext';

export type TabType = 'dashboard' | 'habits' | 'stats' | 'settings' | 'admin';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user, logout, impersonation, stopImpersonation } = useAuth();

  return (
    <div className="layout">
      {/* Impersonation Banner */}
      {impersonation.isImpersonating && (
        <div className="impersonation-banner">
          <span>👁️ {user?.name || user?.email} olarak görüntülüyorsunuz</span>
          <button onClick={stopImpersonation}>
            <X size={16} />
            Çıkış
          </button>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className={`mobile-header glass ${impersonation.isImpersonating ? 'with-banner' : ''}`}>
        <h2 className="title-gradient">Habitify</h2>
        <div className="mobile-header-actions">
          <button className="mobile-add-btn" onClick={() => setIsFormOpen(true)}>
            <Plus size={24} />
          </button>
          <button className="logout-btn-minimal" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
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
          {user?.isAdmin && !impersonation.isImpersonating && (
            <NavItem
              icon={<Shield size={20} />}
              label="Admin"
              active={activeTab === 'admin'}
              onClick={() => setActiveTab('admin')}
            />
          )}
        </div>
        <button className="btn btn-primary add-habit-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={20} />
          <span>Yeni Alışkanlık</span>
        </button>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <UserIcon size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Kullanıcı'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Çıkış Yap</span>
          </button>
        </div>
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
          flex-direction: column;
        }

        .impersonation-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 44px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          z-index: 1000;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .impersonation-banner button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
        }

        .impersonation-banner button:hover {
          background: rgba(255, 255, 255, 0.3);
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

        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logout-btn-minimal {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 8px;
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

        .layout:has(.impersonation-banner) .sidebar {
          top: 44px;
          height: calc(100vh - 44px);
        }

        .layout:has(.impersonation-banner) .content {
          padding-top: calc(2.5rem + 44px);
        }

        .mobile-header.with-banner {
          top: 44px;
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
          width: 100%;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(var(--accent-primary-rgb), 0.1);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.7rem;
          color: var(--text-secondary);
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
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
