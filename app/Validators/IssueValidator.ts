import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddIssueValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Issue_Request_Validator';

	public schema = schema.create({
		year: schema.string({ escape: true, trim: true }),
		name_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'issues',
				column: 'en_name',
			}),
		]),
		name_in_ar: schema.string({ escape: false, trim: true }, [
			rules.unique({
				table: 'issues',
				column: 'ar_name',
			}),
		]),
		cover_image: schema.file({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}

export class UpdateIssueValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Issue_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		year: schema.string({ escape: true, trim: true }),
		name_in_en: schema.string({ escape: true, trim: true }, [
			rules.unique({
				table: 'issues',
				column: 'en_name',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		name_in_ar: schema.string({ escape: false, trim: true }, [
			rules.unique({
				table: 'issues',
				column: 'ar_name',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		cover_image: schema.file.optional({
			size: '2mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: '{{ field }} needs to be unique.',
	};
}

export class AddIssueAritcleValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Issue_Aritcle_Request_Validator';

	public schema = schema.create({
		title_in_en: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(100),
		]),
		title_in_ar: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(100),
		]),
		page_no: schema.string(),
		doi_link: schema.string({ escape: false, trim: true }),
		name_in_en: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		name_in_ar: schema.string({ escape: false, trim: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		email: schema.string({ escape: false, trim: true }, [rules.email()]),
		description_in_en: schema.string({ escape: false, trim: true }),
		description_in_ar: schema.string({ escape: false, trim: true }),
		issue: schema.number([
			rules.exists({
				table: 'issues',
				column: 'id',
			}),
		]),
		research_file: schema.file({
			size: '15mb',
			extnames: ['pdf', 'docx'],
		}),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'unique': '{{ field }} needs to be unique.',
		'exists': `No new category with provided id.`,
		'image': `Not valid image.`,
		'title_in_en.minLength': 'Title in English can not have less than 2 characters',
		'title_in_ar.minLength': 'Title in English can not have less than 2 characters',
		'title_in_en.maxLength': 'Title in English can not have more than 100 characters',
		'title_in_ar.maxLength': 'Title in English can not have more than 100 characters',
		'name_in_en.minLength': 'Author name in English can not have less than 2 characters',
		'name_in_ar.minLength': 'Author name in English can not have less than 2 characters',
		'name_in_en.maxLength': 'Author name in English can not have more than 70 characters',
		'name_in_ar.maxLength': 'Author name in English can not have more than 70 characters',
	};
}

export class UpdateIssueAritcleValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Issue_Article_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		title_in_en: schema.string({ escape: false, trim: true }, [rules.maxLength(255)]),
		title_in_ar: schema.string({ escape: false, trim: true }, [rules.maxLength(255)]),
		name_in_en: schema.string({ escape: false, trim: true }, [rules.maxLength(255)]),
		name_in_ar: schema.string({ escape: false, trim: true }, [rules.maxLength(255)]),
		page_no: schema.string(),
		doi_link: schema.string({ escape: false, trim: true }),
		description_in_en: schema.string({ escape: true, trim: true }),
		description_in_ar: schema.string({ escape: true, trim: true }),
		issue: schema.number([
			rules.exists({
				table: 'issues',
				column: 'id',
			}),
		]),
		is_approved: schema.string.optional({ escape: true, trim: true }),
		research_file: schema.file.optional({
			size: '15mb',
			extnames: ['pdf', 'docx'],
		}),
	});

	public messages = {
		'required': '{{ field }} is required.',
		'unique': '{{ field }} needs to be unique.',
		'exists': `No new category with provided id.`,
		'image': `Not valid image.`,
		'title_in_en.maxLength': 'Title in English can not have more than 255 characters',
		'title_in_ar.maxLength': 'Title in English can not have more than 255 characters',
		'name_in_en.maxLength': 'Author name in English can not have more than 255 characters',
		'name_in_ar.maxLength': 'Author name in English can not have more than 255 characters',
	};
}

export class UpdateIssueAritcleStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Issue_Article_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}

/**------------------------------------------------------------------------
 *                           For API
 *------------------------------------------------------------------------**/

export class GetIssueArticlesValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Get_Issue_Articles_Request_Validator';

	public schema = schema.create({
		id: schema.number([
			rules.exists({
				table: 'issues',
				column: 'id',
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		exists: `No issue found.`,
	};
}

export class GetIssueArticlesForHomePageValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'GET_ARTICLES_FOR_HOME_PAGE_REQUEST_VALIDATOR';

	public schema = schema.create({
		type: schema.enum(['latest', 'most-read', 'most-downloaded'] as const),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		exists: `No issue found.`,
	};
}

export class GetIssueArticleDetailsValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Get_Issue_Article_Detail_Request_Validator';

	public schema = schema.create({
		id: schema.number([
			rules.exists({
				table: 'issue_articles',
				column: 'id',
				where: {
					is_approved: true,
				},
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		exists: `No issue article found.`,
	};
}

export class SubmitResearchValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Submit_Research_Request_Validator';

	public schema = schema.create({
		title: schema.string({ escape: true, trim: true }, [rules.maxLength(255)]),
		name: schema.string({ escape: true, trim: true }, [rules.maxLength(255)]),
		email: schema.string({ escape: true, trim: true }, [rules.email()]),
		description: schema.string({ escape: true, trim: true }),
		research_file: schema.file({
			size: '15mb',
			extnames: ['pdf', 'doc', 'docx'],
		}),
		policy_file: schema.file({
			size: '15mb',
			extnames: ['pdf', 'doc', 'docx'],
		}),
		info_file: schema.file({
			size: '15mb',
			extnames: ['pdf', 'doc', 'docx'],
		}),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
		file: `Not valid file.`,
		exists: `No issue article found.`,
	};
}

export class SearchIssueValidator {
	constructor(protected ctx: HttpContextContract) {}
	public reporter = ErrorReporter;

	public cacheKey = 'Search_Issue_Request_Validator';

	public schema = schema.create({
		search: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
	};
}
