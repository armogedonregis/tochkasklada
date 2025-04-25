import { Router } from 'hyper-express'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';
import cityControllers from '@/models/city/city.controllers';

const router = new Router();

router.get('/', cityControllers.get_all_city)
router.post('/', json_checker, authMiddleware, cityControllers.create_city)
router.put('/:id', json_checker, authMiddleware, cityControllers.update_city)
router.delete('/:id', authMiddleware, cityControllers.delete_city)
router.get('/short-name/:id', cityControllers.get_city_by_short_name)

export default router 