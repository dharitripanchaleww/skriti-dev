import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddSizeValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Size_Request_Validator';

	public schema = schema.create({
		size_name: schema.string(),
	});

	public messages = {
		'required': '{{ field }} is required.',
	};
}

export class UpdateSizeValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Size_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		size_name: schema.string(),
	});

	public messages = {
		required: '{{ field }} is required.',
	};
}

export class UpdateSizeStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Size_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
	};
}
