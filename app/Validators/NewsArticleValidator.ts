import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddNewsAritcleValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_News_Aritcle_Request_Validator';

	public schema = schema.create({
		title_eng: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_articles',
				column: 'en_title',
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		category_id: schema.number([
			rules.exists({
				table: 'news_categories',
				column: 'id',
			}),
		]),
		title_ar: schema.string({ escape: false, trim: true }, [
			rules.unique({
				table: 'news_articles',
				column: 'ar_title',
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		image: schema.file({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
		en_description: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		ar_description: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		en_content: schema.string({ escape: false, trim: true }, [rules.minLength(2)]),
		ar_content: schema.string({ escape: false, trim: true }, [rules.minLength(2)]),
		written_by: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		is_published: schema.string.optional({ escape: true, trim: true }),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'title_eng.unique': 'Title in EN needs to be unique.',
		'title_ar.unique': 'Title in AR needs to be unique.',
		'exists': `No new category with provided id.`,
		'image': `Not valid image.`,
		'title_eng.minLength': 'Title in EN must be at least 2 characters.',
		'title_eng.maxLength': 'Title in EN must be at most 70 characters.',
		'title_ar.minLength': 'Title in AR must be at least 2 characters.',
		'title_ar.maxLength': 'Title in AR must be at most 70 characters.',
		'en_description.minLength': 'Description in EN must be at least 2 characters.',
		'en_description.maxLength': 'Description in EN must be at most 70 characters.',
		'ar_description.minLength': 'Description in AR must be at least 2 characters.',
		'ar_description.maxLength': 'Description in AR must be at most 70 characters.',
		'en_content.minLength': 'Content in EN must be at least 2 characters.',
		'ar_content.minLength': 'Content in AR must be at least 2 characters.',
		'written_by.minLength': 'Written By must be at least 2 characters.',
		'written_by.maxLength': 'Written By must be at most 70 characters.',
	};
}

export class UpdateNewsAritcleValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_News_Article_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		title_eng: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'news_articles',
				column: 'en_title',
				whereNot: {
					id: this.refs.id,
				},
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		title_ar: schema.string({ escape: false, trim: true }, [
			rules.unique({
				table: 'news_articles',
				column: 'ar_title',
				whereNot: {
					id: this.refs.id,
				},
			}),
			rules.minLength(2),
			rules.maxLength(70),
		]),
		category_id: schema.number([
			rules.exists({
				table: 'news_categories',
				column: 'id',
			}),
		]),
		image: schema.file.optional({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
		en_description: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(255),
		]),
		ar_description: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(255),
		]),
		en_content: schema.string({ escape: false, trim: true }, [rules.minLength(2)]),
		ar_content: schema.string({ escape: false, trim: true }, [rules.minLength(2)]),
		written_by: schema.string({ escape: true, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		is_published: schema.string.optional({ escape: true, trim: true }),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'title_eng.unique': 'Title in EN needs to be unique.',
		'title_ar.unique': 'Title in AR needs to be unique.',
		'exists': `No new category with provided id.`,
		'image': `Not valid image.`,
		'title_eng.minLength': 'Title in EN must be at least 2 characters.',
		'title_eng.maxLength': 'Title in EN must be at most 70 characters.',
		'title_ar.minLength': 'Title in AR must be at least 2 characters.',
		'title_ar.maxLength': 'Title in AR must be at most 70 characters.',
		'en_description.minLength':
			'Description in EN must be at least {{ options.minLength }} characters.',
		'en_description.maxLength':
			'Description in EN must be at most {{ options.maxLength }} characters.',
		'ar_description.minLength':
			'Description in AR must be at least {{ options.minLength }} characters.',
		'ar_description.maxLength':
			'Description in AR must be at most {{ options.maxLength }} characters.',
		'en_content.minLength':
			'Content in EN must be at least {{ options.minLength }} characters.',
		'ar_content.minLength':
			'Content in AR must be at least {{ options.minLength }} characters.',
		'written_by.minLength': 'Written By must be at least {{ options.minLength }} characters.',
		'written_by.maxLength': 'Written By must be at most {{ options.maxLength }} characters.',
	};
}

export class UpdateNewsAritcleStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_News_Article_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}

export class UpdateNewsAritcleFeaturedStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_News_Article_Featured_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		featured: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}

/**------------------------------------------------------------------------
 *                           For API
 *------------------------------------------------------------------------**/

export class GetNewsArticlesValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Get_News_Articles_Request_Validator';

	public schema = schema.create({
		id: schema.number([
			rules.exists({
				table: 'news_categories',
				column: 'id',
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		exists: `No category found.`,
	};
}

export class GetNewsArticleDetailsValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Get_News_Article_Detail_Request_Validator';

	public schema = schema.create({
		id: schema.number([
			rules.exists({
				table: 'news_articles',
				column: 'id',
				where: {
					is_published: true,
				},
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		exists: `No news article found.`,
	};
}
