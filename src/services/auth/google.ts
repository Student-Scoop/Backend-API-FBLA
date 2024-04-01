import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { createToken } from '@/lib/token';
import { OAuth2Client } from 'google-auth-library';
import { ServiceToController, serviceToController } from '@/util/response';

const client = new OAuth2Client();

export const googleLoginEvents = {
	SUCCESS: 'SUCCESS',
	NO_GOOGLE_PAYLOAD: 'NO_GOOGLE_PAYLOAD',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	COULD_NOT_GENERATE_TOKEN: 'COULD_NOT_GENERATE_TOKEN'
};

export default async function googleLoginService(
	googleToken: string
): Promise<ServiceToController> {
	const ticket = await client.verifyIdToken({
		idToken: googleToken,
		audience: [
			'294317333146-e1t6m7g4vhal2q5ak56cbovd18c0fuah.apps.googleusercontent.com',
			'294317333146-31btmvp1ltu2pl9jm3lg6gtn9uk0dp3c.apps.googleusercontent.com'
		]
	});

	const payload = ticket.getPayload();

	if (!payload) return serviceToController(googleLoginEvents.NO_GOOGLE_PAYLOAD);

	const associatedUser = await safe(
		UserRepo.findUnqiueUser('email', payload.email)
	);

	if (associatedUser.error)
		return serviceToController(googleLoginEvents.USER_NOT_FOUND);

	const token = await safe(
		createToken(associatedUser.data.userId, associatedUser.data.email)
	);
	if (token.error)
		return serviceToController(googleLoginEvents.COULD_NOT_GENERATE_TOKEN);

	return serviceToController(googleLoginEvents.SUCCESS, {
		userId: associatedUser.data.userId,
		email: associatedUser.data.email,
		username: associatedUser.data.username,
		name: associatedUser.data.name,
		avatar: associatedUser.data.avatar,
		schoolName: associatedUser.data.schoolName,
		schoolLocation: associatedUser.data.schoolLocation,
		graduationYear: associatedUser.data.graduationYear,
		degree: associatedUser.data.degree,
		major: associatedUser.data.major,
		sports: associatedUser.data.sports,
		clubs: associatedUser.data.clubs,
		followers: associatedUser.data.followers.length,
		following: associatedUser.data.followers.length,
		createdAt: associatedUser.data.createdAt,
		updatedAt: associatedUser.data.updatedAt,
		token: token.data.trim()
	});
}
