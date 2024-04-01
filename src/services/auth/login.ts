import bcrypt from 'bcrypt';
import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { createToken } from '@/lib/token';
import { ServiceToController, serviceToController } from '@/util/response';

export const loginEvents = {
	SUCCESS: 'SUCCESS',
	COULD_NOT_GET_USER: 'COULD_NOT_GET_USER',
	USER_NOT_FOUND: 'LOGIN_USER_NOT_FOUND',
	INVALID_PASSWORD: 'INVALID_PASSWORD',
	COULD_NOT_GENERATE_TOKEN: 'COULD_NOT_GENERATE_TOKEN'
};

export default async function loginService(
	email: string,
	password: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('email', email));

	if (user.error) return serviceToController(loginEvents.COULD_NOT_GET_USER);

	if (!user.data) return serviceToController(loginEvents.USER_NOT_FOUND);

	const comparePassword = await bcrypt.compare(
		password,
		user.data.password.trim()
	);

	if (!comparePassword)
		return serviceToController(loginEvents.INVALID_PASSWORD);

	const token = await safe(createToken(user.data.userId, user.data.email));
	if (token.error)
		return serviceToController(loginEvents.COULD_NOT_GENERATE_TOKEN);

	return serviceToController(loginEvents.SUCCESS, {
		userId: user.data.userId,
		email: user.data.email,
		username: user.data.username,
		name: user.data.name,
		avatar: user.data.avatar,
		emailIsVerified: user.data.emailIsVerified,
		verified: user.data.verified,
		schoolName: user.data.schoolName,
		schoolLocation: user.data.schoolLocation,
		graduationYear: user.data.graduationYear,
		degree: user.data.degree,
		major: user.data.major,
		sports: user.data.sports,
		clubs: user.data.clubs,
		followers: user.data.followers.length,
		following: user.data.followers.length,
		createdAt: user.data.createdAt,
		updatedAt: user.data.updatedAt,
		token: token.data.trim()
	});
}
