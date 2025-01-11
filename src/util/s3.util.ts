import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { AWSConfig } from 'src/config/config.model';

@Injectable()
export class S3Util {
	constructor(
		private configService: ConfigService<AWSConfig>
	) {
		const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', { infer: true });
		const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true });

		this.s3 = new AWS.S3({
			accessKeyId,
			secretAccessKey,
			region: 'ap-northeast-2'
		});
	}

	private s3: AWS.S3;

	public async uploadBufferedFile(params: {
		bucket: string,
		key: string,
		file: Buffer
	}) {
		const { bucket, key, file } = params;

		return this.s3.upload({
			Bucket: bucket,
			Key: key,
			Body: file
		}).promise();
	}
}
