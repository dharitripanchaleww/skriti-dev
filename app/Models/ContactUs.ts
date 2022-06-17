import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ContactUs extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public email: string

	@column()
	public message: string

	@column()
	public admin_response: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
