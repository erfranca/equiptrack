import { pool } from '../db.js';

// 🧾 Criar novo chamado
export const criarChamado = async (req, res) => {
  try {
    const { titulo, descricao, id_equipamento, id_tecnico } = req.body;
    const result = await pool.query(
      `INSERT INTO chamados (titulo, descricao, id_equipamento, id_tecnico)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, id_equipamento, id_tecnico]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar chamado' });
  }
};

// 📋 Listar chamados
export const listarChamados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, e.nome AS equipamento, u.nome AS tecnico
      FROM chamados c
      LEFT JOIN equipamentos e ON e.id = c.id_equipamento
      LEFT JOIN usuarios u ON u.id = c.id_tecnico
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar chamados' });
  }
};

// ✏️ Atualizar status
export const atualizarStatusChamado = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE chamados SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
};

// 🗑️ Deletar chamado
export const deletarChamado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM chamados WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json({ mensagem: 'Chamado deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar chamado' });
  }
};
