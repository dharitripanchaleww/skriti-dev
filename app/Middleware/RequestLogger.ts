import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RequestLogger {
	public async handle({ request, logger }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		logger.info(`${request.method()}: ${request.url()}`);
		await next()
	}
}
