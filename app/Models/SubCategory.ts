import { BaseModel, column, belongsTo, BelongsTo,} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Category from './Category'

export default class SubCategory extends BaseModel { 
    
    public static table = 'sub_category';

    @column({isPrimary:true})
    public id : number 

    @column()
    public category_id : number


    @column()
	public subcat_name: string;

    @column()
	public status: boolean;

    @column.dateTime({ autoCreate : true})
    public createdAt : DateTime

    @column.dateTime({ autoCreate : true, autoUpdate:true})
    public updatedAt : DateTime

    @column.dateTime()
    public deletedAt : DateTime

    @belongsTo(() => Category, {
		localKey: 'id',
		foreignKey: 'category_id',
	})
	public category: BelongsTo<typeof Category>;
}