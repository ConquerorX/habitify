import { CheckCircle2, Flame, Award, Trash2, Play, Clock } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import type { Habit } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardView = () => {
    const { habits, toggleHabit, deleteHabit } = useHabits();
    const today = new Date().toISOString().split('T')[0];

    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    // Calculate overall streak
    const allCompletedDates = Array.from(new Set(habits.flatMap(h => h.completedDates))).sort((a, b) => b.localeCompare(a));

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
            <header className="dashboard-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Merhaba! 👋</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Bugün harika şeyler yapmak için iyi bir gün.</p>
                </motion.div>

                <div className="streak-stats glass">
                    <div className="stat-item">
                        <Flame className={overallStreak > 0 ? 'active-flame' : ''} size={24} />
                        <div>
                            <span className="stat-value">{overallStreak}</span>
                            <span className="stat-label">Günlük Seri</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <Award color="#facc15" size={24} />
                        <div>
                            <span className="stat-value">{habits.filter(h => h.streak >= 7).length}</span>
                            <span className="stat-label">Başarılar</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="progress-section glass">
                <div className="progress-info">
                    <h3>Günlük İlerleme</h3>
                    <p>{completedToday}/{totalHabits} alışkanlık tamamlandı</p>
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
                    <h3>Bugünün Alışkanlıkları</h3>
                </div>
                <div className="habits-grid">
                    <AnimatePresence mode="popLayout">
                        {habits.length === 0 ? (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-secondary)' }}>
                                Henüz alışkanlık eklenmemiş.
                            </motion.p>
                        ) : (
                            habits.map(habit => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    completed={habit.completedDates.includes(today)}
                                    onToggle={() => toggleHabit(habit.id, today)}
                                    onDelete={() => deleteHabit(habit.id)}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <style>{`
        .dashboard-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .streak-stats {
          display: flex;
          gap: 2rem;
          padding: 1rem 1.5rem;
          border-radius: 20px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
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
        .progress-bar-bg {
          height: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
          border-radius: 6px;
        }
        .habits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .habit-card {
          padding: 1.5rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .habit-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-primary);
        }
        .habit-info h4 {
          margin-bottom: 0.25rem;
        }
        .habit-time {
          font-size: 0.75rem;
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;
        }
        .habit-info .streak-tag {
          font-size: 0.75rem;
          color: #ff4500;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }
        .habit-info span {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .habit-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .complete-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .complete-btn.completed {
          background: var(--success);
          border-color: var(--success);
          color: white;
        }
        .delete-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }
        .habit-card:hover .delete-btn {
          color: #ef4444;
        }
      `}</style>
        </div>
    );
};

const HabitCard = ({ habit, completed, onToggle, onDelete }: { habit: Habit, completed: boolean, onToggle: () => void, onDelete: () => void }) => (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="habit-card glass">
        <div className="habit-info">
            {habit.startTime && (
                <div className="habit-time">
                    <Clock size={12} />
                    {habit.startTime} - {habit.endTime}
                </div>
            )}
            <h4>{habit.title}</h4>
            <span>{habit.frequency === 'daily' ? 'Her Gün' : habit.frequency === 'weekly' ? 'Haftalık' : 'Aylık'}</span>
            {habit.streak > 0 && (
                <div className="streak-tag">
                    <Flame size={12} fill="#ff4500" />
                    {habit.streak} gün seri
                </div>
            )}
        </div>
        <div className="habit-actions">
            <button className="delete-btn" onClick={onDelete}>
                <Trash2 size={18} />
            </button>
            <motion.button
                whileTap={{ scale: 0.9 }}
                className={`complete-btn ${completed ? 'completed' : ''}`}
                onClick={onToggle}
            >
                {completed ? <CheckCircle2 size={24} /> : <Play size={24} />}
            </motion.button>
        </div>
    </motion.div>
);

export default DashboardView;
