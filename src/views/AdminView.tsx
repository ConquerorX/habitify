import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import InfoTooltip from '../components/InfoTooltip';
import {
  Users,
  Activity,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  Calendar,
  Flame,
  Target
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  habitCount: number;
}

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  habits: Array<{
    id: string;
    title: string;
    category: string;
    frequency: string;
    completedDates: string[];
    createdAt: string;
  }>;
}

interface Stats {
  totalUsers: number;
  totalHabits: number;
  completedToday: number;
  activeUsers: number;
}

const AdminView = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { token, startImpersonation } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${ADMIN_API_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!usersRes.ok || !statsRes.ok) {
        throw new Error('Admin verilerine erişilemedi');
      }

      const [usersData, statsData] = await Promise.all([
        usersRes.json(),
        statsRes.json()
      ]);

      setUsers(usersData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (userId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${ADMIN_API_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Kullanıcı detayları alınamadı');

      const data = await res.json();
      setSelectedUser(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImpersonate = async (userId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${ADMIN_API_URL}/users/${userId}/impersonate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Görüntüleme başlatılamadı');

      const { token: impToken, user } = await res.json();
      startImpersonation(impToken, user);
      setSelectedUser(null);
      // Navigate to dashboard after impersonation
      if (onNavigate) onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${ADMIN_API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Kullanıcı silinemedi');

      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error glass">
        <AlertTriangle size={48} />
        <h3>Hata</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Admin Paneli</h1>
          <p>Kullanıcıları ve istatistikleri yönetin</p>
        </motion.div>
      </header>

      {/* Stats Cards */}
      {stats && (
        <section className="stats-grid">
          <motion.div
            className="stat-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon users-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalUsers}</span>
              <span className="stat-label">Toplam Kullanıcı</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon habits-icon">
              <Target size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalHabits}</span>
              <span className="stat-label">Toplam Alışkanlık</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon completed-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.completedToday}</span>
              <span className="stat-label">Bugün Tamamlanan</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon active-icon">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="stat-value">{stats.activeUsers}</span>
                <InfoTooltip text="Son 24 saat içinde en az bir alışkanlığını tamamlayan kullanıcı sayısı." />
              </div>
              <span className="stat-label">Aktif Kullanıcı</span>
            </div>
          </motion.div>
        </section>
      )}

      <section className="users-section glass">
        <div className="section-header">
          <h3>Kullanıcılar</h3>
          <span className="badge">{users.length} kullanıcı</span>
        </div>

        <div className="users-table-container">
          <div className="table-header desktop-only">
            <span>Kullanıcı</span>
            <span>Alışkanlık</span>
            <span>Kayıt Tarihi</span>
            <span>İşlemler</span>
          </div>

          <div className="table-body">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                className="table-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="user-cell">
                  <div className="user-avatar-small">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.name || 'İsimsiz'}</span>
                    <span className="user-email">{user.email}</span>
                    {user.isAdmin && <span className="admin-badge">Admin</span>}
                  </div>
                </div>

                <div className="mobile-stats-row mobile-only">
                  <div className="mobile-stat">
                    <span className="stat-label">Alışkanlık</span>
                    <span className="habit-count">{user.habitCount}</span>
                  </div>
                  <div className="mobile-stat">
                    <span className="stat-label">Kayıt</span>
                    <span className="date-cell-mobile">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="habit-cell desktop-only">
                  <span className="habit-count">{user.habitCount}</span>
                </div>
                <div className="date-cell desktop-only">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </div>
                <div className="actions-cell">
                  <button
                    className="action-btn view-btn"
                    onClick={() => fetchUserDetail(user.id)}
                    title="Detayları Gör"
                  >
                    <Eye size={16} />
                    <span className="mobile-only">Detay</span>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => setDeleteConfirm(user.id)}
                    title="Sil"
                    disabled={user.isAdmin}
                  >
                    <Trash2 size={16} />
                    <span className="mobile-only">Sil</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="modal-content glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedUser(null)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <div className="modal-avatar">
                  {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <h2>{selectedUser.name || 'İsimsiz Kullanıcı'}</h2>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="modal-stats">
                <div className="modal-stat">
                  <Calendar size={16} />
                  <span>Kayıt: {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="modal-stat">
                  <Target size={16} />
                  <span>{selectedUser.habits.length} alışkanlık</span>
                </div>
              </div>

              <button
                className="btn btn-primary impersonate-btn"
                onClick={() => handleImpersonate(selectedUser.id)}
              >
                <Eye size={18} />
                Kullanıcıyı Gör
              </button>

              {selectedUser.habits.length > 0 && (
                <div className="habits-list">
                  <h4>Alışkanlıklar</h4>
                  {selectedUser.habits.map(habit => (
                    <div key={habit.id} className="habit-item">
                      <div className="habit-info">
                        <span className="habit-title">{habit.title}</span>
                        <span className="habit-category">{habit.category}</span>
                      </div>
                      <div className="habit-meta">
                        <Flame size={14} />
                        <span>{habit.completedDates.length} gün</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="modal-content glass delete-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-icon">
                <AlertTriangle size={48} />
              </div>
              <h3>Kullanıcıyı Sil</h3>
              <p>Bu kullanıcı ve tüm alışkanlıkları kalıcı olarak silinecek. Bu işlem geri alınamaz.</p>
              <div className="delete-actions">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  İptal
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-header p {
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .admin-loading, .admin-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: 400px;
          color: var(--text-secondary);
        }

        .admin-error {
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
        }

        .admin-error h3 {
          margin-top: 0.5rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .users-icon { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
        .habits-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .completed-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .active-icon { background: rgba(236, 72, 153, 0.15); color: #ec4899; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .users-section {
          padding: 1.5rem;
          border-radius: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .badge {
          background: rgba(var(--accent-primary-rgb), 0.1);
          color: var(--accent-primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .users-table {
          overflow-x: auto;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
        }

        .table-header {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.2s;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .user-name {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 2px;
          color: white;
        }

        .habit-count {
          font-weight: 600;
          color: var(--accent-primary);
        }

        .date-cell {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-btn {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .view-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .delete-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
        }

        .delete-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          padding: 2rem;
          border-radius: 24px;
          position: relative;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          box-shadow: var(--card-shadow);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          color: white;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .modal-header p {
          margin: 4px 0 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .modal-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .modal-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .impersonate-btn {
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .habits-list {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .habits-list h4 {
          margin: 0 0 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .habit-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--card-bg-elevated);
          border-radius: 12px;
          margin-bottom: 0.5rem;
        }

        .habit-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .habit-title {
          font-weight: 500;
        }

        .habit-category {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .habit-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ff4500;
          font-size: 0.85rem;
        }

        /* Delete Modal */
        .delete-modal {
          text-align: center;
          max-width: 400px;
        }

        .delete-icon {
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .delete-modal h3 {
          margin: 0 0 0.5rem;
        }

        .delete-modal p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .delete-actions {
          display: flex;
          gap: 1rem;
        }

        .delete-actions .btn {
          flex: 1;
        }

        .btn-secondary {
          background: var(--btn-secondary-bg);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .desktop-only { display: block; }
        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .stat-card {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-value {
            font-size: 1.4rem;
          }

          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            border-radius: 20px;
            margin-bottom: 1.25rem;
            background: var(--card-bg-elevated);
          }

          .mobile-stats-row {
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
          }

          .mobile-stat {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .mobile-stat .stat-label {
            font-size: 0.65rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .actions-cell {
            width: 100%;
            gap: 1rem;
            margin-top: 0.25rem;
            justify-content: center;
          }

          .action-btn {
            flex: 1;
            height: 44px;
            width: auto;
            gap: 8px;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .modal-content {
            padding: 1.5rem;
            border-radius: 20px;
          }

          .modal-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminView;
