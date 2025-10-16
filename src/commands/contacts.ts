import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { readFileSync } from 'fs';
import { pollUntilComplete, BatchProgress } from '../utils/progress.js';
import { displayError, validate } from '../utils/errors.js';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList } from '../utils/defaults.js';
import { applyListDefaults } from '../utils/list-defaults.js';

export function createContactsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const contacts = new Command('contacts')
    .description('Manage contacts in lists');

  // List contacts
  contacts
    .command('list [list-id]')
    .description('List contacts in a list (auto-detects if only one list exists)')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .option('-q, --query <query>', 'Search query')
    .option('--sort <sort>', 'Sort by field: +email, -subscribed_on, +status, etc.')
    .option('--filter <filter>', 'Filter (e.g., "status==active;email==user@example.com")')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Validate list ID
      const validation = validate.id(detectedListId, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const profileConfig = formatter.getProfile();
      const spinner = ora('Fetching contacts...').start();
      try {
        // Apply profile-based defaults for pagination and sorting
        const params: any = {
          list_id: detectedListId,
          ...applyListDefaults(options, profileConfig)
        };

        // Add contacts-specific filters
        if (options.query) params.query = options.query;
        if (options.filter) params.filter = options.filter;

        const data = await client.sdk.contacts.list(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts list',
          resource: 'list',
          resourceId: detectedListId,
          operation: 'fetch contacts'
        });
        process.exit(1);
      }
    });

  // Get contact
  contacts
    .command('get <list-id> <contact-id>')
    .description('Get contact details')
    .action(async (listId, contactId) => {
      // Validate IDs
      const listValidation = validate.id(listId, 'List ID');
      if (!listValidation.valid) {
        formatter.error(listValidation.error!);
        process.exit(1);
      }

      const contactValidation = validate.id(contactId, 'Contact ID');
      if (!contactValidation.valid) {
        formatter.error(contactValidation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching contact ${contactId}...`).start();
      try {
        const data = await client.sdk.contacts.get(parseInt(contactId));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts get',
          resource: 'contact',
          resourceId: contactId,
          operation: 'fetch'
        });
        process.exit(1);
      }
    });

  // Add contact
  contacts
    .command('add [list-id]')
    .description('Add a contact to a list (auto-detects if only one list exists)')
    .requiredOption('-e, --email <email>', 'Contact email')
    .option('-f, --first-name <name>', 'First name')
    .option('-l, --last-name <name>', 'Last name')
    .option('-d, --data <json>', 'Custom attributes as JSON')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Validate list ID
      const listValidation = validate.id(detectedListId, 'List ID');
      if (!listValidation.valid) {
        formatter.error(listValidation.error!);
        process.exit(1);
      }

      // Validate email
      const emailValidation = validate.email(options.email);
      if (!emailValidation.valid) {
        formatter.error(emailValidation.error!);
        process.exit(1);
      }

      // Validate JSON if provided
      if (options.data) {
        const jsonValidation = validate.json(options.data, 'Custom attributes');
        if (!jsonValidation.valid) {
          formatter.error(jsonValidation.error!);
          process.exit(1);
        }
      }

      const spinner = ora('Adding contact...').start();
      try {
        const payload: any = {
          email: options.email,
          list_ids: [detectedListId],
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
        displayError(error, {
          command: 'contacts add',
          resource: 'list',
          resourceId: detectedListId.toString(),
          operation: 'add contact'
        });
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
      // Validate IDs
      const listValidation = validate.id(listId, 'List ID');
      if (!listValidation.valid) {
        formatter.error(listValidation.error!);
        process.exit(1);
      }

      const contactValidation = validate.id(contactId, 'Contact ID');
      if (!contactValidation.valid) {
        formatter.error(contactValidation.error!);
        process.exit(1);
      }

      // Validate email if provided
      if (options.email) {
        const emailValidation = validate.email(options.email);
        if (!emailValidation.valid) {
          formatter.error(emailValidation.error!);
          process.exit(1);
        }
      }

      // Validate JSON if provided
      if (options.data) {
        const jsonValidation = validate.json(options.data, 'Custom attributes');
        if (!jsonValidation.valid) {
          formatter.error(jsonValidation.error!);
          process.exit(1);
        }
      }

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
        displayError(error, {
          command: 'contacts update',
          resource: 'contact',
          resourceId: contactId,
          operation: 'update'
        });
        process.exit(1);
      }
    });

  // Delete contact
  contacts
    .command('delete <list-id> <contact-id>')
    .description('Delete a contact')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, contactId, options) => {
      // Validate IDs
      const listValidation = validate.id(listId, 'List ID');
      if (!listValidation.valid) {
        formatter.error(listValidation.error!);
        process.exit(1);
      }

      const contactValidation = validate.id(contactId, 'Contact ID');
      if (!contactValidation.valid) {
        formatter.error(contactValidation.error!);
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('contact', contactId, [
          'Contact will be permanently deleted from this list',
          'Contact history and data will be lost'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting contact ${contactId}...`).start();
      try {
        await client.sdk.contacts.delete(parseInt(contactId));
        spinner.stop();
        formatter.success(`Contact ${contactId} deleted`);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts delete',
          resource: 'contact',
          resourceId: contactId,
          operation: 'delete'
        });
        process.exit(1);
      }
    });

  // Unsubscribe contact
  contacts
    .command('unsubscribe <list-id> <contact-id>')
    .description('Unsubscribe a contact from a list')
    .action(async (listId, contactId) => {
      // Validate IDs
      const listValidation = validate.id(listId, 'List ID');
      if (!listValidation.valid) {
        formatter.error(listValidation.error!);
        process.exit(1);
      }

      const contactValidation = validate.id(contactId, 'Contact ID');
      if (!contactValidation.valid) {
        formatter.error(contactValidation.error!);
        process.exit(1);
      }

      const spinner = ora(`Unsubscribing contact ${contactId}...`).start();
      try {
        await client.sdk.contacts.unsubscribe(parseInt(contactId), parseInt(listId));
        spinner.stop();
        formatter.success(`Contact ${contactId} unsubscribed`);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts unsubscribe',
          resource: 'contact',
          resourceId: contactId,
          operation: 'unsubscribe'
        });
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
    .command('export [list-id]')
    .description('Create and download a contacts export (auto-detects if only one list exists)')
    .option('--status <status>', 'Filter by status (subscribed, unsubscribed, etc.)')
    .option('--no-wait', 'Create export without waiting for completion')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      try {
        const params: any = {
          listId: detectedListId
        };
        if (options.status) params.filter = `status==${options.status}`;

        // Create the export
        const spinner = ora('Creating contacts export...').start();
        const exportResponse = await client.sdk.contactService.exportContacts(params);
        spinner.succeed('Export job created');

        const exportId = exportResponse.data?.id;
        if (!exportId) {
          formatter.error('Export ID not returned');
          process.exit(1);
        }

        // If --no-wait flag is set, just show the export ID
        if (options.wait === false) {
          formatter.info(`Export ID: ${exportId}`);
          formatter.info(`Check status with: cakemail contacts export-get ${detectedListId} ${exportId}`);
          formatter.output(exportResponse);
          return;
        }

        // Poll until export is ready
        const result = await pollUntilComplete(
          async () => {
            const status = await client.sdk.contactService.getContactsExport({
              listId: detectedListId,
              exportId: exportId
            });

            const exportStatus = status.data?.status;
            const complete = exportStatus === 'ready' || exportStatus === 'failed';

            return {
              complete,
              status: exportStatus === 'ready'
                ? 'Export ready'
                : `Export ${exportStatus || 'processing'}...`,
              data: status
            };
          },
          'Waiting for export to complete...',
          { checkInterval: 2000, maxAttempts: 60 }
        );

        if (result.data?.status === 'ready') {
          formatter.info(`Export completed. Download with: cakemail contacts export-download ${detectedListId} ${exportId}`);
          formatter.output(result);
        } else {
          formatter.error('Export failed');
          formatter.output(result);
          process.exit(1);
        }
      } catch (error: any) {
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List exports
  contacts
    .command('exports [list-id]')
    .description('List contact exports for a list (auto-detects if only one list exists)')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const profileConfig = formatter.getProfile();
      const spinner = ora('Fetching exports...').start();
      try {
        const params: any = {
          listId: detectedListId,
          ...applyListDefaults(options, profileConfig)
        };

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
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, exportId, options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('contacts export', exportId, [
          'Export file will be permanently deleted'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
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
      try {
        const contactIds = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        const tags = options.tags.split(',').map((t: string) => t.trim());

        const progress = new BatchProgress({
          total: contactIds.length,
          current: 0,
          operation: `Tagging ${contactIds.length} contact${contactIds.length > 1 ? 's' : ''}`
        });

        await client.sdk.contactService.tagMultipleContacts({
          listId: parseInt(listId),
          requestBody: {
            contact_ids: contactIds,
            tags
          }
        });

        progress.increment(contactIds.length);
        progress.complete(`Successfully tagged ${contactIds.length} contact${contactIds.length > 1 ? 's' : ''}`);
      } catch (error: any) {
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
      try {
        const contactIds = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        const tags = options.tags.split(',').map((t: string) => t.trim());

        const progress = new BatchProgress({
          total: contactIds.length,
          current: 0,
          operation: `Untagging ${contactIds.length} contact${contactIds.length > 1 ? 's' : ''}`
        });

        await client.sdk.contactService.untagMultipleContacts({
          listId: parseInt(listId),
          requestBody: {
            contact_ids: contactIds,
            tags
          }
        });

        progress.increment(contactIds.length);
        progress.complete(`Successfully untagged ${contactIds.length} contact${contactIds.length > 1 ? 's' : ''}`);
      } catch (error: any) {
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Add interests to contacts
  contacts
    .command('add-interests <list-id>')
    .description('Add interests to one or more contacts')
    .requiredOption('-i, --interests <interests>', 'Comma-separated interest names')
    .option('-c, --contacts <ids>', 'Comma-separated contact IDs')
    .option('-q, --query <query>', 'SQL query to select contacts')
    .action(async (listId, options) => {
      // Must have either contact IDs or query
      if (!options.contacts && !options.query) {
        formatter.error('Either --contacts or --query is required');
        process.exit(1);
      }

      const spinner = ora('Adding interests to contacts...').start();
      try {
        const interests = options.interests.split(',').map((i: string) => i.trim());
        const payload: any = { interests };

        if (options.contacts) {
          payload.contact_ids = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        }
        if (options.query) {
          payload.query = options.query;
        }

        await client.sdk.contactService.addInterestsToContacts({
          listId: parseInt(listId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Interests added to contacts');
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts add-interests',
          resource: 'list',
          resourceId: listId,
          operation: 'add interests'
        });
        process.exit(1);
      }
    });

  // Remove interests from contacts
  contacts
    .command('remove-interests <list-id>')
    .description('Remove interests from one or more contacts')
    .requiredOption('-i, --interests <interests>', 'Comma-separated interest names')
    .option('-c, --contacts <ids>', 'Comma-separated contact IDs')
    .option('-q, --query <query>', 'SQL query to select contacts')
    .action(async (listId, options) => {
      // Must have either contact IDs or query
      if (!options.contacts && !options.query) {
        formatter.error('Either --contacts or --query is required');
        process.exit(1);
      }

      const spinner = ora('Removing interests from contacts...').start();
      try {
        const interests = options.interests.split(',').map((i: string) => i.trim());
        const payload: any = { interests };

        if (options.contacts) {
          payload.contact_ids = options.contacts.split(',').map((id: string) => parseInt(id.trim()));
        }
        if (options.query) {
          payload.query = options.query;
        }

        await client.sdk.contactService.removeInterestsFromContacts({
          listId: parseInt(listId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Interests removed from contacts');
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'contacts remove-interests',
          resource: 'list',
          resourceId: listId,
          operation: 'remove interests'
        });
        process.exit(1);
      }
    });

  return contacts;
}
