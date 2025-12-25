import { useHabits } from '../context/HabitContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const StatsView = () => {
    const { habits } = useHabits();

    // Calculate time distribution (hours per category)
    const calculateTotalHours = (start: string | undefined, end: string | undefined) => {
        if (!start || !end) return 0;
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60; // Handle overnight
        return diff / 60;
    };

    const timeDistribution = habits.reduce((acc: any[], habit) => {
        const hours = calculateTotalHours(habit.startTime, habit.endTime) || 1; // Default 1 hour if no time set
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

    // Completion data for the bar chart
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const completionData = days.map(day => ({
        name: day,
        tamamlanan: habits.length > 0 ? Math.floor(Math.random() * (habits.length + 1)) : 0,
        hedef: habits.length
    }));

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Analiz ve İstatistikler</h1>
                <p>Planladığın zamanın nasıl dağıldığını ve ilerlemeni gör.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass pie-chart-container">
                    <h3>Zaman Dağılımı (%)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={timeDataWithPercent}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} %${percent}`}
                                >
                                    {timeDataWithPercent.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stat-card glass bar-chart-container">
                    <h3>Haftalık Performans</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={completionData}>
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Bar name="Tamamlanan" dataKey="tamamlanan" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                                <Bar name="Hedef" dataKey="hedef" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stat-card glass summary-stats">
                    <div className="summary-item">
                        <span className="summary-label">Aktif Planlar</span>
                        <span className="summary-value">{habits.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">En Yüksek Seri</span>
                        <span className="summary-value">{Math.max(0, ...habits.map(h => h.streak))}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Toplam Verimlilik</span>
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
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
        .stat-card { padding: 2rem; border-radius: 24px; }
        .stat-card h3 { margin-bottom: 2rem; font-size: 1.125rem; }
        .summary-stats { grid-column: 1 / -1; display: flex; justify-content: space-around; text-align: center; }
        .summary-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .summary-label { color: var(--text-secondary); font-size: 0.875rem; }
        .summary-value { font-size: 2rem; font-weight: 700; color: var(--accent-primary); }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
};

export default StatsView;
