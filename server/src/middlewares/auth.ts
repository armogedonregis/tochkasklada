import { Request, Response } from 'hyper-express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

interface JwtPayload {
  userId: string;
}

export const authMiddleware = async (req: Request, res: Response) => {
  try {
    const token = req.cookies['auth_token'];
    
    if (!token) {
      return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не установлен');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    (req as any).user = user;
    
    return true; 
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен авторизации' });
  }
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('auth_token', token, 7 * 24 * 60 * 60 * 1000, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const clearAuthCookie = (res: Response) => {
  res.cookie('auth_token', '', -1, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};