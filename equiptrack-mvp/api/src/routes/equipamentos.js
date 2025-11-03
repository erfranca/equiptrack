import express from 'express';
import {
  criarEquipamento,
  listarEquipamentos,
  obterEquipamento,
  atualizarEquipamento,
  deletarEquipamento,
} from '../controllers/equipamentosController.js';

const router = express.Router();

router.post('/', criarEquipamento);
router.get('/', listarEquipamentos);
router.get('/:id', obterEquipamento);
router.put('/:id', atualizarEquipamento);
router.delete('/:id', deletarEquipamento);

export default router;
