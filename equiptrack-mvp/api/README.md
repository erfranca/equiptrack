# EquipTrack MVP (Backend)

API simples para controle de **entrada/saída de equipamentos**, com:
- Login (JWT, expira em **15 minutos**)
- Clientes (CRUD básico: listar/criar)
- Equipamentos (registrar entrada/saída, instalação/manutenção, acessórios/defeitos)
- Busca com filtros (datas, cliente, tipo, série, fluxo)

> Pensado para começar simples em ambiente local. Banco: **SQLite** (um arquivo `equiptrack.db`).

## 🛠️ Requisitos
- Node.js 18+
- npm

## 🚀 Como rodar
```bash
cd api
cp .env.example .env  # edite JWT_SECRET se desejar
npm install
npm run reset:db      # cria e popula o banco com dados básicos
npm run dev           # inicia a API (http://localhost:3001)
```

Usuário inicial para login:
- **email:** `admin@example.com`
- **senha:** `admin123`

## 🔑 Autenticação
Faça login em `POST /api/auth/login` com `{ "email", "password" }`.  
Receberá `{ token, user }`. Envie o token nos próximos requests:
```
Authorization: Bearer SEU_TOKEN_JWT
```

## 📚 Endpoints principais
- `POST /api/auth/login`
- `GET  /api/auth/me`

- `GET  /api/clients`
- `POST /api/clients`  — body: `{ name, document?, contact?, phone?, address? }`

- `GET  /api/accessories`
- `GET  /api/defects`

- `POST /api/equipments` — body:
```json
{
  "client_id": 1,
  "kind": "Notebook",
  "serial": "ABC123",
  "flow": "entrada",     // ou "saida"
  "category": "manutencao", // ou "instalacao"
  "accessories": [1,2],  // ids
  "defects": [3,4],      // ids
  "accessories_note": "sem fonte",
  "defects_note": "não liga"
}
```

- `GET  /api/equipments?flow=entrada&client_id=1&kind=Note&serial=123&from=2025-10-01&to=2025-10-31`
- `GET  /api/equipments/:id`

## 🧭 Como isso atende ao escopo
- **Login com expiração de 15 min** ✅
- **Tela inicial (Entrada/Saída)** ➜ Representada por `flow` no payload
- **Instalação/Manutenção** ➜ Campo `category`
- **Cliente + Tipo + Série (obrigatório)** ✅
- **Saída: acessórios** ➜ Tabela e relacionamento ✅
- **Entrada: defeitos** ➜ Tabela e relacionamento ✅
- **Busca com filtros** (datas, clientes, tipos, série, entrada/saída) ✅

## 🗺️ Próximos passos (frontend)
- React + Vite com rotas: Login, Registrar Movimento (Entrada/Saída), Busca/Histórico
- Selects carregados de `/api/clients`, `/api/accessories`, `/api/defects`
- Proteção de rotas usando o token JWT

---

Qualquer dúvida, me diga que eu já crio o **frontend base** e integro tudo.
