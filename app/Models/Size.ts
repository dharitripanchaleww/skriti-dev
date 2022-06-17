import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class Size extends BaseModel { 
    
    public static table = 'sizes';

    @column({isPrimary:true})
    public id : number 

    @column()
    public size_name : string

    @column()
	public status: boolean;

    @column.dateTime({ autoCreate : true})
    public createdAt : DateTime

    @column.dateTime({ autoCreate : true, autoUpdate:true})
    public updatedAt : DateTime

    @column.dateTime()
    public deletedAt : DateTime
}