import { createContext, useContext, useState, useEffect } from 'react';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
    frequency: Frequency;
    startTime?: string; // e.g., "15:00"
    endTime?: string;   // e.g., "17:00"
    category: string;
    completedDates: string[]; // ISO date strings
    streak: number;
    createdAt: string;
}

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => void;
    toggleHabit: (id: string, date: string) => void;
    deleteHabit: (id: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    const calculateStreak = (completedDates: string[]): number => {
        if (completedDates.length === 0) return 0;

        const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a));
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

        let streak = 0;
        let currentDate = sortedDates[0];

        if (currentDate !== today && currentDate !== yesterday) return 0;

        let checkDate = new Date(currentDate);
        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            const diffTime = Math.abs(checkDate.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                streak++;
                checkDate = date;
            } else {
                break;
            }
        }

        return streak;
    };

    const addHabit = (newHabit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 11);

        const habit: Habit = {
            ...newHabit,
            id,
            completedDates: [],
            streak: 0,
            createdAt: new Date().toISOString(),
        };
        setHabits([...habits, habit]);
    };

    const toggleHabit = (id: string, date: string) => {
        setHabits(prev => prev.map(habit => {
            if (habit.id === id) {
                const isCompleted = habit.completedDates.includes(date);
                const newCompletedDates = isCompleted
                    ? habit.completedDates.filter(d => d !== date)
                    : [...habit.completedDates, date];

                return {
                    ...habit,
                    completedDates: newCompletedDates,
                    streak: calculateStreak(newCompletedDates)
                };
            }
            return habit;
        }));
    };

    const deleteHabit = (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within a HabitProvider');
    return context;
};
