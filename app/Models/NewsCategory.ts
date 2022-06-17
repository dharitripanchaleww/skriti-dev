import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import NewsArticle from './NewsArticle'

export default class NewsCategory extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public en_name: string

	@column()
	public en_about: string

	@column()
	public ar_name: string

	@column()
	public ar_about: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@hasMany(() => NewsArticle, {
		localKey: 'id',
		foreignKey: 'category_id',

	})
	public articles: HasMany<typeof NewsArticle>

}
