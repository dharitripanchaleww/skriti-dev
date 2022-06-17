import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import BoardMember from './BoardMember'

export default class BoardType extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public type: string

	@column()
	public is_trash: boolean

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime


	@hasMany(() => BoardMember, {
		localKey: 'id',
		foreignKey: 'board_type_id',
	})
	public members: HasMany<typeof BoardMember>

}
