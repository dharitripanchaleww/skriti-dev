/**
* List of all supported dynamic for fields.

* you can use it to generate form dynamically.
*/
export type FormFieldTypes =
	| 'text'
	| 'number'
	| 'dropdown'
	| 'email'
	| 'password'
	| 'textarea'
	| 'date'
	| 'date-range'
	| 'image'
	| 'file'
	| 'checkbox';

/**
 * Dropdown's option for allowing user to select.
 */
export type DropDownOption = {
	/**
	 * `id` it'll be returned when used for `POST` request.
	 */
	id: string | number;
	/**
	 * `value` it'll be displayed to user for selecting from dropdown.
	 */
	value: string;
};

/**
 * Required data to generate one form field.
 */
// TODO: add invalid field message field
export type FormField = {
	/**
	 * `label` Title of form field.
	 */
	label: string;
	/**
	 * `type` Type of form field. i.e. `text`, `number`, `checkbox`, etc.
	 */
	type: FormFieldTypes;
	/**
	 * `description` Short description. It'll be used as placeholder.
	 */
	description: string;
	/**
	 * `is_updatable` whether allow user to update this field in update form model.
	 */
	is_updatable: boolean;
	/**
	 * `dropdown_options` `optional` list of dropdown options. but required if `type` is `dropdown`.
	 */
	dropdown_options?: DropDownOption[];
	/**
	 * `attributes` `optional` key-value pair of attributes for form field.
	 */
	attributes?: {
		maxFileSize?: string;
		[key: string]: any;
	};
};
