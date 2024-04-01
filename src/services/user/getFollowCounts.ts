import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const getFollowCountsEvents = {
	SUCCESS: 'SUCCESS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	CANT_GET_USER: 'CANT_GET_USER',
	CANT_GET_FOLLOWERS: 'CANT_GET_FOLLOWERS'
};

export default async function getFollowCountsService(
	userId: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error)
		return serviceToController(getFollowCountsEvents.CANT_GET_USER);

	if (!user.data)
		return serviceToController(getFollowCountsEvents.USER_NOT_FOUND);

	return serviceToController(getFollowCountsEvents.SUCCESS, {
		following: user.data.following?.length.toString(),
		followers: user.data.followers?.length.toString()
	});
}
