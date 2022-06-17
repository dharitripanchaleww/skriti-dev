import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import BoardType from './BoardType';

export default class BoardMember extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public name_en: string;

	@column()
	public name_ar: string;

	@column()
	public board_type_id: number;

	@column()
	public email: string;

	@column()
	public info_en: string;

	@column()
	public info_ar: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@belongsTo(() => BoardType, {
		localKey: 'id',
		foreignKey: 'board_type_id',
	})
	public boardType: BelongsTo<typeof BoardType>;
}
