import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';
import { followEvents } from './follow';

export const unfollowEvents = {
	SUCCESS: 'SUCCESS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	CANT_GET_USER: 'CANT_GET_USER',
	COULD_NOT_UNFOLLOW_USER: 'COULD_NOT_UNFOLLOW_USER'
}

export default async function unfollowService(
	userId: string,
	unfollowId: string
): Promise<ServiceToController> {
		const user = await safe(UserRepo.findUnqiueUser('userId', userId));
		if (user.error) return serviceToController(unfollowEvents.CANT_GET_USER);

		const userBeingUnfollowed = await safe(UserRepo.findUnqiueUser('userId', unfollowId));
		if (userBeingUnfollowed.error) return serviceToController(unfollowEvents.CANT_GET_USER);

		const updateUserBeingUnfollowed = await safe(UserRepo.updateUser(unfollowId, {
			followers:  userBeingUnfollowed.data.followers.filter(e => e !== userId)
		}));

		if (updateUserBeingUnfollowed.error) return serviceToController(unfollowEvents.COULD_NOT_UNFOLLOW_USER);

		const updateUserThatFollowed = await safe(UserRepo.updateUser(userId, {
			following: user.data.following.filter(e => e !== unfollowId)
		}));

		if (updateUserThatFollowed.error) return serviceToController(unfollowEvents.COULD_NOT_UNFOLLOW_USER);

		return serviceToController(followEvents.SUCCESS, {
			me: {
				followingCount: updateUserThatFollowed.data.following.length,
				followersCount: updateUserThatFollowed.data.followers.length
			},
			unfollowedUser: {
				followingCount: updateUserBeingUnfollowed.data.following.length,
				followersCount: updateUserBeingUnfollowed.data.followers.length
			}
		});
}
