import { join } from 'path';
import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class AwqafValidator extends BaseCommand {
	/**
	 * Command name is used to run the command
	 */
	public static commandName = 'cmd:validator'

	/**
	 * Command description is displayed in the "help" output
	 */
	public static description = 'Create validator for request validation.'

	public static settings = {
		/**
		 * Set the following value to true, if you want to load the application
		 * before running the command
		 */
		loadApp: false,

		/**
		 * Set the following value to true, if you want this command to keep running until
		 * you manually decide to exit the process
		 */
		stayAlive: false,
	}

	@args.string({ description: 'Name of the validator you want to generate.' })
	public name: string

	@flags.boolean({ description: 'If pagination request validator needs to be generated.', alias: 'p' })
	public pagination: boolean = false;

	public async run() {
		/**--------------------------------------------
		 *               Validator File
		 *---------------------------------------------**/
		const errorReporterFileName = 'HttpErrorReporter';
		this.logger.info(`Generating ${this.name} request validator.`);
		const validatorFileName = string.pascalCase(`${this.name}Validator`);
		const paginationStub = join(__dirname, '..', 'templates', 'validator.txt');
		this.generator
			.addFile(validatorFileName)
			.appRoot(this.application.cliCwd || this.application.appRoot)
			.destinationDir('app/Validators')
			.stub(paginationStub)
			.useMustache()
			.apply({
				reporter_file_name: errorReporterFileName,
				file_name: validatorFileName,
				cache_name: validatorFileName,
				field: '{{ filed }}'
			});

		await this.generator.run();
	}
}
