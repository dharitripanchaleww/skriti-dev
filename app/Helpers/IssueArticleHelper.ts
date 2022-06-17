import Route from '@ioc:Adonis/Core/Route';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';

import IssueArticle from 'App/Models/IssueArticle';
import FileHelper from './FileHelper';
import IssueHelper from './IssueHelper';
import {
	TableColumnData,
	TableViewColumn,
	TablePaginationColumn,
	FormField,
	PaginationData,
	PaginationSearchData,
	AddIssueArticle,
	IssueArticlesData,
	ISSUE_ARTICLE_DATE_FORMAT,
	DashboardIssueArticleData,
	IssueArticlesStatistics,
	FilterDropdown,
	TableExtraBtn,
} from 'App/Types';
import HtmlMarkupHelper from './HtmlMarkupHelper';

export default class IssueArticleHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Title in EN',
			db_name: 'en_title',
		},
		{
			name: 'Title in AR',
			db_name: 'ar_title',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Name in EN',
			db_name: 'name_en',
		},
		{
			name: 'Name in AR',
			db_name: 'name_ar',
		},
		{
			name: 'Email',
			db_name: 'email',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'DOI Link',
			db_name: 'doi_link',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Page No',
			db_name: 'page_no',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Issue',
			db_name: 'issue_id',
			attributes: {
				class: 'no_sort',
			},
		},
		{
			name: 'Description in EN',
			db_name: 'en_description',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Description in AR',
			db_name: 'ar_description',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Status',
			db_name: 'is_approved',
		},
		{
			name: 'Read Counts',
			db_name: 'read_count',
		},
		{
			name: 'Download Counts',
			db_name: 'download_count',
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
				label: 'Title in EN',
				type: 'text',
				description: 'Title of issue in English.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 100]',
					'data-parsley-length-message':
						'Title in EN shoud be between 2 and 100 characters.',
				},
			},
			{
				label: 'Title in AR',
				type: 'text',
				description: 'Title of issue in Arabic.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 100]',
					'data-parsley-length-message':
						'Title in EN shoud be between 2 and 100 characters.',
				},
			},
			{
				label: 'Name in EN',
				type: 'text',
				description: 'Name of author in English.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Title in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Name in AR',
				type: 'text',
				description: 'Name of author in Arabic.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Title in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Email',
				type: 'email',
				description: 'Email of author.',
				is_updatable: false,
			},
			{
				label: 'DOI Link',
				type: 'text',
				description: 'DOI Link.',
				is_updatable: true,
			},
			{
				label: 'Page No',
				type: 'text',
				description: 'Page Number.',
				is_updatable: true,
			},
			{
				label: 'Issue',
				type: 'dropdown',
				description: 'Issue name.',
				is_updatable: true,
				dropdown_options: await IssueHelper.getAllIssues(),
			},
			{
				label: 'Description in EN',
				type: 'textarea',
				description: 'Description of issue in English.',
				is_updatable: true,
			},
			{
				label: 'Description in AR',
				type: 'textarea',
				description: 'Description of issue in Arabic.',
				is_updatable: true,
			},
			{
				label: 'Research File',
				type: 'file',
				description: 'PDF file of research.',
				is_updatable: true,
				attributes: {
					accepts: 'application/pdf, .docx',
				},
			},
			{
				label: 'Status',
				type: 'dropdown',
				description: 'Status of news article.',
				is_updatable: false,
				dropdown_options: [
					{ id: 0, value: 'Pending' },
					{ id: 1, value: 'Approved' },
				],
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
			issue_id: 'issue_id',
			is_approved: 'is_approved',
		};
		let filters = {};
		if (filter_options.status && filter_options.status !== '') {
			filters['is_approved'] = parseInt(filter_options.status);
		}
		if (filter_options.issue && filter_options.issue !== '') {
			filters['issue_id'] = parseInt(filter_options.issue);
		}
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await IssueArticle.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('en_title', 'like', `%${search}%`)
					.orWhere('ar_title', 'like', `%${search}%`)
					.orWhere('name_en', 'like', `%${search}%`)
					.orWhere('name_ar', 'like', `%${search}%`)
					.orWhere('email', 'like', `%${search}%`);
			})
			.preload('issue')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Title in EN': getRedirectURL(item.$extras['Title in EN'], item.$extras['ID']),
				'Issue': item.issue.en_name,
				'Status': getStatusMarkup(item.$extras['Status']),
				'Actions': getActionColMarkup(),
				'DT_RowId': item.$extras['ID'], // attach id to row
				'DT_RowClass': 'align-items-center', // add class to each row
				'DT_RowData': item.$extras, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await IssueArticle.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};
		function getStatusMarkup(status: boolean): string {
			return status
				? HtmlMarkupHelper.getSuccessMarkup('Approved')
				: HtmlMarkupHelper.getDangerMarkup('Pending');
		}

		function getRedirectURL(text: string, id: number): string {
			const redirectURL = Route.makeUrl('show_update_issue_article', {
				id: id,
			});
			return `<a href="${redirectURL}" target="_blank">${text}</a>`;
		}

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}

	public static async addNewArticle(data: AddIssueArticle): Promise<[Boolean, String]> {
		const researhFileName = `${cuid()}.${data.research_file.extname}`;
		let [isSaved, message] = await FileHelper.saveAssetToPublic(
			data.research_file,
			researhFileName,
			'uploads',
			'issues',
			'research'
		);
		if (!isSaved) return [false, message];
		await IssueArticle.create({
			en_title: data.en_title,
			ar_title: data.ar_title,
			name_en: data.name_en,
			name_ar: data.name_ar,
			email: data.email,
			page_no: data.page_no,
			doi_link: data.doi_link,
			issue_id: data.issue_id,
			research_file_name: researhFileName,
			ar_description: data.ar_description,
			en_description: data.en_description,
			is_approved: data.is_approved,
		});
		return [true, 'Issue added successfully.'];
	}

	public static async search(search = '', lang = 'en'): Promise<DashboardIssueArticleData[]> {
		const articlesData = await IssueArticle.query()
			.preload('issue')
			.where((query) => {
				query
					.where('en_title', 'like', `%${search}%`)
					.orWhere('ar_title', 'like', `%${search}%`)
					.orWhere('name_en', 'like', `%${search}%`)
					.orWhere('name_ar', 'like', `%${search}%`);
			})
			.where('is_approved', true)
			.orderBy('id', 'desc');

		const articles: DashboardIssueArticleData[] = articlesData.map((article) => {
			if (lang === 'en') {
				return {
					id: article.id,
					title: article.en_title,
					issue: article.issue.en_name,
					author: article.name_en,
					created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
					status: article.is_approved,
					read_count: article.read_count,
					download_count: article.download_count,
					download_link: this.getDownloadLink(article.id),
				};
			} else {
				return {
					id: article.id,
					title: article.ar_title,
					issue: article.issue.ar_name,
					author: article.name_ar,
					status: article.is_approved,
					created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
					read_count: article.read_count,
					download_count: article.download_count,
					download_link: this.getDownloadLink(article.id),
				};
			}
		});
		return articles;
	}

	public static getDownloadLink(id: number): string {
		return Route.makeUrl(
			'get_research_file',
			{
				lang: 'en',
				id: id,
			},
			{
				prefixUrl: Env.get('BASE_URL'),
			}
		);
	}

	public static async getLatestArticles(
		lang = 'en',
		limit = 10,
		isApproved: boolean
	): Promise<IssueArticlesData[]> {
		const where = isApproved ? { is_approved: true } : {};
		const articlesData = await IssueArticle.query()
			.preload('issue')
			.where(where)
			.limit(limit)
			.orderBy('id', 'desc');
		const articles: IssueArticlesData[] = articlesData.map((article) => {
			return {
				id: article.id,
				title: lang === 'en' ? article.en_title : article.ar_title,
				description: lang === 'en' ? article.en_description : article.ar_description,
				issue_id: article.issue_id,
				issue: article.issue.en_name,
				issue_cover_img: `${Env.get('BASE_URL')}/uploads/issues/cover_imgs/${
					article.issue.cover_img
				}`,
				doi_link: article.doi_link,
				page_no: article.page_no,
				author: lang === 'en' ? article.name_en : article.name_ar,
				status: article.is_approved,
				created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
				read_count: article.read_count,
				download_count: article.download_count,
				download_link: '',
			};
		});
		return articles;
	}

	public static async getArticlesByCount(
		lang = 'en',
		limit = 10,
		type: 'read' | 'download' = 'read'
	): Promise<IssueArticlesData[]> {
		const articlesData = await IssueArticle.query()
			.preload('issue')
			.where('is_approved', true)
			.limit(limit)
			.orderBy(type === 'read' ? 'read_count' : 'download_count', 'desc');
		const articles: IssueArticlesData[] = articlesData.map((article) => {
			return {
				id: article.id,
				title: lang === 'en' ? article.en_title : article.ar_title,
				description: lang === 'en' ? article.en_description : article.ar_description,
				doi_link: article.doi_link,
				page_no: article.page_no,
				issue_id: article.issue_id,
				issue: article.issue.en_name,
				author: lang === 'en' ? article.name_en : article.name_ar,
				created_at: article.createdAt.toFormat(ISSUE_ARTICLE_DATE_FORMAT),
				read_count: article.read_count,
				download_count: article.download_count,
				download_link: '',
			};
		});
		return articles;
	}

	public static async getArticlesStatistics(): Promise<IssueArticlesStatistics> {
		const approvedArticles = await IssueArticle.query()
			.count('id as total')
			.where('is_approved', true);
		const totalAricles = await IssueArticle.query().count('id as total');
		const now = DateTime.now();
		const thisMonthsArticles = await IssueArticle.query()
			.count('id as total')
			.where('created_at', '>=', now.set({ day: 1 }).toString());
		const lastMonthsArticles = await IssueArticle.query()
			.count('id as total')
			.where('created_at', '>=', now.set({ day: 1, month: now.get('month') - 1 }).toString())
			.where('created_at', '<=', now.set({ day: 1 }).toString());

		return {
			total: totalAricles[0].$extras.total,
			approved: approvedArticles[0].$extras.total,
			not_approved: totalAricles[0].$extras.total - approvedArticles[0].$extras.total,
			this_month: thisMonthsArticles[0].$extras.total,
			last_month: lastMonthsArticles[0].$extras.total,
		};
	}

	public static async delete(issue: number | string | IssueArticle): Promise<[boolean, string]> {
		if (typeof issue === 'string' || typeof issue === 'number')
			issue = await IssueArticle.findOrFail(issue);
		await FileHelper.deleteAssetToPublic(issue.info_file_name, 'uploads', 'issues', 'info');
		await FileHelper.deleteAssetToPublic(issue.policy_file_name, 'uploads', 'issues', 'policy');
		await FileHelper.deleteAssetToPublic(
			issue.research_file_name,
			'uploads',
			'issues',
			'research'
		);
		await issue.delete();
		return [true, `Issue deleted successfully.`];
	}
}
