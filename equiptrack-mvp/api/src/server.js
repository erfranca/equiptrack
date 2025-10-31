import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const PORT = process.env.PORT || 3001;

const db = new Database('equiptrack.db', { verbose: null });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// helpers
function signToken(user) {
  // 15 minutos de expiração conforme requisito
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '15m' });
}
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// --- Auth ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user });
});

// --- Clientes ---
app.get('/api/clients', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY name').all();
  res.json(rows);
});

app.post('/api/clients', authMiddleware, (req, res) => {
  const { name, document, contact, phone, address } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
  const info = db.prepare('INSERT INTO clients (name, document, contact, phone, address) VALUES (?, ?, ?, ?, ?)')
    .run(name, document || null, contact || null, phone || null, address || null);
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(client);
});

// helpers for accessories/defects
app.get('/api/accessories', authMiddleware, (req,res) => {
  const rows = db.prepare('SELECT * FROM accessories ORDER BY description').all();
  res.json(rows);
});
app.get('/api/defects', authMiddleware, (req,res) => {
  const rows = db.prepare('SELECT * FROM defects ORDER BY description').all();
  res.json(rows);
});

// --- Equipments (Entrada/Saída) ---
app.post('/api/equipments', authMiddleware, (req, res) => {
  const { client_id, kind, serial, flow, category, accessories = [], defects = [], accessories_note = null, defects_note = null } = req.body || {};
  if (!client_id) return res.status(400).json({ error: 'cliente é obrigatório' });
  if (!kind) return res.status(400).json({ error: 'tipo de equipamento é obrigatório' });
  if (!serial) return res.status(400).json({ error: 'número de série é obrigatório' });
  if (!['entrada', 'saida'].includes(flow)) return res.status(400).json({ error: 'flow deve ser entrada|saida' });
  if (!['instalacao', 'manutencao'].includes(category)) return res.status(400).json({ error: 'category deve ser instalacao|manutencao' });

  const tx = db.transaction(() => {
    const info = db.prepare(`INSERT INTO equipments (client_id, kind, serial, flow, category, accessories_note, defects_note)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(client_id, kind, serial, flow, category, accessories_note, defects_note);
    const equipment_id = info.lastInsertRowid;

    const insAcc = db.prepare('INSERT OR IGNORE INTO equipment_accessories (equipment_id, accessory_id) VALUES (?, ?)');
    for (const a of accessories) insAcc.run(equipment_id, a);

    const insDef = db.prepare('INSERT OR IGNORE INTO equipment_defects (equipment_id, defect_id) VALUES (?, ?)');
    for (const d of defects) insDef.run(equipment_id, d);

    return equipment_id;
  });

  const id = tx();
  const created = db.prepare('SELECT * FROM equipments WHERE id = ?').get(id);
  res.status(201).json(created);
});

// Busca/Histórico com filtros
app.get('/api/equipments', authMiddleware, (req, res) => {
  const { flow, client_id, kind, serial, from, to } = req.query;
  const clauses = [];
  const params = [];
  if (flow && ['entrada','saida'].includes(flow)) { clauses.push('flow = ?'); params.push(flow); }
  if (client_id) { clauses.push('client_id = ?'); params.push(client_id); }
  if (kind) { clauses.push('kind LIKE ?'); params.push(`%${kind}%`); }
  if (serial) { clauses.push('serial LIKE ?'); params.push(`%${serial}%`); }
  if (from) { clauses.push('datetime(created_at) >= datetime(?)'); params.push(from); }
  if (to) { clauses.push('datetime(created_at) <= datetime(?)'); params.push(to); }
  const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
  const rows = db.prepare(`
    SELECT e.*, c.name AS client_name
    FROM equipments e
    JOIN clients c ON c.id = e.client_id
    ${where}
    ORDER BY e.created_at DESC, e.id DESC
    LIMIT 200
  `).all(...params);
  res.json(rows);
});

app.get('/api/equipments/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const eq = db.prepare('SELECT * FROM equipments WHERE id = ?').get(id);
  if (!eq) return res.status(404).json({ error: 'Não encontrado' });
  const accessories = db.prepare(`
    SELECT a.* FROM accessories a
    JOIN equipment_accessories ea ON ea.accessory_id = a.id
    WHERE ea.equipment_id = ?
  `).all(id);
  const defects = db.prepare(`
    SELECT d.* FROM defects d
    JOIN equipment_defects ed ON ed.defect_id = d.id
    WHERE ed.equipment_id = ?
  `).all(id);
  res.json({ ...eq, accessories, defects });
});

app.listen(PORT, () => {
  console.log(`✅ EquipTrack API rodando em http://localhost:${PORT}`);
  console.log('Endpoints: /api/auth/login, /api/clients, /api/equipments ...');
});
