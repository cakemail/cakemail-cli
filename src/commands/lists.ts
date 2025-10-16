import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { displayError, validate } from '../utils/errors.js';
import { confirmDelete, confirmDangerousDelete } from '../utils/confirm.js';
import { promptText, createSpinner } from '../utils/interactive.js';
import { applyListDefaults } from '../utils/list-defaults.js';

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
      const profileConfig = formatter.getProfile();
      const spinner = ora('Fetching lists...').start();
      try {
        // Apply profile-based defaults for pagination and sorting
        const params: any = applyListDefaults(options, profileConfig);

        // Add lists-specific filters
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
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching list ${id}...`).start();
      try {
        const data = await client.sdk.lists.get(parseInt(id));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'lists get',
          resource: 'list',
          resourceId: id,
          operation: 'fetch'
        });
        process.exit(1);
      }
    });

  // Create list
  lists
    .command('create')
    .description('Create a new list')
    .option('-n, --name <name>', 'List name')
    .option('-l, --language <lang>', 'Language code (e.g., en, fr)')
    .action(async (options) => {
      const profileConfig = formatter.getProfile();

      // Interactive prompt for list name if not provided
      let listName = options.name;
      if (!listName) {
        listName = await promptText('List name:', {
          required: true,
          profileConfig
        });

        if (!listName) {
          formatter.error('List name is required');
          formatter.info('Usage: cakemail lists create --name "My List"');
          process.exit(1);
        }
      }

      // Interactive prompt for language if not provided (optional)
      let language = options.language;
      if (!language && profileConfig) {
        language = await promptText('Language code (optional, e.g., en, fr):', {
          required: false,
          profileConfig
        });
      }

      // Profile-aware spinner
      const spinner = createSpinner('Creating list...', profileConfig);
      spinner.start();

      try {
        const payload: any = {
          name: listName,
        };
        if (language) payload.language = language;

        const data = await client.sdk.lists.create(payload);
        spinner.succeed(`List created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.fail('Failed to create list');
        displayError(error, {
          command: 'lists create',
          resource: 'list',
          operation: 'create',
          profileConfig
        });
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
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

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
        displayError(error, {
          command: 'lists update',
          resource: 'list',
          resourceId: id,
          operation: 'update'
        });
        process.exit(1);
      }
    });

  // Delete list
  lists
    .command('delete <id>')
    .description('Delete a list')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (id, options) => {
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      // Lists are dangerous to delete as they contain all contacts
      if (!options.force) {
        const profileConfig = formatter.getProfile();
        const confirmed = await confirmDangerousDelete('list', id, [
          'All contacts in this list will be deleted',
          'All segments in this list will be deleted',
          'This action cannot be undone'
        ], profileConfig);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting list ${id}...`).start();
      try {
        await client.sdk.lists.delete(parseInt(id));
        spinner.stop();
        formatter.success(`List ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'lists delete',
          resource: 'list',
          resourceId: id,
          operation: 'delete'
        });
        process.exit(1);
      }
    });

  // Archive list
  lists
    .command('archive <id>')
    .description('Archive a list')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Archiving list ${id}...`).start();
      try {
        const data = await client.sdk.listService.archiveList({ listId: parseInt(id) });
        spinner.stop();
        formatter.success(`List ${id} archived`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'lists archive',
          resource: 'list',
          resourceId: id,
          operation: 'archive'
        });
        process.exit(1);
      }
    });

  // Accept policy
  lists
    .command('accept-policy <id>')
    .description('Accept policy for a list')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Accepting policy for list ${id}...`).start();
      try {
        const data = await client.sdk.listService.acceptListPolicy({ listId: parseInt(id) });
        spinner.stop();
        formatter.success(`Policy accepted for list ${id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'lists accept-policy',
          resource: 'list',
          resourceId: id,
          operation: 'accept policy'
        });
        process.exit(1);
      }
    });

  // List subscription forms
  lists
    .command('forms <id>')
    .description('List subscription form endpoints for a list')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching subscription forms for list ${id}...`).start();
      try {
        const data = await client.sdk.listService.listSubscriptionFormEndpoints({ listId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'lists forms',
          resource: 'list',
          resourceId: id,
          operation: 'fetch subscription forms'
        });
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
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

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
        displayError(error, {
          command: 'lists form-create',
          resource: 'list',
          resourceId: id,
          operation: 'create subscription form'
        });
        process.exit(1);
      }
    });

  // Delete subscription form
  lists
    .command('form-delete <list-id> <form-id>')
    .description('Delete a subscription form endpoint')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, formId, options) => {
      // Validate list ID
      const validation = validate.id(listId, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const profileConfig = formatter.getProfile();
        const confirmed = await confirmDelete('subscription form', formId, [
          'Subscription form endpoint will be deleted',
          'Any websites using this form will stop working'
        ], profileConfig);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
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
        displayError(error, {
          command: 'lists form-delete',
          resource: 'subscription form',
          resourceId: formId,
          operation: 'delete'
        });
        process.exit(1);
      }
    });

  return lists;
}
