import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const getFollowingEvents = {
	SUCCESS: 'SUCCESS',
	CANT_GET_USER: 'CANT_GET_USER',
	USER_NOT_FOUND: 'USER_NOT_FOUND'
}

export default async function getFollowingService(
	userId: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error) return serviceToController(getFollowingEvents.CANT_GET_USER);
	if (!user.data) return serviceToController(getFollowingEvents.USER_NOT_FOUND);

	const usersWithFollowingStatus = user.data.following.map((u) => {
		const isMutual = user.data.followers.includes(u);

		return { 
			followingId: u, 
			mutual: isMutual 
		};
	});

	return serviceToController(getFollowingEvents.SUCCESS, usersWithFollowingStatus);
}
