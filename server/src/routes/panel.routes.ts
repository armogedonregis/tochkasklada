import { Router } from 'hyper-express'
import panelController from '../controllers/panel.controller'
import { authMiddleware } from '../middlewares/auth'
import { json_checker } from '../middlewares/json_checker';

const router = new Router();

router.get('/',  panelController.getPanels)
router.post('/', json_checker, authMiddleware, panelController.createPanel)

export default router 