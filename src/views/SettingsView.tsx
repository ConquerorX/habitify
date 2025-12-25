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
        <p>Görünümü ve tercihlerini özelleştir.</p>
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
            <button className="mode-btn glass"><Monitor size={18} /> Otomatik</button>
          </div>
          <p className="hint">Şu anda sadece koyu mod desteklenmektedir.</p>
        </section>
      </div>

      <style>{`
        .view-container { max-width: 800px; margin: 0 auto; }
        .view-header { margin-bottom: 2rem; }
        .view-header p { color: var(--text-secondary); margin-top: 4px; }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-section {
          padding: 1.5rem;
          border-radius: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .color-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 1rem;
        }

        .color-btn {
          aspect-ratio: 1;
          width: 100%;
          border-radius: 14px;
          border: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .color-btn:active {
          transform: scale(0.95);
        }

        .color-btn.active {
          border-color: white;
          transform: scale(1.05);
        }

        .inner-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        .mode-options {
          display: flex;
          gap: 0.75rem;
        }

        .mode-btn {
          flex: 1;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          border-radius: 14px;
          cursor: not-allowed;
          opacity: 0.4;
          font-size: 0.75rem;
          font-weight: 500;
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
          text-align: center;
        }

        @media (max-width: 768px) {
          .settings-section { padding: 1.25rem; }
          .color-options { grid-template-columns: repeat(6, 1fr); gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default SettingsView;
