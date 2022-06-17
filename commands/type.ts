import { join } from 'path';
import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class Type extends BaseCommand {

	/**
	 * Command name is used to run the command
	 */
	public static commandName = 'cmd:type'

	/**
	 * Command description is displayed in the "help" output
	 */
	public static description = 'Generate type file for managing types inside project.'

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

	@args.string({ description: 'Name of the fil you want to generate.' })
	public name: string

	public async run() {
		const typFileName = string.snakeCase(`${this.name}`);
		const typeFileStub = join(__dirname, '..', 'templates', 'types.txt');
		const typeFilePath = this.application.resolveNamespaceDirectory('Types') || 'app/Types';
		this.generator
			.addFile(typFileName)
			.appRoot(this.application.cliCwd || this.application.appRoot)
			.destinationDir(typeFilePath || 'app/Types')
			.stub(typeFileStub)
			.useMustache()
			.apply({ name: this.name });
		await this.generator.run();
		this.ui
			.instructions()
			.add(`Write some types & export it.`)
			.add(`Copy & paste below code inside ${this.colors.green(typeFilePath)} file.`)
			.add(this.colors.cyan(`export * from './${typFileName}';`))
			.render();
	}
}
