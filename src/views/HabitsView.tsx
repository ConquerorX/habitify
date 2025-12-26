import { Trash2, Plus, Calendar } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import type { Habit } from '../context/HabitContext';

const HabitsView = () => {
  const { habits, deleteHabit } = useHabits();

  return (
    <div className="view-container">
      <header className="view-header">
        <h1>Alışkanlıklarım</h1>
        <p>Bütün planlarını buradan görebilir ve yönetebilirsin.</p>
      </header>

      <div className="habits-list-grid">
        {habits.length === 0 ? (
          <div className="empty-state glass">
            <Plus size={48} />
            <p>Henüz alışkanlık eklemedin.</p>
          </div>
        ) : (
          habits.map((habit: Habit) => (
            <div key={habit.id} className="habit-detail-card glass">
              <div className="habit-main">
                <div className="habit-header">
                  <h3>{habit.title}</h3>
                  <span className="category-tag">{habit.category || 'Genel'}</span>
                </div>
                <div className="habit-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{habit.frequency === 'daily' ? 'Her Gün' : habit.frequency === 'weekly' ? 'Haftalık' : 'Aylık'}</span>
                  </div>
                  {habit.startTime && (
                    <div className="meta-item">
                      <span>{habit.startTime} - {habit.endTime}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="habit-actions">
                <button className="btn-danger" onClick={() => deleteHabit(habit.id)} title="Sil">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .view-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .view-header {
          margin-bottom: 2rem;
        }
        .view-header p {
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .habits-list-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .habit-detail-card {
          padding: 1.25rem;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .habit-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        .category-tag {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: rgba(var(--accent-primary-rgb), 0.1);
          color: var(--accent-primary);
          border-radius: 6px;
          border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
          text-transform: uppercase;
        }
        .habit-meta {
          display: flex;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.8rem;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .btn-danger:hover {
          background: #ef4444;
          color: white;
        }
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          border-radius: 24px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .habit-detail-card {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
          }
          .habit-actions {
            position: absolute;
            top: 1rem;
            right: 1rem;
          }
          .habit-header {
            padding-right: 3rem;
          }
          .habit-header h3 {
            font-size: 1.1rem;
          }
          .habit-meta {
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitsView;
