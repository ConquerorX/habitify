import { Trash2, Plus, Calendar } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import type { Habit } from '../context/HabitContext';

const HabitsView = () => {
    const { habits, deleteHabit } = useHabits();

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Tüm Alışkanlıklarım</h1>
                <p>Bütün alışkanlıklarını buradan yönetebilirsin.</p>
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
                                <button className="btn btn-danger" onClick={() => deleteHabit(habit.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .view-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .view-header {
          margin-bottom: 2.5rem;
        }
        .habits-list-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .habit-detail-card {
          padding: 1.5rem;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .habit-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .category-tag {
          font-size: 0.75rem;
          padding: 2px 8px;
          background: rgba(var(--accent-primary-rgb), 0.1);
          color: var(--accent-primary);
          border-radius: 6px;
          border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
        }
        .habit-meta {
          display: flex;
          gap: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-danger:hover {
          background: #ef4444;
          color: white;
        }
        .empty-state {
          padding: 4rem;
          text-align: center;
          border-radius: 24px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
      `}</style>
        </div>
    );
};

export default HabitsView;
