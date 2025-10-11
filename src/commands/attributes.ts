import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createAttributesCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const attributes = new Command('attributes')
    .description('Manage custom attributes (custom fields)');

  // List attributes
  attributes
    .command('list <list-id>')
    .description('List all custom attributes for a list')
    .action(async (listId) => {
      const spinner = ora('Fetching custom attributes...').start();
      try {
        const data = await client.sdk.customAttributeService.listCustomAttributes({
          listId: parseInt(listId)
        });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get attribute
  attributes
    .command('get <list-id> <name>')
    .description('Get custom attribute details')
    .action(async (listId, name) => {
      const spinner = ora(`Fetching attribute ${name}...`).start();
      try {
        const data = await client.sdk.customAttributeService.getCustomAttribute({
          listId: parseInt(listId),
          name
        });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create attribute
  attributes
    .command('create <list-id>')
    .description('Create a new custom attribute')
    .requiredOption('-n, --name <name>', 'Attribute name')
    .requiredOption('-t, --type <type>', 'Attribute type (text, number, date, boolean)')
    .action(async (listId, options) => {
      const spinner = ora('Creating custom attribute...').start();
      try {
        const data = await client.sdk.customAttributeService.createCustomAttribute({
          listId: parseInt(listId),
          requestBody: {
            name: options.name,
            type: options.type
          }
        });
        spinner.stop();
        formatter.success(`Custom attribute created: ${options.name}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete attribute
  attributes
    .command('delete <list-id> <name>')
    .description('Delete a custom attribute')
    .option('-f, --force', 'Skip confirmation')
    .action(async (listId, name, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting attribute ${name}...`).start();
      try {
        await client.sdk.customAttributeService.deleteCustomAttribute({
          listId: parseInt(listId),
          name
        });
        spinner.stop();
        formatter.success(`Attribute ${name} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return attributes;
}
