import { Response, NextFunction } from 'express';
import prisma from '../prisma';
import { AuthRequest } from './auth';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Yetkisiz erişim' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { isAdmin: true }
        });

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin yetkisi gerekli' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
