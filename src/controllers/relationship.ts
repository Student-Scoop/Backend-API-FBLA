import { Response } from 'express';
import httpStatus from 'http-status';
import { TypedRequest } from '@/types/request';
import { CreateResponse } from '@/util/response';

import {
	followService,
	followEvents,
	unfollowService,
	unfollowEvents,
	getFollowersService,
	getFollowersEvents,
	getFollowingService,
	getFollowingEvents,
	searchUserService,
	searchUserEvents
} from '@/services/relationship';

export default class RelationshipController {
	static async follow(
		req: TypedRequest<{}, {}, { followId: string }>,
		res: Response
	) {
		const { userId } = req.user;
		const { followId } = req.body;

		const { event, data } = await followService(userId, followId);

		let r = new CreateResponse(res);

		switch (event) {
			case followEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case followEvents.FOLLOW_SELF:
				return r
					.code(httpStatus.BAD_REQUEST)
					.msg('Cannot follow yourself.')
					.send();
			case followEvents.CANT_FOLLOW_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not follow user.')
					.send();
			case followEvents.USER_ALREADY_FOLLOWED:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('User already followed.')
					.send();
			case followEvents.CANT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Cant get user.')
					.send();
			case followEvents.USER_NOT_FOUND:
				return r
					.code(httpStatus.NOT_FOUND)
					.msg('User not found.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async unfollow(
		req: TypedRequest<{}, {}, { unfollowId: string }>,
		res: Response
	) {
		const { userId } = req.user;
		const { unfollowId } = req.body;

		const { event, data } = await unfollowService(userId, unfollowId);

		let r = new CreateResponse(res);

		switch (event) {
			case unfollowEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case unfollowEvents.COULD_NOT_UNFOLLOW_USER:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Could not unfollow user.').send();
			case unfollowEvents.CANT_GET_USER:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Cant get user.').send();
			case unfollowEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getFollowers(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;
		const { event, data } = await getFollowersService(userId);

		let r = new CreateResponse(res);

		switch (event) {
			case getFollowersEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getFollowersEvents.CANT_GET_USER:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Cant get user.').send();
			case getFollowersEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getFollowing(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;
		const { event, data } = await getFollowingService(userId);

		let r = new CreateResponse(res);

		switch (event) {
			case getFollowingEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getFollowingEvents.CANT_GET_USER:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Cant get user.').send();
			case getFollowersEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async searchUser(
		req: TypedRequest<{ query: string }, {}, {}>,
		res: Response
	) {
		const { userId } = req.user;
		const { query } = req.query;

		let r = new CreateResponse(res);

		if (query.trim() === '')
			return r
				.code(httpStatus.BAD_REQUEST)
				.msg('Query cannot be empty.')
				.send();

		const { event, data } = await searchUserService(userId, query);

		switch (event) {
			case searchUserEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case searchUserEvents.NO_RESULTS:
				return r.code(httpStatus.NO_CONTENT).msg('No results found.').send();
			case searchUserEvents.CANT_SEARCH:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Unable to search.').send();
			case getFollowingEvents.CANT_GET_USER:
				return r.code(httpStatus.INTERNAL_SERVER_ERROR).msg('Cant get user.').send();
			case getFollowersEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NO_CONTENT).msg('User not found.').send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}
}
