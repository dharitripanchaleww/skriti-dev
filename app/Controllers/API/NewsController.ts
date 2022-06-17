import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CategoryHelper from 'App/Helpers/CategoryHelper';
import NewsHelper from 'App/Helpers/NewsHelper';

import {
	GetNewsArticleDetailsValidator,
	GetNewsArticlesValidator,
} from 'App/Validators/NewsArticleValidator';

export default class NewsController {
	
	// 13-06-2022
	public async getCategories({ response, auth }: HttpContextContract) {
		try {
			// console.log('error');

			await auth.check()
			//return response.json('You are logged in')
		  
		//const lang = params.lang;
		//const categories = await NewsHelper.getCategoriesByLang(lang);
		 const categories = await CategoryHelper.getAllCategories(); // 13-06-2022
		return response.status(200).json({
			status: true,
			message: `all categories data.`,
			data: {
				categories,
			},
		});
		} catch (error) {
			console.log(error);
			
			return	response.json('You are not logged in')
	    }
	}

	

	public async getNewsArticles({ request, params, response }: HttpContextContract) {
		const requestData = await request.validate(GetNewsArticlesValidator);
		const lang = params.lang;
		const articles = await NewsHelper.getArticlesByCategory(requestData.id, lang);
		return response.status(200).json({
			status: true,
			message: `list of all articles for lang '${lang}'.`,
			data: {
				articles,
			},
		});
	}

	public async getHomeNewsArticles({ request, params, response }: HttpContextContract) {
		const requestData = request.only(['limit']);
		const lang = params.lang;
		const articles = await NewsHelper.getArticlesForHomePage(
			requestData.limit == 5 ? 5 : 15,
			lang
		);
		return response.status(200).json({
			status: true,
			message: `list of all articles for lang '${lang}'.`,
			data: {
				articles,
			},
		});
	}

	public async getNewsArticle({ request, params, response }: HttpContextContract) {
		const requestData = await request.validate(GetNewsArticleDetailsValidator);
		const lang = params.lang;
		const article = await NewsHelper.getArticleDetails(requestData.id, lang);
		return response.status(200).json({
			status: true,
			message: `all details of news article '${lang}'.`,
			data: {
				article,
			},
		});
	}
}
