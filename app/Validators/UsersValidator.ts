import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ErrorReporter } from './Reporters/ErrorReporter';

export class UserLogInValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'User_Login_Request_Validator';

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		email: schema.string({}, [rules.email()]),
		password: schema.string({ escape: true, trim: true }),
	});

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages = {
		required: '{{ field }} is required.',
		email: `Not valid email address.`,
	};
}

export class AddUserValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Add_User_Request_Validator';

	public schema = schema.create({
		first_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		last_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		email: schema.string({}, [
			rules.email(),
			rules.unique({
				table: 'users',
				column: 'email',
			}),
		]),
		profile_picture: schema.file.optional({
			size: '5mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
	});

	public messages = {
		required: '{{ field }} is required.',
		email: `Not valid email address.`,
		unique: 'User already exist with provided email.',
		minLength: 'Name can not have less than 2 characters',
		maxLength: 'Name can not have less than 70 characters',
	};
}

export class UpdateUserStatusValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'Update_User_Status_Request_Validator';

	public schema = schema.create({
		id: schema.number(),
		status: schema.enum(['0', '1']),
	});

	public messages = {
		required: '{{ field }} is required.',
		enum: 'The value of {{ field }} must be one of {{ options.choices }}.',
	};
}

export class UserChangePasswordValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'User_Change_Password_Request_Validator';
	public refs = schema.refs({
		new_password: this.ctx.request.input('new_password').toString(),
	});

	public schema = schema.create({
		current_password: schema.string({ trim: true, escape: true }, [
			rules.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
		]),
		new_password: schema.string({ trim: true, escape: true }, [
			rules.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
		]),
		conf_password: schema.string({}, [rules.equalTo(this.refs.new_password)]),
	});

	public messages = {
		required: '{{ field }} is required.',
		regex: `password should be at least 8 characters with uppercase, symbol & number.`,
		equalTo: `both password should be same.`,
	};
}

export class UserChangeProfileValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'User_Change_Profile_Request_Validator';

	public schema = schema.create({
		id:schema.number(),
		first_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		last_name: schema.string({ trim: true, escape: true }, [
			rules.minLength(2),
			rules.maxLength(70),
		]),
		profile_picture: schema.file.optional({
			size: '5mb',
			extnames: ['jpg', 'png', 'jpeg'],
		}),
		
	});

	public messages = {
		required: '{{ field }} is required.',
		minLength: 'Name can not have less than 2 characters',
		maxLength: 'Name can not have less than 70 characters',
	};
}

export class UserCreatePasswordValidator {
	constructor(protected ctx: HttpContextContract) {}

	public reporter = ErrorReporter;

	public cacheKey = 'User_Create_Password_Request_Validator';
	public refs = schema.refs({
		password: this.ctx.request.input('password').toString(),
	});

	public schema = schema.create({
		password: schema.string({ trim: true, escape: true }, [
			rules.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
		]),
		conf_password: schema.string({}, [rules.equalTo(this.refs.password)]),
	});

	public messages = {
		required: '{{ field }} is required.',
		regex: `password should be at least 8 characters with uppercase, symbol & number.`,
		equalTo: `both password should be same.`,
	};
}
export class LoginRequestValidator {
    constructor(protected ctx: HttpContextContract) {
    }

    public reporter = ErrorReporter

    public cacheKey = 'API_Login_Request_Validator'

    public schema = schema.create({
        email: schema.string({
            escape: true,
            trim: true,
        }),
        device_type: schema.enum([ 'ios', 'android' ]),
        device_token: schema.string({
            trim: true,

        }, [
            //* Enable this line to check for multiple device login with same credentials
            // rules.unique({ table: 'user_devices', column: 'device_token' })

        ]),

    })

    public messages = {
        required: '{{ field }} is required',
        exists: `You're not registered. Please register first.`,
        'enum': 'The value of {{ field }} must be one of {{ options.choices }}',
        'device_token.unique': 'User already exists/logged in with this device_token',

    }
}

export class RegisterOTPValidator {
    constructor(protected ctx: HttpContextContract) {
    }

    public reporter = ErrorReporter

    public cacheKey = 'API_Register_OTP_Validator'

    public schema = schema.create({
        mobile_no: schema.string({
            escape: true,
            trim: true,

        }, [
            rules.mobile({
                locales: [ 'en-AU', 'en-IN', 'en-PK' ]
            }),
            rules.unique({
                table: 'users',
                column: 'mobile_no',
            })
        ])
    })

    public messages = {
        required: '{{ field }} is required',
        unique: 'User already exists with this mobile no.',
        mobile: 'Mobile no is not valid.',

    }
}

export class RegisterValidator {
    constructor(protected ctx: HttpContextContract) {
    }

    public reporter = ErrorReporter

    public cacheKey = 'API_Register_Validator'

    public schema = schema.create({
        first_name: schema.string({
            trim: true,

        }),
        last_name: schema.string({
            trim: true,

        }),
        country_short_code: schema.enum([ 'IN', 'AUS', 'PAK' ]),
        country_code: schema.enum([ '+91', '+63', '+92' ]),
        mobile_no: schema.string({
            trim: true,
            escape: true,

        }, [
            rules.mobile({
                locales: [ 'en-AU', 'en-IN', 'en-PK' ]
            }),
            rules.unique({ table: 'users', column: 'mobile_no' })
        ]),
        device_type: schema.enum([ 'ios', 'android' ]),
        device_token: schema.string({
            trim: true,

        }),

    })

    public messages = {
        required: '{{ field }} is required',
        // 'last_name.required': 'First name is required',
        'mobile_no.unique': 'User already exists with this mobile no.',
        'mobile_no.mobile': 'Mobile no is not valid.',
        'email.unique': 'User already exists with this email address',
        'password.regex': 'password must be 8 to 15 characters with at least 1 uppercase, lowercase, symbol and number.',
        'enum': 'The value of {{ field }} must be one of {{ options.choices }}',

    }
}
export class UpdateProfileValidator {
    constructor(protected ctx: HttpContextContract) {
    }

    public reporter = ErrorReporter

    public cacheKey = 'API_Update_Profile_Validator'

    public schema = schema.create({
        first_name: schema.string({
            trim: true,

        }),
        last_name: schema.string({
            trim: true,

        })

    })

    public messages = {
        required: '{{ field }} is required',
        'mobile_no.mobile': 'Mobile no is not valid.',
        'password.regex': 'password must be 8 to 15 characters with at least 1 uppercase, lowercase, symbol and number.',
        'enum': 'The value of {{ field }} must be one of {{ options.choices }}',

    }
}
