import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseBatch } from './batch/base-batch';

async function bootstrap() {
	const args = process.argv.slice(2);
	console.log('Received arguments:', args);

	const batchName = args.shift();
	if (!batchName) {
		throw new Error('no batch name');
	}

	const appContext = await NestFactory.createApplicationContext(AppModule);
	const batch = appContext.get<BaseBatch>(batchName);

	await batch.run();

	await appContext.close();
}
bootstrap();
