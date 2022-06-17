import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { cuid } from '@ioc:Adonis/Core/Helpers';

import IssueHelper from 'App/Helpers/IssueHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import Issue from 'App/Models/Issue';
import { AddIssueValidator, UpdateIssueValidator } from 'App/Validators/IssueValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';
import FileHelper from 'App/Helpers/FileHelper';

export default class IssuesController {
	public async list({ view }: HttpContextContract) {
		const columns = IssueHelper.getTableColumns();
		const formFields = await IssueHelper.getFormFields();
		const filters = await IssueHelper.getFilterDropdowns(formFields);
		const extraBtns = IssueHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Issues',
			form_name: 'Issue Category',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: true,
			is_addable: true,
		});
	}

	public async pagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await IssueHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddIssueValidator);
		const fileName = `${cuid()}.${requestData.cover_image.extname}`;
		const [isSaved, message] = await FileHelper.saveAssetToPublic(
			requestData.cover_image,
			fileName,
			'uploads',
			'issues',
			'cover_imgs'
		);
		if (!isSaved) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		await Issue.create({
			year: requestData.year,
			en_name: requestData.name_in_en,
			ar_name: requestData.name_in_ar,
			cover_img: fileName,
		});
		return response.status(200).json({
			staus: true,
			message: `Issue added successfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateIssueValidator);
		const issue = await Issue.findOrFail(requestData.id);
		if (requestData.cover_image) {
			// image is updated, replace it
			const fileName = `${cuid()}.${requestData.cover_image.extname}`;
			const [isSaved, message] = await FileHelper.replaceAssetToPublic(
				requestData.cover_image,
				issue.cover_img,
				fileName,
				'uploads',
				'issues',
				'cover_imgs'
			);
			if (!isSaved) {
				return response.status(400).json({
					status: false,
					message: message,
				});
			}
			issue.cover_img = fileName;
		}
		issue.year = requestData.year;
		issue.en_name = requestData.name_in_en;
		issue.ar_name = requestData.name_in_ar;
		await issue.save();
		return response.status(200).json({
			staus: true,
			message: `Issue updated successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const issue = await Issue.findOrFail(requestData.id || 0);
		const isArticleExists = await issue.related('articles').query().first();
		if (isArticleExists) {
			return response.status(400).json({
				status: false,
				message: `Can not delete, There is articles connected to it.`,
			});
		}
		await issue.delete();
		return response.status(200).json({
			status: true,
			message: `Issue deleted successfully.`,
			data: {},
		});
	}
}
