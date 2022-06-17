$(window).on('load', function () {
	window.Parsley.addValidator('password', {
		requirementType: 'string',
		validateString: function (value, requirement) {
			// password validator
			// minimum 8 character
			// minimum 1 uppercase, 1 lowercase, 1 digit, 1 special symbol

			var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			return re.test(value);

		},
		messages: {
			en: 'Password must be at least 8 character with uppercase, lowercase, number and special symbol.'
		}

	});
	window.Parsley.addValidator('password2', {
		requirementType: 'string',
		validateString: function (value, requirement) {
			const newPass = $('input[name="password"]').val();
			const confPass = value;

			return newPass === confPass;

		},
		messages: {
			en: 'Confirm password and new password must be same.'

		}
	});
	$('#form').parsley();
});