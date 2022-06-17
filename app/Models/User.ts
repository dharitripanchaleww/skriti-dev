import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
	column,
	BaseModel,
	beforeSave,
	hasMany,
	HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Products from './Products';
export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public first_name: string

	@column()
	public last_name: string

	@column()
	public email: string

	@column()
	public password: string

	@column()
	public verify_url: string
	
	@column()
	public profile_picture: string

	@column()
	public user_type: number

	@column()
	public status: boolean;

	@column()
	public device_type: string

	@column()
	public device_token: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@hasMany(() => Products, {
		localKey: 'id',
		foreignKey: 'user_id',
	})

	public products: HasMany<typeof Products>;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password)
		}
	}

}
