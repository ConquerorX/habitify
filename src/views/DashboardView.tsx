import { CheckCircle2, Flame, Award, Trash2, Play, Clock, Edit2, Plus, Minus } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import type { Habit } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import InfoTooltip from '../components/InfoTooltip';
import { useState } from 'react';
import HabitForm from '../components/HabitForm';
import ProfileBar from '../components/ProfileBar';

const DashboardView = () => {
  const { habits, toggleHabit, deleteHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const completedToday = habits.filter(h => {
    const entry = h.completedDates.find(e => typeof e === 'string' ? e === today : e.date === today);
    if (!entry) return false;
    if (h.isQuantity) {
      const val = typeof entry === 'string' ? 0 : entry.value;
      return val >= (h.goalValue || 0);
    }
    return true;
  }).length;
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const allCompletedEntries = habits.flatMap(h => h.completedDates);
  const allCompletedDates = Array.from(new Set(allCompletedEntries.map(e => typeof e === 'string' ? e : e.date))).sort((a, b) => b.localeCompare(a));

  const calculateOverallStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;
    const t = new Date().toISOString().split('T')[0];
    const y = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    if (dates[0] !== t && dates[0] !== y) return 0;
    let streak = 0;
    let checkDate = new Date(dates[0]);
    for (const d of dates) {
      const date = new Date(d);
      if (Math.abs(checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 1) {
        streak++;
        checkDate = date;
      } else break;
    }
    return streak;
  };

  const overallStreak = calculateOverallStreak(allCompletedDates);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header flex justify-between items-center mb-8">
        <div className="greeting">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Merhaba, {habits.find(h => h.id)?.id ? 'Tekrar Hoş Geldin' : 'Bugün Harika Bir Gün!'}
          </h1>
          <p className="text-gray-400 mt-1">Hadi hedeflerine bir adım daha yaklaşalım.</p>
        </div>
        <div className="streak-stats glass flex gap-6 p-4 rounded-3xl">
          <div className="stat-item">
            <Flame className={`${overallStreak > 0 ? 'active-flame' : 'text-gray-500'}`} size={24} />
            <div className="stat-info">
              <span className="stat-value">{overallStreak}</span>
              <span className="stat-label">Seri</span>
            </div>
            <InfoTooltip text="Art arda kaç gündür en az bir alışkanlığınızı tamamladığınızı gösterir." position="bottom" />
          </div>
          <div className="stat-item border-l border-white/10 pl-6">
            <Award className="text-yellow-500" size={24} />
            <div className="stat-info">
              <span className="stat-value">%{Math.round(progress)}</span>
              <span className="stat-label">Başarı</span>
            </div>
            <InfoTooltip text="Bugünkü alışkanlıklarınızın ne kadarını tamamladığınızı gösterir." position="bottom" />
          </div>
        </div>
      </header>

      <ProfileBar />

      {editingHabit && (
        <HabitForm
          initialData={editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}

      <section className="progress-section glass mb-8">
        <div className="progress-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0 }}>İlerlemen</h3>
            <InfoTooltip text="Bugün için planladığınız tüm alışkanlıklara göre toplam ilerleme durumunuz." />
          </div>
          <p>{completedToday}/{totalHabits} alışkanlık</p>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      <section className="habits-today">
        <div className="section-header">
          <h3>Bugün Neler Var?</h3>
        </div>
        <div className="habits-grid">
          <AnimatePresence mode="popLayout">
            {habits.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-msg">
                Henüz alışkanlık eklenmemiş. Planlamaya başlayın!
              </motion.p>
            ) : (
              habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleHabit(habit.id, today)}
                  onDelete={() => deleteHabit(habit.id)}
                  onEdit={() => setEditingHabit(habit)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      <style>{`
        .dashboard-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .greeting p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 4px;
        }

        .streak-stats {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-value {
          display: block;
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .active-flame {
          color: #ff4500;
          fill: #ff4500;
          filter: drop-shadow(0 0 8px rgba(255, 69, 0, 0.5));
        }

        .progress-section {
          padding: 1.5rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-info p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .progress-bar-bg {
          height: 14px;
          background: var(--input-bg);
          border-radius: 7px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
          border-radius: 7px;
        }

        .habits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .empty-msg {
          color: var(--text-secondary);
          text-align: center;
          padding: 2rem;
          grid-column: 1 / -1;
        }

        .habit-card {
          padding: 1.25rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .habit-card:hover {
          border-color: var(--accent-primary);
        }

        .habit-info h4 {
          margin-bottom: 2px;
          font-weight: 600;
        }

        .habit-time {
          font-size: 0.75rem;
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 6px;
        }

        .streak-tag {
          font-size: 0.7rem;
          color: #ff4500;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }

        .freq-badge {
          font-size: 0.7rem;
          color: var(--text-secondary);
          background: var(--input-bg);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .habit-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .complete-btn {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--btn-secondary-bg);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .complete-btn.completed {
          background: var(--success);
          border-color: var(--success);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .delete-btn {
          background: none;
          border: none;
          color: rgba(var(--text-primary-rgb), 0.15);
          cursor: pointer;
          padding: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          color: #ef4444;
          transform: scale(1.1);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border-radius: 12px;
          padding: 2px;
          border: 1px solid var(--border-color);
        }

        .q-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .q-btn:hover {
          background: var(--btn-secondary-bg);
          color: var(--accent-primary);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .greeting h1 {
            font-size: 1.5rem;
          }
          .streak-stats {
            width: 100%;
            justify-content: space-around;
            padding: 1rem;
          }
          .habits-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .habit-card {
            padding: 1.25rem;
            flex-direction: column;
            align-items: stretch;
            position: relative;
            gap: 1.25rem;
          }
          .habit-info {
            padding-right: 120px;
          }
          .habit-actions {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            gap: 0.5rem;
            padding-top: 0;
            border-top: none;
          }
          .complete-btn {
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 480px) {
          .streak-stats {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          .greeting h1 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

const HabitCard = ({ habit, onToggle, onDelete, onEdit }: { habit: Habit, onToggle: () => void, onDelete: () => void, onEdit: () => void }) => {
  const { updateProgress } = useHabits();
  const today = new Date().toISOString().split('T')[0];

  const todayEntry = habit.completedDates.find(e => typeof e === 'string' ? e === today : e.date === today);
  const currentProgress = typeof todayEntry === 'object' ? todayEntry.value : (todayEntry ? (habit.goalValue || 1) : 0);
  const isCompleted = habit.isQuantity
    ? (currentProgress >= (habit.goalValue || 0))
    : !!todayEntry;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!habit.isQuantity) return;
    const step = habit.goalValue && habit.goalValue >= 100 ? 100 : 1;
    updateProgress(habit.id, today, currentProgress + step);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!habit.isQuantity) return;
    const step = habit.goalValue && habit.goalValue >= 100 ? 100 : 1;
    updateProgress(habit.id, today, Math.max(0, currentProgress - step));
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="habit-card glass">
      <div className="habit-info">
        {habit.startTime && (
          <div className="habit-time">
            <Clock size={12} />
            {habit.startTime} - {habit.endTime}
          </div>
        )}
        <h4>{habit.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="freq-badge">{habit.frequency === 'daily' ? 'GÜNLÜK' : habit.frequency === 'weekly' ? 'HAFTALIK' : 'AYLIK'}</span>
          {habit.isQuantity && (
            <span className="freq-badge" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              {currentProgress} / {habit.goalValue} {habit.unit}
            </span>
          )}
        </div>

        {habit.isQuantity && (
          <div className="progress-bar-bg" style={{ height: '6px', marginTop: '12px', width: '100px' }}>
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (currentProgress / (habit.goalValue || 1)) * 100)}%` }}
            />
          </div>
        )}

        {habit.streak > 0 && (
          <div className="streak-tag">
            <Flame size={12} fill="#ff4500" />
            {habit.streak} gün seri
          </div>
        )}
      </div>
      <div className="habit-actions">
        {habit.isQuantity && (
          <div className="quantity-controls">
            <button className="q-btn" onClick={handleDecrement}><Minus size={14} /></button>
            <button className="q-btn" onClick={handleIncrement}><Plus size={14} /></button>
          </div>
        )}
        <button className="delete-btn" onClick={onEdit} title="Düzenle">
          <Edit2 size={16} />
        </button>
        <button className="delete-btn" onClick={onDelete} title="Sil">
          <Trash2 size={18} />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`complete-btn ${isCompleted ? 'completed' : ''}`}
          onClick={onToggle}
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Play size={22} />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardView;
