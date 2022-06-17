import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.group(() => {
			Route.get('list', 'IssuesController.list');
			Route.get('home', 'IssuesController.getArticlesForHomePage');
			Route.get('articles', 'IssuesController.getArticles');
			Route.get('article', 'IssuesController.getIssueArticle');
			Route.get('article/research-file/:id', 'IssuesController.getResearchFile').as(
				'get_research_file'
			);
			Route.post('add', 'IssuesController.submitResearch');
			Route.get('search', 'IssuesController.search');
		}).prefix('issues');
		Route.get('indices/list', 'IndexesController.list');

		Route.group(() => {
			Route.get('', 'BoardMembersController.getBoardMembers');
		}).prefix('board-members');

		Route.group(() => {
			Route.get('categories', 'NewsController.getCategories');
			Route.get('home', 'NewsController.getHomeNewsArticles');
			Route.get('articles', 'NewsController.getNewsArticles');
			Route.get('article', 'NewsController.getNewsArticle');
		}).prefix('news');

		Route.get('faqs', 'GeneralController.getFAQs');
		Route.get('for-author', 'GeneralController.getForAuthror');
		Route.get('privacy-policy', 'GeneralController.getPrivacyPolicy');
		Route.get('terms-conditions', 'GeneralController.getTermsAndCondtions');
		Route.get('publication-ethics', 'GeneralController.getPublicationEthics');
		Route.get('about', 'GeneralController.getAboutJournal');
		Route.post('contact-us', 'GeneralController.addContactUsEntry');
		Route.post('subscribe', 'GeneralController.addSubscriptionEntry');
	})
})
	.namespace('App/Controllers/API')
	.prefix('api/v1')
	.middleware('api');

	/*

	#DATE : 13-06-2022	
	
	*/ 
Route.post('login', 'AuthController.login').namespace('App/Controllers/API').prefix('api/v1');
