import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';

import IssueHelper from 'App/Helpers/IssueHelper';
import {
	GetIssueArticleDetailsValidator,
	GetIssueArticlesForHomePageValidator,
	GetIssueArticlesValidator,
	SearchIssueValidator,
	SubmitResearchValidator,
} from 'App/Validators/IssueValidator';
import { AddIssueArticle } from 'app/Types';
import IssueArticleHelper from 'App/Helpers/IssueArticleHelper';
import Issue from 'App/Models/Issue';
import IssueArticle from 'App/Models/IssueArticle';

export default class IssuesController {
	public async list({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const issues = await IssueHelper.getAllIssuesByLang(lang);
		return response.status(200).json({
			status: true,
			message: `list of all issues for lang. '${lang}'`,
			data: {
				issues,
			},
		});
	}

	public async getArticles({ request, response, params }: HttpContextContract) {
		const requestData = await request.validate(GetIssueArticlesValidator);
		const lang = params.lang;
		const articles = await IssueHelper.getArticls(requestData.id, lang);
		return response.status(200).json({
			status: true,
			message: `list of articles for issue_id '${requestData.id}' and lang '${lang}'.`,
			data: {
				articles,
			},
		});
	}

	public async getArticlesForHomePage({ request, response, params }: HttpContextContract) {
		const requestData = await request.validate(GetIssueArticlesForHomePageValidator);
		const lang = params.lang;
		if (requestData.type === 'latest') {
			const articles = await IssueArticleHelper.getLatestArticles(lang, 5, true);
			return response.status(200).json({
				status: true,
				message: `latest 4 articles and lang '${lang}'.`,
				data: {
					articles,
				},
			});
		}
		if (requestData.type === 'most-downloaded') {
			const mostDownloadedArticles = await IssueArticleHelper.getArticlesByCount(
				lang,
				6,
				'download'
			);
			return response.status(200).json({
				status: true,
				message: `most downloaded 5 articles for lang '${lang}'.`,
				data: {
					articles: mostDownloadedArticles,
				},
			});
		}
		const mostReadArticles = await IssueArticleHelper.getArticlesByCount(lang, 5, 'read');
		return response.status(200).json({
			status: true,
			message: `most read 5 articles for lang '${lang}'.`,
			data: {
				articles: mostReadArticles,
			},
		});
	}

	public async getIssueArticle({ request, params, response }: HttpContextContract) {
		const requestData = await request.validate(GetIssueArticleDetailsValidator);
		const lang = params.lang;
		const article = await IssueHelper.getArticleDetails(requestData.id, lang);
		return response.status(200).json({
			status: true,
			message: `all details of issue article '${lang}'.`,
			data: {
				article,
			},
		});
	}

	public async submitResearch({ request, response }: HttpContextContract) {
		const requestData = await request.validate(SubmitResearchValidator);
		const issue = await Issue.query().orderBy('id', 'desc').first();
		const issueData: AddIssueArticle = {
			en_title: requestData.title,
			ar_title: requestData.title,
			name_en: requestData.name,
			name_ar: requestData.name,
			email: requestData.email,
			issue_id: issue!.id, // adding any new research in to latest issue.
			doi_link: '',
			page_no: '0-0',
			en_description: requestData.description,
			ar_description: requestData.description,
			research_file: requestData.research_file,
			is_approved: false,
		};
		const [isCreated, message] = await IssueArticleHelper.addNewArticle(issueData);
		if (!isCreated) {
			return response.status(200).json({
				status: false,
				message: `Can not add Issue due to '${message}'.`,
			});
		}
		return response.status(200).json({
			status: true,
			message: 'Research submitted succesfully.',
		});
	}

	public async search({ request, params, response }: HttpContextContract) {
		const { search } = await request.validate(SearchIssueValidator);
		const lang = params.lang;
		const articles = await IssueArticleHelper.search(search, lang);
		return response.status(200).json({
			status: true,
			message: `search result for query '${search}' where lang. is '${lang}'.`,
			data: {
				articles,
			},
		});
	}

	public async getResearchFile({ params, response }: HttpContextContract) {
		const id = params.id;
		const issueArticle = await IssueArticle.query()
			.where({
				id: id || 0,
				is_approved: true,
			})
			.first();
		if (!issueArticle) {
			return response.status(200).json({
				status: false,
				message: `No issue article found.`,
			});
		}
		issueArticle.download_count++;
		await issueArticle.save();
		// return response.status(200).json({
		// 	status: true,
		// 	message: `Download link for issue.`,
		// 	data: {
		// 		url: `${Env.get('BASE_URL')}/uploads/issues/research/${issueArticle.research_file_name}`
		// 	}
		// })
		return response.attachment(
			Application.publicPath('uploads', 'issues', 'research', issueArticle.research_file_name)
		);
	}
}
