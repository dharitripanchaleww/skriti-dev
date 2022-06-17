import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddNewsCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_News_Category_Request_Validator';

	public schema = schema.create({
		name_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_categories',
				column: 'en_name',
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		about_in_en: schema.string({ escape: true, trim: true }),
		name_in_ar: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_categories',
				column: 'ar_name',
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		about_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'unique': '{{ field }} needs to be unique.',
		'name_eng.minLength': 'Name in English can not have less than 2 characters',
		'name_ar.minLength': 'Name in English can not have less than 2 characters',
		'name_eng.maxLength': 'Name in English can not have more than 70 characters',
		'name_ar.maxLength': 'Name in English can not have more than 70 characters',
	};
}

export class UpdateNewsCategoryValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_News_Category_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		name_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_categories',
				column: 'en_name',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		about_in_en: schema.string({ escape: true, trim: true }),
		name_in_ar: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_categories',
				column: 'ar_name',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		about_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}
