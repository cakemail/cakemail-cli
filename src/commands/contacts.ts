import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { readFileSync } from 'fs';

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

  // Import contacts - TODO: Implement CSV/JSON parsing
  // The SDK expects structured ImportContactData[], not raw file content
  // Need to add CSV/JSON parser and convert to proper format
  // contacts
  //   .command('import <list-id>')
  //   .description('Import contacts from a file')
  //   .requiredOption('-f, --file <path>', 'CSV or JSON file path')
  //   .option('--update-existing', 'Update existing contacts')
  //   .action(async (listId, options) => {
  //     // TODO: Parse CSV/JSON file and convert to ImportContactData[]
  //   });

  // Export contacts
  contacts
    .command('export <list-id>')
    .description('Create a contacts export')
    .option('--status <status>', 'Filter by status (subscribed, unsubscribed, etc.)')
    .action(async (listId, options) => {
      const spinner = ora('Creating contacts export...').start();
      try {
        const params: any = {
          listId: parseInt(listId)
        };
        if (options.status) params.filter = `status==${options.status}`;

        const data = await client.sdk.contactService.exportContacts(params);
        spinner.stop();
        formatter.success('Contacts export created');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List exports
  contacts
    .command('exports <list-id>')
    .description('List contact exports for a list')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (listId, options) => {
      const spinner = ora('Fetching exports...').start();
      try {
        const params: any = {
          listId: parseInt(listId)
        };
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.contactService.listContactsExports(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get export
  contacts
    .command('export-get <list-id> <export-id>')
    .description('Get a contacts export status')
    .action(async (listId, exportId) => {
      const spinner = ora(`Fetching export ${exportId}...`).start();
      try {
        const data = await client.sdk.contactService.getContactsExport({
          listId: parseInt(listId),
          exportId: exportId
        });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Download export
  contacts
    .command('export-download <list-id> <export-id>')
    .description('Download a contacts export')
    .action(async (listId, exportId) => {
      const spinner = ora(`Downloading export ${exportId}...`).start();
      try {
        const data = await client.sdk.contactService.downloadContactsExport({
          listId: parseInt(listId),
          exportId: exportId
        });
        spinner.stop();
        formatter.success('Export downloaded');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete export
  contacts
    .command('export-delete <list-id> <export-id>')
    .description('Delete a contacts export')
    .option('-f, --force', 'Skip confirmation')
    .action(async (listId, exportId, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting export ${exportId}...`).start();
      try {
        await client.sdk.contactService.deleteContactsExport({
          listId: parseInt(listId),
          exportId: exportId
        });
        spinner.stop();
        formatter.success(`Export ${exportId} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Tag single contact
  contacts
    .command('tag <list-id> <contact-id>')
    .description('Tag a contact')
    .requiredOption('-t, --tags <tags>', 'Comma-separated tags')
    .action(async (listId, contactId, options) => {
      const spinner = ora(`Tagging contact ${contactId}...`).start();
      try {
        const tags = options.tags.split(',').map((t: string) => t.trim());
        await client.sdk.contactService.tagContact({
          listId: parseInt(listId),
          contactId: parseInt(contactId),
          requestBody: { tags }
        });
        spinner.stop();
        formatter.success(`Contact ${contactId} tagged`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Untag single contact
  contacts
    .command('untag <list-id> <contact-id>')
    .description('Remove tags from a contact')
    .requiredOption('-t, --tags <tags>', 'Comma-separated tags to remove')
    .action(async (listId, contactId, options) => {
      const spinner = ora(`Untagging contact ${contactId}...`).start();
      try {
        const tags = options.tags.split(',').map((t: string) => t.trim());
        await client.sdk.contactService.untagContact({
          listId: parseInt(listId),
          contactId: parseInt(contactId),
          requestBody: { tags }
        });
        spinner.stop();
        formatter.success(`Tags removed from contact ${contactId}`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Tag multiple contacts
  contacts
    .command('tag-bulk <list-id>')
    .description('Tag multiple contacts')
    .requiredOption('-c, --contacts <ids>', 'Comma-separated contact IDs')
    .requiredOption('-t, --tags <tags>', 'Comma-separated tags')
    .action(async (listId, options) => {
      const spinner = ora('Tagging contacts...').start();
      try {
        const contactIds = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        const tags = options.tags.split(',').map((t: string) => t.trim());

        await client.sdk.contactService.tagMultipleContacts({
          listId: parseInt(listId),
          requestBody: {
            contact_ids: contactIds,
            tags
          }
        });
        spinner.stop();
        formatter.success(`${contactIds.length} contacts tagged`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Untag multiple contacts
  contacts
    .command('untag-bulk <list-id>')
    .description('Remove tags from multiple contacts')
    .requiredOption('-c, --contacts <ids>', 'Comma-separated contact IDs')
    .requiredOption('-t, --tags <tags>', 'Comma-separated tags to remove')
    .action(async (listId, options) => {
      const spinner = ora('Untagging contacts...').start();
      try {
        const contactIds = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        const tags = options.tags.split(',').map((t: string) => t.trim());

        await client.sdk.contactService.untagMultipleContacts({
          listId: parseInt(listId),
          requestBody: {
            contact_ids: contactIds,
            tags
          }
        });
        spinner.stop();
        formatter.success(`Tags removed from ${contactIds.length} contacts`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return contacts;
}
