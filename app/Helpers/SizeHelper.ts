import HtmlMarkupHelper from './HtmlMarkupHelper';

import {
	TableColumnData,
    TableViewColumn,
    TablePaginationColumn,
    FormField,
    TableExtraBtn,
	PaginationSearchData,
	PaginationData,
	FilterDropdown,

} from 'App/Types';


import { DateTime } from 'luxon';
import Size from 'App/Models/Size';

export default class SizeHelper {

    private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Size Name',
			db_name: 'size_name',
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
				label: 'Size Name',
				type: 'text',
				description: 'Name of size.',
				is_updatable: true,
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
		const paginationRowData = await Size.query()
			.select(columns)
			.where((query) => {
				query
                    .where('id', 'like', `%${search}%`)
					.orWhere('size_name', 'like', `%${search}%`);
			})
            .whereNull('deletedAt')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
             
			return {
				...item.$extras,
                size_name : item.$extras['size_name'],
                Status : getStatusMarkup(item.$extras['Status']),
				Actions: getActionColMarkup(),
				DT_RowId: item.$extras['ID'], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				DT_RowData: {
					...item.$extras,
				}, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

        function getStatusMarkup(status: boolean): string {
            
            return status? HtmlMarkupHelper.getSuccessMarkup('Approved') : HtmlMarkupHelper.getDangerMarkup('Pending');
		}
		const totalCount = await Size.query().count('id', 'total');

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
		size: number | string | Size
	): Promise<[boolean, string]> {
		
		if (typeof size === 'string' || typeof size === 'number')
		size = await Size.findOrFail(size);
        size.deletedAt = DateTime.now();
        await size.save();
		return [true, `Size deleted successfully.`];
	}

}