$(window).on('load', function () {
	$('.selectpicker').selectpicker();
	$('.dropify').dropify({
		messages: {
			default: 'Drag and drop a Image here or click',
			replace: 'Drag and drop or click to replace',
			remove: 'Remove',
			error: 'Ooops, something wrong appended.',
		},
		error: {
			fileSize: 'The file size is too big (1M max).',
		},
	});

	// const enContentQuill = new Quill('#en_content_editor', {
	// 	theme: 'snow',
	// 	modules: {
	// 		'toolbar': [
	// 			// [{ 'font': [] }, { 'size': [] }],
	// 			[ 'bold', 'italic', 'underline', 'strike' ],
	// 			// [{ 'color': [] }, { 'background': [] }],
	// 			[ { 'script': 'super' }, { 'script': 'sub' } ],
	// 			[ { 'header': [ false, 4, 5, 6 ] }, 'blockquote', ], // 'code-block'
	// 			[ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
	// 			[ { 'align': [] } ], // 'direction'
	// 			[ 'link' ], // 'video', 'formula', 'image'
	// 			// ['clean'] // clear formating
	// 		]
	// 	},
	// });
	// const arContentQuill = new Quill('#ar_content_editor', {
	// 	theme: 'snow',
	// 	modules: {
	// 		'toolbar': [
	// 			// [{ 'font': [] }, { 'size': [] }],
	// 			[ 'bold', 'italic', 'underline', 'strike' ],
	// 			// [{ 'color': [] }, { 'background': [] }],
	// 			[ { 'script': 'super' }, { 'script': 'sub' } ],
	// 			[ { 'header': [ false, 4, 5, 6 ] }, 'blockquote', ], // 'code-block'
	// 			[ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
	// 			[ { 'align': [] } ], // 'direction'
	// 			[ 'link' ], // 'video', 'formula', 'image'
	// 			// ['clean'] // clear formating
	// 		]
	// 	},
	// });

	const form = $('#news_article_form').parsley({
		triggerAfterFailure: 'focusout changed.bs.select',
	});
	if (form) handleForm(form);
});

function handleForm(form) {
	form.on('form:submit', function () {
		return false;
	});
	form.on('form:validate', function () {
		// const enContent = enContentQuill.root.innerHTML;
		// const arContent = arContentQuill.root.innerHTML;
		// $(this.$element).find('#en_content').val(enContent);
		// $(this.$element).find('#ar_content').val(arContent);
		// $("#hiddenArea").val($("#quillArea").html());
		return false;
	});

	form.on('field:success', function () {
		const elem = this.$element;
		const formFieldType = elem.attr('data-form-field-type');
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
		const formJ = $(e.element);
		const formData = new FormData(formJ[0]);

		// const enContent = enContentQuill.root.innerHTML;
		// formData.set('en_content', enContent);
		// const arContent = arContentQuill.root.innerHTML;
		// formData.set('ar_content', arContent);

		var url = formJ.attr('action');
		formJ.find('button[type=submit]').attr('disabled', true);

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

	function successAlert(response) {
		// console.log('request successfull: ', data);
		$('#news_article_form').find('button[type=submit]').attr('disabled', false);
		const message = response.message;
		// console.log(`success: ${data}, ${message}`);
		Swal.fire({
			title: 'Success!',
			text: message,
			type: 'success',
		});

		if (response.data?.redirect_to) {
			setTimeout(() => {
				window.location.href = response.data?.redirect_to;
			}, 1000);
		}
	}

	function errorAlert(xhr, status, error) {
		// console.log('request can not succeed: ', xhr.responseText);
		$('#news_article_form').find('button[type=submit]').attr('disabled', false);
		const message = JSON.parse(xhr.responseText).message;
		// console.log(`error occured: ${error}, ${message}`);
		Swal.fire({
			title: 'Error',
			text: message,
			type: 'error',
		});
	}
}
