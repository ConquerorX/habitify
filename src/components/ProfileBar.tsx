import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

const ProfileBar = () => {
    const { user } = useAuth();

    if (!user) return null;

    const currentXp = user.xp || 0;
    const level = user.level || 1;
    const xpInLevel = currentXp % 100;
    const progress = xpInLevel; // Since 100 XP is next level

    return (
        <div className="profile-bar glass">
            <div className="profile-info">
                <div className="level-badge">
                    <Zap size={14} fill="currentColor" />
                    <span>Seviye {level}</span>
                </div>
                <div className="user-text">
                    <h3>Hoş geldin, {user.name || user.email.split('@')[0]}!</h3>
                    <p>{level < 5 ? 'Alışkanlık Yolcusu' : level < 10 ? 'İstikrar Elçisi' : 'Alışkanlık Efendisi'}</p>
                </div>
            </div>

            <div className="xp-section">
                <div className="xp-header">
                    <div className="xp-labels">
                        <Star size={12} className="star-icon" />
                        <span>{xpInLevel} / 100 XP</span>
                    </div>
                    <div className="next-level">
                        <Trophy size={12} />
                        <span>Seviye {level + 1}</span>
                    </div>
                </div>
                <div className="xp-bar-container">
                    <motion.div
                        className="xp-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    />
                </div>
            </div>

            <style>{`
                .profile-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem 2rem;
                    border-radius: 24px;
                    margin-bottom: 2rem;
                    gap: 2rem;
                }

                .profile-info {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .level-badge {
                    background: var(--accent-primary);
                    color: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb), 0.3);
                }

                .user-text h3 {
                    font-size: 1.25rem;
                    margin: 0;
                }

                .user-text p {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .xp-section {
                    flex: 1;
                    max-width: 400px;
                }

                .xp-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                }

                .xp-labels, .next-level {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .star-icon {
                    color: #ffd700;
                }

                .xp-bar-container {
                    height: 10px;
                    background: var(--input-bg);
                    border-radius: 5px;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                }

                .xp-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #ffd700, #ff8c00);
                    border-radius: 5px;
                }

                @media (max-width: 768px) {
                    .profile-bar {
                        flex-direction: column;
                        align-items: stretch;
                        padding: 1.25rem;
                        gap: 1rem;
                    }
                    .xp-section {
                        max-width: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfileBar;
