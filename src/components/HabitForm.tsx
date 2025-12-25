import { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import type { Frequency } from '../context/HabitContext';
import { X, Clock, Calendar, Tag } from 'lucide-react';

interface HabitFormProps {
  onClose: () => void;
}

const HabitForm = ({ onClose }: HabitFormProps) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('Genel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      frequency,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="habit-form-modal glass">
        <div className="modal-header">
          <h3>Yeni Alışkanlık</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Tag size={14} /> Alışkanlık Adı</label>
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
              <label><Calendar size={14} /> Sıklık</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value as Frequency)}>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kategori</label>
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
              <label><Clock size={14} /> Başlangıç</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label><Clock size={14} /> Bitiş</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">Planla</button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .habit-form-modal {
          width: 100%;
          max-width: 450px;
          padding: 2rem;
          border-radius: 24px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .close-btn {
          background: none; border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .form-group {
          margin-bottom: 1.5rem;
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
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .form-group input, .form-group select {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: white;
          outline: none;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: var(--accent-primary);
        }
        .submit-btn {
          width: 100%;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default HabitForm;
