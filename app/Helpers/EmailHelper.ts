import Mail from "@ioc:Adonis/Addons/Mail";
import Route from '@ioc:Adonis/Core/Route';
import Env from '@ioc:Adonis/Core/Env';
import User from "App/Models/User";

export default class EmailHelper {
	public static async sendUserVerifyLink(user: User): Promise<Boolean> {
		try {
			// generate singedURL
			const signedURL = Route.builder()
				.params({ email: user.email, })
				.prefixUrl(Env.get('BASE_URL'))
				.makeSigned('verify_email');

			console.log('signed url: ', signedURL);
			console.log('USERNAME: ', Env.get('SMTP_USERNAME'));

			await Mail.sendLater((message) => {
				message
					.from(Env.get('SMTP_USERNAME'), `${Env.get('Name')}`)
					.to(`${user.email}`)
					.replyTo(Env.get('SMTP_USERNAME'))
					.subject(`${Env.get('Name')} - Added As User Role`)
					.htmlView('emails/user_verify', {
						first_name: user.first_name,
						url: signedURL
					});
			});
			user.verify_url = signedURL;
			await user.save();

		} catch (error) {
			console.log('can not send email...', error);
			throw Error(error);

		}

		return true;
	}

	public static async adminForgotPassword(user: User, expiryIn: string): Promise<Boolean> {
		try {
			// generate singedURL
			const signedURL = Route.builder()
				.params({ email: user.email, })
				.prefixUrl(Env.get('BASE_URL'))
				.makeSigned('change_password', {
					expiresIn: expiryIn
				});

			// console.log('signed url: ', signedURL);

			await Mail.sendLater((message) => {
				message
					.from(Env.get('SMTP_USERNAME'), `${Env.get('Name')}`)
					.to(`${user.email}`)
					.replyTo(Env.get('SMTP_USERNAME'))
					.subject(`${Env.get('Name')} - Forgot Password`)
					.htmlView('emails/forgot-password', {
						url: signedURL,
						expiryIn
					});
			});
			user.verify_url = signedURL;
			await user.save();

		} catch (error) {
			console.log('can not send email...', error);
			throw Error(error);

		}

		return true;
	}
}