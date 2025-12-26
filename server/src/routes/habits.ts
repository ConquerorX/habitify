import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all habits for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.userId }
        });
        const formattedHabits = habits.map(h => ({
            ...h,
            completedDates: typeof h.completedDates === 'string' ? JSON.parse(h.completedDates) : h.completedDates
        }));
        res.json(formattedHabits);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Add habit
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, category, frequency, startTime, endTime, isQuantity, goalValue, unit } = req.body;
        console.log('Backend habit creation body:', req.body);
        const habit = await prisma.habit.create({
            data: {
                title,
                category,
                frequency,
                startTime,
                endTime,
                isQuantity: !!isQuantity,
                goalValue: goalValue ? parseFloat(goalValue) : null,
                unit,
                userId: req.userId!
            } as any
        });
        res.json({
            ...habit,
            completedDates: JSON.parse((habit as any).completedDates as string)
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { date } = req.body;
        const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });

        if (!habit || habit.userId !== req.userId) {
            return res.status(404).json({ message: 'Alışkanlık bulunamadı' });
        }

        let completedDates = typeof (habit as any).completedDates === 'string' ? JSON.parse((habit as any).completedDates) : (habit as any).completedDates;
        if (completedDates.includes(date)) {
            completedDates = completedDates.filter((d: string) => d !== date);
        } else {
            completedDates.push(date);
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: req.params.id },
            data: { completedDates: JSON.stringify(completedDates) } as any
        });

        // XP Grant Logic
        let updatedUser = null;
        const isNowCompleted = completedDates.find((e: any) => typeof e === 'string' ? e === date : e.date === date);
        if (isNowCompleted) {
            const user = await prisma.user.findUnique({ where: { id: req.userId } });
            if (user) {
                const newXp = ((user as any).xp || 0) + 10;
                const newLevel = Math.floor(newXp / 100) + 1;
                updatedUser = await prisma.user.update({
                    where: { id: req.userId },
                    data: { xp: newXp, level: newLevel } as any
                });
            }
        }

        res.json({
            habit: {
                ...updatedHabit,
                completedDates
            },
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Update habit
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, category, frequency, startTime, endTime, isQuantity, goalValue, unit } = req.body;
        const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });

        if (!habit || habit.userId !== req.userId) {
            return res.status(404).json({ message: 'Alışkanlık bulunamadı' });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: req.params.id },
            data: {
                title, category, frequency, startTime, endTime,
                isQuantity: isQuantity !== undefined ? !!isQuantity : (habit as any).isQuantity,
                goalValue: goalValue !== undefined ? parseFloat(goalValue) : (habit as any).goalValue,
                unit: unit !== undefined ? unit : (habit as any).unit
            } as any
        });

        res.json({
            ...updatedHabit,
            completedDates: typeof updatedHabit.completedDates === 'string' ? JSON.parse(updatedHabit.completedDates) : updatedHabit.completedDates
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Update habit progress (for quantitative habits)
router.patch('/:id/progress', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { date, value } = req.body;
        const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });

        if (!habit || habit.userId !== req.userId) {
            return res.status(404).json({ message: 'Alışkanlık bulunamadı' });
        }

        let completedDates = typeof (habit as any).completedDates === 'string' ? JSON.parse((habit as any).completedDates) : (habit as any).completedDates;

        const previousEntry = completedDates.find((d: any) => (typeof d === 'string' ? d === date : d.date === date));
        const wasCompletedBefore = previousEntry && (typeof previousEntry === 'string' || ((habit as any).goalValue && previousEntry.value >= (habit as any).goalValue));

        // Find if we already have progress for this date
        const existingIndex = completedDates.findIndex((d: any) => (typeof d === 'string' ? d === date : d.date === date));

        if (existingIndex > -1) {
            if (typeof completedDates[existingIndex] === 'string') {
                completedDates[existingIndex] = { date, value };
            } else {
                completedDates[existingIndex].value = value;
            }
        } else {
            completedDates.push({ date, value });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: req.params.id },
            data: { completedDates: JSON.stringify(completedDates) } as any
        });

        const isNowCompleted = (habit as any).goalValue && value >= (habit as any).goalValue;
        let updatedUser = null;

        if (isNowCompleted && !wasCompletedBefore) {
            const user = await prisma.user.findUnique({ where: { id: req.userId } });
            if (user) {
                const newXp = (user as any).xp + 10;
                const newLevel = Math.floor(newXp / 100) + 1;
                updatedUser = await prisma.user.update({
                    where: { id: req.userId },
                    data: { xp: newXp, level: newLevel } as any
                });
            }
        }

        res.json({
            habit: {
                ...updatedHabit,
                completedDates
            },
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Delete habit
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
        if (!habit || habit.userId !== req.userId) {
            return res.status(404).json({ message: 'Alışkanlık bulunamadı' });
        }

        await prisma.habit.delete({ where: { id: req.params.id } });
        res.json({ message: 'Silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

export default router;
