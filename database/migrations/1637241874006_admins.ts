import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
	protected tableName = 'admins'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('name').notNullable().comment('name of admin.');
			table.string('email').notNullable().unique().comment('email of an admin.');
			table.string('password').comment('password of admin.');
			table.boolean('is_super_admin').defaultTo(false).comment('1 of super admin.');
			table.string('verify_url').comment('url for email verification.');

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
