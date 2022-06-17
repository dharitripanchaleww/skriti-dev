import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddFaqValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_FAQ_Request_Validator';

	public schema = schema.create({
		que_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'faqs',
				column: 'en_question',
			}),
		]),
		ans_in_en: schema.string({ escape: true, trim: true }),
		que_in_ar: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'faqs',
				column: 'ar_question',
			}),
		]),
		ans_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}

export class UpdateFaqValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_FAQ_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		que_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'faqs',
				column: 'en_question',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		ans_in_en: schema.string({ escape: true, trim: true }),
		que_in_ar: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'faqs',
				column: 'ar_question',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		ans_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}
