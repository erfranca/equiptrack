import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, tipo: user.tipo },
      process.env.JWT_SECRET || 'segredo-equiptrack',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

export default router;
