import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AUTH_API_URL } from '../config';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`${AUTH_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
      } else {
        setError(data.message || 'Bir hata oluştu');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card glass"
      >
        <div className="auth-header">
          <h1 className="title-gradient">Habitify</h1>
          <p>{isLogin ? 'Tekrar hoş geldin!' : 'Yeni bir başlangıç yap.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <User size={20} />
              <input
                type="text"
                placeholder="Ad Soyad"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="auth-input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Hesabın yok mu?' : 'Zaten üye misin?'}
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
              {isLogin ? ' Hemen Kayıt Ol' : ' Giriş Yap'}
            </button>
          </p>
        </div>
      </motion.div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #050505;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          border-radius: 32px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-header p {
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }
        .auth-input-group {
          position: relative;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 0 1rem;
        }
        .auth-input-group svg {
          color: var(--text-secondary);
        }
        .auth-input-group input {
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          color: white;
          outline: none;
          font-size: 1rem;
        }
        .auth-submit {
          width: 100%;
          height: 54px;
          margin-top: 1rem;
          justify-content: center;
          font-size: 1.1rem;
        }
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .toggle-auth {
          background: none;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
        }
        .auth-error {
          color: #ef4444;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AuthView;
