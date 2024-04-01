import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const getFollowersEvents = {
	SUCCESS: 'SUCCESS',
	CANT_GET_USER: 'CANT_GET_USER',
	USER_NOT_FOUND: 'USER_NOT_FOUND', 
}

export default async function getFollowersService(
	userId: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error) return serviceToController(getFollowersEvents.CANT_GET_USER);
	if (!user.data) return serviceToController(getFollowersEvents.USER_NOT_FOUND);

	const usersWithFollowStatus = user.data.followers.map((u) => {
		const isMutual = user.data.following.includes(u);

		return { 
			followerId: u, 
			mutual: isMutual 
		};
	});

	return serviceToController(getFollowersEvents.SUCCESS, usersWithFollowStatus);
}
