import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { ErrorReporter } from './Reporters/ErrorReporter';

export class AddBoardTypeValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Board_Type_Request_Validator';
	public schema = schema.create({
		type: schema.string({ trim: true, escape: true }, [
			rules.unique({
				table: 'board_types',
				column: 'type',
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: 'Provided board type already exists.',
	};
}

export class UpdateBoardTypeValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Board_Type_Request_Validator';
	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});
	public schema = schema.create({
		id: schema.number(),
		type: schema.string({ trim: true, escape: true }, [
			rules.unique({
				table: 'board_types',
				column: 'type',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: 'Provided board type already exists.',
	};
}

/**------------------------------------------------------------------------
 *                           Board Members
 *------------------------------------------------------------------------**/

export class AddBoardMemberValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Board_Member_Request_Validator';
	public schema = schema.create({
		name_in_en: schema.string({ trim: true, escape: false }, [
			rules.unique({
				table: 'board_members',
				column: 'name_en',
			}),
		]),
		name_in_ar: schema.string({ trim: true, escape: false }, [
			rules.unique({
				table: 'board_members',
				column: 'name_ar',
			}),
		]),
		email: schema.string({ trim: true, escape: true }, [
			rules.email(),
			rules.unique({
				table: 'board_members',
				column: 'email',
			}),
		]),
		board_type: schema.number([
			rules.exists({
				table: 'board_types',
				column: 'id',
				where: {
					is_trash: false,
				},
			}),
		]),
		occupation_in_en: schema.string({ escape: true, trim: true }),
		occupation_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: 'Board member with provided {{ field }} already exists.',
		exists: 'There is no board type with provided id.',
	};
}

export class UpdateBoardMemberValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_Board_Member_Request_Validator';

	public refs = schema.refs({
		id: this.ctx.request.input('id'),
	});

	public schema = schema.create({
		id: schema.number(),
		name_in_en: schema.string({ trim: true, escape: true }, [
			rules.unique({
				table: 'board_members',
				column: 'name_en',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		name_in_ar: schema.string({ trim: true, escape: true }, [
			rules.unique({
				table: 'board_members',
				column: 'name_ar',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		email: schema.string({ trim: true, escape: true }, [
			rules.unique({
				table: 'board_members',
				column: 'email',
				whereNot: {
					id: this.refs.id,
				},
			}),
		]),
		board_type: schema.number([
			rules.exists({
				table: 'board_types',
				column: 'id',
				where: {
					is_trash: false,
				},
			}),
		]),
		occupation_in_en: schema.string({ escape: true, trim: true }),
		occupation_in_ar: schema.string({ escape: true, trim: true }),
	});

	public messages = {
		required: '{{ field }} is required.',
		unique: 'Board member with provided {{ field }} already exists.',
		exists: 'There is no board type with provided id.',
	};
}
