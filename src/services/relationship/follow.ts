import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { sendPushNotifications } from '@/lib/expo';
import { ServiceToController, serviceToController } from '@/util/response';

export const followEvents = {
	SUCCESS: 'SUCCESS',
	FOLLOW_SELF: 'FOLLOW_SELF',
	CANT_GET_USER: 'CANT_GET_USER',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	CANT_FOLLOW_USER: 'CANT_FOLLOW_USER',
	USER_ALREADY_FOLLOWED: 'USER_ALREADY_FOLLOWED'
}

export default async function followService(
	userId: string,
	followId: string
): Promise<ServiceToController> {
	if (userId === followId) return serviceToController(followEvents.FOLLOW_SELF);

	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error) return serviceToController(followEvents.CANT_GET_USER);

	const followedUser = await safe(UserRepo.findUnqiueUser('userId', followId));
	if (user.error) return serviceToController(followEvents.CANT_GET_USER);

	if (!followedUser.data) return serviceToController(followEvents.USER_NOT_FOUND);

	if (user.data.following.includes(followId)) return serviceToController(followEvents.USER_ALREADY_FOLLOWED);

	const userThatFollowed = await safe(UserRepo.updateUser(userId, {
		following: [...user.data.following, followId]
	}));

	if (userThatFollowed.error) return serviceToController(followEvents.CANT_FOLLOW_USER);

	const userBeingFollowed = await safe(UserRepo.updateUser(followId, {
		followers: [...followedUser.data.followers, user.data.userId]
	}));

	if (userBeingFollowed.error) return serviceToController(followEvents.CANT_FOLLOW_USER);

	sendPushNotifications([
		{
			to: userBeingFollowed.data.notificationId,
			title: 'You have a new follower!',
			body: `${user.data.username} is now following you! Check out their profile!`,
		}
	]);

	return serviceToController(followEvents.SUCCESS, {
		me: {
			followingCount: userThatFollowed.data.following.length,
			followersCount: userThatFollowed.data.followers.length
		},
		followedUser: {
			followingCount: userBeingFollowed.data.following.length,
			followersCount: userBeingFollowed.data.followers.length
		}
	});
}
