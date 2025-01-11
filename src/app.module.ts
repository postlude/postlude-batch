import { Module } from '@nestjs/common';
import { Backup } from './batch/backup/backup.batch';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { S3Util } from 'util/s3.util';

@Module({
	imports: [
		// When a key exists both in the runtime environment as an environment variable and in a .env file, the runtime environment variable takes precedence.
		ConfigModule.forRoot({
			envFilePath: [ 'src/config/local.env' ],
			isGlobal: true
		}),
		DatabaseModule
	],
	providers: [
		S3Util,
		{
			provide: 'Backup',
			useClass: Backup
		}
	]
})
export class AppModule {}
