import { join } from 'path';
import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class Helper extends BaseCommand {

	/**
	 * Command name is used to run the command
	 */
	public static commandName = 'cmd:helper'

	/**
	 * Command description is displayed in the "help" output
	 */
	public static description = 'Generate Helper class for your convenience.'

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

	@args.string({ description: 'Name of the helper you want to generate.' })
	public name: string

	@flags.string({
		alias: 'm',
		description: 'Name of model for which pagination helper will be generated.'
	})
	public model: string

	@flags.boolean({
		alias: 'c',
		description: 'To generate pagiantion controller.'
	})
	public controller: boolean

	public async run() {
		const helperFileName = string.pascalCase(`${this.name}Helper`);
		const paginationStub = join(__dirname, '..', 'templates', this.model ? 'pagination_helper.txt' : 'helper.txt');
		const pageNationPath = this.application.resolveNamespaceDirectory('Helpers');
		this.generator
			.addFile(helperFileName)
			.appRoot(this.application.cliCwd || this.application.appRoot)
			.destinationDir(pageNationPath || 'app/Helpers')
			.stub(paginationStub)
			.useMustache()
			.apply({ model: this.model || '', fileName: helperFileName });

		if (this.controller) {
			const paginationHelperFileName = 'PaginationHelper';
			const controllerFileName = string.pascalCase(`${string.pluralize(this.name)}Controller`);
			const controllerStub = join(__dirname, '..', 'templates', 'pagination_controller.txt');
			const deleteObjName = this.model.toLowerCase();
			const pageName = string.capitalCase(string.pluralize(this.model))
			this.generator
				.addFile(controllerFileName)
				.appRoot(this.application.cliCwd || this.application.appRoot)
				.destinationDir('app/Controllers/Admin')
				.stub(controllerStub)
				.useMustache()
				.apply({
					model: this.model || '',
					file_name: controllerFileName,
					helperFileName: helperFileName,
					paginationHelperFileName: paginationHelperFileName,
					deleteObjName,
					page_name: pageName,
					form_name: string.capitalCase(this.model)
				});
		}

		await this.generator.run();

	}
}
