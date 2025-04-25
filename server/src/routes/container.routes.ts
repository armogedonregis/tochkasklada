import { Router } from 'hyper-express'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';
import containerControllers from '@/models/container/container.controllers';

const router = new Router();

router.get('/', containerControllers.get_all_containers)
router.post('/', json_checker, containerControllers.create_container)
router.put('/:id', json_checker, containerControllers.update_container)
router.delete('/:id', containerControllers.delete_container)
router.get('/:id', containerControllers.get_container_by_id)
router.get('/location/:locId', containerControllers.get_containers_by_location)

export default router 