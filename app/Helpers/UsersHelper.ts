import User from 'App/Models/User';
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
} from 'App/Types';

export default class UsersHelper {
	private static columns: TableColumnData[] = [
		{
			name: 'ID',
			db_name: 'id',
		},
		{
			name: 'first name',
			db_name: 'first_name',
		},
		{
			name: 'last name',
			db_name: 'last_name',
		},
		{
			name: 'Email',
			db_name: 'email',
		},
		{
			name: 'Profile Picture',
			db_name: 'profile_picture',
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
				label: 'First Name',
				type: 'text',
				description: 'First Name of user.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message': 'Name shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Last Name',
				type: 'text',
				description: 'Last Name of user.',
				is_updatable: true,
				attributes: {
					'data-parsley-length': '[2, 70]',
					'data-parsley-length-message': 'Name shoud be between 2 and 70 characters.',
				},
			},
			{
				label: 'Email',
				type: 'email',
				description: 'Email of user.',
				is_updatable: false,
			},
			{
				label: 'Profile Picture',
				type: 'image',
				description: 'Profile Picture of user.',
				is_updatable: true,
			},
			{
				label: 'Status',
				type: 'dropdown',
				description: 'Status of user.',
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
			status: 'status',
		};
		let filters = {};
		if (filter_options.status && filter_options.status !== '') {
			filters['status'] = parseInt(filter_options.status);
		}
		const order_by_column = Object.values(columns)[order_by];
		const paginationRowData = await User.query()
			.select(columns)
			.where((query) => {
				query
					.where('id', 'like', `%${search}%`)
					.orWhere('first_name', 'like', `%${search}%`)
					.orWhere('last_name', 'like', `%${search}%`)
					.orWhere('email', 'like', `%${search}%`);
			})
			.where('user_type',2)
			.where(filters)
			.orderBy(order_by_column, obrder_by_dir)
			.paginate(current_page + 1, items_per_page);

		const paginationData = paginationRowData.all().map((item) => {
			return {
				...item.$extras,
				'Profile Picture': getImageMarkup(item.$extras['Profile Picture']),
				'Status': getStatusMarkup(item.$extras['Status']),
				Actions: getActionColMarkup(),
				DT_RowId: item.$extras['ID'], // attach id to row
				DT_RowClass: 'align-items-center', // add class to each row
				// DT_RowData: item.$extras, // add these data to each row, can be retrived by calling $(row).data()
				DT_RowData: {
					...item.$extras,
					'Profile Picture': `/uploads/users/${item.$extras['Profile Picture']}`,
				},
			};
		});

		const totalCount = await User.query().where('user_type',2).count('id', 'total');

		return {
			total_rows: totalCount[0].$extras.total,
			total_filtered_rows: paginationRowData.total,
			data: paginationData,
		};
		function getActionColMarkup(): string {
			return `${HtmlMarkupHelper.getEditBtnMarkup()}${HtmlMarkupHelper.getDeleteBtnMarkup()}`;
		}
		function getStatusMarkup(status: boolean): string {
			return status
				? HtmlMarkupHelper.getSuccessMarkup('Approved')
				: HtmlMarkupHelper.getDangerMarkup('Pending');
		}
		function getImageMarkup(name: string): string {
			return name ? `${HtmlMarkupHelper.getImageMarkup(`/uploads/users/${name}`)}`: '-';
		}
	}

	public static async changeProfile(
		user: User,
		first_name: string,
		last_name: string,
		profile_picture: string,
	): Promise<[Boolean, String]> {
		const isAdminExist = await User.query()
			.whereNot('id', user.id)
			.first();
		if (isAdminExist) return [false, 'Already exists with provided email.'];
		user.first_name = first_name;
		user.last_name = last_name;
		user.profile_picture = profile_picture;
		await user.save();
		return [true, 'Profile updated successfully.'];
	}
}
