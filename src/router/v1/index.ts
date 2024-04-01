import { Router } from 'express';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import relationshipRouter from './routes/relationship';

import auth from '@/middleware/security/auth';

const versionOneRouter = Router();

versionOneRouter.use('/auth', authRouter);
versionOneRouter.use('/users', auth, userRouter);
versionOneRouter.use('/relationship', auth, relationshipRouter);

export default versionOneRouter;
