import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { HABITS_API_URL } from '../config';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
    id: string;
    title: string;
    category: string;
    frequency: Frequency;
    isQuantity: boolean;
    goalValue?: number;
    unit?: string;
    startTime?: string;
    endTime?: string;
    completedDates: (string | { date: string, value: number })[];
    streak: number;
    createdAt: string;
}

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => Promise<void>;
    toggleHabit: (id: string, date: string) => Promise<void>;
    updateProgress: (id: string, date: string, value: number) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
    refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const { token, user, updateUser } = useAuth();

    const calculateStreak = (entries: (string | { date: string, value: number })[], isQuantity: boolean, goalValue?: number) => {
        if (entries.length === 0) return 0;

        const dates = entries.map(e => typeof e === 'string' ? e : e.date).sort((a, b) => b.localeCompare(a));
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

        if (dates[0] !== today && dates[0] !== yesterday) return 0;

        let streak = 0;
        let checkDate = new Date(dates[0]);

        for (const entry of entries.sort((a, b) => {
            const da = typeof a === 'string' ? a : a.date;
            const db = typeof b === 'string' ? b : b.date;
            return db.localeCompare(da);
        })) {
            const dateStr = typeof entry === 'string' ? entry : entry.date;
            const date = new Date(dateStr);
            const diff = Math.abs(checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

            if (diff <= 1) {
                // For quantity habits, only count if goal is met (or at least some progress is made? let's say goal met for streak)
                if (isQuantity && goalValue) {
                    const val = typeof entry === 'string' ? 0 : entry.value;
                    if (val < goalValue) break;
                }
                streak++;
                checkDate = date;
            } else break;
        }
        return streak;
    };

    const refreshHabits = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const enrichedData = data.map((h: any) => ({
                    ...h,
                    streak: calculateStreak(h.completedDates, h.isQuantity, h.goalValue)
                }));
                setHabits(enrichedData);
            }
        } catch (error) {
            console.error('Fetch habits error:', error);
        }
    };

    useEffect(() => {
        if (user) refreshHabits();
        else setHabits([]);
    }, [user]);

    const addHabit = async (newHabit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newHabit)
            });
            if (res.ok) refreshHabits();
        } catch (error) {
            console.error('Add habit error:', error);
        }
    };

    const toggleHabit = async (id: string, date: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}/${id}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.user) updateUser(data.user);
                refreshHabits();
            }
        } catch (error) {
            console.error('Toggle habit error:', error);
        }
    };

    const updateProgress = async (id: string, date: string, value: number) => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}/${id}/progress`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, value })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.user) updateUser(data.user);
                refreshHabits();
            }
        } catch (error) {
            console.error('Update progress error:', error);
        }
    };

    const deleteHabit = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) refreshHabits();
        } catch (error) {
            console.error('Delete habit error:', error);
        }
    };

    const updateHabit = async (id: string, habit: Partial<Habit>) => {
        if (!token) return;
        try {
            const res = await fetch(`${HABITS_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(habit)
            });
            if (res.ok) refreshHabits();
        } catch (error) {
            console.error('Update habit error:', error);
        }
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabit, updateProgress, deleteHabit, updateHabit, refreshHabits }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within HabitProvider');
    return context;
};
