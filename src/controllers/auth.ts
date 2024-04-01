import { Response } from 'express';
import httpStatus from 'http-status';
import { TypedRequest } from '@/types/request';
import { CreateResponse } from '@/util/response';
import {
	loginService,
	loginEvents,
	signupService,
	signupEvents,
	googleLoginService,
	googleLoginEvents
} from '@/services/auth';

export default class AuthController {
	static async login(
		req: TypedRequest<{}, {}, { email: string; password: string }>,
		res: Response
	) {
		const { email, password } = req.body;
		const { event, data } = await loginService(email, password);

		let r = new CreateResponse(res);

		switch (event) {
			case loginEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case loginEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unable to get user.')
					.send();
			case loginEvents.USER_NOT_FOUND:
				return r
					.code(httpStatus.BAD_REQUEST)
					.msg('Invalid login details.')
					.send();
			case loginEvents.INVALID_PASSWORD:
				return r
					.code(httpStatus.BAD_REQUEST)
					.msg('Invalid login details.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Internal server error.')
					.send();
		}
	}

	static async loginGoogle(
		req: TypedRequest<{}, {}, { token: string }>,
		res: Response
	) {
		const { token } = req.body;
		const { event, data } = await googleLoginService(token);

		let r = new CreateResponse(res);

		switch (event) {
			case googleLoginEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case googleLoginEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Internal server error.')
					.send();
		}
	}

	static async signup(
		req: TypedRequest<
			{},
			{},
			{ name: string; email: string; username: string; password: string }
		>,
		res: Response
	) {
		const { name, email, username, password } = req.body;
		const { event, data } = await signupService(
			name,
			email,
			username,
			password
		);

		let r = new CreateResponse(res);

		switch (event) {
			case signupEvents.SUCCESS:
				return r.code(httpStatus.CREATED).payload(data).send();
			case signupEvents.EMAIL_ALREADY_EXISTS:
				return r
					.code(httpStatus.BAD_REQUEST)
					.msg('Email already exists.')
					.send();
			case signupEvents.USER_NOT_CREATED:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('User not created.')
					.send();
			case signupEvents.PORTFOLIO_NOT_SYNCED:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Portfolio not synced.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Internal server error.')
					.send();
		}
	}
}
