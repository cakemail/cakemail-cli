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
    .option('--sort <sort>', 'Sort by field: +name, -created_on')
    .option('--filter <filter>', 'Filter (e.g., "status==active;name==Newsletter")')
    .action(async (options) => {
      const spinner = ora('Fetching lists...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);
        if (options.sort) params.sort = options.sort;
        if (options.filter) params.filter = options.filter;

        const data = await client.sdk.lists.list(params);
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
        const data = await client.sdk.lists.get(parseInt(id));
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

        const data = await client.sdk.lists.create(payload);
        spinner.stop();
        formatter.success(`List created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update list
  lists
    .command('update <id>')
    .description('Update a list')
    .option('-n, --name <name>', 'List name')
    .option('-l, --language <lang>', 'Language code')
    .action(async (id, options) => {
      const spinner = ora(`Updating list ${id}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.language) payload.language = options.language;

        const data = await client.sdk.lists.update(parseInt(id), payload);
        spinner.stop();
        formatter.success(`List ${id} updated`);
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
        await client.sdk.lists.delete(parseInt(id));
        spinner.stop();
        formatter.success(`List ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Archive list
  lists
    .command('archive <id>')
    .description('Archive a list')
    .action(async (id) => {
      const spinner = ora(`Archiving list ${id}...`).start();
      try {
        const data = await client.sdk.listService.archiveList({ listId: parseInt(id) });
        spinner.stop();
        formatter.success(`List ${id} archived`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Accept policy
  lists
    .command('accept-policy <id>')
    .description('Accept policy for a list')
    .action(async (id) => {
      const spinner = ora(`Accepting policy for list ${id}...`).start();
      try {
        const data = await client.sdk.listService.acceptListPolicy({ listId: parseInt(id) });
        spinner.stop();
        formatter.success(`Policy accepted for list ${id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List subscription forms
  lists
    .command('forms <id>')
    .description('List subscription form endpoints for a list')
    .action(async (id) => {
      const spinner = ora(`Fetching subscription forms for list ${id}...`).start();
      try {
        const data = await client.sdk.listService.listSubscriptionFormEndpoints({ listId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create subscription form
  lists
    .command('form-create <id>')
    .description('Create a subscription form endpoint')
    .option('-d, --domain <domain>', 'Domain name hosting the form')
    .option('-n, --name <name>', 'Name of the form')
    .option('--double-opt-in', 'Enable double opt-in')
    .action(async (id, options) => {
      const spinner = ora('Creating subscription form...').start();
      try {
        const requestBody: any = {};
        if (options.domain) requestBody.domain = options.domain;
        if (options.name) requestBody.name = options.name;
        if (options.doubleOptIn) requestBody.double_opt_in = options.doubleOptIn;

        const data = await client.sdk.listService.createSubscriptionFormEndpoint({
          listId: parseInt(id),
          requestBody
        });
        spinner.stop();
        formatter.success('Subscription form created');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete subscription form
  lists
    .command('form-delete <list-id> <form-id>')
    .description('Delete a subscription form endpoint')
    .option('-f, --force', 'Skip confirmation')
    .action(async (listId, formId, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting subscription form ${formId}...`).start();
      try {
        await client.sdk.listService.deleteSubscriptionFormEndpoint({
          listId: parseInt(listId),
          formId: formId
        });
        spinner.stop();
        formatter.success(`Subscription form ${formId} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return lists;
}
