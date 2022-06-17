import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import SizeHelper from 'App/Helpers/SizeHelper';
import PaginationValidator from 'App/Validators/PaginationValidator';
import {
	AddSizeValidator,
	UpdateSizeValidator,
    UpdateSizeStatusValidator
} from 'App/Validators/SizeValidator';
import Size from 'App/Models/Size';

export default class SizeController {
	public async list({ view }: HttpContextContract) {

		const columns = SizeHelper.getTableColumns();
        //console.log(columns);
		const formFields = await SizeHelper.getFormFields();
		const filters = await SizeHelper.getFilterDropdowns(formFields);
		const extraBtns = SizeHelper.getCustomBtns();
                
		return view.render('table-master', {
			page_name: 'Size',
			form_name: 'size',
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
		const paginationData = await SizeHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

    public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddSizeValidator);
		await Size.create({
			size_name: requestData.size_name,
			status : true
		});
		return response.status(200).json({
			staus: true,
			message: `Size added successfully.`,
			data: {},
		});
	}

    public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateSizeValidator);
		const size = await Size.findOrFail(requestData.id);

		size.size_name = requestData.size_name;
		await size.save();
		return response.status(200).json({
			staus: true,
			message: `Size updated successfully.`,
			data: {},
		});
	}
    
    public async updateStatus({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateSizeStatusValidator);
		const size = await Size.query().where('id', requestData.id).first();
		if (!size) {
			return response.status(400).json({
				status: false,
				message: `No size data found with provided id '${requestData.id}'.`,
			});
		}
        size.status = requestData.status === '1' ? true : false;
		await size.save();
		return response.status(200).json({
			staus: true,
			message: `Color status changed successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const [isDeleted, message] = await SizeHelper.delete(requestData['id'] || 0);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message: message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Size deleted successfully.`,
			data: {},
		});
	}
}
