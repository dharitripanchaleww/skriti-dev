import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddSubCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_SubCategory_Request_Validator';

	public schema = schema.create({
		subcat_name: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		category: schema.number([
			rules.exists({
				table: 'category',
				column: 'id',
			}),
		]),
		
	});

	public messages = {
		'required': '{{ field }} is required.',
		'subcat_name.minLength': 'SubCategory Name can not have less than 2 characters',
        'subcat_name.maxLength': 'SubCategory Name can not have greater than 70 characters',		
	};
}

export class UpdateSubCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_SubCategory_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		category: schema.number([
			rules.required()
		]),
		
		subcat_name: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(255),
		]),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'subcat_name.minLength': 'SubCategory Name must be at least {{ options.minLength }} characters.',
		'subcat_name.maxLength': 'SubCategory Name must be at most {{ options.maxLength }} characters.',
	};
}

export class UpdateSubCategoryStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_SubCategory_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}
