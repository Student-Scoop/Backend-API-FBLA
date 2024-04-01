import { Router } from 'express';
import AuthController from '@/controllers/auth';
import { validate } from '@/middleware/validation/validate';

import {
	loginValidation,
	loginWithGoogleValidation,
	registerValidation
} from '@/middleware/validation/rules';

const authRouter = Router();

authRouter.post('/login', loginValidation, validate, AuthController.login);
authRouter.post(
	'/google',
	loginWithGoogleValidation,
	validate,
	AuthController.loginGoogle
);

authRouter.post('/signup', registerValidation, validate, AuthController.signup);

export default authRouter;
