import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'equiptrack.db');
if (fs.existsSync(dbPath)) fs.rmSync(dbPath);

const db = new Database(dbPath);

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  document TEXT,
  contact TEXT,
  phone TEXT,
  address TEXT
);

CREATE TABLE accessories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL UNIQUE
);

CREATE TABLE defects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL UNIQUE
);

CREATE TABLE equipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  kind TEXT NOT NULL,                  -- tipo de equipamento
  serial TEXT NOT NULL,                -- número de série (obrigatório)
  flow TEXT NOT NULL,                  -- 'entrada' | 'saida'
  category TEXT NOT NULL,              -- 'instalacao' | 'manutencao'
  accessories_note TEXT,               -- texto livre opcional
  defects_note TEXT,                   -- texto livre opcional
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE equipment_accessories (
  equipment_id INTEGER NOT NULL,
  accessory_id INTEGER NOT NULL,
  PRIMARY KEY (equipment_id, accessory_id),
  FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
  FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
);

CREATE TABLE equipment_defects (
  equipment_id INTEGER NOT NULL,
  defect_id INTEGER NOT NULL,
  PRIMARY KEY (equipment_id, defect_id),
  FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
  FOREIGN KEY (defect_id) REFERENCES defects(id) ON DELETE CASCADE
);
`);

// seed: admin user (admin@example.com / admin123)
const password_hash = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
  .run('Admin', 'admin@example.com', password_hash);

// seed: basic accessories & defects
const accessories = ['Fonte', 'Cabo de energia', 'Mouse', 'Teclado', 'Cabo HDMI', 'Suporte'];
const defects = ['Não liga', 'Tela quebrada', 'Aquecendo', 'Sem vídeo', 'Bateria fraca', 'Ruído estranho'];

const insAcc = db.prepare('INSERT INTO accessories (description) VALUES (?)');
accessories.forEach(a => { try { insAcc.run(a); } catch(e) {} });

const insDef = db.prepare('INSERT INTO defects (description) VALUES (?)');
defects.forEach(d => { try { insDef.run(d); } catch(e) {} });

// seed: one client
db.prepare('INSERT INTO clients (name, document, contact, phone, address) VALUES (?, ?, ?, ?, ?)')
  .run('Cliente Exemplo LTDA', '12.345.678/0001-99', 'João Silva', '(41) 99999-9999', 'Rua Exemplo, 123 - Curitiba');

console.log('✅ Database reset and seeded:', dbPath);
db.close();
