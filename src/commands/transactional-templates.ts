import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { displayError, validate } from '../utils/errors.js';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList } from '../utils/defaults.js';

export function createTransactionalTemplatesCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const templates = new Command('transactional-templates')
    .description('Manage transactional email templates');

  // List transactional templates
  templates
    .command('list [list-id]')
    .description('List transactional email templates (auto-detects if only one list exists)')
    .option('-p, --page <number>', 'Page number')
    .option('--per-page <number>', 'Results per page')
    .option('--with-count', 'Include total count')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching transactional templates...').start();
      try {
        const params: any = {
          listId: detectedListId
        };
        if (options.page) params.page = parseInt(options.page);
        if (options.perPage) params.perPage = parseInt(options.perPage);
        if (options.withCount) params.withCount = true;

        const data = await client.sdk.transactionalEmailService.listTransactionalEmailTemplates(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates list',
          operation: 'list templates'
        });
        process.exit(1);
      }
    });

  // Show transactional template
  templates
    .command('show [list-id] <template-id>')
    .description('Show transactional email template details (auto-detects if only one list exists)')
    .action(async (listId, templateId) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Fetching template ${templateId}...`).start();
      try {
        const data = await client.sdk.transactionalEmailService.showTransactionalEmailTemplate({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId)
        });

        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates show',
          resource: 'template',
          resourceId: templateId,
          operation: 'fetch'
        });
        process.exit(1);
      }
    });

  // Create transactional template
  templates
    .command('create [list-id]')
    .description('Create a transactional email template (auto-detects if only one list exists)')
    .requiredOption('-n, --name <name>', 'Template name')
    .requiredOption('-s, --subject <subject>', 'Email subject')
    .requiredOption('--html <html>', 'HTML content')
    .option('--text <text>', 'Plain text content')
    .option('--sender-id <id>', 'Sender ID')
    .option('--tracking <tracking>', 'Tracking settings (open, click)')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Creating transactional template...').start();
      try {
        const payload: any = {
          name: options.name,
          subject: options.subject,
          html: options.html
        };
        if (options.text) payload.text = options.text;
        if (options.senderId) payload.sender_id = parseInt(options.senderId);
        if (options.tracking) payload.tracking = options.tracking;

        const data = await client.sdk.transactionalEmailService.createTransactionalEmailTemplate({
          listId: detectedListId,
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Transactional template created successfully');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates create',
          operation: 'create template'
        });
        process.exit(1);
      }
    });

  // Update transactional template
  templates
    .command('update [list-id] <template-id>')
    .description('Update a transactional email template (auto-detects if only one list exists)')
    .option('-n, --name <name>', 'Template name')
    .option('-s, --subject <subject>', 'Email subject')
    .option('--html <html>', 'HTML content')
    .option('--text <text>', 'Plain text content')
    .option('--sender-id <id>', 'Sender ID')
    .option('--tracking <tracking>', 'Tracking settings')
    .action(async (listId, templateId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Updating template ${templateId}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.subject) payload.subject = options.subject;
        if (options.html) payload.html = options.html;
        if (options.text) payload.text = options.text;
        if (options.senderId) payload.sender_id = parseInt(options.senderId);
        if (options.tracking) payload.tracking = options.tracking;

        const data = await client.sdk.transactionalEmailService.updateTransactionalEmailTemplate({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Template updated successfully');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates update',
          resource: 'template',
          resourceId: templateId,
          operation: 'update'
        });
        process.exit(1);
      }
    });

  // Delete transactional template
  templates
    .command('delete [list-id] <template-id>')
    .description('Delete a transactional email template (auto-detects if only one list exists)')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, templateId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('transactional template', templateId, [
          'Template will be permanently deleted',
          'This action cannot be undone'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting template ${templateId}...`).start();
      try {
        await client.sdk.transactionalEmailService.deleteTransactionalEmailTemplate({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId)
        });

        spinner.stop();
        formatter.success('Template deleted successfully');
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates delete',
          resource: 'template',
          resourceId: templateId,
          operation: 'delete'
        });
        process.exit(1);
      }
    });

  // Send transactional email
  templates
    .command('send [list-id] <template-id>')
    .description('Send a transactional email from template (auto-detects if only one list exists)')
    .option('-c, --contact-id <id>', 'Contact ID to send to')
    .option('-e, --email <email>', 'Email address to send to (alternative to contact-id)')
    .option('--variables <json>', 'Template variables as JSON')
    .action(async (listId, templateId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Validate that either contact-id or email is provided
      if (!options.contactId && !options.email) {
        formatter.error('Either --contact-id or --email is required');
        process.exit(1);
      }

      const spinner = ora('Sending transactional email...').start();
      try {
        const payload: any = {};

        if (options.contactId) {
          payload.contact_id = parseInt(options.contactId);
        } else if (options.email) {
          payload.email = options.email;
        }

        if (options.variables) {
          payload.variables = JSON.parse(options.variables);
        }

        const data = await client.sdk.transactionalEmailService.sendTransactionalEmail({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Transactional email sent successfully');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates send',
          resource: 'template',
          resourceId: templateId,
          operation: 'send email'
        });
        process.exit(1);
      }
    });

  // Send test email
  templates
    .command('test [list-id] <template-id>')
    .description('Send a test transactional email (auto-detects if only one list exists)')
    .requiredOption('-e, --email <email>', 'Email address to send test to')
    .option('--variables <json>', 'Template variables as JSON')
    .action(async (listId, templateId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Validate email
      const emailValidation = validate.email(options.email);
      if (!emailValidation.valid) {
        formatter.error(emailValidation.error!);
        process.exit(1);
      }

      const spinner = ora('Sending test email...').start();
      try {
        const payload: any = {
          email: options.email
        };

        if (options.variables) {
          payload.variables = JSON.parse(options.variables);
        }

        const data = await client.sdk.transactionalEmailService.sendTestTransactionalEmail({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success(`Test email sent to ${options.email}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates test',
          resource: 'template',
          resourceId: templateId,
          operation: 'send test'
        });
        process.exit(1);
      }
    });

  // Render template
  templates
    .command('render [list-id] <template-id>')
    .description('Render a transactional email template (auto-detects if only one list exists)')
    .option('-c, --contact-id <id>', 'Contact ID for personalization')
    .option('--variables <json>', 'Template variables as JSON')
    .action(async (listId, templateId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Rendering template...').start();
      try {
        const payload: any = {};

        if (options.contactId) {
          payload.contact_id = parseInt(options.contactId);
        }

        if (options.variables) {
          payload.variables = JSON.parse(options.variables);
        }

        const html = await client.sdk.transactionalEmailService.renderTransactionalEmailTemplate({
          listId: detectedListId,
          transactionalEmailTemplateId: parseInt(templateId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Template rendered successfully');
        console.log(html);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'transactional-templates render',
          resource: 'template',
          resourceId: templateId,
          operation: 'render'
        });
        process.exit(1);
      }
    });

  return templates;
}
