import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { createToken } from '@/lib/token';
import { serviceToController, ServiceToController } from '@/util/response';

export const signupEvents = {
	SUCCESS: 'SUCCESS',
	EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
	USER_NOT_CREATED: 'USER_NOT_CREATED',
	PORTFOLIO_NOT_SYNCED: 'PORTFOLIO_NOT_SYNCED',
	COULD_NOT_GENERATE_TOKEN: 'COULD_NOT_GENERATE_TOKEN'
};

export default async function signupService(
	name: string,
	email: string,
	username: string,
	password: string
): Promise<ServiceToController> {
	const formattedUsername = username.toLowerCase();

	const findUserByEmail = await safe(UserRepo.findUnqiueUser('email', email));

	if (findUserByEmail.data)
		return serviceToController(signupEvents.EMAIL_ALREADY_EXISTS);

	// TODO: Change to custom snowflake ID system
	const userId = uuidv4();
	const hashedPassword = await bcrypt.hash(password, 10);

	const createdUser = await safe(
		UserRepo.createUser(userId, name, email, formattedUsername, hashedPassword)
	);

	if (createdUser.error || !createdUser.data)
		return serviceToController(signupEvents.USER_NOT_CREATED);

	const token = await safe(
		createToken(createdUser.data.userId, createdUser.data.email)
	);
	if (token.error)
		return serviceToController(signupEvents.COULD_NOT_GENERATE_TOKEN);

	return serviceToController(signupEvents.SUCCESS, {
		userId: createdUser.data.userId,
		email: createdUser.data.email,
		username: createdUser.data.username,
		name: createdUser.data.name,
		avatar: createdUser.data.avatar,
		schoolName: createdUser.data.schoolName,
		schoolLocation: createdUser.data.schoolLocation,
		graduationYear: createdUser.data.graduationYear,
		degree: createdUser.data.degree,
		major: createdUser.data.major,
		sports: createdUser.data.sports,
		clubs: createdUser.data.clubs,
		followers: createdUser.data.followers?.length.toString(),
		following: createdUser.data.followers?.length.toString(),
		createdAt: createdUser.data.createdAt,
		updatedAt: createdUser.data.updatedAt,
		token: token.data.trim()
	});
}
