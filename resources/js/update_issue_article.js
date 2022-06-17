$(window).on('load', function () {
	$('.selectpicker').selectpicker();

	const form = $('#issue_article_form').parsley();
	if (form) handleForm(form);
});

function handleForm(form) {
	form.on('form:submit', function () {
		return false;
	});
	form.on('form:validate', function () {
		return false;
	});
	form.on('field:error', function () {
		// This global callback will be called for any field that fails validation.
		// console.log('Validation failed for: ', elemId);
	});

	form.on('form:success', function (e) {
		const formJ = $(e.element);
		const formData = new FormData(formJ[0]);

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
		$('#issue_article_form').find('button[type=submit]').attr('disabled', false);
		$('.parsley-success').removeClass('parsley-success');
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
		$('#issue_article_form').find('button[type=submit]').attr('disabled', false);
		const message = JSON.parse(xhr.responseText).message;
		// console.log(`error occured: ${error}, ${message}`);
		Swal.fire({
			title: 'Error',
			text: message,
			type: 'error',
		});
	}
}
