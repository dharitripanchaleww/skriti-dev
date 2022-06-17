import { DropDownOption } from ".";

/**
* List of columns to be displayed in admin panel.
*/
export type TableViewColumn = {
	/**
	* `name` name of coulmn to display.
	*/
	name: string;
	/**
	* container key value pair of attributes to attach to column.
	* @example class: 'no_sort none'
	*/
	attributes?: {
		class: string;
		[ key: string ]: string;
	}
}

/**
* List of columns to for datatable in admin panel and pagination.
*/
export type TableColumnData = TableViewColumn & {
	/**
	* name of column in database.
	*/
	db_name: string;
}

/**
* Key-Value pair of column to make query inside database.
*/
export type TablePaginationColumn = {
	[ key: string ]: string
}

/**
* To create extra btns in admin panel.

* `name` name of the button.

* `url` where to redirect user when clicked on it.
*/
export type TableExtraBtn = {
	/**
	* name of the button.
	*/
	name: string;
	/**
	* where to redirect user when clicked on it.
	*/
	url: string;
}

/**
* Dropdown data for allowing user to filter data.
*/
export type FilterDropdown = {
	/**
	* name of dropdown.
	*/
	name: string;
	/**
	* options from which user can select.
	*/
	options: DropDownOption[]
}