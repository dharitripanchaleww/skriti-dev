import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorReporter } from './Reporters/ErrorReporter';

export default class PaginationValidator {
	constructor(protected ctx: HttpContextContract) { }
	public reporter = ErrorReporter;

	public cacheKey = 'Pagination_Data_Request_Validator';
	public schema = schema.create({
		draw: schema.number(),
		length: schema.number(),
		start: schema.number(),
		order: schema.array()
			.members(
				schema.object()
					.members({
						column: schema.number(),
						dir: schema.enum([ 'asc', 'desc' ] as const),

					})
			),
		filter_options: schema.object().anyMembers()

	})

	public messages = {
		required: '{{ field }} is required.',
	}
}
