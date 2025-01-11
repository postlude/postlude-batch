import { Injectable } from '@nestjs/common';
import { sync } from 'cross-spawn';
import { BaseBatch } from '../base-batch';
import { ConfigService } from '@nestjs/config';
import { MySqlConfig } from 'src/config/config.model';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class Backup extends BaseBatch {
	constructor(
		private configService: ConfigService<MySqlConfig>
	) {
		super();
	}

	private readonly TARGET_DATABASES = [ 'postlude', 'aeum_gil' ];

	public async run() {
		const host = this.configService.get('MYSQL_HOST', { infer: true });
		const port = this.configService.get('MYSQL_PORT', { infer: true });
		const user = this.configService.get('MYSQL_USERNAME', { infer: true });
		const password = this.configService.get('MYSQL_PASSWORD', { infer: true });

		if (!host || !port || !user || !password) {
			throw new Error('no mysql connection info');
		}

		const myCnfContent = `[client]\nuser=${user}\npassword=${password}`;

		const filePath = join(process.cwd(), '/src/batch/backup/my.cnf');
		// 8진수 표기법으로 600 권한
		writeFileSync(filePath, myCnfContent.trim(), { mode: 0o600 });

		for (const database of this.TARGET_DATABASES) {
			console.log(`start ${database} backup`);

			const result = sync('/opt/homebrew/opt/mysql-client/bin/mysqldump', [
				`--defaults-file=${filePath}`,
				'-h', host,
				'-P', port.toString(),
				'--no-tablespaces',
				'--add-drop-database',
				database
			], { shell: true });

			if (result.error || result.stderr.toString().length) {
				console.error(result.error);
				console.error(result.stderr.toString());
				throw new Error(`${database} dump error`);
			}

			writeFileSync(`./${database}.sql`, result.stdout);

			console.log(`end ${database} backup`);
		}
	}
}