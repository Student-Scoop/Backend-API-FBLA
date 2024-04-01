import multer from 'multer';
import { CustomError, errors } from '@/lib/errors';

export default function upload(filetypes: string[], sizeLimit: number) {
	return multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: sizeLimit * 1024 * 1024 },
		fileFilter: (_, file, cb: Function) => {
			for (let i = 0; i < filetypes.length; i++) {
				if (file.mimetype === filetypes[i]) {
					cb(null, true);
					return;
				}
			}

			cb(
				new CustomError({
					name: errors.fileUpload.INVALID_FILE_TYPE,
					message: 'Invalid file type'
				}),
				false
			);
		}
	});
}
