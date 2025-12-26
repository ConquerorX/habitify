import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Get all users with habit counts
router.get('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                createdAt: true,
                _count: {
                    select: { habits: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            isAdmin: u.isAdmin,
            createdAt: u.createdAt,
            habitCount: u._count.habits
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Get user details with all habits
router.get('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                createdAt: true,
                habits: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Impersonate user - generate token for viewing as that user
router.post('/users/:id/impersonate', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true
            }
        });

        if (!targetUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Generate impersonation token with admin's id stored for reference
        const impersonationToken = jwt.sign(
            {
                userId: targetUser.id,
                impersonatedBy: req.userId,
                isImpersonation: true
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' } // Impersonation expires in 1 hour
        );

        res.json({
            token: impersonationToken,
            user: {
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                isAdmin: targetUser.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Get overall statistics
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [totalUsers, totalHabits, allHabits] = await Promise.all([
            prisma.user.count(),
            prisma.habit.count(),
            prisma.habit.findMany({
                select: { completedDates: true }
            })
        ]);

        // Count habits completed today
        const completedToday = allHabits.filter(h =>
            h.completedDates.includes(today)
        ).length;

        // Count active users (users with at least one habit)
        const activeUsers = await prisma.user.count({
            where: {
                habits: {
                    some: {}
                }
            }
        });

        res.json({
            totalUsers,
            totalHabits,
            completedToday,
            activeUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Delete user and all their habits
router.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Don't allow deleting yourself
        if (req.params.id === req.userId) {
            return res.status(400).json({ message: 'Kendi hesabınızı silemezsiniz' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Delete all habits first (cascade)
        await prisma.habit.deleteMany({
            where: { userId: req.params.id }
        });

        // Delete user
        await prisma.user.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Kullanıcı silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

export default router;
