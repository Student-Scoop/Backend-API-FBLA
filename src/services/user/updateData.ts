import bcrypt from 'bcrypt';
import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { ServiceToController, serviceToController } from '@/util/response';

export const updateDataEvents = {
	SUCCESS: 'SUCCESS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	INVALID_PASSWORD: 'INVALID_PASSWORD',
	COULD_NOT_GET_USER: 'COULD_NOT_GET_USER',
	COULD_NOT_UPDATE_USER: 'COULD_NOT_UPDATE_USER'
};

export default async function updateDataService(
	userId: string,
	name: string,
	username: string,
	password: string,
	newPassword: string,
	schoolName: string,
	schoolLocation: string,
	graduationYear: string,
	degree: string,
	major: string,
	sports: string,
	clubs: string
): Promise<ServiceToController> {
	const user = await safe(UserRepo.findUnqiueUser('userId', userId));

	if (user.error)
		return serviceToController(updateDataEvents.COULD_NOT_GET_USER);

	if (!user.data) return serviceToController(updateDataEvents.USER_NOT_FOUND);

	if (
		password &&
		password.length > 0 &&
		!(await bcrypt.compare(password, user.data.password))
	)
		return serviceToController(updateDataEvents.INVALID_PASSWORD);

	const updatedUser = await safe(
		UserRepo.updateUser(user.data.userId, {
			name: name || undefined,
			username: username ? username.trim() : undefined,
			password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
			schoolName: schoolName || undefined,
			schoolLocation: schoolLocation || undefined,
			graduationYear: graduationYear || undefined,
			degree: degree || undefined,
			major: major || undefined,
			sports: sports || undefined,
			clubs: clubs || undefined
		})
	);

	if (updatedUser.error)
		return serviceToController(updateDataEvents.COULD_NOT_UPDATE_USER);

	if (updatedUser)
		return serviceToController(updateDataEvents.SUCCESS, {
			userId: updatedUser.data.userId,
			email: updatedUser.data.email,
			username: updatedUser.data.username,
			avatar: updatedUser.data.avatar,
			emailIsVerified: updatedUser.data.emailIsVerified,
			verified: updatedUser.data.verified,
			name: updatedUser.data.name,
			schoolName: updatedUser.data.schoolName,
			schoolLocation: updatedUser.data.schoolLocation,
			graduationYear: updatedUser.data.graduationYear,
			degree: updatedUser.data.degree,
			major: updatedUser.data.major,
			sports: updatedUser.data.sports,
			clubs: updatedUser.data.clubs,
			followersCount: updatedUser.data.followers?.length.toString(),
			followingCount: updatedUser.data.following?.length.toString(),
			createdAt: updatedUser.data.createdAt,
			updatedAt: updatedUser.data.updatedAt
		});
}