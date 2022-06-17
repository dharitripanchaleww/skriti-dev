import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorReporter } from './Reporters/ErrorReporter';

export default class GetBoardMemberValidator {
	constructor(protected ctx: HttpContextContract) { }
	public reporter = ErrorReporter;

	public cacheKey = 'Get_Board_Members_Request_Validator';

	public schema = schema.create({
		type: schema.enum([ 'advisory board', 'editorial board', 'editor-in-chief', 'managing editor', 'editorial team' ]),
	})

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	}
}
