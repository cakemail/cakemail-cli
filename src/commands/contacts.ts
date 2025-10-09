import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createContactsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const contacts = new Command('contacts')
    .description('Manage contacts in lists');

  // List contacts
  contacts
    .command('list <list-id>')
    .description('List contacts in a list')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .option('-q, --query <query>', 'Search query')
    .option('--sort <sort>', 'Sort by field: +email, -subscribed_on, +status, etc.')
    .option('--filter <filter>', 'Filter (e.g., "status==active;email==user@example.com")')
    .action(async (listId, options) => {
      const spinner = ora('Fetching contacts...').start();
      try {
        const params: any = {
          list_id: parseInt(listId),
        };
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);
        if (options.query) params.query = options.query;
        if (options.sort) params.sort = options.sort;
        if (options.filter) params.filter = options.filter;

        const data = await client.sdk.contacts.list(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get contact
  contacts
    .command('get <list-id> <contact-id>')
    .description('Get contact details')
    .action(async (listId, contactId) => {
      const spinner = ora(`Fetching contact ${contactId}...`).start();
      try {
        const data = await client.sdk.contacts.get(parseInt(contactId));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Add contact
  contacts
    .command('add <list-id>')
    .description('Add a contact to a list')
    .requiredOption('-e, --email <email>', 'Contact email')
    .option('-f, --first-name <name>', 'First name')
    .option('-l, --last-name <name>', 'Last name')
    .option('-d, --data <json>', 'Custom attributes as JSON')
    .action(async (listId, options) => {
      const spinner = ora('Adding contact...').start();
      try {
        const payload: any = {
          email: options.email,
          list_ids: [parseInt(listId)],
        };
        if (options.firstName) payload.first_name = options.firstName;
        if (options.lastName) payload.last_name = options.lastName;
        if (options.data) {
          payload.custom_attributes = JSON.parse(options.data);
        }

        const data = await client.sdk.contacts.create(payload);
        spinner.stop();
        formatter.success(`Contact added: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update contact
  contacts
    .command('update <list-id> <contact-id>')
    .description('Update a contact')
    .option('-e, --email <email>', 'Contact email')
    .option('-f, --first-name <name>', 'First name')
    .option('-l, --last-name <name>', 'Last name')
    .option('-d, --data <json>', 'Custom attributes as JSON')
    .action(async (listId, contactId, options) => {
      const spinner = ora('Updating contact...').start();
      try {
        const payload: any = {};
        if (options.email) payload.email = options.email;
        if (options.firstName) payload.first_name = options.firstName;
        if (options.lastName) payload.last_name = options.lastName;
        if (options.data) {
          payload.custom_attributes = JSON.parse(options.data);
        }

        const data = await client.sdk.contacts.update(parseInt(contactId), payload);
        spinner.stop();
        formatter.success(`Contact ${contactId} updated`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete contact
  contacts
    .command('delete <list-id> <contact-id>')
    .description('Delete a contact')
    .option('-f, --force', 'Skip confirmation')
    .action(async (listId, contactId, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting contact ${contactId}...`).start();
      try {
        await client.sdk.contacts.delete(parseInt(contactId));
        spinner.stop();
        formatter.success(`Contact ${contactId} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Unsubscribe contact
  contacts
    .command('unsubscribe <list-id> <contact-id>')
    .description('Unsubscribe a contact from a list')
    .action(async (listId, contactId) => {
      const spinner = ora(`Unsubscribing contact ${contactId}...`).start();
      try {
        await client.sdk.contacts.unsubscribe(parseInt(contactId), parseInt(listId));
        spinner.stop();
        formatter.success(`Contact ${contactId} unsubscribed`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return contacts;
}
