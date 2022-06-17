import HtmlMarkupHelper from './HtmlMarkupHelper';
import Category from 'App/Models/Category';

import {
	TableColumnData,
    TableViewColumn,
    TablePaginationColumn,
    FormField,
    TableExtraBtn,
	PaginationSearchData,
	PaginationData,
	FilterDropdown,
	CategoryData,

} from 'App/Types';


import { DateTime } from 'luxon';

export default class CategoryHelper {

    private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Category Name',
			db_name: 'category_name',
		},
		{
			name: 'Image',
			db_name: 'image',
		},
        {
			name: 'Status',
			db_name: 'status',
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
				label: 'Category Name',
				type: 'text',
				description: 'Name of category.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
					'Category Name shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Image',
				type: 'image',
				description: 'Please Choose Image file',
				is_updatable: true,
				attributes: {
					accepts: 'image/jpeg,png,jpg',
				},
			},
            {
				label: 'Status',
				type: 'dropdown',
				description: 'Status',
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
		};
		let filters = {};
        if (filter_options.status && filter_options.status !== '') {
			filters['status'] = parseInt(filter_options.status);
		}
		
       const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await Category.query()
			.select(columns)
			.where((query) => {
				query
                    .where('id', 'like', `%${search}%`)
					.orWhere('category_name', 'like', `%${search}%`);
			})
            .whereNull('deletedAt')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
             
			return {
				...item.$extras,
                CatName : item.$extras['category_name'],
				'Image': getImageMarkup(item.$extras['Image']),
                Status : getStatusMarkup(item.$extras['Status']),
				Actions: getActionColMarkup(),
				DT_RowId: item.$extras['ID'], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				DT_RowData: {
					...item.$extras,
					'Image': `/uploads/category/${item.$extras['Image']}`,
				}, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		function getImageMarkup(name: string): string {
			return `
				${HtmlMarkupHelper.getImageMarkup(`/uploads/category/${name}`)}
		`;
		}

        function getStatusMarkup(status: boolean): string {
            
            return status? HtmlMarkupHelper.getSuccessMarkup('Approved') : HtmlMarkupHelper.getDangerMarkup('Pending');
		}
		const totalCount = await Category.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}

    
    public static async delete(
		category: number | string | Category
	): Promise<[boolean, string]> {
		
		if (typeof category === 'string' || typeof category === 'number')
		category = await Category.findOrFail(category);
        category.deletedAt = DateTime.now();
        await category.save();
		return [true, `Category deleted successfully.`];
	}

	public static async getAllCategories(): Promise<CategoryData[]> {
		const categoriesData = await Category.query()
			.select(['id', 'category_name'])
			.whereNull('deletedAt')
			.where('status',1)
			.orderBy('id', 'desc');
		let categories = categoriesData.map((category) => {
			return {
				id: category.id,
				value: category.category_name,
			};
		});
		return categories;
	}

	
}