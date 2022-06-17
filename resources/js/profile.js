$(window).on('load', function () {
	window.Parsley.addValidator('password', {
		requirementType: 'string',
		validateString: function (value, requirement) {
			// password validator
			// minimum 8 character
			// minimum 1 uppercase, 1 lowercase, 1 digit, 1 special symbol
			const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
			return re.test(value);
		},
		messages: {
			en: 'Password must be between 8 to 15 character with uppercase, lowercase, number and special symbol.'
		}
	});

	window.Parsley.addValidator('password2', {
		requirementType: 'string',
		validateString: function (value, requirement) {
			const newPass = $('input[name="new_password"]').val();
			const confPass = value;
			return newPass === confPass;
		},
		messages: {
			en: 'Confirm password and new password must be same.'
		}
	});

	const forms = $('form').parsley();
	if (forms) {
		if (forms.length) {
			// multiple fors
			forms.forEach(form => handleForm(form));
		} else {
			// only one form
			handleForm(forms);
		}
	}
	function handleForm(form) {
		form.on('form:submit', function () {
			return false;
		});

		form.on('form:success', function (e) {
			// e.preventDefault();

			const formJ = $(e.element);
			const formData = new FormData(formJ[ 0 ]);
			var url = formJ.attr('action');
			const submitBtn = formJ.find('button[type=submit]');
			submitBtn.attr('disabled', true);

			$.ajax({
				type: "POST",
				url: url,
				// dataType: 'json',
				contentType: false,
				processData: false,
				data: formData, // serializes the form's elements.
				success: (data) => {
					formJ.find('.response_msg').html(`
						<div class="alert alert-success border-0 fade show" role="alert">
							${data.message}
						</div>
					`);
					$('.response_msg').fadeIn();
					setTimeout(() => {
						submitBtn.removeAttr('disabled');
						$('.response_msg').fadeOut();
						if (data.redirect_to !== undefined) {
							window.location = data.redirect_to;
						}
					}, 1000);

				},
				error: (error) => {
					submitBtn.removeAttr('disabled');
					$('.response_msg').html(`
						<div class="alert alert-danger border-0 fade show" role="alert">
							${JSON.parse(error.responseText).message}
						</div>
					`);
					$('.response_msg').fadeIn();
					setTimeout(() => {
						$('.response_msg').fadeOut();
					}, 1000);
				}
			});

		});
	}
});