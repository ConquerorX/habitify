import { useState } from 'react';
import { Home, List, PieChart, Settings, Plus, LogOut, User as UserIcon, Shield, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, impersonation, stopImpersonation } = useAuth();

  return (
    <div className={`layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Impersonation Banner */}
      {impersonation.isImpersonating && (
        <div className="impersonation-banner">
          <div className="banner-content">
            <div className="banner-user">
              <Eye size={16} className="banner-icon" />
              <span className="banner-text">
                <strong>{user?.name || 'İsimsiz'}</strong>
                <span className="banner-email">{user?.email}</span>
              </span>
            </div>
            <button className="banner-exit-btn" onClick={stopImpersonation} title="Çıkış Yap">
              <X size={18} />
              <span>Çıkış</span>
            </button>
          </div>
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
      <nav className={`sidebar glass ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="logo">
            <h2 className="title-gradient">{isCollapsed ? 'H' : 'Habitify'}</h2>
          </div>
          <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Genişlet' : 'Daralt'}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="nav-items">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<List size={20} />}
            label="Alışkanlıklar"
            active={activeTab === 'habits'}
            onClick={() => setActiveTab('habits')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<PieChart size={20} />}
            label="İstatistikler"
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Ayarlar"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            collapsed={isCollapsed}
          />
          {user?.isAdmin && !impersonation.isImpersonating && (
            <NavItem
              icon={<Shield size={20} />}
              label="Admin"
              active={activeTab === 'admin'}
              onClick={() => setActiveTab('admin')}
              collapsed={isCollapsed}
            />
          )}
        </div>

        <button className="btn btn-primary add-habit-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={20} />
          {!isCollapsed && <span>Yeni Alışkanlık</span>}
        </button>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <UserIcon size={18} />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{user?.name || 'Kullanıcı'}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={logout} title="Çıkış Yap">
            <LogOut size={18} />
            {!isCollapsed && <span>Çıkış Yap</span>}
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
        {user?.isAdmin && !impersonation.isImpersonating && (
          <div className={`bottom-nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
            <Shield size={24} />
            <span>Admin</span>
          </div>
        )}
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
          --sidebar-width: 280px;
        }

        .layout.sidebar-collapsed {
          --sidebar-width: 80px;
        }

        .impersonation-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: rgba(99, 102, 241, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: white;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
        }

        .banner-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .banner-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .banner-icon {
          color: rgba(255, 255, 255, 0.9);
          flex-shrink: 0;
        }

        .banner-text {
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .banner-email {
          opacity: 0.7;
          font-size: 0.75rem;
          font-weight: 400;
        }

        .banner-exit-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .banner-exit-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .banner-exit-btn:active {
          transform: translateY(0);
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
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 100;
          transition: width 0.3s ease;
          overflow: hidden;
        }

        .sidebar.collapsed {
          padding: 1rem;
        }

        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .sidebar.collapsed .sidebar-top {
          justify-content: center;
        }

        .sidebar.collapsed .logo h2 {
          font-size: 1.5rem;
        }

        .collapse-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .sidebar.collapsed .collapse-btn {
          display: none;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .sidebar.collapsed:hover .collapse-btn {
          display: flex;
        }

        .layout:has(.impersonation-banner) .sidebar {
          top: 40px;
          height: calc(100vh - 40px);
        }

        .layout:has(.impersonation-banner) .content {
          padding-top: calc(2.5rem + 40px);
        }

        .mobile-header.with-banner {
          top: 40px;
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
          margin-left: var(--sidebar-width);
          flex: 1;
          padding: 2.5rem;
          min-height: 100vh;
          width: 100%;
          transition: margin-left 0.3s ease;
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
          white-space: nowrap;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 0.75rem;
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
          justify-content: center;
        }

        .sidebar.collapsed .add-habit-btn {
          padding: 0.75rem;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar.collapsed .user-profile {
          justify-content: center;
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
          flex-shrink: 0;
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
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar.collapsed .logout-btn {
          padding: 0.75rem;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 1024px) {
          .layout { --sidebar-width: 240px; }
          .layout.sidebar-collapsed { --sidebar-width: 70px; }
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
            transition: none;
          }

          .layout:has(.impersonation-banner) .content {
            padding-top: calc(80px + 40px);
          }

          .layout:has(.impersonation-banner) .mobile-header {
            top: 40px;
          }

          .banner-email {
            display: none;
          }

          .banner-text {
            font-size: 0.8rem;
          }

          .banner-exit-btn span {
            display: none;
          }

          .banner-exit-btn {
            padding: 4px;
            border-radius: 6px;
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
  collapsed?: boolean;
}

const NavItem = ({ icon, label, active, onClick, collapsed }: NavItemProps) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} title={collapsed ? label : undefined}>
    {icon}
    {!collapsed && <span className="label">{label}</span>}
  </div>
);

export default Layout;
