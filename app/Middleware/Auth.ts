import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
	/**
	 * The URL to redirect to when request is Unauthorized
	 */
	protected redirectTo = '/admin/login'

	/**
	 * Authenticates the current HTTP request against a custom set of defined
	 * guards.
	 *
	 * The authentication loop stops as soon as the user is authenticated using any
	 * of the mentioned guards and that guard will be used by the rest of the code
	 * during the current request.
	 */
	protected async authenticate(auth: HttpContextContract[ 'auth' ], guards: (keyof GuardsList)[]) {
		/**
		 * Hold reference to the guard last attempted within the for loop. We pass
		 * the reference of the guard to the "AuthenticationException", so that
		 * it can decide the correct response behavior based upon the guard
		 * driver
		 */
		let guardLastAttempted: string | undefined

		for (let guard of guards) {
			guardLastAttempted = guard

			if (await auth.use(guard).check()) {
				/**
				 * Instruct auth to use the given guard as the default guard for
				 * the rest of the request, since the user authenticated
				 * succeeded here
				 */
				auth.defaultGuard = guard
				return true
			}
		}

		/**
		 * Unable to authenticate using any guard
		 */
		throw new AuthenticationException(
			'Unauthorized access',
			'E_UNAUTHORIZED_ACCESS',
			guardLastAttempted,
			this.redirectTo,
		)
	}

	/**
	 * Handle request
	 */
	public async handle(
		{ auth, response }: HttpContextContract,
		next: () => Promise<void>,
		customGuards: (keyof GuardsList)[]
	) {
		/**
		 * Uses the user defined guards or the default guard mentioned in
		 * the config file
		 */
		const guards = customGuards.length ? customGuards : [ auth.name ]
		const guard = guards[ 0 ].toString();

		switch (guard) {
			case 'web':
				try {

					await auth.authenticate();
					// console.log('Admin is verified', user.first_name);

				} catch (error) {
					console.log('error Admin can not be verified: ', error.message);
					return response.redirect().toRoute('admin_login');

				}
				await next();
				break;

			case 'api':
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
				break;
		}
	}
}
