import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { HABITS_API_URL } from '../config';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
    id: string;
    title: string;
    category: string;
    frequency: Frequency;
    startTime?: string;
    endTime?: string;
    completedDates: string[];
    streak: number;
    createdAt: string;
}

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => Promise<void>;
    toggleHabit: (id: string, date: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
    refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const { token, user } = useAuth();

    const calculateStreak = (dates: string[]) => {
        if (dates.length === 0) return 0;
        const sortedDates = [...dates].sort((a, b) => b.localeCompare(a));
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

        if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

        let streak = 0;
        let checkDate = new Date(sortedDates[0]);

        for (const d of sortedDates) {
            const date = new Date(d);
            const diff = Math.abs(checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
            if (diff <= 1) {
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
                    streak: calculateStreak(h.completedDates)
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
            if (res.ok) refreshHabits();
        } catch (error) {
            console.error('Toggle habit error:', error);
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
            console.log(`Sending PUT request to update habit ${id}`, habit);
            const res = await fetch(`${HABITS_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(habit)
            });

            console.log(`Update habit response status: ${res.status}`);

            if (res.ok) {
                console.log('Update success, refreshing habits...');
                refreshHabits();
            } else {
                const errorData = await res.json();
                console.error('Update habit failed:', errorData);
            }
        } catch (error) {
            console.error('Update habit error:', error);
        }
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, updateHabit, refreshHabits }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within HabitProvider');
    return context;
};
