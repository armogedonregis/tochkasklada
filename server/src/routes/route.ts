import { Router } from 'hyper-express';
import panelRoutes from './panel.routes';
import relayRoutes from './relay.routes';
import cityRoutes from './city.routes';
import locationRoutes from './location.routes';
import containerRoutes from './container.routes';
import cellRoutes from './cell.routes';
import sizeRoutes from './size.routes';

const router = new Router();

// new routes
router.use('/city', cityRoutes)
router.use('/location', locationRoutes)
router.use('/container', containerRoutes)
router.use('/cell', cellRoutes)
router.use('/size', sizeRoutes)

router.use('/panels', panelRoutes)
router.use('/relays', relayRoutes)

export default router;  