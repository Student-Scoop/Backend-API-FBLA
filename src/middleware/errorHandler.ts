import httpStatus from 'http-status';
import { errors } from '@/lib/errors';
import { TypedRequest } from '@/types/request';
import { Response, NextFunction } from 'express';
import { CreateResponse } from '@/util/response';

export default function errorHandler(
	err: Error,
	_: TypedRequest<{}, {}, {}>,
	res: Response,
	next: NextFunction
) {
	if (res.headersSent) return next(err);

	let r = new CreateResponse(res);

	switch (err.name) {
		case errors.fileUpload.MulterError:
			return r
				.code(httpStatus.BAD_REQUEST)
				.msg('An error occured while uploading.')
				.send();
		case errors.fileUpload.INVALID_FILE_TYPE:
			return r.code(httpStatus.BAD_REQUEST).msg('Invalid file type.').send();
	}
}
