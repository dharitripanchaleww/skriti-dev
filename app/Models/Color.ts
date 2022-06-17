import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Products from './Products';

export default class Color extends BaseModel { 
    
    public static table = 'colors';

    @column({isPrimary:true})
    public id : number 

    @column()
    public color_name : string

    @column()
    public color_code : string

    @column()
	public status: boolean;

    @column.dateTime({ autoCreate : true})
    public createdAt : DateTime

    @column.dateTime({ autoCreate : true, autoUpdate:true})
    public updatedAt : DateTime

    @column.dateTime()
    public deletedAt : DateTime

    @hasMany(() => Products, {
		localKey: 'id',
		foreignKey: 'color_id',
	})
	public products: HasMany<typeof Products>;
}