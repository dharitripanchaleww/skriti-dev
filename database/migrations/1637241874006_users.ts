import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
	protected tableName = 'admins'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('ip_address').nullable().comment('ip address of user.');
			table.string('first_name').notNullable().comment('first name of user.');
			table.string('last_name').notNullable().comment('last name of user.');
			table.string('email').notNullable().unique().comment('email of a user.');
			table.string('password').comment('password of user.');
			table.enu('status',[0,1]).defaultTo(1).comment('status of user.');
			table.boolean('user_type').defaultTo(2).comment('1:Admin,2:User');
			table.boolean('notifications').defaultTo(1);
			table.string('device_token').nullable();
			table.boolean('gender').nullable().comment('1:Male,2:Female');
			table.string('phone').nullable();
			table.string('address').nullable();
			table.string('city').nullable();
			table.string('state').nullable();
			table.string('country').nullable();
			table.string('zip').nullable();
			table.string('lat').nullable();
			table.string('lng').nullable();
			table.dateTime('last_login').nullable();
			table.dateTime('email_verified_at').nullable();
			table.dateTime('phone_verified_at').nullable();
			table.string('remember_token').nullable();
			table.string('verify_url').comment('url for email verification.');
			table.string('stripe_id').nullable();

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
			table.timestamp('deleted_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
