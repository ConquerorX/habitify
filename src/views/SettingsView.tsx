import { useTheme } from '../context/ThemeContext';
import { Palette, Moon, Sun, Monitor } from 'lucide-react';

const colors = [
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#d946ef' },
] as const;

const SettingsView = () => {
    const { primaryColor, setPrimaryColor } = useTheme();

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Ayarlar</h1>
                <p>Görünüm ve uygulama tercihlerini özelleştir.</p>
            </header>

            <div className="settings-grid">
                <section className="settings-section glass">
                    <div className="section-header">
                        <Palette size={20} />
                        <h3>Tema Rengi</h3>
                    </div>
                    <div className="color-options">
                        {colors.map(color => (
                            <button
                                key={color.value}
                                className={`color-btn ${primaryColor === color.value ? 'active' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setPrimaryColor(color.value as any)}
                                title={color.name}
                            >
                                {primaryColor === color.value && <div className="inner-dot" />}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="settings-section glass">
                    <div className="section-header">
                        <Monitor size={20} />
                        <h3>Görünüm Modu</h3>
                    </div>
                    <div className="mode-options">
                        <button className="mode-btn glass active"><Sun size={18} /> Açık</button>
                        <button className="mode-btn glass"><Moon size={18} /> Koyu</button>
                        <button className="mode-btn glass"><Monitor size={18} /> Sistem</button>
                    </div>
                    <p className="hint">Şu anda sadece koyu mod desteklenmektedir.</p>
                </section>
            </div>

            <style>{`
        .view-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .settings-section {
          padding: 2rem;
          border-radius: 24px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }
        .color-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .color-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .color-btn:hover {
          transform: scale(1.1);
        }
        .color-btn.active {
          border-color: white;
          transform: scale(1.1);
        }
        .inner-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }
        .mode-options {
          display: flex;
          gap: 1rem;
        }
        .mode-btn {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          border-radius: 12px;
          cursor: not-allowed;
          opacity: 0.5;
          font-size: 0.875rem;
        }
        .mode-btn.active {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          opacity: 1;
        }
        .hint {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default SettingsView;
