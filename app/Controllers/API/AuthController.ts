import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
// import Admin from 'App/Models/Admin';
import { AdminLogInValidator } from 'App/Validators/AuthValidator';
import User from 'App/Models/User';


export default class AuthController {

public async login({ request, response,auth }: HttpContextContract) {

    const requestData = await request.validate(AdminLogInValidator);
    console.log(requestData);
    console.log('Output above');
    const admin = await User.findBy('email', requestData.email);

    if (!admin) {
        // no user found with this credentials
        return response.status(400).json({
            status: true,
            message: `User not exists`,
        });
    }
    // verify password
    const isValidPassword = await Hash.verify(admin.password, requestData.password);
    if (!isValidPassword) {
        return response.status(400).json({
            status: true,
            message: `Wrong password.`,
        });
    }
    const token = await auth.use('api').generate(admin,{
        expiresIn: '60mins'
      });
    return response.status(200).json({
        status: true,
        message: `Login successfully.`,
        token : token
    });
}

}
