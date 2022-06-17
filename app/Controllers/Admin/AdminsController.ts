import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import Hash from '@ioc:Adonis/Core/Hash';
import UsersHelper from 'App/Helpers/UsersHelper';
import EmailHelper from 'App/Helpers/EmailHelper';
import PaginationHelper from 'App/Helpers/PaginationHelper';
// import Admin from 'App/Models/Admin';
import User from 'App/Models/User';
import { AddUserValidator } from 'App/Validators/AuthValidator';
import PaginationValidator from 'App/Validators/PaginationValidator';
import {
	UserChangePasswordValidator,
	UserChangeProfileValidator,
	UserCreatePasswordValidator,
} from 'App/Validators/UsersValidator';

export default class AdminsController {
	public async list({ view }: HttpContextContract) {
		const columns = UsersHelper.getTableColumns();
		const formFields = await UsersHelper.getFormFields();
		const filters = await UsersHelper.getFilterDropdowns(formFields);
		const extraBtns = UsersHelper.getCustomBtns();
		return view.render('table-master', {
			page_name: 'Sub Admins',
			form_name: 'Sub Admin',
			form_fields: formFields,
			buttons: extraBtns,
			columns: columns,
			filters: filters,
			is_deletable: true,
			is_editable: false,
			is_addable: true,
		});
	}

	public async subAdminsPagination({ request, response }: HttpContextContract) {
		const paginationRawData = await request.validate(PaginationValidator);
		const paginationSearchData = PaginationHelper.preparePaginationData(paginationRawData);
		const paginationData = await UsersHelper.getPaginationData(paginationSearchData);

		return response.status(200).json({
			draw: paginationRawData.draw,
			recordsTotal: paginationData.total_rows,
			recordsFiltered: paginationData.total_filtered_rows,
			data: paginationData.data,
		});
	}

	public async addSubAdmin({ request, response }: HttpContextContract) {
		const requestData = await request.validate(AddUserValidator);
		const subAdmin = await User.create({
			first_name: requestData.first_name,
			last_name: requestData.last_name,
			email: requestData.email,
		});
		await EmailHelper.sendUserVerifyLink(subAdmin);
		return response.status(200).json({
			message: 'User added successfully.',
			data: {
				email: subAdmin.email,
			},
		});
	}

	public async showCreatePasswordForSubAdmin({ request, params, view }: HttpContextContract) {
		if (request.hasValidSignature()) {
			const email = params.email;
			// update password
			const subAdmin = await User.findBy('email', email);
			if (!subAdmin) {
				return view.render('create_password', {
					title: 'Create Your Passowrd',
					error: 'No record found!',
				});
			}
			if (subAdmin.verify_url !== request.completeUrl(true)) {
				return view.render('create_password', {
					title: 'Create Your Passowrd',
					error: 'This URL has been expired.',
				});
			}
			return view.render('create_password', {
				title: 'Create Your Passowrd',
			});
		}
		return view.render('create_password', {
			title: 'Create Your Passowrd',
			error: 'This URL has been expired.',
		});
	}

	public async createPasswordForSubAdmin({
		request,
		params,
		view,
		response,
	}: HttpContextContract) {
		if (request.hasValidSignature()) {
			const email = params.email;
			// update password
			const subAdmin = await User.findBy('email', email);
			if (!subAdmin) {
				return view.render('create_password', {
					title: 'Create Your Passowrd',
					error: 'No record found!',
				});
			}
			if (subAdmin.verify_url !== request.completeUrl(true)) {
				return view.render('create_password', {
					title: 'Create Your Passowrd',
					error: 'This URL has been expired.',
				});
			}
			const { password } = await request.validate(UserCreatePasswordValidator);
			subAdmin.password = password;
			subAdmin.verify_url = '';
			await subAdmin.save();
			response.redirect().toRoute('admin_login');
		}
		return view.render('create_password', {
			title: 'Create Your Passowrd',
			error: 'This URL has been expired.',
		});
	}

	public async delete({ request, response }: HttpContextContract) {
		const requestData = request.only(['id']);
		const admin = await User.findOrFail(requestData.id || 0);
		await admin.delete();
		return response.status(200).json({
			status: true,
			message: 'Sub-Admin deleted successfully.',
			data: {},
		});
	}

	/**------------------------------------------------------------------------
	 *                           Profile Section
	 *------------------------------------------------------------------------**/

	public async profile({ view }: HttpContextContract) {
		return view.render('profile', {
			page_name: 'Profile',
		});
	}

	public async changePassword({ request, auth, response }: HttpContextContract) {
		const admin = await auth.use('web').authenticate();
		console.log(request.all());
		const requestData = await request.validate(UserChangePasswordValidator);
		const isValidPassword = await Hash.verify(admin.password, requestData.current_password);
		if (!isValidPassword) {
			return response.status(400).json({
				status: false,
				message: `Wrong password.`,
			});
		}
		admin.password = requestData.new_password;
		await admin.save();
		response.status(200).json({
			status: true,
			message: `Password changed successfully.`,
			redirect_to: Route.makeUrl('admin_profile'),
		});
	}

	public async changeProfile({ request, auth, response }: HttpContextContract) {
		const user = await auth.use('web').authenticate();
		const requestData = await request.validate(UserChangeProfileValidator);
		const [isSaved, message] = await UsersHelper.changeProfile(
		user,
		requestData.first_name,
		requestData.last_name,
		requestData.email
		);
		if (!isSaved) {
			return response.status(400).json({
				status: false,
				message,
			});
		}
		response.status(200).json({
			status: true,
			message: `Profile updated successfully.`,
			redirect_to: Route.makeUrl('admin_profile'),
		});
	}
}
