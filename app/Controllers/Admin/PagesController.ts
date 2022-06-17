import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Page from 'App/Models/Page';
import { UpdateAboutJournalValidator } from 'App/Validators/PagesValidator';

export default class PagesController {
	public async getTermsAndConditions({ response, view }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_terms_and_conditions');
		// const arPage = await Page.findBy('title', 'ar_terms_and_conditions');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('cms', {
			pageTitle: 'Terms & Conditions',
			page_name: 'Terms & Conditions',
			en_page: enPage.serialize(),
			// ar_page: arPage.serialize(),
			postURLName: 'terms-and-conditions',
		});
	}

	public async updateTermsAndConditions({ request, response }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_terms_and_conditions');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = request.only(['en_content']);
		enPage.content = requestData.en_content;
		await enPage.save();
		return response.status(200).json({
			status: true,
			message: 'Terms & Conditions updated successfully.',
		});
	}

	public async getPrivacyAndPolicy({ response, view }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_privacy_and_policy');
		// const arPage = await Page.findBy('title', 'ar_privacy_and_policy');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('cms', {
			pageTitle: 'Privacy & Policy',
			page_name: 'Privacy & Policy',
			en_page: enPage.serialize(),
			// ar_page: arPage.serialize(),
			postURLName: 'privacy-and-policy',
		});
	}

	public async updatePrivacyAndPolicy({ request, response }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_privacy_and_policy');
		// const arPage = await Page.findBy('title', 'ar_privacy_and_policy');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = request.only(['en_content']);
		enPage.content = requestData.en_content;
		// arPage.content = requestData.ar_content;
		await enPage.save();
		// await arPage.save();

		return response.status(200).json({
			status: true,
			message: 'Privacy & Policy updated successfully.',
		});
	}

	public async getAuthor({ response, view }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_for_author');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('cms', {
			pageTitle: 'For Author',
			page_name: 'For Author',
			en_page: enPage.serialize(),
			// ar_page: arPage.serialize(),
			postURLName: 'author',
		});
	}

	public async updateAuthor({ request, response }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_for_author');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = request.only(['en_content']);
		enPage.content = requestData.en_content;
		await enPage.save();

		return response.status(200).json({
			status: true,
			message: 'For Author updated successfully.',
		});
	}

	public async getPublicationEthics({ response, view }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_publication_ethics');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('cms', {
			pageTitle: 'Publication Ethics',
			page_name: 'Publication Ethics',
			en_page: enPage.serialize(),
			postURLName: 'publication-ethics',
		});
	}

	public async updatePublicationEthics({ request, response }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_publication_ethics');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = request.only(['en_content']);
		enPage.content = requestData.en_content;
		await enPage.save();

		return response.status(200).json({
			status: true,
			message: 'Publication Ethics updated successfully.',
		});
	}

	public async getAboutUs({ response, view }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_about_us');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('cms', {
			pageTitle: 'About Us',
			page_name: 'About Us',
			en_page: enPage.serialize(),
			postURLName: 'about-us',
		});
	}

	public async updateAboutUs({ request, response }: HttpContextContract) {
		const enPage = await Page.findBy('title', 'en_about_us');
		if (!enPage) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = request.only(['en_content']);
		enPage.content = requestData.en_content;
		await enPage.save();

		return response.status(200).json({
			status: true,
			message: 'About Us updated successfully.',
		});
	}

	public async getAboutJournal({ response, view }: HttpContextContract) {
		const enAboutPage = await Page.findBy('title', 'en_about_journal');

		const enMessagePage = await Page.findBy('title', 'en_message_journal');

		const enGoalPage = await Page.findBy('title', 'en_goal_journal');

		const enVisionPage = await Page.findBy('title', 'en_vision_journal');

		const enValuesPage = await Page.findBy('title', 'en_values');
		if (
			!enAboutPage ||
			!enMessagePage ||
			!enGoalPage ||
			!enVisionPage ||
			!enValuesPage
		) {
			return response.redirect().toRoute('admin_home');
		}

		return view.render('about', {
			page_name: 'About Journal',
			en_about: enAboutPage.content,
			en_message: enMessagePage.content,
			en_goal: enGoalPage.content,
			en_vision: enVisionPage.content,
			en_values: enValuesPage.content,
		});
	}

	public async updateAboutJournal({ request, response }: HttpContextContract) {
		const enAboutPage = await Page.findBy('title', 'en_about_journal');

		const enMessagePage = await Page.findBy('title', 'en_message_journal');

		const enGoalPage = await Page.findBy('title', 'en_goal_journal');

		const enVisionPage = await Page.findBy('title', 'en_vision_journal');

		const enValuesPage = await Page.findBy('title', 'en_values');

		if (
			!enAboutPage ||
			!enMessagePage ||
			!enGoalPage ||
			!enVisionPage ||
			!enValuesPage 
		) {
			return response.redirect().toRoute('admin_home');
		}
		const requestData = await request.validate(UpdateAboutJournalValidator);

		enAboutPage.content = requestData.en_about;
		enMessagePage.content = requestData.en_message;
		enGoalPage.content = requestData.en_goal;
		enVisionPage.content = requestData.en_vision;
		enValuesPage.content = requestData.en_values;

		await enAboutPage.save();
		await enMessagePage.save();
		await enGoalPage.save();
		await enVisionPage.save();
		await enValuesPage.save();

		return response.status(200).json({
			status: true,
			message: 'About Journal updated successfully.',
		});
	}
}
