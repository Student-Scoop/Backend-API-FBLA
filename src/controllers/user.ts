import { Response } from 'express';
import httpStatus from 'http-status';
import { TypedRequest } from '@/types/request';
import { CreateResponse } from '@/util/response';

import {
	updateDataService,
	updateDataEvents,
	getFollowCountsService,
	getFollowCountsEvents,
	getUserService,
	getUserEvents,
	updateAvatarService,
	updateAvatarEvents,
	updateNotificationIdService,
	updateNotificationIdEvents
} from '@/services/user';

interface UpdateDataRequest {
	name: string;
	username: string;
	password: string;
	newPassword: string;
	schoolName: string;
	schoolLocation: string;
	graduationYear: string;
	degree: string;
	major: string;
	sports: string;
	clubs: string;
}

export default class UserController {
	static async updateData(
		req: TypedRequest<{}, {}, UpdateDataRequest>,
		res: Response
	) {
		const { userId } = req.user;
		const { 
			name,
			username, 
			password, 
			newPassword,
			schoolName,
			schoolLocation,
			graduationYear,
			degree,
			major,
			sports,
			clubs
	 } = req.body;

		const { event, data } = await updateDataService(
			userId,
			name,
			username,
			password,
			newPassword,
			schoolName,
			schoolLocation,
			graduationYear,
			degree,
			major,
			sports,
			clubs
		);

		let r = new CreateResponse(res);

		switch (event) {
			case updateDataEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case updateDataEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case updateDataEvents.INVALID_PASSWORD:
				return r.code(httpStatus.BAD_REQUEST).msg('Invalid password.').send();
			case updateDataEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could get user.')
					.send();
			case updateDataEvents.COULD_NOT_UPDATE_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not update user.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async updateAvatar(req: TypedRequest<{}, {}, {}>, res: Response) {
		let r = new CreateResponse(res);

		if (!req.file)
			return r.code(httpStatus.BAD_REQUEST).msg('No file uploaded.').send();

		const { userId } = req.user;
		const { event, data } = await updateAvatarService(userId, req.file);

		switch (event) {
			case updateAvatarEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case updateAvatarEvents.COULD_NOT_UPDATE_AVATAR:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not update avatar.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async removeAvatar(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;
		const { event, data } = await updateAvatarService(userId, null);

		let r = new CreateResponse(res);

		switch (event) {
			case updateAvatarEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case updateAvatarEvents.COULD_NOT_UPDATE_AVATAR:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not remove avatar.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getFollowCounts(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getFollowCountsService(userId);

		let r = new CreateResponse(res);

		switch (event) {
			case getFollowCountsEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getFollowCountsEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getFollowCountsEvents.CANT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get user.')
					.send();
			case getFollowCountsEvents.CANT_GET_FOLLOWERS:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get followers.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getUser(
		req: TypedRequest<{}, { id: string }, {}>,
		res: Response
	) {
		const { userId } = req.user;

		let getUserId: string;
		if (req.params.id && req.params.id.toLowerCase() === '@me') {
			getUserId = userId;
		} else {
			getUserId = req.params.id;
		}

		const { event, data } = await getUserService(getUserId);

		let r = new CreateResponse(res);

		switch (event) {
			case getUserEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getUserEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getUserEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get user.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async updateNotificationId(
		req: TypedRequest<{}, {}, { notificationId: string }>,
		res: Response
	) {
		const { userId } = req.user;
		const { notificationId } = req.body;

		const { event, data } = await updateNotificationIdService(
			userId,
			notificationId
		);

		let r = new CreateResponse(res);

		switch (event) {
			case updateNotificationIdEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getUserEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getUserEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get user.')
					.send();
			case updateNotificationIdEvents.COULD_NOT_UPDATE_NOTIFICATION_ID:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not update notification id.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}
}
