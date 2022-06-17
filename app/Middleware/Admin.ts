import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		try {
			const admin = auth.user!;
			if (!admin) throw new Error('Not Super Admin.');
		} catch (error) {
			// return response.redirect().toRoute('sub_admin_dashboard');
			return response.redirect().toRoute('admin_home');
		}
		await next()
	}
}
