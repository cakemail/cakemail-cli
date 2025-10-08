import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createListsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const lists = new Command('lists')
    .description('Manage contact lists');

  // List all lists
  lists
    .command('list')
    .description('List all contact lists')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (options) => {
      const spinner = ora('Fetching lists...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = options.limit;
        if (options.page) params.page = options.page;

        const data = await client.get('/lists', { params });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get list
  lists
    .command('get <id>')
    .description('Get list details')
    .action(async (id) => {
      const spinner = ora(`Fetching list ${id}...`).start();
      try {
        const data = await client.get(`/lists/${id}`);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create list
  lists
    .command('create')
    .description('Create a new list')
    .requiredOption('-n, --name <name>', 'List name')
    .option('-l, --language <lang>', 'Language code (e.g., en, fr)')
    .action(async (options) => {
      const spinner = ora('Creating list...').start();
      try {
        const payload: any = {
          name: options.name,
        };
        if (options.language) payload.language = options.language;

        const data = await client.post('/lists', payload);
        spinner.stop();
        formatter.success(`List created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete list
  lists
    .command('delete <id>')
    .description('Delete a list')
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting list ${id}...`).start();
      try {
        await client.delete(`/lists/${id}`);
        spinner.stop();
        formatter.success(`List ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return lists;
}
