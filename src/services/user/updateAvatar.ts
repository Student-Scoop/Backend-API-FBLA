import { safe } from '@/lib/errors';
import UserRepo from '@/repository/user';
import { uploadStream } from '@/lib/cloudinary';
import { ServiceToController, serviceToController } from '@/util/response';

export const updateAvatarEvents = {
	SUCCESS: 'SUCCESS',
	COULD_NOT_UPDATE_AVATAR: 'COULD_NOT_UPDATE_AVATAR'
};

export default async function updateAvatarService(
	userId: string,
	image: any | null
): Promise<ServiceToController> {
	if (!image) {
		const updateAvatarRemoved = await safe(
			UserRepo.updateUser(userId, { avatar: '' })
		);

		if (updateAvatarRemoved.error)
			return serviceToController(updateAvatarEvents.COULD_NOT_UPDATE_AVATAR);

		return serviceToController(updateAvatarEvents.SUCCESS, {
			avatar: ''
		});
	}

	const profileImage = await uploadStream('profile_pictures', image);

	const updateAvatar = await safe(
		UserRepo.updateUser(userId, { avatar: profileImage['secure_url'] })
	);

	if (updateAvatar.error)
		return serviceToController(updateAvatarEvents.COULD_NOT_UPDATE_AVATAR);

	return serviceToController(updateAvatarEvents.SUCCESS, {
		avatar: profileImage['secure_url']
	});
}
