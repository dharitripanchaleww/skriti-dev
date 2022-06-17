import Route from '@ioc:Adonis/Core/Route';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import NewsArticle from 'App/Models/NewsArticle';

import NewsCategory from 'App/Models/Newscategory';
import {
	FilterDropdown,
	FormField,
	NewsArticleData,
	NewsArticlesData,
	NewsArticlesStatistics,
	NewsCategoriesData,
	NEWS_ARTICLE_DATE_FORMAT,
	PaginationData,
	PaginationSearchData,
	TableColumnData,
	TableExtraBtn,
	TablePaginationColumn,
	TableViewColumn,
} from 'App/Types';
import HtmlMarkupHelper from './HtmlMarkupHelper';
import FileHelper from './FileHelper';
import NewsCategoryHelper from './NewsCategoryHelper';

export default class NewsHelper {
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
		},
		{
			name: 'Category',
			db_name: 'category_id',
			attributes: {
				class: 'no_sort',
			},
		},
		{
			name: 'Status',
			db_name: 'is_published',
		},
		{
			name: 'Is Featured',
			db_name: 'is_featured',
		},
		{
			name: 'Written By',
			db_name: 'written_by',
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
				label: 'Status',
				type: 'dropdown',
				description: 'Status of news article.',
				is_updatable: false,
				dropdown_options: [
					{ id: 0, value: 'Not Published' },
					{ id: 1, value: 'Published' },
				],
			},
			{
				label: 'Featured',
				type: 'dropdown',
				description: 'Whether news is featured or not.',
				is_updatable: false,
				dropdown_options: [
					{ id: 0, value: 'Not Featured' },
					{ id: 1, value: 'Featured' },
				],
			},
		];
	}

	public static getCustomBtns(): TableExtraBtn[] {
		return [
			{
				name: 'Add New Article',
				url: Route.makeUrl('show_add_news_article'),
			},
		];
	}

	public static async getFilterDropdowns(formFields: FormField[]): Promise<FilterDropdown[]> {
		const filterDropdowns: FilterDropdown[] = [];
		const categories = await NewsCategoryHelper.getAllNewsCategories();
		filterDropdowns.push({
			name: 'category',
			options: categories,
		});
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
			category_id: 'category_id',
		};
		let filters = {};
		if (filter_options.status && filter_options.status !== '') {
			filters['is_published'] = parseInt(filter_options.status);
		}
		if (filter_options.category && filter_options.category !== '') {
			filters['category_id'] = parseInt(filter_options.category);
		}
		if (filter_options.featured && filter_options.featured !== '') {
			filters['is_featured'] = parseInt(filter_options.featured);
		}
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await NewsArticle.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('ar_title', 'like', `%${search}%`)
					.orWhere('en_title', 'like', `%${search}%`);
			})
			.preload('category')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Title Eng': getRedirectURL(item.$extras['Title Eng'], item.$extras['ID']),
				'Category': item.category.en_name,
				'Status': getStatusMarkup(item.$extras['Status']),
				'Is Featured': getFeaturedMarkup(item.$extras['Is Featured']),
				'Actions': getActionColMarkup(item.$extras['ID']),
				'DT_RowId': item.$extras['ID'], // attach id to row
				'DT_RowClass': 'align-items-center', // add class to each row
				'DT_RowData': item.$extras, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await NewsArticle.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};

		function getStatusMarkup(status: boolean): string {
			return status
				? HtmlMarkupHelper.getSuccessMarkup('Published')
				: HtmlMarkupHelper.getWarningMarkup('Not Published');
		}

		function getFeaturedMarkup(status: boolean): string {
			return status
				? HtmlMarkupHelper.getSuccessMarkup('Yes', 'update-is-featured')
				: HtmlMarkupHelper.getWarningMarkup('No', 'update-is-featured');
		}

		function getRedirectURL(text: string, id: number): string {
			const redirectURL = Route.makeUrl('show_update_news_article', {
				id: id,
			});
			return `<a href="${redirectURL}" target="_blank">${text}</a>`;
		}

		function getActionColMarkup(id: number): string {
			const href = Route.makeUrl('show_update_news_article', { id: id });
			return `${HtmlMarkupHelper.getEditBtnLinkMarkup(
				href
			)}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}

	public static async getCategoriesByLang(lang = 'en'): Promise<NewsCategoriesData[]> {
		const categoriesData = await NewsCategory.query().orderBy('id', 'desc');
		const categories: NewsCategoriesData[] = categoriesData.map((category) => {
			if (lang === 'en')
				return {
					id: category.id,
					name: category.en_name,
					about: category.en_about,
				};
			else
				return {
					id: category.id,
					name: category.ar_name,
					about: category.ar_about,
				};
		});
		return categories;
	}

	public static async getArticlesByCategory(
		id: number,
		lang = 'en'
	): Promise<NewsArticlesData[]> {
		const category = (await NewsCategory.find(id))!;
		const articlesData = await category
			.related('articles')
			.query()
			.where('is_published', true)
			.orderBy('id', 'desc');
		const articles: NewsArticlesData[] = articlesData.map((article) => {
			if (lang === 'en') {
				return {
					id: article.id,
					title: article.en_title,
					img_url: `${Env.get('BASE_URL')}/uploads/news/${article.img_name}`,
					description: article.en_description,
					created_at: article.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
					author: article.written_by,
				};
			}
			return {
				id: article.id,
				title: article.ar_title,
				img_url: `${Env.get('BASE_URL')}/uploads/news/${article.img_name}`,
				description: article.ar_description,
				created_at: article.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
				author: article.written_by,
			};
		});
		return articles;
	}

	public static async getArticlesForHomePage(
		limit: number,
		lang = 'en'
	): Promise<NewsArticlesData[]> {
		const articlesData = await NewsArticle.query()
			.where('is_published', true)
			.where('is_featured', limit === 5 ? true : false)
			.orderBy('id', 'desc')
			.limit(limit);
		const articles: NewsArticlesData[] = articlesData.map((article) => {
			if (lang === 'en') {
				return {
					id: article.id,
					title: article.en_title,
					img_url: `${Env.get('BASE_URL')}/uploads/news/${article.img_name}`,
					description: article.en_description,
					created_at: article.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
					author: article.written_by,
				};
			}
			return {
				id: article.id,
				title: article.ar_title,
				img_url: `${Env.get('BASE_URL')}/uploads/news/${article.img_name}`,
				description: article.ar_description,
				created_at: article.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
				author: article.written_by,
			};
		});
		return articles;
	}

	public static async getArticleDetails(id: number, lang = 'en'): Promise<NewsArticleData> {
		const articleData = (await NewsArticle.find(id))!;
		let article: NewsArticleData;
		if (lang === 'en') {
			article = {
				id: articleData.id,
				title: articleData.en_title,
				category_id: articleData.category_id,
				img_url: `${Env.get('BASE_URL')}/uploads/news/${articleData.img_name}`,
				description: articleData.en_description,
				content: articleData.en_content,
				author: articleData.written_by,
				created_at: articleData.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
			};
		} else {
			article = {
				id: articleData.id,
				title: articleData.ar_title,
				category_id: articleData.category_id,
				img_url: `${Env.get('BASE_URL')}/uploads/news/${articleData.img_name}`,
				description: articleData.ar_description,
				content: articleData.ar_content,
				author: articleData.written_by,
				created_at: articleData.createdAt.toFormat(NEWS_ARTICLE_DATE_FORMAT),
			};
		}
		return article;
	}

	public static async getArticlesStatistics(): Promise<NewsArticlesStatistics> {
		const publisedArticles = await NewsArticle.query()
			.count('id as total')
			.where('is_published', true);
		const totalAricles = await NewsArticle.query().count('id as total');
		const now = DateTime.now();
		const thisMonthsArticles = await NewsArticle.query()
			.count('id as total')
			.where('created_at', '>=', now.set({ day: 1 }).toString());
		const lastMonthsArticles = await NewsArticle.query()
			.count('id as total')
			.where('created_at', '>=', now.set({ day: 1, month: now.get('month') - 1 }).toString())
			.where('created_at', '<=', now.set({ day: 1 }).toString());

		return {
			total: totalAricles[0].$extras.total,
			published: publisedArticles[0].$extras.total,
			not_published: totalAricles[0].$extras.total - publisedArticles[0].$extras.total,
			this_month: thisMonthsArticles[0].$extras.total,
			last_month: lastMonthsArticles[0].$extras.total,
		};
	}

	public static async delete(
		newsArticle: number | string | NewsArticle
	): Promise<[boolean, string]> {
		if (typeof newsArticle === 'string' || typeof newsArticle === 'number')
			newsArticle = await NewsArticle.findOrFail(newsArticle);
		const [isDeleted, message] = await FileHelper.deleteAssetToPublic(
			newsArticle.img_name,
			'uploads',
			'news'
		);
		if (!isDeleted) return [false, message];
		await newsArticle.delete();
		return [true, `News article deleted successfully.`];
	}
}
