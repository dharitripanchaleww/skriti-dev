import Category from 'App/Models/Category';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import CategoryHelper from 'App/Helpers/CategoryHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import FileHelper from 'App/Helpers/FileHelper';
import {
	AddCategoryValidator,
	UpdateCategoryValidator,
    UpdateCategoryStatusValidator
} from 'App/Validators/CategoryValidator';

export default class CategoryController {
	public async list({ view }: HttpContextContract) {

		const columns = CategoryHelper.getTableColumns();
        //console.log(columns);
		const formFields = await CategoryHelper.getFormFields();
		const filters = await CategoryHelper.getFilterDropdowns(formFields);
		const extraBtns = CategoryHelper.getCustomBtns();
        
        
		return view.render('table-master', {
			page_name: 'Category',
			form_name: 'category',
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
		const paginationData = await CategoryHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

    public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddCategoryValidator);

		const fileName = `${cuid()}.${requestData.image.extname}`;
		const [isSaved, message] = await FileHelper.saveAssetToPublic(
			requestData.image,
			fileName,
			'uploads',
			'category'
		);
		if (!isSaved) {
			return response.status(500).json({
				status: false,
				message: `Can not add article due to '${message}'.`,
			});
		}
		await Category.create({
			category_name: requestData.category_name,
			image : fileName,
			status : true
		});
		return response.status(200).json({
			staus: true,
			message: `Category added successfully.`,
			data: {},
		});
	}

    public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateCategoryValidator);
		const category = await Category.findOrFail(requestData.id);

		if(requestData.image)  {
			const fileName = `${cuid()}.${requestData.image.extname}`;
			const [isReplaced, message] = await FileHelper.replaceAssetToPublic(
				requestData.image,
				category.image,
				fileName,
				'uploads',
				'category'
			);
			
			if (!isReplaced) {
				return response.status(500).json({
					status: false,
					message: `Can not update due to, '${message}'.'`,
				});
			}
			category.image = fileName;
		}
		
		category.category_name = requestData.category_name;
		await category.save();
		return response.status(200).json({
			staus: true,
			message: `Category updated successfully.`,
			data: {},
		});
	}
    
    public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateCategoryStatusValidator);
		const category = await Category.query().where('id', requestData.id).first();
		if (!category) {
			return response.status(400).json({
				status: false,
				message: `No category found with provided id '${requestData.id}'.`,
			});
		}
        category.status = requestData.status === '1' ? true : false;
		await category.save();
		return response.status(200).json({
			staus: true,
			message: `Category status changed successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await CategoryHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Category deleted successfully.`,
			data: {},
		});
	}
}
