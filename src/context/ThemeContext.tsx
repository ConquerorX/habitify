import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColor = '#8b5cf6' | '#3b82f6' | '#10b981' | '#f59e0b' | '#ef4444' | '#d946ef';

interface ThemeContextType {
    primaryColor: ThemeColor;
    setPrimaryColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState<ThemeColor>(() => {
        return (localStorage.getItem('theme-color') as ThemeColor) || '#8b5cf6';
    });

    useEffect(() => {
        localStorage.setItem('theme-color', primaryColor);
        document.documentElement.style.setProperty('--accent-primary', primaryColor);

        // Auto-calculate a secondary color (slightly offset hue or opacity based)
        // For simplicity, we can just use the same but CSS handles the gradients
    }, [primaryColor]);

    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
