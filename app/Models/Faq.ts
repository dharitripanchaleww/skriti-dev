import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Faq extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public en_question: string

	@column()
	public ar_question: string

	@column()
	public en_answer: string

	@column()
	public ar_answer: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
