import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ErrorReporter } from './Reporters/ErrorReporter';

export class AdminLogInValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Admin_Login_Request_Validator';

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		email: schema.string({}, [rules.email()]),
		password: schema.string({ escape: true, trim: true }),
	});

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages = {
		required: '{{ field }} is required.',
		email: `Not valid email address.`,
	};
}

export class AddUserValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_Admin_Request_Validator';

	public schema = schema.create({
		first_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		last_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		email: schema.string({}, [
			rules.email(),
			rules.unique({
				table: 'users',
				column: 'email',
			}),
		]),
	});

	public messages = {
		required: '{{ field }} is required.',
		email: `Not valid email address.`,
		unique: 'Sub Admin already exist with provided email.',
		minLength: 'Name can not have less than 2 characters',
		maxLength: 'Name can not have less than 70 characters',
	};
}
