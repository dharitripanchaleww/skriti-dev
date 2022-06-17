import { DateTime } from 'luxon';
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import NewsCategory from './Newscategory';

export default class NewsArticle extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public en_title: string;

	@column()
	public ar_title: string;

	@column()
	public category_id: number;

	@column()
	public img_name: string;

	@column()
	public en_description: string;

	@column()
	public ar_description: string;

	@column()
	public en_content: string;

	@column()
	public ar_content: string;

	@column()
	public written_by: string;

	@column()
	public is_published: boolean;

	@column()
	public is_featured: boolean;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@belongsTo(() => NewsCategory, {
		localKey: 'id',
		foreignKey: 'category_id',
	})
	public category: BelongsTo<typeof NewsCategory>;
}
