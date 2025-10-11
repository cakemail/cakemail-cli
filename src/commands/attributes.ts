import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList } from '../utils/defaults.js';

export function createAttributesCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const attributes = new Command('attributes')
    .description('Manage custom attributes (custom fields)');

  // List attributes
  attributes
    .command('list [list-id]')
    .description('List all custom attributes for a list (auto-detects if only one list exists)')
    .action(async (listId) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching custom attributes...').start();
      try {
        const data = await client.sdk.customAttributeService.listCustomAttributes({
          listId: detectedListId
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
    .command('get [list-id] <name>')
    .description('Get custom attribute details (auto-detects if only one list exists)')
    .action(async (listId, name) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Fetching attribute ${name}...`).start();
      try {
        const data = await client.sdk.customAttributeService.getCustomAttribute({
          listId: detectedListId,
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
    .command('create [list-id]')
    .description('Create a new custom attribute (auto-detects if only one list exists)')
    .requiredOption('-n, --name <name>', 'Attribute name')
    .requiredOption('-t, --type <type>', 'Attribute type (text, number, date, boolean)')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Creating custom attribute...').start();
      try {
        const data = await client.sdk.customAttributeService.createCustomAttribute({
          listId: detectedListId,
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
    .command('delete [list-id] <name>')
    .description('Delete a custom attribute (auto-detects if only one list exists)')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, name, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('custom attribute', name, [
          'Attribute and all its data will be deleted from all contacts'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting attribute ${name}...`).start();
      try {
        await client.sdk.customAttributeService.deleteCustomAttribute({
          listId: detectedListId,
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
