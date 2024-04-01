import { Router } from 'express';
import UserController from '@/controllers/user';
import upload from '@/middleware/uploader/upload';
import { validate } from '@/middleware/validation/validate';

import {
	followerFollowingValidator,
	updateDataValidator,
	updateNotificationIdValidator
} from '@/middleware/validation/rules';

const userRouter = Router();

userRouter.get('/:id', UserController.getUser);

userRouter.put('/@me/update',
	updateDataValidator,
	validate,
	UserController.updateData
);

userRouter.post(
	'/@me/update-avatar',
	upload(['image/jpeg', 'image/png', 'image/jpg'], 10).single('image'),
	UserController.updateAvatar
);

userRouter.post('/@me/update-notification-id', updateNotificationIdValidator, validate, UserController.updateNotificationId);

userRouter.get('/@me/remove-avatar', UserController.removeAvatar);

userRouter.get(
	'/@me/follow-counts',
	followerFollowingValidator,
	UserController.getFollowCounts
);

export default userRouter;
