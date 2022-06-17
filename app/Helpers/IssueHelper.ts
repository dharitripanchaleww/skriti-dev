import Env from '@ioc:Adonis/Core/Env';

import Issue from 'App/Models/Issue';
import IssueArticle from 'App/Models/IssueArticle';
import HtmlMarkupHelper from './HtmlMarkupHelper';
import IssueArticleHelper from './IssueArticleHelper';
import {
	FilterDropdown,
	FormField,
	IssueArticleData,
	IssueArticlesData,
	IssueData,
	IssuesData,
	ISSUE_ARTICLE_DATE_FORMAT,
	PaginationData,
	PaginationSearchData,
	TableColumnData,
	TableExtraBtn,
	TablePaginationColumn,
	TableViewColumn,
} from 'App/Types';

export default class IssueHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Year',
			db_name: 'year',
		},
		{
			name: 'Cover Image',
			db_name: 'cover_img',
			attributes: {
				class: 'no_sort',
			},
		},
		{
			name: 'Name in EN',
			db_name: 'en_name',
		},
		{
			name: 'Name in AR',
			db_name: 'ar_name',
		},
	];

	public static getTableColumns(): TableViewColumn[] {
		return this.columns.map((column) => {
			return {
				name: column.name,
				attributes: column.attributes,
			};
		});
	}

	public static getPaginationColumns(): TablePaginationColumn {
		let paginationColumns = {};
		this.columns.forEach((column) => {
			paginationColumns[column.name] = column.db_name;
		});
		return paginationColumns;
	}

	public static async getFormFields(): Promise<FormField[]> {
		return [
			{
				label: 'Year',
				type: 'text',
				description: 'Release Year.',
				is_updatable: true,
			},
			{
				label: 'Cover Image',
				type: 'image',
				description: 'Cover image of issue.',
				is_updatable: true,
				attributes: {
					maxFileSize: '5',
				},
			},
			{
				label: 'Name in EN',
				type: 'text',
				description: 'Name of Issue in English.',
				is_updatable: true,
			},
			{
				label: 'Name in AR',
				type: 'text',
				description: 'Name of Issue in Arabic.',
				is_updatable: true,
			},
		];
	}

	public static getCustomBtns(): TableExtraBtn[] {
		return [];
	}

	public static async getFilterDropdowns(formFields: FormField[]): Promise<FilterDropdown[]> {
		const filterDropdowns: FilterDropdown[] = [];
		formFields.forEach((formField) => {
			if (formField.type !== 'dropdown') return;
			filterDropdowns.push({
				name: formField.label,
				options: formField.dropdown_options!,
			});
		});
		return filterDropdowns;
	}

	public static async getPaginationData(data: PaginationSearchData): Promise<PaginationData> {
		let { order_by, obrder_by_dir, current_page, items_per_page, filter_options } = data;
		const search = filter_options.search;
		const columns = {
			...this.getPaginationColumns(),
		};
		let filters = {};
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await Issue.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('year', 'like', `%${search}%`)
					.orWhere('en_name', 'like', `%${search}%`)
					.orWhere('ar_name', 'like', `%${search}%`);
			})
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Actions': getActionColMarkup(),
				'Cover Image': getImageMarkup(item.$extras['Cover Image']),
				'DT_RowId': item.$extras['ID'], // attach id to row
				'DT_RowClass': 'align-items-center', // add class to each row
				'DT_RowData': {
					...item.$extras,
					'Cover Image': `/uploads/issues/cover_imgs/${item.$extras['Cover Image']}`,
				}, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await Issue.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}

		function getImageMarkup(name: string): string {
			return `
				${HtmlMarkupHelper.getImageMarkup(`/uploads/issues/cover_imgs/${name}`)}
		`;
		}
	}

	public static async getAllIssues(): Promise<IssueData[]> {
		const issuesData = await Issue.query().select(['id', 'en_name']);
		let issues = issuesData.map((issue) => {
			return {
				id: issue.id,
				value: issue.en_name,
			};
		});
		return issues;
	}

	public static async getAllIssuesByLang(lang = 'en'): Promise<IssuesData[]> {
		const issuesData = await Issue.query()
			.select(['id', 'year', 'en_name', 'ar_name', 'created_at'])
			.orderBy('id', 'desc');
		let issues = issuesData.map((issue) => {
			return {
				id: issue.id,
				name: lang === 'en' ? issue.en_name : issue.ar_name,
				year: issue.year,
			};
		});
		return issues;
	}

	public static async getArticls(
		issue: Issue | number,
		lang = 'en'
	): Promise<IssueArticlesData[]> {
		if (typeof issue === 'number') issue = (await Issue.find(issue))!;

		const articlesData = await issue
			.related('articles')
			.query()
			.where('is_approved', true)
			.orderBy('id', 'desc');
		let articles: IssueArticlesData[] = [];
		articlesData.forEach((article) => {
			if (lang === 'en') {
				articles.push({
					id: article.id,
					title: article.en_title,
					issue_id: article.issue_id,
					// @ts-ignore
					issue: issue.en_name,
					doi_link: article.doi_link,
					page_no: article.page_no,
					description: article.en_description,
					author: article.name_en,
					created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
					read_count: article.read_count,
					download_count: article.download_count,
					download_link: IssueArticleHelper.getDownloadLink(article.id),
				});
			} else {
				articles.push({
					id: article.id,
					title: article.ar_title,
					issue_id: article.issue_id,
					// @ts-ignore
					issue: issue.ar_name,
					doi_link: article.doi_link,
					page_no: article.page_no,
					description: article.ar_description,
					author: article.name_ar,
					created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
					read_count: article.read_count,
					download_count: article.download_count,
					download_link: IssueArticleHelper.getDownloadLink(article.id),
				});
			}
		});
		return articles;
	}

	public static async getArticleDetails(id: number, lang = 'en'): Promise<IssueArticleData> {
		const articleData = (await IssueArticle.find(id))!;
		await articleData.load('issue');
		let article: IssueArticleData;
		if (lang === 'en') {
			article = {
				id: articleData.id,
				title: articleData.en_title,
				issue: articleData.issue.en_name,
				issue_cover_img: `${Env.get('BASE_URL')}/uploads/issues/cover_imgs/${
					articleData.issue.cover_img
				}`,
				description: articleData.en_description,
				author: articleData.name_en,
				created_at: articleData.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
				read_count: articleData.read_count,
				download_count: articleData.download_count,
				download_link: IssueArticleHelper.getDownloadLink(articleData.id),
			};
		} else {
			article = {
				id: articleData.id,
				title: articleData.ar_title,
				issue: articleData.issue.ar_name,
				issue_cover_img: `${Env.get('BASE_URL')}/uploads/issues/cover_imgs/${
					articleData.issue.cover_img
				}`,
				description: articleData.ar_description,
				author: articleData.name_ar,
				created_at: articleData.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
				read_count: articleData.read_count,
				download_count: articleData.download_count,
				download_link: IssueArticleHelper.getDownloadLink(articleData.id),
			};
		}
		articleData.read_count++;
		await articleData.save();
		return article;
	}
}
