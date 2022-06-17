import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorReporter } from './Reporters/ErrorReporter';

export class ContactUsValidator {
	constructor(protected ctx: HttpContextContract) { }

	public reporter = ErrorReporter;

	public cacheKey = 'Contact_Us_Request_Validator';

	public schema = schema.create({
		name: schema.string({ trim: true, escape: true }),
		email: schema.string({}, [
			rules.email()
		]),
		subject: schema.string({ trim: true, escape: true }, [
			rules.maxLength(255)
		]),
		message: schema.string({ escape: true, trim: true }, [
			rules.maxLength(1000)
		])
	})

	public messages = {
		required: '{{ field }} is required.',
		url: `Not valid redirect url.`,
		unique: 'Index already exists with provided name.',
		email: `Not valid email, please provide valid email.`
	}
}


export class UpdateContactUsValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Contact_Us_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		admin_response: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}