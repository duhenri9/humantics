
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '2h';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });
  const existing = await storage.getUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Usuário já existe' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, passwordHash };
  await storage.createUser(user);
  res.status(201).json({ message: 'Usuário registrado com sucesso' });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await storage.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token });
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Token ausente' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
