import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class Category extends BaseModel { 
    
    public static table = 'category';

    @column({isPrimary:true})
    public id : number 

    @column()
    public category_name : string

    @column()
    public cat_name : string

    @column()
	public image: string;

    @column()
	public status: boolean;

    @column.dateTime({ autoCreate : true})
    public createdAt : DateTime

    @column.dateTime({ autoCreate : true, autoUpdate:true})
    public updatedAt : DateTime

    @column.dateTime()
    public deletedAt : DateTime
}