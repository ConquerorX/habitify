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
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Add habit
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, category, frequency, startTime, endTime } = req.body;
        const habit = await prisma.habit.create({
            data: {
                title,
                category,
                frequency,
                startTime,
                endTime,
                userId: req.userId!
            }
        });
        res.json(habit);
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

        let completedDates = [...habit.completedDates];
        if (completedDates.includes(date)) {
            completedDates = completedDates.filter(d => d !== date);
        } else {
            completedDates.push(date);
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: req.params.id },
            data: { completedDates }
        });

        res.json(updatedHabit);
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
