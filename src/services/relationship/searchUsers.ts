import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const searchUserEvents = {
	SUCCESS: 'SUCCESS',
	NO_RESULTS: 'NO_RESULTS',
	CANT_SEARCH: 'CANT_SEARCH',
	CANT_GET_USER: 'CANT_GET_USER',
	USER_NOT_FOUND: 'USER_NOT_FOUND'
}

export default async function searchUserService(
	userId: string,
	query: string
): Promise<ServiceToController> {
	const users = await safe(UserRepo.searchUsers(query.toString(), 15));
	if (users.error) return serviceToController(searchUserEvents.CANT_SEARCH);

	if (!users.data || users.data.length === 0) return serviceToController(searchUserEvents.NO_RESULTS);

	const user = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (user.error) return serviceToController(searchUserEvents.CANT_GET_USER)
	if (!user.data) return serviceToController(searchUserEvents.USER_NOT_FOUND);

	let updatedUsers: Array<{
		userId: string;
		name: string;
		username: string;
		isFollowed: boolean;
		avatar: string | null;
	}> = [];

	const searchedUsersWithFollowStatus = users.data.map((u) => {
		const isFollowed = user.data.following.includes(u.userId);
		return { ...u, isFollowed };
	});

	updatedUsers = searchedUsersWithFollowStatus;

	return serviceToController(searchUserEvents.SUCCESS, updatedUsers);
}
