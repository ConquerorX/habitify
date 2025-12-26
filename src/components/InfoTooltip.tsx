import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoTooltipProps {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoTooltip = ({ text, position = 'top' }: InfoTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    const getPositionStyles = () => {
        switch (position) {
            case 'bottom': return { top: '100%', left: '50%', x: '-50%', mt: '10px' };
            case 'left': return { right: '100%', top: '50%', y: '-50%', mr: '10px' };
            case 'right': return { left: '100%', top: '50%', y: '-50%', ml: '10px' };
            default: return { bottom: '100%', left: '50%', x: '-50%', mb: '10px' };
        }
    };

    const pos = getPositionStyles();

    return (
        <div className="tooltip-container" ref={tooltipRef} style={{ display: 'inline-flex', position: 'relative', verticalAlign: 'middle' }}>
            <button
                type="button"
                className="tooltip-trigger"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
            >
                <Info size={14} />
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, ...pos }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="tooltip-content glass"
                        style={{
                            position: 'absolute',
                            zIndex: 2000,
                            padding: '8px 12px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            width: 'max-content',
                            maxWidth: '200px',
                            pointerEvents: 'none',
                            lineHeight: '1.4',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--panel-bg)',
                            backdropFilter: 'var(--glass-blur)',
                            color: 'var(--text-primary)',
                            ...pos
                        } as any}
                    >
                        {text}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .tooltip-trigger {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s;
          opacity: 0.6;
        }
        .tooltip-trigger:hover {
          opacity: 1;
          color: var(--accent-primary);
          background: rgba(var(--accent-primary-rgb), 0.1);
        }
        .tooltip-content {
          text-align: center;
          color: var(--text-primary);
          word-wrap: break-word;
        }
      `}</style>
        </div>
    );
};

export default InfoTooltip;
