import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';

import { IndexData } from 'app/Types';
import Index from 'App/Models/Index';

export default class IndexesController {
	public async list({ response }: HttpContextContract) {
		const indexesData = await Index.query();
		const indexes: IndexData[] = indexesData.map((index) => {
			return {
				name: index.name,
				img_url: `${Env.get('BASE_URL')}/uploads/index/${index.img_url}`,
				redirect_url: index.redirect_url,
			};
		});
		return response.status(200).json({
			status: true,
			message: `list of indices.`,
			data: {
				indices: indexes,
			},
		});
	}
}
