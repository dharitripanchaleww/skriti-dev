import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BoardTypeHelper from 'App/Helpers/BoardTypeHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import BoardType from 'App/Models/BoardType';
import { AddBoardTypeValidator, UpdateBoardTypeValidator } from 'App/Validators/BoardTypeValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class BoardTypesController {
	public async list({ view }: HttpContextContract) {
		const columns = BoardTypeHelper.getTableColumns();
		const formFields = await BoardTypeHelper.getFormFields();
		const filters = await BoardTypeHelper.getFilterDropdowns(formFields);
		const extraBtns = BoardTypeHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Board Member Types',
			form_name: 'Board Member Type',
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
		const paginationData = await BoardTypeHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddBoardTypeValidator);
		await BoardType.create({
			type: requestData.type,
		});
		return response.status(200).json({
			staus: true,
			message: `Board Type '${requestData.type}' added successfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateBoardTypeValidator);
		const boardType = await BoardType.findOrFail(requestData.id);
		boardType.type = requestData.type;
		await boardType.save();
		return response.status(200).json({
			staus: true,
			message: `Board Type '${requestData.type}' updated successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const boardType = await BoardType.findOrFail(requestData.id || 0);
		const [isDeleted, message] = await BoardTypeHelper.deleteBoardType(boardType);
		if (!isDeleted) {
			return response.status(400).json({
				status: false,
				message,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Board Type '${boardType.type}' deleted successfully.`,
			data: {},
		});
	}
}
