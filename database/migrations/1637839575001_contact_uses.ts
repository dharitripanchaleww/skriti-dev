import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ContactUses extends BaseSchema {
	protected tableName = 'contact_uses'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('name').notNullable().comment('name of user.');
			table.string('email').notNullable().comment('email of user.');
			table.string('subject').notNullable().comment('subject of inquiry.');
			table.text('message').notNullable().comment('message of inquiry.');

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
