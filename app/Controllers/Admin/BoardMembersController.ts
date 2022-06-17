import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BoardMemberHelper from 'App/Helpers/BoardMemberHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import BoardMember from 'App/Models/BoardMember';
import {
	AddBoardMemberValidator,
	UpdateBoardMemberValidator,
} from 'App/Validators/BoardTypeValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class BoardMembersController {
	public async list({ view }: HttpContextContract) {
		const columns = BoardMemberHelper.getTableColumns();
		const formFields = await BoardMemberHelper.getFormFields();
		const filters = await BoardMemberHelper.getFilterDropdowns(formFields);
		const extraBtns = BoardMemberHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Board Members',
			form_name: 'Board Member',
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
		const paginationData = await BoardMemberHelper.getPaginationData(paginationSearchData);

		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddBoardMemberValidator);
		await BoardMember.create({
			name_en: requestData.name_in_en,
			name_ar: requestData.name_in_ar,
			email: requestData.email,
			board_type_id: requestData.board_type,
			info_en: requestData.occupation_in_en,
			info_ar: requestData.occupation_in_ar,
		});
		return response.status(200).json({
			staus: true,
			message: `Member added successfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateBoardMemberValidator);
		const boardMember = await BoardMember.findOrFail(requestData.id);
		boardMember.name_en = requestData.name_in_en;
		boardMember.name_ar = requestData.name_in_ar;
		boardMember.email = requestData.email;
		boardMember.board_type_id = requestData.board_type;
		boardMember.info_en = requestData.occupation_in_en;
		boardMember.info_ar = requestData.occupation_in_ar;
		await boardMember.save();
		return response.status(200).json({
			status: true,
			message: `Board member updated successfully.`,
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const boardMember = await BoardMember.findOrFail(requestData.id || 0);
		await boardMember.delete();
		return response.status(200).json({
			status: true,
			message: `Board member deleted successfully.`,
			data: {},
		});
	}
}
