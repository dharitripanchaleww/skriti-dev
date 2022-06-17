import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AboutJournalData, FAQData } from 'app/Types';
import ContactUs from 'App/Models/ContactUs';
import Faq from 'App/Models/Faq';
import Page from 'App/Models/Page';
import Subscriber from 'App/Models/Subscriber';
import { ContactUsValidator } from 'App/Validators/ContactUsValidator';
import { SubscribeValidator } from 'App/Validators/SubscribeValidator';

export default class GeneralController {
	public async getFAQs({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const faqsData = await Faq.query();
		const faqs: FAQData[] = faqsData.map((faq) => {
			if (lang === 'en') {
				return {
					que: faq.en_question,
					ans: faq.en_answer,
				};
			} else {
				return {
					que: faq.ar_question,
					ans: faq.ar_answer,
				};
			}
		});
		return response.status(200).json({
			status: true,
			message: `list of all FAQs for lang '${lang}'.`,
			data: {
				faqs,
			},
		});
	}

	public async getForAuthror({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const page =
			lang === 'en'
				? await Page.query().where('title', 'en_for_author').first()
				: await Page.query().where('title', 'ar_for_author').first();
		if (!page) {
			return response.status(200).json({
				status: false,
				message: `page not found.`,
			});
		}
		return response.status(200).json({
			status: true,
			message: `For Author content in lang. '${lang}'.`,
			data: {
				content: page.content,
			},
		});
	}

	public async getPrivacyPolicy({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const page =
			lang === 'en'
				? await Page.query().where('title', 'en_privacy_and_policy').first()
				: await Page.query().where('title', 'ar_privacy_and_policy').first();
		if (!page) {
			return response.status(200).json({
				status: false,
				message: `page not found.`,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Privacy & Policy content in lang. '${lang}'.`,
			data: {
				content: page.content,
			},
		});
	}

	public async getTermsAndCondtions({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const page =
			lang === 'en'
				? await Page.query().where('title', 'en_terms_and_conditions').first()
				: await Page.query().where('title', 'ar_terms_and_conditions').first();
		if (!page) {
			return response.status(200).json({
				status: false,
				message: `page not found.`,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Terms & Conditions content in lang. '${lang}'.`,
			data: {
				content: page.content,
			},
		});
	}

	public async getPublicationEthics({ params, response }: HttpContextContract) {
		const lang = params.lang;
		const page =
			lang === 'en'
				? await Page.query().where('title', 'en_publication_ethics').first()
				: await Page.query().where('title', 'ar_publication_ethics').first();
		if (!page) {
			return response.status(200).json({
				status: false,
				message: `page not found.`,
			});
		}
		return response.status(200).json({
			status: true,
			message: `Publication Ethics content in lang. '${lang}'.`,
			data: {
				content: page.content,
			},
		});
	}

	public async getAboutJournal({ params, response }: HttpContextContract) {
		const lang = params.lang;
		let about: AboutJournalData;
		if (lang === 'en') {
			const aboutPage = await Page.findBy('title', 'en_about_journal');
			const messagePage = await Page.findBy('title', 'en_message_journal');
			const goalPage = await Page.findBy('title', 'en_goal_journal');
			const visionPage = await Page.findBy('title', 'en_vision_journal');
			const valuesPage = await Page.findBy('title', 'en_values');
			if (!aboutPage || !messagePage || !goalPage || !visionPage || !valuesPage) {
				return response.status(200).json({
					status: false,
					message: `Page not found.`,
				});
			}
			about = {
				about: aboutPage.content,
				message: messagePage.content,
				goal: goalPage.content,
				vision: visionPage.content,
				values: valuesPage.content,
			};
		} else {
			const aboutPage = await Page.findBy('title', 'ar_about_journal');
			const messagePage = await Page.findBy('title', 'ar_message_journal');
			const goalPage = await Page.findBy('title', 'ar_goal_journal');
			const visionPage = await Page.findBy('title', 'ar_vision_journal');
			const valuesPage = await Page.findBy('title', 'ar_values');
			if (!aboutPage || !messagePage || !goalPage || !visionPage || !valuesPage) {
				return response.status(200).json({
					status: false,
					message: `Page not found.`,
				});
			}
			about = {
				about: aboutPage.content,
				message: messagePage.content,
				goal: goalPage.content,
				vision: visionPage.content,
				values: valuesPage.content,
			};
		}
		return response.status(200).json({
			status: true,
			message: `about journal in lang. '${lang}'.`,
			data: about,
		});
	}

	public async addContactUsEntry({ request, response }: HttpContextContract) {
		const requestData = await request.validate(ContactUsValidator);
		await ContactUs.create(requestData);
		return response.status(200).json({
			status: true,
			message: `Entry added successfully.`,
			data: {},
		});
	}

	public async addSubscriptionEntry({ request, response }: HttpContextContract) {
		const requestData = await request.validate(SubscribeValidator);
		await Subscriber.firstOrCreate(requestData);
		return response.status(200).json({
			status: true,
			message: `Subscribed successfully.`,
			data: {},
		});
	}
}
