import express from 'express';
import {
  criarChamado,
  listarChamados,
  atualizarStatusChamado,
  deletarChamado,
} from '../controllers/chamadosController.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);
router.put('/:id/status', atualizarStatusChamado);
router.delete('/:id', deletarChamado);

export default router;
