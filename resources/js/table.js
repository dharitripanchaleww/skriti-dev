let activeRow;
let addRowID;
let table;
const URL_PATH = window.location.pathname;
let filterOptions = {
	search: '',
};

$(window).on('load', function () {
	window.Parsley.addValidator('filemaxmegabytes', {
		requirementType: 'string',
		validateString: function (value, requirement, parsleyInstance) {
			var files = parsleyInstance.$element[0].files;
			var maxBytes = requirement * 1048576;

			let totalSize = 0;

			Array.from(files).forEach((file) => {
				totalSize += file.size;
			});

			return totalSize <= maxBytes;
		},
		messages: {
			en: 'Size can not be more than %sMB.',
		},
	}).addValidator('filemimetypes', {
		requirementType: 'string',
		validateString: function (value, requirement, parsleyInstance) {
			var files = parsleyInstance.$element[0].files;
			var allowedMimeTypes = requirement.replace(/\s/g, '').split(',');
			let isValidFiles = [];
			Array.from(files).forEach((file) => {
				isValidFiles.push(allowedMimeTypes.indexOf(file.type) !== -1);
			});

			return isValidFiles.every((validFile) => validFile);
		},
		messages: {
			en: 'Not supported file type.',
		},
	});
	$('.selectpicker').selectpicker();
	$('.dropify').dropify({
		messages: {
			default: 'Drag and drop a file here or click',
			replace: 'Drag and drop or click to replace',
			remove: 'Remove',
			error: 'Not valid file, Please select a valid file',
		},
	});
	table = $('#main-table').DataTable({
		pageLength: 10,
		autoWidth: false,
		processing: true,
		serverSide: true,
		scrollX: true,
		order: [[0, 'desc']],
		ajax: $.fn.dataTable.pipeline({
			url: `${URL_PATH}/pagination`,
			pages: 5,
			data: (data) => {
				data.filter_options = filterOptions;
			},
		}),
		columns: columns,
		language: {
			processing: 'Loading...',
			paginate: {
				previous: "<i class='mdi mdi-chevron-left'>",
				next: "<i class='mdi mdi-chevron-right'>",
			},
		},
		columnDefs: [
			{
				targets: 'no_sort',
				orderable: false,
			},
			{ 'max-width': '20%', 'targets': '_all' },
		],
	});

	let searchTimer;
	$('#search-table').keyup(function () {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			const searchValue = this.value;
			filterOptions['search'] = searchValue;
			table.search(searchValue).draw();
		}, 500);
	});
	$('select.filter_by_dropdown').on('change', function () {
		const selectedValue = $(this).val();
		const filterBy = $(this).attr('name');
		filterOptions[filterBy] = selectedValue;
		filterOptions['search'] = $('#search-table').val() || '';
		table.search(Math.random()).draw(); //Exact value, column, reg
		// table.search("^" + selectedValue + "$", true, false, true).draw(); //Exact value, column, reg
	});

	$('#main-table').on('click', '.table-delete-row', function () {
		//get the row we are wanting to delete
		var row = $(this).parents('tr:first');
		const rowIDToBeDeleted = row.attr('id');
		const data = {
			id: rowIDToBeDeleted,
		};

		// show alter
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, cancel!',
			confirmButtonClass: 'btn btn-success mt-2',
			cancelButtonClass: 'btn btn-danger ml-2 mt-2',
			buttonsStyling: false,
		}).then(function (result) {
			if (result.value) {
				activeRow = row;
				$('#loader').css('display', 'block');
				$.ajax({
					type: 'DELETE',
					url: `${URL_PATH}/delete`,
					data: data,
					dataType: 'json',
					success: successAlert,
					error: errorAlert,
				});
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				// Swal.fire({
				//     title: 'Cancelled',
				//     text: 'Row is not deleted.',
				//     type: 'error'
				// })
			}
		});
	});

	const forms = $('form').parsley({
		triggerAfterFailure: 'focusout changed.bs.select',
	});

	if (forms) {
		if (forms.length) {
			// multiple fors
			forms.forEach((form) => handleForm(form));
		} else {
			// only one form
			handleForm(forms);
		}
	}

	// when editing/updating btn clicked
	$('#main-table').on('click', '.table-update-row', function () {
		$('#update-form').parsley().reset();
		const updateForm = $('#update-form');
		//get the row we are wanting to delete
		var row = $(this).parents('tr:first');
		const rowData = row.data(); // containes all data for current row if passed from server-side as DT_RowData
		for (const column in rowData) {
			const columnName = column.split(' ').join('_').toLowerCase();
			const selector = `#${columnName}_update`;
			const formField = updateForm.find(selector);
			updateFormField(formField, rowData[column]);
		}
	});

	// update status
	$('#main-table').on('click', '.table-status-update', function () {
		var row = $(this).parents('tr:first');
		activeRow = row;
		const rowID = row.attr('id');
		const statusValue = row.data()['Status'];
		const statusForm = $('#status-form');
		const option = $(statusForm)
			.find(`#status_status option`)
			.filter(function () {
				return $(this).val() == `${statusValue}`;
			});
		$(option).prop('selected', true).change();
		const hiddenField = $(statusForm).find('input[name="id"]');
		hiddenField.prop('value', rowID);
	});

	// TODO: fix this patch
	// update featured
	$('#main-table').on('click', '[data-target="#table-update-is-featured"]', function () {
		var row = $(this).parents('tr:first');
		activeRow = row;
		const rowID = row.attr('id');
		const statusValue = row.data()['Is Featured'];
		const statusForm = $('#feature-form');
		const option = $(statusForm)
			.find(`#featured_status option`)
			.filter(function () {
				return $(this).val() == `${statusValue}`;
			});
		$(option).prop('selected', true).change();
		const hiddenField = $(statusForm).find('input[name="id"]');
		hiddenField.prop('value', rowID);
	});

	// disable mousewheel on a input number field when in focus
	// (to prevent Cromium browsers change the value when scrolling)
	$('form').on('focus', 'input[type=number]', function (e) {
		$(this).on('wheel.disableScroll', function (e) {
			e.preventDefault();
		});
	});

	$('form').on('blur', 'input[type=number]', function (e) {
		$(this).off('wheel.disableScroll');
	});

	$('#add-btn').click(() => {
		$('button[class="dropify-clear"]').click();
		$('.invalid-item-border').removeClass('invalid-item-border');
		$('#add-form').trigger('reset');
		$('#add-form').parsley().reset();
		$('.selectpicker').selectpicker('refresh');
	});
});

function handleForm(form) {
	form.on('form:submit', function () {
		console.log('prevent form submit');
		return false;
	});

	form.on('field:success', function () {
		const elem = this.$element;
		const formFieldType = elem.attr('data-form-field-type');
		console.log(elem, formFieldType);
		switch (formFieldType) {
			case 'dropdown':
				elem.next().removeClass('invalid-item-border');
				break;
			case 'image':
				elem.parent().removeClass('invalid-item-border');
				break;
		}
	});

	form.on('field:error', function () {
		const elem = this.$element;
		const formFieldType = elem.attr('data-form-field-type');
		console.log('field error: ', elem, formFieldType);
		switch (formFieldType) {
			case 'dropdown':
				elem.next().addClass('invalid-item-border');
				break;
			case 'image':
				elem.parent().addClass('invalid-item-border');
				break;
		}
	});

	form.on('form:success', function (e) {
		// e.preventDefault();

		const form = $(e.element);
		const formData = new FormData(form[0]);
		const formType = form.attr('data-form-type');
		let url = '';
		switch (formType) {
			case 'add':
				url = `${URL_PATH}/add`;
				break;
			case 'update':
				url = `${URL_PATH}/update`;
				break;
			case 'status':
				url = `${URL_PATH}/update-status`;
				break;
			case 'feature':
				url = `${URL_PATH}/update-featured`;
				break;
		}
		form.find('button[type=submit]').attr('disabled', true);
		$('#loader').css('display', 'block');
		$.ajax({
			type: 'POST',
			url: url,
			// dataType: 'json',
			contentType: false,
			processData: false,
			data: formData, // serializes the form's elements.
			success: successAlert,
			error: errorAlert,
		});
	});
}

function successAlert(data) {
	$('#loader').hide();
	// console.log('request successfull: ', data);
	$('.form-add-or-update').find('button[type=submit]').attr('disabled', false);
	const message = data.message;
	console.log(`success: ${data}, ${message}`);
	Swal.fire({
		title: 'Success!',
		text: message,
		type: 'success',
	});

	if (data.type === 'delete') {
		table.row(activeRow).remove().draw();
		$('button[class="close"]').click();
	} else if (data.type === 'status') {
		const cell = activeRow.find('[data-field-name="Status"]');
		const newStatus = $('#Status-status').val();

		cell.attr('data-value', newStatus);
		const span = cell.find('span');
		span.text(newStatus);
		if (newStatus === 'Approved' || newStatus === 'Unblocked' || newStatus === 'Paid') {
			span.attr(
				'class',
				'table-status-update btn btn-success btn-rounded waves-effect waves-light'
			);
		} else if (newStatus === 'Pending') {
			span.attr(
				'class',
				'table-status-update btn btn-warning btn-rounded waves-effect waves-light'
			);
		} else if (newStatus === 'Rejected' || newStatus === 'Blocked') {
			span.attr(
				'class',
				'table-status-update btn btn-danger btn-rounded waves-effect waves-light'
			);
		}
		cell.change();

		$('button[class="close"]').click();
	} else {
		setTimeout(() => {
			location.reload();
		}, 500);
		// table.reload(null, false);
		// console.log('reloading table', table.ajax, table.ajax.url(), table.ajax.json());
		// table.ajax.reload(null, false);
	}
}

function errorAlert(xhr, status, error) {
	$('#loader').hide();
	// console.log('request can not succeed: ', xhr.responseText);
	$('.form-add-or-update').find('button[type=submit]').attr('disabled', false);
	const message = JSON.parse(xhr.responseText).message;
	// console.log(`error occured: ${error}, ${message}`);
	Swal.fire({
		title: 'Error',
		text: message,
		type: 'error',
	});
}

// TODO: handle more scenario cases
function updateFormField(formField, value) {
	const formFieldType = formField.attr('data-form-field-type');
	switch (formFieldType) {
		case 'id':
		case 'email':
		case 'text':
		case 'textarea':
		case 'number':
			formField.val(value);
			break;
		case 'dropdown':
			const option = formField.find(`option`).filter(function () {
				return $(this).val() == `${value}`;
			});
			option.prop('selected', true).change();
			break;
		case 'image':
			// TODO: improve this one
			const formFieldID = formField.attr('id');
			const formFieldName = formField.attr('name');
			formField.closest('div[class="form-group mb-3"]').html(`
                <label for="${formFieldID}-update">${formFieldName}</label>
                <input
                    type="file"
                    name="${formFieldName}"
                    id="${formFieldID}-update"
                    class="dropify"
                    data-default-file="${value}"
                    accept="image/*"
                    data-max-file-size="15M"
                    data-height="200px"
                    data-show-remove="false"
                    />
                <p class="text-muted text-center mt-2 mb-0">${formFieldName}</p>
            `);
			const updateImageDropify = $('.dropify').dropify();
			updateImageDropify.on('dropify.beforeClear', function (event, dropElement) {
				const htmlElem = $(dropElement.element);
				$(htmlElem).attr('data-default-file', '');
			});
			break;
		case 'date':
			flatpickr(formField, {
				defaultDate: new Date(value),
				minDate: new Date().fp_incr(1),
				allowInput: true,
				altInput: true,
				onOpen: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop('readonly', true);
				},
				onClose: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop('readonly', false);
					$(instance.altInput).blur();
				},
			});
			break;
		case 'date-range':
			const [startDate, endDate] = formlFieldValue.split(' To ');
			flatpickr(formField, {
				mode: 'range',
				altFormat: 'j F Y',
				dateFormat: 'j F Y',
				minDate: startDate,
				defaultDate: [startDate, endDate],
				allowInput: true,
				altInput: true,
				onOpen: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop('readonly', true);
				},
				onClose: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop('readonly', false);
					$(instance.altInput).blur();
				},
			});
			break;
		default:
			console.warn(`no form field found.`, formFieldType, value);
	}
}
