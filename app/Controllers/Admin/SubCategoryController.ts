import SubCategory from 'App/Models/SubCategory';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import SubCategoryHelper from 'App/Helpers/SubCategoryHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import {
	AddSubCategoryValidator,
	UpdateSubCategoryValidator,
    UpdateSubCategoryStatusValidator
} from 'App/Validators/SubCategoryValidator';

export default class SubCategoryController {
	public async list({ view }: HttpContextContract) {

        const columns = SubCategoryHelper.getTableColumns();
        const formFields = await SubCategoryHelper.getFormFields();
		const filters = await SubCategoryHelper.getFilterDropdowns(formFields);
		const extraBtns = SubCategoryHelper.getCustomBtns();
        
		return view.render('table-master', {
			page_name: 'Sub Category',
			form_name: 'Sub Category',
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
		const paginationData = await SubCategoryHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

    public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddSubCategoryValidator);
		await SubCategory.create({
			subcat_name: requestData.subcat_name,
			category_id : requestData.category,
			status : true
		});
		return response.status(200).json({
			staus: true,
			message: `SubCategory added successfully.`,
			data: {},
		});
	}

    public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateSubCategoryValidator);
		const subCategory = await SubCategory.query().where('id', requestData.id).first();
		if (!subCategory) {
			return response.status(400).json({
				status: false,
				message: `No SubCategory found with provided id '${requestData.id}'.`,
			});
		}
		subCategory.subcat_name = requestData.subcat_name;
		subCategory.category_id = requestData.category;
		
		await subCategory.save();
		return response.status(200).json({
			staus: true,
			message: `SubCategory updated successfully.`,
			data: {},
		});
	}
    
    public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateSubCategoryStatusValidator);
		const subcategory = await SubCategory.query().where('id', requestData.id).first();
		if (!subcategory) {
			return response.status(400).json({
				status: false,
				message: `No SubCategory found with provided id '${requestData.id}'.`,
			});
		}
        subcategory.status = requestData.status === '1' ? true : false;
		await subcategory.save();
		return response.status(200).json({
			staus: true,
			message: `SubCategory status changed successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await SubCategoryHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `SubCategory deleted successfully.`,
			data: {},
		});
	}
}
