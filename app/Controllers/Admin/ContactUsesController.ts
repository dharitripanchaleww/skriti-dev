import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ContactUsHelper from 'App/Helpers/ContactUsHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import ContactUs from 'App/Models/ContactUs';
import { UpdateContactUsValidator } from 'App/Validators/ContactUsValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class ContactUsesController {
	public async list({ view }: HttpContextContract) {
		const columns = ContactUsHelper.getTableColumns();
		const formFields = await ContactUsHelper.getFormFields();
		const filters = await ContactUsHelper.getFilterDropdowns(formFields);
		const extraBtns = ContactUsHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Contact Us Inquires',
			form_name: 'ContactUs',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: true,
			is_addable: false,
		});
	}

	public async pagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await ContactUsHelper.getPaginationData(paginationSearchData);
		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const requestData = await request.validate(UpdateContactUsValidator);
		const data = await ContactUs.findOrFail(requestData.id);
		data.admin_response = requestData.admin_response;
		await data.save();
		return response.status(200).json({
			staus: true,
			message: `Response Added successfully.`,
			data: {},
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const faq = await ContactUs.findOrFail(requestData.id || 0);
		await faq.delete();
		return response.status(200).json({
			status: true,
			message: `Deleted successfully.`,
			data: {},
		});
	}
}
