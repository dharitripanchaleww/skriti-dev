import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pages extends BaseSchema {
  protected tableName = 'pages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('title').notNullable().unique().comment('title of the page.');
      table.text('content').notNullable().comment('content of the page.');

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
