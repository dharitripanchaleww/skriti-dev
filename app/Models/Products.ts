import { DateTime } from 'luxon';
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import Color from './Color';

export default class Products extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public product_name: string;

	@column()
	public brand_name: string;
	
	@column()
	public description: string;
	
	@column()
	public fabrics_name: string;

	@column()
	public original_price: number;

	@column()
	public seller_price: number;

	@column()
	public discount_price: number;

	@column()
	public qty: number;

	@column()
	public status: boolean;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@column.dateTime()
	public deletedAt: DateTime;

	@belongsTo(() => Color, {
		localKey: 'id',
		foreignKey: 'color_id',
	})
	public colors: BelongsTo<typeof Color>;

	@belongsTo(() => User, {
		localKey: 'id',
		foreignKey: 'user_id',
	})
	public users: BelongsTo<typeof User>;
}
