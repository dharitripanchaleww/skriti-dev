
import { DateTime } from 'luxon';
import CategoryHelper from './CategoryHelper';

import {
	TableColumnData,
	TableViewColumn,
	TablePaginationColumn,
	FormField,
	PaginationData,
	PaginationSearchData,
	AddSubCategoryData,
	FilterDropdown,
	TableExtraBtn,
} from 'App/Types';
import HtmlMarkupHelper from './HtmlMarkupHelper';
import SubCategory from 'App/Models/SubCategory';
//import Category from 'App/Models/Category';

export default class SubCategoryHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
        {
			name: 'Subcat Name',
			db_name: 'subcat_name',
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
				label: 'Category',
				type: 'dropdown',
				description: 'Category',
				is_updatable: true,
				dropdown_options: await CategoryHelper.getAllCategories(),
			},
			{
				label: 'SubCat Name',
				type: 'text',
				description: 'Name of Sub Category',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
					'Sub Category Name shoud be between 2 and 70 characters.',
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
		const categories = await CategoryHelper.getAllCategories();
		filterDropdowns.push({
			name: 'category',
			options: categories,
		});
		formFields.forEach((formField) => {
			if (formField.type !== 'dropdown') return;
			// filterDropdowns.push({
			// 	name: formField.label,
			// 	options: formField.dropdown_options!,
			// });
		});
		return filterDropdowns;
	}

	public static async getPaginationData(data: PaginationSearchData): Promise<PaginationData> {
		let { order_by, obrder_by_dir, current_page, items_per_page, filter_options } = data;
		const search = filter_options.search;
		const columns = {
			...this.getPaginationColumns(),
			category_id: 'category_id',
			//is_approved: 'is_approved',
		};
		
		//console.log(filter_options);
		let filters = {};
		if (filter_options.status && filter_options.status !== '') {
			filters['status'] = parseInt(filter_options.status);
		}
		if (filter_options.category && filter_options.category !== '') {
			filters['category_id'] = parseInt(filter_options.category);
		}
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await SubCategory.query()
			.select(columns)
			.preload('category')
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('subcat_name', 'like', `%${search}%`);
			})
			
			.whereNull('deletedAt')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);
			
		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Subcat Name': item.$extras['Subcat Name'], //item.issue.en_name,
                'Category': item.category.category_name,
				'Status': getStatusMarkup(item.$extras['Status']),
				'Actions': getActionColMarkup(),
				'DT_RowId': item.$extras['ID'], // attach id to row
				'DT_RowClass': 'align-items-center', // add class to each row
				'DT_RowData': item.$extras, // add these data to each row, can be retrived by calling $(row).data()
			};
		});
		
		const totalCount = await SubCategory.query().count('id', 'total');
		//console.log(totalCount);
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

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}
	
	public static async addSubCategory(data: AddSubCategoryData): Promise<[Boolean, String]> {

		await SubCategory.create({
			subcat_name: data.subcat_name,
			category_id: data.category_id,
		});
		return [true, 'Subcategory added successfully.'];
	}

	public static async delete(subcatgory: number | string | SubCategory): Promise<[boolean, string]> {
		if (typeof subcatgory === 'string' || typeof subcatgory === 'number')
		subcatgory = await SubCategory.findOrFail(subcatgory);
		subcatgory.deletedAt = DateTime.now();
		//await subcatgory.delete();
		await subcatgory.save();
		return [true, `Issue deleted successfully.`];
	}

	
}
