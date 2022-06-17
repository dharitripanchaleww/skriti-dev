import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { cuid } from '@ioc:Adonis/Core/Helpers';

import Index from 'App/Models/Index';
import { AddIndexValidator, UpdateIndexValidator } from 'App/Validators/IndexValidator';
import FileHelper from 'App/Helpers/FileHelper';
import IndexHelper from 'App/Helpers/IndexHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import PaginationHelper from 'App/Helpers/PaginationHelper';

export default class IndexesController {
	public async list({ view }: HttpContextContract) {
		const columns = IndexHelper.getTableColumns();
		const formFields = await IndexHelper.getFormFields();
		const filters = await IndexHelper.getFilterDropdowns(formFields);
		const extraBtns = IndexHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Indexe & Database',
			form_name: 'Index & Database',
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
		const paginationData = await IndexHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddIndexValidator);
		const fileName = `${cuid()}.${requestData.image.extname}`;
		const [isSaved, message] = await FileHelper.saveAssetToPublic(
			requestData.image,
			fileName,
			'uploads',
			'index'
		);
		if (!isSaved) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		await Index.create({
			name: requestData.name,
			redirect_url: requestData.redirect_url,
			img_url: fileName,
		});
		return response.status(200).json({
			status: true,
			message: `Index added successfully.`,
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateIndexValidator);
		const index = await Index.findOrFail(requestData.id);
		if (requestData.image) {
			// image is updated, replace it
			const fileName = `${cuid()}.${requestData.image.extname}`;
			const [isSaved, message] = await FileHelper.replaceAssetToPublic(
				requestData.image,
				index.img_url,
				fileName,
				'uploads',
				'index'
			);
			if (!isSaved) {
				return response.status(400).json({
					status: false,
					message: message,
				});
			}
			index.img_url = fileName;
		}
		index.name = requestData.name;
		index.redirect_url = requestData.redirect_url;
		await index.save();
		return response.status(200).json({
			status: true,
			message: `Index updated successfully.`,
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await IndexHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(500).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Index deleted successfully.`,
			data: {},
		});
	}
}
