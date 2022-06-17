import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.get('', 'AuthController.home').as('admin_home').middleware('auth:web');
		Route.get('login', 'AuthController.showLogin').as('admin_login');
		Route.post('login', 'AuthController.login').as('admin_login_post');
		Route.get('logout', 'AuthController.logout').as('admin_logout');
		Route.get('forgot-password', 'AuthController.showForgotPassword').as('forgot_password');
		Route.post('forgot-password', 'AuthController.forgotPassword');
		Route.get('change-password/:email', 'AuthController.showChangePassword').as(
			'change_password'
		);
		Route.post('change-password/:email', 'AuthController.changePassword');

	});

	Route.group(() => {
		Route.group(() => {
			Route.get('', 'AdminsController.profile').as('admin_profile');
			Route.post('change-password', 'AdminsController.changePassword').as(
				'admin_change_pass'
			);
			Route.post('change-profile', 'AdminsController.changeProfile').as(
				'admin_change_profile'
			);
		}).prefix('profile');

		Route.group(()=>{
			// Listing of category
			Route.get('', 'CategoryController.list').as('categories');
		    Route.get('pagination', 'CategoryController.pagination');

			Route.post('add', 'CategoryController.add');
			Route.post('update', 'CategoryController.update');
			Route.post('update-status', 'CategoryController.updateStatus');
			Route.delete('delete', 'CategoryController.delete');

		}).prefix('categories');

		/*
		@Route('SubCategory')
		@date:09-06-2022
		@developedBy: soham rathod
		 */
		Route.group(()=>{
			// Listing of category
			Route.get('', 'SubCategoryController.list').as('Subcategories');
			Route.get('pagination', 'SubCategoryController.pagination');
			Route.post('add', 'SubCategoryController.add');
			Route.post('update', 'SubCategoryController.update');
			Route.post('update-status', 'SubCategoryController.updateStatus');
			Route.delete('delete', 'SubCategoryController.delete');
		}).prefix('Subcategories');
	
	}).middleware(['auth:web']);

	Route.group(() => {
		Route.group(() => {
			Route.get('', 'UsersController.list').as('users_list');
			Route.get('pagination', 'UsersController.usersPagination');
			Route.post('add', 'UsersController.addUser');
			Route.post('update', 'UsersController.update');
			Route.post('update-status', 'UsersController.updateStatus');
			Route.delete('delete', 'UsersController.delete');
		}).prefix('users');

		Route.group(() => {
			Route.get('', 'ColorController.list').as('colors_list');
			Route.get('pagination', 'ColorController.pagination');
			Route.post('add', 'ColorController.add');
			Route.post('update', 'ColorController.update');
			Route.post('update-status', 'ColorController.updateStatus');
			Route.delete('delete', 'ColorController.delete');
		}).prefix('colors');

		Route.group(() => {
			Route.get('', 'SizeController.list').as('sizes_list');
			Route.get('pagination', 'SizeController.pagination');
			Route.post('add', 'SizeController.add');
			Route.post('update', 'SizeController.update');
			Route.post('update-status', 'SizeController.updateStatus');
			Route.delete('delete', 'SizeController.delete');
		}).prefix('sizes');

		Route.group(() => {
			Route.get('', 'FaQsController.list').as('faqs_list');
			Route.get('pagination', 'FaQsController.pagination');
			Route.post('add', 'FaQsController.add');
			Route.post('update', 'FaQsController.update');
			Route.delete('delete', 'FaQsController.delete');
		}).prefix('faqs');

	
		Route.group(() => {
			Route.get('', 'ContactUsesController.list').as('contact_us_inquires');
			Route.get('pagination', 'ContactUsesController.pagination');
			Route.post('update', 'ContactUsesController.update');
			Route.post('update-status', 'ContactUsesController.updateStatus');
			Route.delete('delete', 'ContactUsesController.delete');
		}).prefix('contact-us');

		Route.group(() => {
			Route.get('', 'SubscribersController.list').as('subscribers');
			Route.get('pagination', 'SubscribersController.pagination');
			Route.delete('delete', 'SubscribersController.delete');
		}).prefix('subscribers');

		Route.get('terms-and-conditions', 'PagesController.getTermsAndConditions').as(
			'terms_n_conditions'
		);
		Route.post('terms-and-conditions', 'PagesController.updateTermsAndConditions');

		Route.get('privacy-and-policy', 'PagesController.getPrivacyAndPolicy').as(
			'privacy_n_policy'
		);
		Route.post('privacy-and-policy', 'PagesController.updatePrivacyAndPolicy');

		Route.get('author', 'PagesController.getAuthor').as('author');
		Route.post('author', 'PagesController.updateAuthor');

		Route.get('publication-ethics', 'PagesController.getPublicationEthics').as(
			'publication_ethics'
		);
		Route.post('publication-ethics', 'PagesController.updatePublicationEthics');

		Route.get('about-us', 'PagesController.getAboutUs').as('about_us');
		Route.post('about-us', 'PagesController.updateAboutUs');

		Route.get('about-journal', 'PagesController.getAboutJournal').as('about_journal');
		Route.post('about-journal', 'PagesController.updateAboutJournal');

		/**--------------------------------------------
		 *               App Services Settings
		 *---------------------------------------------**/
		 Route.get('app-settings', 'AppSettingsController.get').as('admin_app_settings');
		 Route.post('app-settings/android', 'AppSettingsController.updateAndroidSettings');
		 Route.post('app-settings/ios', 'AppSettingsController.updateIOSSettings');

		/**--------------------------------------------
		 *               Database Backups
		 *---------------------------------------------**/
		Route.group(() => {
			Route.get('', 'DatabaseBackupsController.get').as('admin_database_backups');
			Route.get('backup', 'DatabaseBackupsController.takeBackup').as(
				'admin_database_backup_now'
			);
			Route.get('download:file', 'DatabaseBackupsController.downloadFile').as(
				'admin_database_backup_download'
			);
			Route.get('delete:file', 'DatabaseBackupsController.deleteFile').as(
				'admin_database_backup_delete'
			);
		}).prefix('databases');
	}).middleware(['auth:web']);
})
	.namespace('App/Controllers/Admin')
	.prefix('admin');

	Route.group(() => {
		Route.get('verify/:email', 'UsersController.showCreatePasswordForUser').as(
			'verify_email'
		);
		Route.post('verify/:email', 'UsersController.createPasswordForUser');
	}).prefix('users');