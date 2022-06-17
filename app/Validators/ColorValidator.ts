import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddColorValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Color_Request_Validator';

	public schema = schema.create({
		color_name: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		color_code: schema.string(),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'color_name.minLength': 'Color Name can not have less than 2 characters',
        'color_name.maxLength': 'Color Name can not have greater than 70 characters',		
	};
}

export class UpdateColorValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Color_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		color_name: schema.string({ escape: true, trim: true },[
            rules.minLength(2),
			rules.maxLength(70),
        ]),
		color_code: schema.string(),
	});

	public messages = {
		required: '{{ field }} is required.',
        'color_name.minLength': 'Color Name can not have less than 2 characters',
        'color_name.maxLength': 'Color Name can not have greater than 70 characters',
	};
}

export class UpdateColorStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Color_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}
