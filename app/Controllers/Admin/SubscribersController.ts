import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaginationHelper from 'App/Helpers/PaginationHelper';
import SubscriberHelper from 'App/Helpers/SubscriberHelper';
import Subscriber from 'App/Models/Subscriber';
import PaginationValidator from 'App/Validators/PaginationValidator';

export default class SubscribersController {
	public async list({ view }: HttpContextContract) {
		const columns = SubscriberHelper.getTableColumns();
		const formFields = await SubscriberHelper.getFormFields();
		const filters = await SubscriberHelper.getFilterDropdowns(formFields);
		const extraBtns = SubscriberHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Subscribers',
			form_name: 'Subscriber',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: false,
			is_addable: false,
		});
	}

	public async pagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await SubscriberHelper.getPaginationData(paginationSearchData);

		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const subscriber = await Subscriber.findOrFail(requestData.id || 0);
		await subscriber.delete();
		return response.status(200).json({
			status: true,
			message: `Subscriber removed successfully.`,
			data: {},
		});
	}
}
