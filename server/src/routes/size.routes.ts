import { Router } from 'hyper-express'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';
import sizeControllers from '@/models/size/size.controllers';

const router = new Router();

router.get('/', sizeControllers.get_all_sizes)
router.post('/', json_checker, sizeControllers.create_size)
router.put('/:id', json_checker, sizeControllers.update_size)
router.delete('/:id', sizeControllers.delete_size)
router.get('/:id', sizeControllers.get_size_by_id)

export default router 