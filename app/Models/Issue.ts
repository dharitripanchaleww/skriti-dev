import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import IssueArticle from './IssueArticle';

// TODO: add cover image option
export default class Issue extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public year: string;

	@column()
	public en_name: string;

	@column()
	public ar_name: string;

	@column()
	public cover_img: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@hasMany(() => IssueArticle, {
		localKey: 'id',
		foreignKey: 'issue_id',
	})
	public articles: HasMany<typeof IssueArticle>;
}
