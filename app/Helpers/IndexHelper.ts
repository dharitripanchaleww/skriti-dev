import Index from 'App/Models/Index';
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
import FileHelper from './FileHelper';

export default class IndexHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'Name',
			db_name: 'name',
		},
		{
			name: 'Image',
			db_name: 'img_url',
			attributes: {
				class: 'no_sort',
			},
		},
		{
			name: 'Redirect URL',
			db_name: 'redirect_url',
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
				label: 'Name',
				type: 'text',
				description: 'Name of the Index.',
				is_updatable: true,
			},
			{
				label: 'Image',
				type: 'image',
				description: 'Image of the Index.',
				is_updatable: true,
			},
			{
				label: 'Redirect URL',
				type: 'text',
				description: 'URL where to send user when clicked.',
				is_updatable: true,
				attributes: {
					'data-parsley-type': 'url',
					'data-parsley-error-message': 'Please enter a valid URL.',
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
		};
		let filters = {};
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await Index.query()
			.select(columns)
			.where((query) => {
				query.where('id', search).orWhere('name', 'like', `%${search}%`);
			})
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				Image: getImageMarkup(item.$extras['Image'], item.$extras['Redirect URL']),
				Actions: getActionColMarkup(),
				DT_RowId: item.$extras['ID'], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				DT_RowData: {
					...item.$extras,
					Image: `/uploads/index/${item.$extras['Image']}`,
				}, // add these data to each row, can be retrived by calling $(row).data()
			};
		});

		const totalCount = await Index.query().count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};
		function getImageMarkup(name: string, redirectURL: string): string {
			return `
			<a
				href="${redirectURL}"
				target="_blank"
				>
				${HtmlMarkupHelper.getImageMarkup(`/uploads/index/${name}`)}
			</a>
		`;
		}

		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
	}

	public static async delete(index: number | string | Index): Promise<[boolean, string]> {
		if (typeof index === 'string' || typeof index === 'number')
			index = await Index.findOrFail(index);
		const [isDeleted, message] = await FileHelper.deleteAssetToPublic(
			index.img_url,
			'uploads',
			'index'
		);
		if (!isDeleted) return [false, message];
		await index.delete();
		return [true, `index deleted successfully.`];
	}
}
