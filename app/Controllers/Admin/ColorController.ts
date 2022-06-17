import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import ColorHelper from 'App/Helpers/ColorHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';

import {
	AddColorValidator,
	UpdateColorValidator,
    UpdateColorStatusValidator
} from 'App/Validators/ColorValidator';
import Color from 'App/Models/Color';

export default class ColorController {
	public async list({ view }: HttpContextContract) {

		const columns = ColorHelper.getTableColumns();
        //console.log(columns);
		const formFields = await ColorHelper.getFormFields();
		const filters = await ColorHelper.getFilterDropdowns(formFields);
		const extraBtns = ColorHelper.getCustomBtns();
                
		return view.render('table-master', {
			page_name: 'Colors',
			form_name: 'color',
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
		const paginationData = await ColorHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

    public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddColorValidator);
		await Color.create({
			color_name: requestData.color_name,
			color_code: requestData.color_code,			
			status : true
		});
		return response.status(200).json({
			staus: true,
			message: `Color added successfully.`,
			data: {},
		});
	}

    public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateColorValidator);
		const color = await Color.findOrFail(requestData.id);

		color.color_name = requestData.color_name;
		color.color_code = requestData.color_code;
		await color.save();
		return response.status(200).json({
			staus: true,
			message: `Color updated successfully.`,
			data: {},
		});
	}
    
    public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateColorStatusValidator);
		const color = await Color.query().where('id', requestData.id).first();
		if (!color) {
			return response.status(400).json({
				status: false,
				message: `No color found with provided id '${requestData.id}'.`,
			});
		}
        color.status = requestData.status === '1' ? true : false;
		await color.save();
		return response.status(200).json({
			staus: true,
			message: `Color status changed successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await ColorHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Color deleted successfully.`,
			data: {},
		});
	}
}
