import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList } from '../utils/defaults.js';

export function createInterestsCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const interests = new Command('interests')
    .description('Manage contact interests');

  // List interests
  interests
    .command('list [list-id]')
    .description('List all interests in a list (auto-detects if only one list exists)')
    .option('-p, --page <number>', 'Page number', '1')
    .option('--per-page <number>', 'Results per page', '50')
    .option('--with-count', 'Include contact count for each interest')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching interests...').start();
      try {
        const page = parseInt(options.page);
        const perPage = parseInt(options.perPage);

        const data = await client.sdk.interestService.listInterests({
          listId: detectedListId,
          page,
          perPage,
          withCount: options.withCount ? true : undefined
        });

        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get interest
  interests
    .command('get [list-id] <interest-name>')
    .description('Get details of a specific interest (auto-detects if only one list exists)')
    .action(async (listId, interestName) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Fetching interest ${interestName}...`).start();
      try {
        const data = await client.sdk.interestService.getInterest({
          listId: detectedListId,
          interestName
        });

        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create interest
  interests
    .command('create [list-id]')
    .description('Create a new interest (auto-detects if only one list exists)')
    .requiredOption('-n, --name <name>', 'Interest name')
    .option('-a, --alias <alias>', 'Interest alias')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Creating interest...').start();
      try {
        const payload: any = {
          name: options.name
        };
        if (options.alias) {
          payload.alias = options.alias;
        }

        const data = await client.sdk.interestService.createInterest({
          listId: detectedListId,
          requestBody: payload
        });

        spinner.stop();
        formatter.success(`Interest "${options.name}" created successfully`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update interest
  interests
    .command('update [list-id] <interest-name>')
    .description('Update an interest (auto-detects if only one list exists)')
    .option('-n, --name <name>', 'New interest name')
    .option('-a, --alias <alias>', 'New interest alias')
    .action(async (listId, interestName, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Updating interest ${interestName}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.alias) payload.alias = options.alias;

        const data = await client.sdk.interestService.patchInterest({
          listId: detectedListId,
          interestName,
          requestBody: payload
        });

        spinner.stop();
        formatter.success(`Interest updated successfully`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete interest
  interests
    .command('delete [list-id] <interest-name>')
    .description('Delete an interest (auto-detects if only one list exists)')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, interestName, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('interest', interestName, [
          'Interest will be permanently deleted',
          'This action cannot be undone'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting interest ${interestName}...`).start();
      try {
        await client.sdk.interestService.deleteInterest({
          listId: detectedListId,
          interestName
        });

        spinner.stop();
        formatter.success(`Interest "${interestName}" deleted successfully`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return interests;
}
