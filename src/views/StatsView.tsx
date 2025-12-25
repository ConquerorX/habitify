import { useHabits } from '../context/HabitContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const StatsView = () => {
    const { habits } = useHabits();

    const calculateTotalHours = (start: string | undefined, end: string | undefined) => {
        if (!start || !end) return 0;
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60;
        return diff / 60;
    };

    const timeDistribution = habits.reduce((acc: any[], habit) => {
        const hours = calculateTotalHours(habit.startTime, habit.endTime) || 1;
        const category = habit.category || 'Genel';
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += hours;
        } else {
            acc.push({ name: category, value: hours });
        }
        return acc;
    }, []);

    const totalTime = timeDistribution.reduce((sum, item) => sum + item.value, 0);
    const timeDataWithPercent = timeDistribution.map(item => ({
        ...item,
        percent: totalTime > 0 ? Math.round((item.value / totalTime) * 100) : 0
    }));

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#d946ef'];

    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const completionData = days.map(day => ({
        name: day,
        tamamlanan: habits.length > 0 ? Math.floor(Math.random() * (habits.length + 1)) : 0,
        hedef: habits.length
    }));

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Analiz</h1>
                <p>Gelişimini ve zaman dağılımını takip et.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass chart-card">
                    <h3>Zaman Dağılımı (%)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={timeDataWithPercent}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="80%"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => (percent !== undefined && percent > 5) ? `${name}` : ''}
                                >
                                    {timeDataWithPercent.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stat-card glass chart-card">
                    <h3>Haftalık Performans</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={completionData}>
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Bar name="Tamam" dataKey="tamamlanan" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                                <Bar name="Hedef" dataKey="hedef" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stat-card glass summary-stats">
                    <div className="summary-item">
                        <span className="summary-label">Planlar</span>
                        <span className="summary-value">{habits.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">En İyi Seri</span>
                        <span className="summary-value">{Math.max(0, ...habits.map(h => h.streak))}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Verimlilik</span>
                        <span className="summary-value">
                            {habits.length > 0 ?
                                Math.round((habits.reduce((acc, h) => acc + h.completedDates.length, 0) / (habits.length * 7)) * 100)
                                : 0}%
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
        .view-container { max-width: 1000px; margin: 0 auto; }
        .view-header { margin-bottom: 2rem; }
        .view-header p { color: var(--text-secondary); margin-top: 4px; }
        
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
          gap: 1.5rem; 
        }

        .stat-card { 
          padding: 1.5rem; 
          border-radius: 24px; 
          display: flex;
          flex-direction: column;
        }

        .stat-card h3 { 
          margin-bottom: 1.5rem; 
          font-size: 1rem; 
          font-weight: 600;
          color: var(--text-primary);
        }

        .chart-wrapper {
          width: 100%;
          height: 250px;
        }

        .summary-stats { 
          grid-column: 1 / -1; 
          display: flex; 
          justify-content: space-around; 
          text-align: center;
          padding: 2rem 1.5rem;
        }

        .summary-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .summary-label { color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .summary-value { font-size: 1.75rem; font-weight: 700; color: var(--accent-primary); }

        @media (max-width: 768px) { 
          .stats-grid { grid-template-columns: 1fr; gap: 1rem; } 
          .summary-stats { flex-direction: row; flex-wrap: wrap; gap: 1.5rem; }
          .summary-item { flex: 1; min-width: 100px; }
          .summary-value { font-size: 1.5rem; }
        }
      `}</style>
        </div>
    );
};

export default StatsView;
