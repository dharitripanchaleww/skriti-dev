import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class UpdateAboutJournalValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_About_Journal_Request_Validator';

	public schema = schema.create({
		en_about: schema.string({ trim: true }),
		// ar_about: schema.string({ trim: true }),
		en_message: schema.string({ trim: true }),
		// ar_message: schema.string({ trim: true }),
		en_goal: schema.string({ trim: true }),
		// ar_goal: schema.string({ trim: true }),
		en_vision: schema.string({ trim: true }),
		// ar_vision: schema.string({ trim: true }),
		en_values: schema.string({ trim: true }),
		// ar_values: schema.string({ trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
	};
}
