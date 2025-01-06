import { Module } from '@nestjs/common';
import { Backup } from './batch/backup/backup.batch';

@Module({
	providers: [
		{
			provide: 'Backup',
			useClass: Backup
		}
	]
})
export class AppModule {}
