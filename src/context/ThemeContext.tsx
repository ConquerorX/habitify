import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColor = '#8b5cf6' | '#3b82f6' | '#10b981' | '#f59e0b' | '#ef4444' | '#d946ef';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    primaryColor: ThemeColor;
    setPrimaryColor: (color: ThemeColor) => void;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState<ThemeColor>(() => {
        return (localStorage.getItem('theme-color') as ThemeColor) || '#8b5cf6';
    });

    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme-mode') as ThemeMode) || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme-color', primaryColor);
        document.documentElement.style.setProperty('--accent-primary', primaryColor);

        // RGB version for semi-transparent backgrounds
        const rgb = hexToRgb(primaryColor);
        if (rgb) {
            document.documentElement.style.setProperty('--accent-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
    }, [primaryColor]);

    useEffect(() => {
        localStorage.setItem('theme-mode', themeMode);
        const root = document.documentElement;

        if (themeMode === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.setAttribute('data-theme', themeMode);
        }
    }, [themeMode]);

    // Helper to convert hex to RGB
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
