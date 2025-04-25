import { Router } from 'hyper-express'
import relayController from '../controllers/relay.controller'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';

const router = new Router();

router.post('/relays/:id/toggle', json_checker, authMiddleware, relayController.toggleRelay)

export default router 