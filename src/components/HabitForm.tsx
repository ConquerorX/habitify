import { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import type { Frequency, Habit } from '../context/HabitContext';
import { X, Clock, Calendar, Tag } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface HabitFormProps {
  onClose: () => void;
  initialData?: Habit;
}

const HabitForm = ({ onClose, initialData }: HabitFormProps) => {
  const { addHabit, updateHabit } = useHabits();
  const [title, setTitle] = useState(initialData?.title || '');
  const [frequency, setFrequency] = useState<Frequency>(initialData?.frequency || 'daily');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [category, setCategory] = useState(initialData?.category || 'Genel');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const habitData = {
      title: title.trim(),
      frequency,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category
    };

    if (initialData) {
      await updateHabit(initialData.id, habitData);
    } else {
      await addHabit(habitData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="habit-form-modal glass">
        <div className="modal-header">
          <h3>{initialData ? 'Alışkanlığı Düzenle' : 'Yeni Alışkanlık'}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Tag size={14} /> Alışkanlık Adı
              <InfoTooltip text="Yapmak istediğiniz aktivitenin kısa adı. Örn: Kitap Okuma" />
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Örn: Fitness"
              autoFocus
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Calendar size={14} /> Sıklık
                <InfoTooltip text="Bu aktiviteyi ne sıklıkla tekrarlamak istersiniz?" />
              </label>
              <select value={frequency} onChange={e => setFrequency(e.target.value as Frequency)}>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                Kategori
                <InfoTooltip text="Benzer alışkanlıkları gruplandırmak için bir kategori seçin." />
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Genel">Genel</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Eğitim">Eğitim</option>
                <option value="İş">İş</option>
                <option value="Hobi">Hobi</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Clock size={14} /> Başlangıç
                <InfoTooltip text="Aktiviteye başlamayı planladığınız saat." />
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>
                <Clock size={14} /> Bitiş
                <InfoTooltip text="Aktivitenin bitmesi gereken saat." />
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            {initialData ? 'Güncelle' : 'Planla'}
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          padding: 1rem;
        }
        .habit-form-modal {
          width: 100%;
          max-width: 480px;
          padding: 2rem;
          border-radius: 28px;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .close-btn {
          background: var(--btn-secondary-bg);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .form-group input, .form-group select {
          padding: 0.8rem 1rem;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-primary);
          outline: none;
          font-size: 1rem;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: var(--accent-primary);
        }
        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          height: 54px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .habit-form-modal {
            padding: 1.5rem;
          }
          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitForm;
