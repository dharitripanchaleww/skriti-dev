import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorReporter } from './Reporters/ErrorReporter';

export class SubscribeValidator {
	constructor(protected ctx: HttpContextContract) { }

	public reporter = ErrorReporter;

	public cacheKey = 'Subscribe_Request_Validator';

	public schema = schema.create({
		email: schema.string({ trim: true, escape: true }, [
			rules.email()
		]),
	})

	public messages = {
		required: '{{ field }} is required.',
		email: `Not valid email, please provide valid email.`
	}
}