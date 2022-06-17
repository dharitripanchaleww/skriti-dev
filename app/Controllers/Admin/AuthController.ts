import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';

// import Admin from 'App/Models/Admin';
import { AdminLogInValidator } from 'App/Validators/AuthValidator';
import EmailHelper from 'App/Helpers/EmailHelper';
import { UserCreatePasswordValidator } from 'App/Validators/UsersValidator';

import User from 'App/Models/User';

export default class AuthController {
	public async showLogin({ response, view, auth }: HttpContextContract) {
		const isLoggedIn = await auth.check();
		if (isLoggedIn) {
			response.redirect().toRoute('admin_home');
		}
		return view.render('login');
	}

	public async login({ request, response, view, auth }: HttpContextContract) {
		const requestData = await request.validate(AdminLogInValidator);

		const admin = await User.findBy('email', requestData.email);

		if (!admin) {
			// no user found with this credentials
			return view.render('login', {
				error: 'Not valid user.',
			});
		}

		// verify password
		const isValidPassword = await Hash.verify(admin.password, requestData.password);
		if (!isValidPassword) {
			return view.render('login', {
				error: 'Wrong Password.',
			});
		}


		// try {
		await auth.use('web').attempt(requestData.email, requestData.password);
		// 	console.log(id);
			
			
		// } catch (error) {
		// 	console.log(error);
			
		// }
		
		// const token = await auth.use('web').generate(admin,{
		// 	expiresIn: '60mins'
		//   });
		// console.log('user logged in: ', auth.user!);

		return response.redirect().toRoute('admin_home');
	}

	public async home({ view }: HttpContextContract) {
		
		// const issuesCount = await Issue.query().count('id', 'total');
		// const issueArticlesCount = await IssueArticle.query().count('id', 'total');
		// const pendingIssueArticlesCount = await IssueArticle.query()
		// 	.count('id', 'total')
		// 	.where('is_approved', false);
		// const publishedNewsArticles = await NewsArticle.query()
		// 	.count('id', 'total')
		// 	.where('is_published', true);

		// const articles = await IssueArticleHelper.getLatestArticles('en', 20, false);
		// const mostReadArticles = await IssueArticleHelper.getArticlesByCount('en', 20, 'read');
		// const mostDownloadedArticles = await IssueArticleHelper.getArticlesByCount(
		// 	'en',
		// 	20,
		// 	'download'
		// );

		// const issueArticlesStatistics = await IssueArticleHelper.getArticlesStatistics();
		// const newsArticlesStatistics = await NewsHelper.getArticlesStatistics();
		const articles = [];
		return view.render('home', {
			pageTitle: 'Dashboard',
			page_name: 'Dashboard',
			total_issues: 0,
			total_issues_articles: 0,
			total_pending_issues_articles: 0,
			total_published_news_articles: 0,
			articles,
			most_read_articles: 0,
			most_downloaded_articles: 0,
			article_statistics: 0,
			news_statistics: 0,
			// total_issues: issuesCount[0].$extras.total,
			// total_issues_articles: issueArticlesCount[0].$extras.total,
			// total_pending_issues_articles: pendingIssueArticlesCount[0].$extras.total,
			// total_published_news_articles: publishedNewsArticles[0].$extras.total,
			// articles,
			// most_read_articles: mostReadArticles,
			// most_downloaded_articles: mostDownloadedArticles,
			// article_statistics: issueArticlesStatistics,
			// news_statistics: newsArticlesStatistics,
		});
	}

	public async logout({ response, auth }: HttpContextContract) {
		await auth.use('web').logout();
		return response.redirect().toRoute('admin_login');
	}

	public async showForgotPassword({ view }: HttpContextContract) {
		return view.render('forgot_password', {
			title: `Forgot your password? Enter your email and we'll send you an email.`,
		});
	}

	public async forgotPassword({ request, view }: HttpContextContract) {
		const { email } = request.only(['email']);
		const admin = await User.findBy('email', email || '');
		if (!admin) {
			return view.render('forgot_password', {
				title: `Forgot your password? Enter your email and we'll send you an email.`,
				error: `You're not part of system.`,
			});
		}
		const EXPIRY_IN = '2h';
		const isSend = await EmailHelper.adminForgotPassword(admin, EXPIRY_IN);
		if (!isSend) {
			return view.render('forgot_password', {
				title: `Forgot your password? Enter your email and we'll send you an email.`,
				error: `Something went wrong, Please try again.`,
			});
		}
		return view.render('forgot_password', {
			title: `Forgot your password? Enter your email and we'll send you an email.`,
			success: `Email has been sent successfully, Link will expiry in ${EXPIRY_IN}. Please check your inbox.`,
		});
	}

	public async showChangePassword({ request, params, view }: HttpContextContract) {
		if (request.hasValidSignature()) {
			const email = params.email;
			// update password
			const subAdmin = await User.findBy('email', email);
			if (!subAdmin) {
				return view.render('create_password', {
					title: 'Change Password',
					error: 'No record found!',
				});
			}
			if (subAdmin.verify_url !== request.completeUrl(true)) {
				return view.render('create_password', {
					title: 'Change Password',
					error: 'This URL has been expired.',
				});
			}
			return view.render('create_password', {
				title: 'Change Password',
			});
		}
		return view.render('create_password', {
			title: 'Change Password',
			error: 'This URL has been expired.',
		});
	}

	public async changePassword({ request, view, params, response }: HttpContextContract) {
		if (request.hasValidSignature()) {
			const email = params.email;
			// update password
			const subAdmin = await User.findBy('email', email);
			if (!subAdmin) {
				return view.render('create_password', {
					title: 'Change Password',
					error: 'No record found!',
				});
			}
			if (subAdmin.verify_url !== request.completeUrl(true)) {
				return view.render('create_password', {
					title: 'Change Password',
					error: 'This URL has been expired.',
				});
			}
			const { password } = await request.validate(UserCreatePasswordValidator);
			subAdmin.password = password;
			subAdmin.verify_url = '';
			await subAdmin.save();
			response.redirect().toRoute('admin_login');
		}
		return view.render('create_password', {
			title: 'Change Password',
			error: 'This URL has been expired.',
		});
	}
}
