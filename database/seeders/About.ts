import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Page from 'App/Models/Page';

export default class AboutSeeder extends BaseSeeder {
	public async run() {
		// Write your database queries inside the run method
		await Page.create({
			title: 'en_values',
			content: '',
		});

		await Page.create({
			title: 'ar_values',
			content: '',
		});
	}
}
