import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BoardMember } from 'app/Types';
import BoardType from 'App/Models/BoardType';
import GetBoardMemberValidator from 'App/Validators/GetBoardMemberValidator';

export default class BoardMembersController {
	public async getBoardMembers({ request, params, response }: HttpContextContract) {
		const lang = params.lang;
		const requestData = await request.validate(GetBoardMemberValidator);
		const board = await BoardType.query().where('type', requestData.type).first();
		if (!board) {
			return response.status(200).json({
				status: false,
				message: `can not find board where type ${requestData.type}.`,
			});
		}
		const boardMembersData = await board.related('members').query();
		const boardMembers: BoardMember[] = boardMembersData.map((member) => {
			return {
				name: lang === 'en' ? member.name_en : member.name_ar,
				info: lang === 'en' ? member.info_en : member.info_ar,
				email: member.email,
			};
		});
		return response.status(200).json({
			status: true,
			message: `list of all board members for type '${requestData.type}'.`,
			data: {
				members: boardMembers,
			},
		});
	}
}
