import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const updateNotificationIdEvents = {
	SUCCESS: 'SUCCESS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	CANT_GET_USER: 'CANT_GET_USER',
    COULD_NOT_UPDATE_NOTIFICATION_ID: 'COULD_NOT_UPDATE_NOTIFICATION_ID'
};

export default async function updateNotificationIdService(
    userId: string,
	notificationId: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error)
		return serviceToController(updateNotificationIdEvents.CANT_GET_USER);

	if (!user.data)
		return serviceToController(updateNotificationIdEvents.USER_NOT_FOUND);

    const updatedNotificationId = await safe(UserRepo.updateUser(userId, {
        notificationId
    }));
    if (updatedNotificationId.error)
        return serviceToController(updateNotificationIdEvents.COULD_NOT_UPDATE_NOTIFICATION_ID);

	return serviceToController(updateNotificationIdEvents.SUCCESS);
}
