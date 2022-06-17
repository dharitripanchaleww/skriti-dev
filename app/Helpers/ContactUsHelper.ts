import ContactUs from "App/Models/ContactUs";

import HtmlMarkupHelper from "./HtmlMarkupHelper";
import {
	TableColumnData,
	TableViewColumn,
	TablePaginationColumn,
	FormField,
	PaginationSearchData,
	PaginationData,
	FilterDropdown,
	TableExtraBtn,

} from "App/Types";

export default class ContactUsHelper {
	static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id'
		},
		{
			name: 'Name',
			db_name: 'name'
		},
		{
			name: 'Email',
			db_name: 'email',
			attributes: {
				class: 'no_sort'
			}
		},
		{
			name: 'Message',
			db_name: 'message',
			attributes: {
				class: 'none'
			}
		},
		{
			name: 'Admin Response',
			db_name: 'admin_response',
			attributes: {
				class: 'none'
			}
		},
	];

	public static getTableColumns(): TableViewColumn[] {
		return this.columns.map(column => {
			return {
				name: column.name,
				attributes: column.attributes
			}
		});
	}

	public static getPaginationColumns(): TablePaginationColumn {
		let paginationColumns = {};
		this.columns.forEach(column => {
			paginationColumns[ column.name ] = column.db_name;
		});
		return paginationColumns;
	}

	public static async getFormFields(): Promise<FormField[]> {
		return [
			{
				label: 'Admin Response',
				type: 'textarea',
				description: 'Admin Response',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
					'Admin Response shoud be between 2 and 70 characters.',
				},
			},
		];
	}

	public static getCustomBtns(): TableExtraBtn[] {
		return [];
	}

	public static async getFilterDropdowns(formFields: FormField[]): Promise<FilterDropdown[]> {
		const filterDropdowns: FilterDropdown[] = [];
		formFields.forEach(formField => {
			if (formField.type !== 'dropdown') return;
			filterDropdowns.push({
				name: formField.label,
				options: formField.dropdown_options!
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
		const order_by_column = Object.values(columns)[ order_by ];
		const paginationRowData = await ContactUs.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', search)
					.orWhere('name', 'like', `%${search}%`)
					.orWhere('email', 'like', `%${search}%`)
					.orWhere('message', 'like', `%${search}%`)
					.orWhere('admin_response', 'like', `%${search}%`)
			})
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map(item => {
			return {
				...item.$extras,
				'Actions': getActionColMarkup(),
				DT_RowId: item.$extras[ 'ID' ], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				DT_RowData: item.$extras // add these data to each row, can be retrived by calling $(row).data()
			}
		});

		const totalCount = await ContactUs
			.query()
			.count('id', 'total');

		return {
			total_rows: totalCount[ 0 ].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData
		}
		function getActionColMarkup(): string {
			// const href = Route.makeUrl('show_update_contact_us', { id: id });
			return `${HtmlMarkupHelper.getEditBtnMarkup()} ${HtmlMarkupHelper.getDeleteBtnMarkup()}`
		}
	}

}