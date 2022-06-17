import { join } from 'path';
import { BaseCommand } from '@adonisjs/core/build/standalone';

export default class Type extends BaseCommand {

	/**
	 * Command name is used to run the command
	 */
	public static commandName = 'cmd:init'

	/**
	 * Command description is displayed in the "help" output
	 */
	public static description = 'Generate required files get going.'

	public static settings = {
		/**
		 * Set the following value to true, if you want to load the application
		 * before running the command
		 */
		loadApp: true,

		/**
		 * Set the following value to true, if you want this command to keep running until
		 * you manually decide to exit the process
		 */
		stayAlive: false,
	}

	public async run() {

		/**------------------------------------------------------------------------
		 *                           HTML Markup File
		 *------------------------------------------------------------------------**/
		const appRoot = this.application.cliCwd || this.application.appRoot;
		const htmlMarkupFileName = 'HtmlMarkupHelper';
		const markupFileStub = join(__dirname, '..', 'templates', 'http_error_reporter.txt');
		const helperFileDir = this.application.resolveNamespaceDirectory('Helpers') || 'app/Helpers';
		this.generator
			.addFile(htmlMarkupFileName)
			.appRoot(appRoot)
			.destinationDir(helperFileDir)
			.stub(markupFileStub)
			.useMustache()
			.apply({ file_name: htmlMarkupFileName });

		/**------------------------------------------------------------------------
		*                           Error Reporter
		*------------------------------------------------------------------------**/
		const errorReporterFileName = 'HttpErrorReporter';
		const errorReporterStub = join(__dirname, '..', 'templates', 'http_error_reporter.txt');
		const errorReporterPath = this.application.resolveNamespaceDirectory('Validators/Reporters') || 'app/Validators';
		this.generator
			.addFile(errorReporterFileName)
			.appRoot(appRoot)
			.destinationDir(errorReporterPath)
			.stub(errorReporterStub)
			.useMustache()
			.apply({ file_name: errorReporterFileName });

		/**------------------------------------------------------------------------
		 *                           Pagination Files
		 *------------------------------------------------------------------------**/
		const validatorFileName = `PaginationValidator`;
		const paginationStub = join(__dirname, '..', 'templates', 'pagination_validator.txt');
		this.generator
			.addFile(validatorFileName)
			.appRoot(appRoot)
			.destinationDir(errorReporterPath || 'app/Validators')
			.stub(paginationStub)
			.useMustache()
			.apply({
				file_name: validatorFileName,
				cache_name: 'Pagination_Data_Request_Validator',
				field: '{{ filed }}'
			});

		const paginationHelperFileName = 'PaginationHelper';
		const paginationHelperStub = join(__dirname, '..', 'templates', 'pagination_helper_data.txt');
		this.generator
			.addFile(paginationHelperFileName)
			.appRoot(appRoot)
			.destinationDir(helperFileDir)
			.stub(paginationHelperStub)
			.useMustache()
			.apply({ fileName: paginationHelperFileName });

		/**------------------------------------------------------------------------
		 *                           Type files
		 *------------------------------------------------------------------------**/
		const typeFilePath = this.application.resolveNamespaceDirectory('Types') || 'app/Types';
		const tableTypeFileStub = join(__dirname, '..', 'templates', 'table_types.txt');
		const formTypeFileStub = join(__dirname, '..', 'templates', 'form_types.txt');
		const paginationTypeFileStub = join(__dirname, '..', 'templates', 'pagination_types.txt');
		const indexTypeFileStub = join(__dirname, '..', 'templates', 'index_types.txt');
		this.generator
			.addFile('table')
			.appRoot(appRoot)
			.destinationDir(typeFilePath)
			.stub(tableTypeFileStub)
			.useMustache();
		this.generator
			.addFile('form')
			.appRoot(appRoot)
			.destinationDir(typeFilePath)
			.stub(formTypeFileStub)
			.useMustache();
		this.generator
			.addFile('pagination')
			.appRoot(appRoot)
			.destinationDir(typeFilePath)
			.stub(paginationTypeFileStub)
			.useMustache();
		this.generator
			.addFile('index')
			.appRoot(appRoot)
			.destinationDir(typeFilePath)
			.stub(indexTypeFileStub)
			.useMustache();

		await this.generator.run();
	}
}
