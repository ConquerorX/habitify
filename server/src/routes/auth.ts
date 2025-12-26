import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();

// Admin email - auto-granted admin access
const ADMIN_EMAIL = 'admin@habitify.dural.qzz.io';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Bu e-posta zaten kullanımda' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, isAdmin }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Hatalı e-posta veya şifre' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

export default router;

