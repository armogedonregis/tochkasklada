import { Router } from 'hyper-express'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';
import cellControllers from '@/models/cell/cell.controllers';

const router = new Router();

router.get('/', cellControllers.get_all_cells)
router.post('/', json_checker, authMiddleware, cellControllers.create_cell)
router.put('/:id', json_checker, authMiddleware, cellControllers.update_cell)
router.delete('/:id', authMiddleware, cellControllers.delete_cell)
router.get('/:id', cellControllers.get_cell_by_id)
router.get('/container/:containerId', cellControllers.get_cells_by_container)
router.get('/size/:size_id', cellControllers.get_cells_by_size)

export default router 