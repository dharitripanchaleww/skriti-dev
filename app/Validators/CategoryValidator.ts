import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Category_Request_Validator';

	public schema = schema.create({
		category_name: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		image: schema.file({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'image': `Not valid image.`,
		'category_name.minLength': 'Category Name can not have less than 2 characters',
        'category_name.maxLength': 'Category Name can not have greater than 70 characters',		
	};
}

export class UpdateCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Category_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		category_name: schema.string({ escape: true, trim: true },[
            rules.minLength(2),
			rules.maxLength(70),
        ]),
		image: schema.file.optional({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
	});

	public messages = {
		required: '{{ field }} is required.',
        'category_name.minLength': 'Category Name can not have less than 2 characters',
        'category_name.maxLength': 'Category Name can not have greater than 70 characters',
		'image': `Not valid image.`,	
	};
}

export class UpdateCategoryStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Category_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}
