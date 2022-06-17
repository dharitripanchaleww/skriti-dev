import Application from '@ioc:Adonis/Core/Application';
import { fsReadAll } from '@ioc:Adonis/Core/Helpers';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';

import { DatabaseBackupFileList } from 'app/Types';

import { unlink } from 'fs/promises';

export default class FileHelper {
	public static async getAllIconsFor(type: string): Promise<string[]> {
		const paths = fsReadAll(Application.publicPath('icons', type), (filePath) => {
			return (
				filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')
			);
		});
		return paths;
	}
	public static async saveAssetToPublic(
		file: MultipartFileContract,
		name: string,
		...paths: string[]
	): Promise<[boolean, string]> {
		if (await this.isFileExists(name, ...paths))
			return [false, 'File already exist with provided name.'];
		await file.move(Application.publicPath(...paths), {
			name: name,
		});
		return [true, 'Saved successfully.'];
	}
	public static async replaceAssetToPublic(
		file: MultipartFileContract,
		oldFileName: string,
		newFileName: string,
		...paths: string[]
	): Promise<[boolean, string]> {
		// delete old file
		if (oldFileName == null) {
			await file.move(Application.publicPath(...paths), {
				name: newFileName,
			});
			return [true, 'Added successfully.'];
		} else {
			const [isDeleted, message] = await this.deleteAssetToPublic(oldFileName, ...paths);
			if (!isDeleted) return [false, message];
			await file.move(Application.publicPath(...paths), {
				name: newFileName,
			});
			return [true, 'Replaced successfully.'];			
		}

	}
	public static async deleteAssetToPublic(
		name: string,
		...paths: string[]
	): Promise<[boolean, string]> {
		if (!(await this.isFileExists(name, ...paths)))
			return [false, 'There is no file to delete.'];
		try {
			await unlink(Application.publicPath(...paths, name));
		} catch (error) {
			console.error('there was an error:', error.message);
			return [false, `Can not delete '${name}' due to '${error.message}'.`];
		}
		return [true, 'Deleted successfully.'];
	}
	public static async isFileExists(name: string, ...paths: string[]): Promise<Boolean> {
		const files = fsReadAll(Application.publicPath(...paths), () => true);
		return files.includes(name);
	}

	public static async getAllDatabaseBackupFiles(): Promise<DatabaseBackupFileList> {
		const paths = fsReadAll(Application.tmpPath('database_backups'), (filePath) => {
			return filePath.endsWith('.sql');
		});
		return paths;
	}

	public static async takeBackup(): Promise<Boolean> {
		const util = require('util');
		const exec = util.promisify(require('child_process').exec);
		const fileName = `${Env.get('MYSQL_DB_NAME')}_${DateTime.now()
			.toUTC()
			.toFormat('dd_MM_yyyy_hh_mm_ss')}.sql`;
		const outputPath = Application.tmpPath('database_backups', fileName);
		const commandPath =
			Env.get('NODE_ENV') === 'development'
				? 'D:\\xampp\\mysql\\bin\\mysqldump'
				: 'mysqldump';
		try { 
			const password = (Env.get('MYSQL_PASSWORD') == undefined) ? "": Env.get('MYSQL_PASSWORD');

			const command = `${commandPath} -h ${Env.get('MYSQL_HOST')} -u ${Env.get('MYSQL_USER')} ${Env.get('MYSQL_DB_NAME')} > ${outputPath}`;
			// const commant = `${commandPath} -h ${Env.get('MYSQL_HOST')} -u ${Env.get('MYSQL_USER')} -p ${password} ${Env.get('MYSQL_DB_NAME')} > ${outputPath}`;
			await exec(command);
			return false;
		} catch (err) {
			console.log('can not take backup', err);
			return true;
		}
	}

	public static async getDatabaseBackupFile(file: string): Promise<string> {
		const filePath = Application.tmpPath('database_backups', file);
		return filePath;
	}

	public static async deleteDBBackupFile(file: string): Promise<Boolean> {
		try {
			await unlink(Application.tmpPath('database_backups', file));
		} catch (error) {
			console.error('there was an error:', error.message);
			return false;
		}
		return true;
	}
}
