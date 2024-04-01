import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const getUserEvents = {
	SUCCESS: 'SUCCESS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	COULD_NOT_GET_USER: 'COULD_NOT_GET_USER'
};

export default async function getUserService(
	userId: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));

	if (user.error) return serviceToController(getUserEvents.COULD_NOT_GET_USER);

	if (!user.data) return serviceToController(getUserEvents.USER_NOT_FOUND);

	return serviceToController(getUserEvents.SUCCESS, {
		userId: user.data.userId,
		email: user.data.email,
		username: user.data.username,
		avatar: user.data.avatar,
		emailIsVerified: user.data.emailIsVerified,
		verified: user.data.verified,
		name: user.data.name,
		schoolName: user.data.schoolName,
		schoolLocation: user.data.schoolLocation,
		graduationYear: user.data.graduationYear,
		degree: user.data.degree,
		major: user.data.major,
		sports: user.data.sports,
		clubs: user.data.clubs,
		following: user.data.following.length,
		followers: user.data.followers.length,
		createdAt: user.data.createdAt,
		updatedAt: user.data.updatedAt
	});
}
