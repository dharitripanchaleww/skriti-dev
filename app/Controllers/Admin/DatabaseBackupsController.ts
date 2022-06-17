import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FileHelper from 'App/Helpers/FileHelper';

export default class DatabaseBackupsController {
	public async get({ view }: HttpContextContract) {
		const files = await FileHelper.getAllDatabaseBackupFiles();
		return view.render('database_backup', {
			pageTitle: 'Database Backups',
			page_name: 'Database Backups',
			files: files.sort().reverse(),
		});
	}

	public async takeBackup({ response }: HttpContextContract) {
		const isSaved = await FileHelper.takeBackup();
		if (!isSaved) {
			return response.redirect().back();
		}
		return response.redirect().back();
	}

	public async downloadFile({ request, response }: HttpContextContract) {
		const { file } = request.only(['file']);
		const filePath = await FileHelper.getDatabaseBackupFile(file);
		return response.status(200).attachment(filePath);
	}

	public async deleteFile({ request, response }: HttpContextContract) {
		const { file } = request.only(['file']);
		await FileHelper.deleteDBBackupFile(file);
		return response.redirect().back();
	}
}
