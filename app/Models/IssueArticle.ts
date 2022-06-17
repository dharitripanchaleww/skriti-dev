import { DateTime } from 'luxon';
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Issue from './Issue';

export default class IssueArticle extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public issue_id: number;

	@column()
	public en_title: string;

	@column()
	public ar_title: string;

	@column()
	public name_en: string;

	@column()
	public name_ar: string;

	@column()
	public email: string;

	@column()
	public doi_link: string;

	@column()
	public page_no: string;

	@column()
	public en_description: string;

	@column()
	public ar_description: string;

	@column()
	public research_file_name: string;

	@column()
	public info_file_name: string;

	@column()
	public policy_file_name: string;

	@column()
	public read_count: number;

	@column()
	public download_count: number;

	@column()
	public is_approved: boolean;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@belongsTo(() => Issue, {
		localKey: 'id',
		foreignKey: 'issue_id',
	})
	public issue: BelongsTo<typeof Issue>;
}
