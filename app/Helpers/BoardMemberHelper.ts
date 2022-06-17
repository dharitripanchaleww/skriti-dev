import BoardMember from 'App/Models/BoardMember';
import BoardTypeHelper from './BoardTypeHelper';
import HtmlMarkupHelper from './HtmlMarkupHelper';
import {
	FilterDropdown,
	FormField,
	PaginationData,
	PaginationSearchData,
	TableColumnData,
	TableExtraBtn,
	TablePaginationColumn,
	TableViewColumn,
} from 'App/Types';

export default class BoardMemberHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
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
		},
		{
			name: 'Board Type',
			db_name: 'board_type_id',
		},
		{
			name: 'Occupation in EN',
			db_name: 'info_en',
			attributes: {
				class: 'none',
			},
		},
		{
			name: 'Occupation in AR',
			db_name: 'info_ar',
			attributes: {
				class: 'none',
			},
		},
	];

	public static getTableColumns(): TableViewColumn[] {
		const tableColumns: TableViewColumn[] = this.columns.map((column) => {
			return {
				name: column.name,
				attributes: column.attributes,
			};
		});
		return tableColumns;
	}

	public static getPaginationColumns(): TablePaginationColumn {
		const paginationColumns: TablePaginationColumn = {};
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
				description: 'Name of board member in English',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Name in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Name in AR',
				type: 'text',
				description: 'Name of board member in Arabic',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Name in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Email',
				type: 'email',
				description: 'Email of board member',
				is_updatable: true,
			},
			{
				label: 'Board Type',
				type: 'dropdown',
				description: "Type of board's member.",
				is_updatable: true,
				dropdown_options: await BoardTypeHelper.getAllBoardTypes(),
			},
			{
				label: 'Occupation in EN',
				type: 'textarea',
				description: 'Occupation of board member.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Occupation in EN shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Occupation in AR',
				type: 'textarea',
				description: 'Occupation of board member.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message':
						'Occupation in EN shoud be between 2 and 70 characters.',
				},
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
			board_type_id: 'board_type_id',
		};
		let filters = {};
		if (filter_options.board_type && filter_options.board_type !== '') {
			filters['board_type_id'] = parseInt(filter_options.board_type);
		}
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await BoardMember.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('name_en', 'like', `%${search}%`)
					.orWhere('name_ar', 'like', `%${search}%`)
					.orWhere('email', 'like', `%${search}%`);
			})
			.preload('boardType')
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData: PaginationData['data'] = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Board Type': item.boardType.type,
				'Actions': getActionColMarkup(),
				'DT_RowId': item.$extras['ID'], // attach id to row
				'DT_RowClass': 'align-items-center', // add class to each row
				'DT_RowData': item.$extras, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await BoardMember.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}
}
