import View from '@ioc:Adonis/Core/View';
import { FormField } from 'App/Types';

View.global('getUniqueFieldName', getUniqueFieldName);

View.global('getFormFieldMarkup', function (formField: FormField, isUpdateForm = false) {
	const name = getUniqueFieldName(formField.label);
	const id = isUpdateForm ? `${name}_update` : name;
	const attributes = getAttributes(formField.attributes || {});
	switch (formField.type) {
		case 'text':
		case 'email':
		case 'password':
		case 'number':
			return `
				<div class="form-group mb-3">
					<label for="${id}">${formField.label}</label>
					<input
						type="${formField.type}"
						class="form-control"
						id="${id}"
						placeholder="${formField.description}"
						name="${name}"
						data-form-field-type="${formField.type}"
						data-parsley-required-message="Please enter ${formField.label}."
						${attributes}
						required
					>
				</div>
			`;
		case 'textarea':
			return `
				<div class="form-group mb-3">
					<label for="${id}">${formField.label}</label>
					<textarea
						class="form-control"
						id="${id}"
						rows="4"
						placeholder="${formField.description}"
						name="${name}"
						data-form-field-type="${formField.type}"
						data-parsley-required-message="Please enter ${formField.label}."
						${attributes}
						required
						></textarea>
				</div>
			`;
		case 'dropdown':
			if (formField.label.toLowerCase() === 'status') return '';
			return getDropDownMarkup(formField, id, name);
		case 'date':
			return `
				<div class="form-group mb-3">
					<label for="${id}">${formField.label}</label>
					<input
						type="text"
						id="${id}"
						class="form-control date-picker"
						placeholder="${formField.description}"
						name="${name}"
						data-form-field-type="${formField.type}"
						data-parsley-required-message="Please select ${formField.label}."
						${attributes}
						required
					>
				</div>
			`;
		case 'date-range':
			return `
				 <div class="form-group mb-3">
					<label for="${id}">${formField.label}</label>
					<input
						type="text"
						id="${id}"
						class="form-control date-range-picker"
						placeholder="${formField.description}"
						name="${name}"
						data-form-field-type="${formField.type}"
						data-parsley-required-message="Please Select ${formField.label}."
						${attributes}
						required
					>
				</div>
			`;
		case 'image':
			return `
				    <div class="form-group mb-3">
						<label for="${id}">${formField.label}</label>
						<input
							type="file"
							name="${name}"
							id="${id}"
							class="dropify"
							accept="image/png, image/jpeg, image/jpg"
							data-parsley-filemaxmegabytes="${formField.attributes?.maxFileSize || '5'}"
							data-parsley-trigger="change"
							data-errors-position="outside"
							data-height="200px"
							data-form-field-type="${formField.type}"
							data-parsley-required-message="Please select ${formField.label}."
							${attributes}
							data-parsley-errors-container="#${name}-error-msg"
							required
							/>
						<p class="text-muted text-center mt-2 mb-0">${formField.label}</p>
						<div id="${name}-error-msg"></div>
					</div>
			`;
		case 'file':
			return `
				<div class="form-group mb-3">
					<label for="${id}">${formField.label}</label>
					<input
						type="file"
						name="${name}"
						id="${id}"
						class="dropify"
						accept="${formField.attributes?.accepts}"
						data-max-file-size="15M"
						data-height="100px"
						data-form-field-type="${formField.type}"
						data-parsley-required-message="Please select ${formField.label}."
						${attributes}
						data-parsley-errors-container="#${name}-error-msg"
						required
					/>
					<p class="text-muted text-center mt-2 mb-0">${formField.label}</p>
					<div id="${name}-error-msg"></div>
				</div>
			`;
		case 'checkbox':
			return `
				<div class="custom-control custom-checkbox mb-3">
					<input
						type="checkbox"
						name="${name}"
						id="${id}"
						data-form-field-type="${formField.type}"
						class="custom-control-input"
						data-parsley-required-message="Please select ${formField.label}."
						${attributes}
						requireds
						>
					<label class="custom-control-label" for="${id}">${formField.label}</label>
				</div>
			`;
		default:
			return '';
	}
});

View.global('getStatusFormFieldMarkup', function (formField: FormField) {
	const name = getUniqueFieldName(formField.label);
	const id = `${name}_status`;
	return getDropDownMarkup(formField, id, name);
});

View.global('isDocFile', function (name?: string): boolean {
	const extension = name?.split('.')[1];
	return extension === 'doc' || extension === 'docx';
});

function getUniqueFieldName(name: string) {
	return name.split(' ').join('_').toLowerCase();
}

function getOptionMarkup(options: FormField['dropdown_options']) {
	let markup = '';
	options!.forEach((option) => {
		markup += `<option value="${option.id}" >${option.value}</option>`;
	});
	return markup;
}

function getDropDownMarkup(formField: FormField, id: string, name: string): string {
	return `
		<div class="form-group mb-3">
		<label for="${id}">${formField.label}</label>
		<select
			id="${id}"
			name="${name}"
			class="selectpicker form-control"
			data-live-search="true"
			data-form-field-type="${formField.type}"
			data-parsley-required-message="Please select ${formField.label}."
			data-parsley-errors-container="#${name}-error-msg"
			required
			>
			<option selected disabled hidden value=""> Select ${formField.description}</option>
			${getOptionMarkup(formField.dropdown_options)}
		</select>
		<div id="${name}-error-msg"></div>
	</div>
`;
}

function getAttributes(attributes: { [key: string]: string }): string {
	let attributesMarkup = '';
	for (const key in attributes) {
		attributesMarkup += ` ${key}="${attributes[key]}"`;
	}
	return attributesMarkup;
}
