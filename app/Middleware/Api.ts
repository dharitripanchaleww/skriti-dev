import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Api {
	public async handle({ request, response, auth }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		// const token = request.header('authorization')?.split(' ')[ 1 ];
		// //console.log(token);
		
		// if (!token)
		// 	return response.status(403).json({
		// 		status: false,
		// 		message: 'Not authorized.'
		// 	})

		try {

			await auth.use('api').authenticate();
			// console.log('Admin is verified', user.first_name);

		} catch (error) {
			console.log('error API User can not be verified: ', error.message);
			return response.status(403).json({
				status: false,
				message: "Not Authorized User. Please provide valid api token.",
			});

		}
		await next();
	}
}
