import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import IssueArticle from 'App/Models/IssueArticle';
import {
	AddIssueAritcleValidator,
	UpdateIssueAritcleStatusValidator,
	UpdateIssueAritcleValidator,
} from 'App/Validators/IssueValidator';
import IssueArticleHelper from 'App/Helpers/IssueArticleHelper';
import IssueHelper from 'App/Helpers/IssueHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import FileHelper from 'App/Helpers/FileHelper';
import { cuid } from '@ioc:Adonis/Core/Helpers';

export default class IssueArticlesController {
	public async list({ view }: HttpContextContract) {
		const columns = IssueArticleHelper.getTableColumns();
		const formFields = await IssueArticleHelper.getFormFields();
		const filters = await IssueArticleHelper.getFilterDropdowns(formFields);
		const extraBtns = IssueArticleHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Issue Articles',
			form_name: 'Issue Article',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: true,
			is_addable: true,
			is_status_updateable: true,
		});
	}

	public async pagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await IssueArticleHelper.getPaginationData(paginationSearchData);

		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async showUpdatePage({ response, params, view }: HttpContextContract) {
		const issueArticle = await IssueArticle.find(params.id || 0);
		if (!issueArticle) {
			return response.redirect().toRoute('issue_articles');
		}
		return view.render('update_issue_article', {
			page_name: 'Update News Article',
			issues: await IssueHelper.getAllIssues(),
			issue_article: issueArticle,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		// console.log('info_file: ', request.file('info_file')?.type);
		// console.log('policy_file: ', request.file('policy_file')?.type);
		// console.log('research_file: ', request.file('research_file')?.type);
		const requestData = await request.validate(AddIssueAritcleValidator);

		const issueData = {
			en_title: requestData.title_in_en,
			ar_title: requestData.title_in_ar,
			name_en: requestData.name_in_en,
			name_ar: requestData.name_in_ar,
			email: requestData.email,
			page_no: requestData.page_no,
			doi_link: requestData.doi_link,
			issue_id: requestData.issue,
			en_description: requestData.description_in_en,
			ar_description: requestData.description_in_ar,
			research_file: requestData.research_file,
			is_approved: true,
		};
		const [isCreated, message] = await IssueArticleHelper.addNewArticle(issueData);
		if (!isCreated) {
			return response.status(500).json({
				status: false,
				message: `Can not add Issue due to '${message}'.`,
			});
		}
		return response.status(200).json({
			staus: true,
			message: `Issue added succuessfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateIssueAritcleValidator);
		const issueArticle = await IssueArticle.query().where('id', requestData.id).first();
		if (!issueArticle) {
			return response.status(400).json({
				status: false,
				message: `No issue article found with provided id '${requestData.id}'.`,
			});
		}

		if (requestData.research_file) {
			// file has been updated, replace it
			const fileName = `${cuid()}.${requestData.research_file.extname}`;
			const [isSaved, message] = await FileHelper.replaceAssetToPublic(
				requestData.research_file,
				issueArticle.research_file_name,
				fileName,
				'uploads',
				'issues',
				'research'
			);
			if (!isSaved) {
				return response.status(400).json({
					status: false,
					message: message,
				});
			}
			issueArticle.research_file_name = fileName;
		}

		issueArticle.en_title = requestData.title_in_en;
		issueArticle.ar_title = requestData.title_in_ar;
		issueArticle.name_en = requestData.name_in_en;
		issueArticle.name_ar = requestData.name_in_ar;
		issueArticle.page_no = requestData.page_no;
		issueArticle.doi_link = requestData.doi_link;
		issueArticle.issue_id = requestData.issue;
		issueArticle.en_description = requestData.description_in_en;
		issueArticle.ar_description = requestData.description_in_ar;
		// issueArticle.is_approved = requestData.is_approved
		// 	? requestData.is_approved === 'on'
		// 		? true
		// 		: false
		// 	: issueArticle.is_approved;

		await issueArticle.save();
		return response.status(200).json({
			staus: true,
			message: `Issue article updated successfully.`,
			data: {},
		});
	}

	public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateIssueAritcleStatusValidator);
		const isseuArticle = await IssueArticle.query().where('id', requestData.id).first();
		if (!isseuArticle) {
			return response.status(400).json({
				status: false,
				message: `No issue article found with provided id '${requestData.id}'.`,
			});
		}
		isseuArticle.is_approved = requestData.status === '1' ? true : false;
		await isseuArticle.save();
		return response.status(200).json({
			staus: true,
			message: `Issue article's status changed successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await IssueArticleHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(500).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Issue article deleted successfully.`,
			data: {},
		});
	}
}
