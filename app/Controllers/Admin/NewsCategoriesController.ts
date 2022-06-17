import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import NewsCategoryHelper from 'App/Helpers/NewsCategoryHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import NewsCategory from 'App/Models/Newscategory';
import {
	AddNewsCategoryValidator,
	UpdateNewsCategoryValidator,
} from 'App/Validators/NewsCategoryValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class NewsCategoriesController {
	public async list({ view }: HttpContextContract) {
		const columns = NewsCategoryHelper.getTableColumns();
		const formFields = await NewsCategoryHelper.getFormFields();
		const filters = await NewsCategoryHelper.getFilterDropdowns(formFields);
		const extraBtns = NewsCategoryHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'News Categories',
			form_name: 'News Category',
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
		const paginationData = await NewsCategoryHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddNewsCategoryValidator);
		await NewsCategory.create({
			en_name: requestData.name_in_en,
			en_about: requestData.about_in_en,
			ar_name: requestData.name_in_ar,
			ar_about: requestData.about_in_ar,
		});
		return response.status(200).json({
			staus: true,
			message: `News category added successfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateNewsCategoryValidator);
		const newsCategory = await NewsCategory.findOrFail(requestData.id);
		newsCategory.en_name = requestData.name_in_en;
		newsCategory.ar_name = requestData.name_in_ar;
		newsCategory.en_about = requestData.about_in_en;
		newsCategory.ar_about = requestData.about_in_ar;
		await newsCategory.save();
		return response.status(200).json({
			staus: true,
			message: `News category updated successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await NewsCategoryHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `News category deleted successfully.`,
			data: {},
		});
	}
}
