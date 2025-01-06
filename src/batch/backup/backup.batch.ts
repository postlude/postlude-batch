import { Injectable } from '@nestjs/common';
import { BaseBatch } from '../base-batch';

@Injectable()
export class Backup extends BaseBatch {
	public async run() {
		console.log('run backup batch');
	}
}