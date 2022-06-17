
/**
* Filtered data of pagniation request from dataTable(client side).
*/
export type PaginationSearchData = {
	/**
	* `order_by` index of column in the list of all `columns`.
	*/
	order_by: number;
	/**
	* `obrder_by_dir` direction of order `asc` | `desc`.
	*/
	obrder_by_dir: 'asc' | 'desc';
	/**
	* `filter_options` different parameters for appying filters.
	* one of main parameter will be `search`, used for search in database.

	* other options will for dropdown filters as key-value pair.
	*/
	filter_options: {
		search: string;
		[ key: string ]: string
	};
	/**
	* `current_page` no. of current page user has requested for.
	*/
	current_page: number;
	/**
	* `items_per_page` no of items user wants per page.
	*/
	items_per_page: number;
}

/**
* data of pagination request. It'll be returned to request of pagination from dataTable(client side).
*/
export type PaginationData = {
	/**
	* total no of rows in database
	*/
	total_rows: number;
	/**
	* total rows after applying fiter & searching
	*/
	total_filtered_rows: number;
	/**
	* data of each row in table as key value pair.
	*/
	data: {
		/**
		* unique id of row. used for `update` and `delete` operation.
		*/
		DT_RowId: number;
		/**
		* string of classes as space separated to be appiled to each row.
		*/
		DT_RowClass: string;
		/**
		* data of each row in table as key value pair. get this data for each row in client side as `$(row).data()`
		*/
		DT_RowData: {
			[ key: string ]: string | number;
		}
		[ key: string ]: any
	}[]
}
