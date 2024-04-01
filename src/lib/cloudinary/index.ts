import config from '@/config/env';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import { generateRandomString } from '@/util/helpers';

cloudinary.config({
	cloud_name: config.CLOUDINARY_CLOUD_NAME,
	api_key: config.CLOUDINARY_API_KEY,
	api_secret: config.CLOUDINARY_API_SECRET
});

export async function uploadStream(folderName: string, fileBuffer: any) {
	return new Promise((resolve, reject) => {
		let stream = cloudinary.uploader.upload_stream(
			{
				folder: folderName,
				filename_override: `${Date.now().toString()}-${generateRandomString(
					24
				)}`
			},
			(error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);

		streamifier.createReadStream(fileBuffer.buffer).pipe(stream);
	});
}

export default cloudinary;
