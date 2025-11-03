import { pool } from '../db.js';

// 🧱 Criar novo equipamento
export const criarEquipamento = async (req, res) => {
  try {
    const { nome, descricao, numero_serie, status } = req.body;
    const result = await pool.query(
      `INSERT INTO equipamentos (nome, descricao, numero_serie, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, descricao, numero_serie, status || 'disponivel']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar equipamento' });
  }
};

// 📋 Listar todos os equipamentos
export const listarEquipamentos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipamentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar equipamentos' });
  }
};

// 🔍 Buscar por ID
export const obterEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM equipamentos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Equipamento não encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao obter equipamento' });
  }
};

// ✏️ Atualizar
export const atualizarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, numero_serie, status } = req.body;
    const result = await pool.query(
      `UPDATE equipamentos
       SET nome = $1, descricao = $2, numero_serie = $3, status = $4
       WHERE id = $5 RETURNING *`,
      [nome, descricao, numero_serie, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Equipamento não encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar equipamento' });
  }
};

// 🗑️ Deletar
export const deletarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM equipamentos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Equipamento não encontrado' });
    res.json({ mensagem: 'Equipamento deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar equipamento' });
  }
};
