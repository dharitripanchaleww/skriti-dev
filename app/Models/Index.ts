import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Index extends BaseModel {

	public static table = 'indexes'

	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public img_url: string

	@column()
	public redirect_url: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
