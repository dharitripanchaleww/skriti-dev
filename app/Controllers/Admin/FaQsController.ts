import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FAQsHelper from 'App/Helpers/FaQsHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';

import Faq from 'App/Models/Faq';
import { AddFaqValidator, UpdateFaqValidator } from 'App/Validators/FaqValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class FaQsController {
	public async list({ view }: HttpContextContract) {
		const columns = FAQsHelper.getTableColumns();
		const formFields = await FAQsHelper.getFormFields();
		const filters = await FAQsHelper.getFilterDropdowns(formFields);
		const extraBtns = FAQsHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'FAQs',
			form_name: 'FAQ',
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
		const paginationData = await FAQsHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async add({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddFaqValidator);
		await Faq.create({
			en_question: requestData.que_in_en,
			en_answer: requestData.ans_in_en,
			ar_question: requestData.que_in_ar,
			ar_answer: requestData.ans_in_ar,
		});
		return response.status(200).json({
			staus: true,
			message: `FAQ added successfully.`,
			data: {},
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateFaqValidator);
		const faq = await Faq.findOrFail(requestData.id);
		faq.en_question = requestData.que_in_en;
		faq.ar_question = requestData.que_in_ar;
		faq.en_answer = requestData.ans_in_en;
		faq.ar_answer = requestData.ans_in_ar;
		await faq.save();
		return response.status(200).json({
			staus: true,
			message: `FAQ updated successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const faq = await Faq.findOrFail(requestData.id || 0);
		await faq.delete();
		return response.status(200).json({
			status: true,
			message: `FAQ deleted successfully.`,
			data: {},
		});
	}
}
