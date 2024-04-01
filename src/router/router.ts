import v1Routes from './v1';
import { Router } from 'express';
import config from '@/config/env';

const router = Router();

/* API Versioning */
router.use('/v1', v1Routes);

router.use(config.API_SUB_URL ? '/api' : '/', router);

export default router;
