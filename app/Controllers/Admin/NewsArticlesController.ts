import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import { cuid } from '@ioc:Adonis/Core/Helpers';

import FileHelper from 'App/Helpers/FileHelper';
import NewsHelper from 'App/Helpers/NewsHelper';
import NewsArticle from 'App/Models/NewsArticle';
import {
	AddNewsAritcleValidator,
	UpdateNewsAritcleFeaturedStatusValidator,
	UpdateNewsAritcleStatusValidator,
	UpdateNewsAritcleValidator,
} from 'App/Validators/NewsArticleValidator';

import PaginationHelper from 'App/Helpers/PaginationHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import NewsCategoryHelper from 'App/Helpers/NewsCategoryHelper';

export default class NewsArticlesController {
	public async list({ view }: HttpContextContract) {
		const columns = NewsHelper.getTableColumns();
		const formFields = await NewsHelper.getFormFields();
		const filters = await NewsHelper.getFilterDropdowns(formFields);
		const extraBtns = NewsHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'News Articles',
			form_name: 'News Article',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: false,
			is_addable: false,
			is_status_updateable: true,
		});
	}

	public async pagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await NewsHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async showUpdatePage({ response, params, view }: HttpContextContract) {
		const newsArticle = await NewsArticle.find(params.id || 0);
		if (!newsArticle) {
			return response.redirect().toRoute('news_articles');
		}
		return view.render('update_news_article', {
			page_name: 'Update News Article',
			categories: await NewsCategoryHelper.getAllNewsCategories(),
			news_article: newsArticle,
		});
	}

	public async showAddPage({ view }: HttpContextContract) {
		return view.render('add_news_article', {
			page_name: 'Add News Article',
			categories: await NewsCategoryHelper.getAllNewsCategories(),
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddNewsAritcleValidator);
		const fileName = `${cuid()}.${requestData.image.extname}`;
		const [isSaved, message] = await FileHelper.saveAssetToPublic(
			requestData.image,
			fileName,
			'uploads',
			'news'
		);
		if (!isSaved) {
			return response.status(500).json({
				status: false,
				message: `Can not add article due to '${message}'.`,
			});
		}
		await NewsArticle.create({
			en_title: requestData.title_eng,
			ar_title: requestData.title_ar,
			category_id: requestData.category_id,
			img_name: fileName,
			ar_description: requestData.ar_description,
			en_description: requestData.en_description,
			ar_content: requestData.ar_content,
			en_content: requestData.en_content,
			written_by: requestData.written_by,
			is_published: requestData.is_published ? true : false,
		});
		return response.status(200).json({
			staus: true,
			message: `Article added succuessfully.`,
			data: {
				redirect_to: Route.makeUrl('news_articles'),
			},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateNewsAritcleValidator);
		const newsArticle = await NewsArticle.findOrFail(requestData.id);
		if (requestData.image) {
			const fileName = `${cuid()}.${requestData.image.extname}`;
			const [isReplaced, message] = await FileHelper.replaceAssetToPublic(
				requestData.image,
				newsArticle.img_name,
				fileName,
				'uploads',
				'news'
			);
			if (!isReplaced) {
				return response.status(500).json({
					status: false,
					message: `Can not update due to, '${message}'.'`,
				});
			}
			newsArticle.img_name = fileName;
		}
		newsArticle.en_title = requestData.title_eng;
		newsArticle.ar_title = requestData.title_ar;
		newsArticle.category_id = requestData.category_id;
		newsArticle.ar_description = requestData.ar_description;
		newsArticle.en_description = requestData.en_description;
		newsArticle.en_content = requestData.en_content;
		newsArticle.ar_content = requestData.ar_content;
		newsArticle.written_by = requestData.written_by;
		// newsArticle.is_published = requestData.is_published ? true : false;
		await newsArticle.save();
		return response.status(200).json({
			staus: true,
			message: `News article updated successfully.`,
			data: {
				redirect_to: Route.makeUrl('news_articles'),
			},
		});
	}

	public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateNewsAritcleStatusValidator);
		const newsArticle = await NewsArticle.findOrFail(requestData.id);
		newsArticle.is_published = requestData.status === '1' ? true : false;
		await newsArticle.save();
		return response.status(200).json({
			staus: true,
			message: `News article updated successfully.`,
			data: {},
		});
	}

	public async updateFeatured({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateNewsAritcleFeaturedStatusValidator);
		const newsArticle = await NewsArticle.findOrFail(requestData.id);
		newsArticle.is_featured = requestData.featured === '1' ? true : false;
		await newsArticle.save();
		return response.status(200).json({
			staus: true,
			message: `News article updated successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await NewsHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(500).json({
				status: false,
				message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `News article deleted successfully.`,
			data: {},
		});
	}
}
