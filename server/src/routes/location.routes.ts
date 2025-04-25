import { Router } from 'hyper-express'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';
import locationControllers from '@/models/location/location.controllers';

const router = new Router();

router.get('/', locationControllers.get_all_locations)
router.post('/', json_checker, locationControllers.create_location)
router.put('/:id', json_checker, locationControllers.update_location)
router.delete('/:id', locationControllers.delete_location)
router.get('/short-name/:short_name', locationControllers.get_location_by_short_name)
router.get('/city/:cityId', locationControllers.get_locations_by_city)

export default router 