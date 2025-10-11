import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { confirmDelete } from '../utils/confirm.js';

export function createSuppressedCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const suppressed = new Command('suppressed')
    .description('Manage suppressed email addresses');

  // List suppressed emails
  suppressed
    .command('list')
    .description('List all suppressed email addresses')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (options) => {
      const spinner = ora('Fetching suppressed emails...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.suppressedEmailService.listSuppressedEmails(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Add suppressed email
  suppressed
    .command('add <email>')
    .description('Add an email to the suppression list')
    .action(async (email) => {
      const spinner = ora(`Adding ${email} to suppression list...`).start();
      try {
        const data = await client.sdk.suppressedEmailService.createSuppressedEmail({
          requestBody: { email }
        });
        spinner.stop();
        formatter.success(`Email ${email} added to suppression list`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete suppressed email
  suppressed
    .command('delete <email>')
    .description('Remove an email from the suppression list')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (email, options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('suppressed email', email, [
          'Email will be removed from the suppression list',
          'This email address will be able to receive emails again'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Removing ${email} from suppression list...`).start();
      try {
        await client.sdk.suppressedEmailService.deleteSuppressedEmail({ email });
        spinner.stop();
        formatter.success(`Email ${email} removed from suppression list`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List suppressed emails exports
  suppressed
    .command('exports')
    .description('List suppressed emails exports')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (options) => {
      const spinner = ora('Fetching exports...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.suppressedEmailService.listSuppressedEmailsExport(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create export
  suppressed
    .command('export')
    .description('Create a suppressed emails export')
    .action(async () => {
      const spinner = ora('Creating suppressed emails export...').start();
      try {
        const data = await client.sdk.suppressedEmailService.createSuppressedEmailsExport({});
        spinner.stop();
        formatter.success('Suppressed emails export created');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get export
  suppressed
    .command('export-get <export-id>')
    .description('Get a suppressed emails export status')
    .action(async (exportId) => {
      const spinner = ora(`Fetching export ${exportId}...`).start();
      try {
        const data = await client.sdk.suppressedEmailService.getSuppressedEmailsExport({
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
  suppressed
    .command('export-download <export-id>')
    .description('Download a suppressed emails export')
    .action(async (exportId) => {
      const spinner = ora(`Downloading export ${exportId}...`).start();
      try {
        const data = await client.sdk.suppressedEmailService.suppressedEmailsExportDownload({
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
  suppressed
    .command('export-delete <export-id>')
    .description('Delete a suppressed emails export')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (exportId, options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('suppressed emails export', exportId, [
          'Export file will be permanently deleted'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting export ${exportId}...`).start();
      try {
        await client.sdk.suppressedEmailService.deleteSuppressedEmailsExport({
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

  return suppressed;
}
