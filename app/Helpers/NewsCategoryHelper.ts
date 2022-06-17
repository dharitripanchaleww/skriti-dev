import NewsCategory from 'App/Models/Newscategory';
import HtmlMarkupHelper from './HtmlMarkupHelper';
import {
	TableColumnData,
	TableViewColumn,
	TablePaginationColumn,
	FormField,
	PaginationSearchData,
	PaginationData,
	FilterDropdown,
	TableExtraBtn,
	NewsCategoryData,
} from 'App/Types';

export default class NewsCategoryHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Name in EN',
			db_name: 'en_name',
		},
		{
			name: 'About in EN',
			db_name: 'en_about',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Name in AR',
			db_name: 'ar_name',
		},
		{
			name: 'About in AR',
			db_name: 'ar_about',
			attributes: {
				class: 'none',
			},
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
				label: 'Name in EN',
				type: 'text',
				description: 'Name of category in English.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Name in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'About in EN',
				type: 'textarea',
				description: 'About category in English.',
				is_updatable: true,
			},
			{
				label: 'Name in AR',
				type: 'text',
				description: 'Name of category in Arabic.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Name in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'About in AR',
				type: 'textarea',
				description: 'About category in Arabic.',
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
		const paginationRowData = await NewsCategory.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('en_name', 'like', `%${search}%`)
					.orWhere('ar_name', 'like', `%${search}%`);
			})
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				Actions: getActionColMarkup(),
				DT_RowId: item.$extras['ID'], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				DT_RowData: item.$extras, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await NewsCategory.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}

	public static async getAllNewsCategories(): Promise<NewsCategoryData[]> {
		const categoriesData = await NewsCategory.query()
			.select(['id', 'en_name'])
			.orderBy('id', 'desc');
		let categories = categoriesData.map((category) => {
			return {
				id: category.id,
				value: category.en_name,
			};
		});
		return categories;
	}

	public static async delete(
		category: number | string | NewsCategory
	): Promise<[boolean, string]> {
		console.log(typeof category, category);
		if (typeof category === 'string' || typeof category === 'number')
			category = await NewsCategory.findOrFail(category);
		console.log(category);
		const isNewsArticleExists = await category.related('articles').query().first();
		if (isNewsArticleExists)
			return [false, `You can't delete this category, as it contains an article`];
		await category.delete();
		return [true, `News category deleted successfully.`];
	}
}
