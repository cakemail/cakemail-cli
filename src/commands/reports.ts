import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { pollUntilComplete } from '../utils/progress.js';
import { displayError, validate } from '../utils/errors.js';
import { confirmDelete } from '../utils/confirm.js';

export function createReportsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const reports = new Command('reports')
    .description('View analytics and reports');

  // Campaign report
  reports
    .command('campaign <id>')
    .description('Get campaign analytics and statistics')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'Campaign ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching campaign ${id} report...`).start();
      try {
        const data = await client.sdk.reportService.getCampaignStats({ campaignId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'reports campaign',
          resource: 'campaign',
          resourceId: id,
          operation: 'fetch report'
        });
        process.exit(1);
      }
    });

  // Campaign links report
  reports
    .command('campaign-links <id>')
    .description('Get campaign link click analytics')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'Campaign ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching link analytics for campaign ${id}...`).start();
      try {
        const data = await client.sdk.reportService.getCampaignLinksStats({ campaignId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'reports campaign-links',
          resource: 'campaign',
          resourceId: id,
          operation: 'fetch link analytics'
        });
        process.exit(1);
      }
    });

  // List report
  reports
    .command('list <id>')
    .description('Get list analytics and statistics')
    .action(async (id) => {
      // Validate ID
      const validation = validate.id(id, 'List ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching list ${id} report...`).start();
      try {
        const data = await client.sdk.reportService.getListStats({ listId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'reports list',
          resource: 'list',
          resourceId: id,
          operation: 'fetch report'
        });
        process.exit(1);
      }
    });

  // Account report
  reports
    .command('account')
    .description('Get account-wide analytics and statistics')
    .action(async () => {
      const spinner = ora('Fetching account report...').start();
      try {
        const data = await client.sdk.reportService.getSelfAccountStats({});
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Email API stats
  reports
    .command('emails')
    .description('Get Email API statistics')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options) => {
      const spinner = ora('Fetching email statistics...').start();
      try {
        const params: any = {};
        if (options.from) params.from = options.from;
        if (options.to) params.to = options.to;

        const data = await client.sdk.emailApiService.getEmailApiStats(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Email API summary
  reports
    .command('emails-summary')
    .description('Get Email API activity summary')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options) => {
      const spinner = ora('Fetching email activity summary...').start();
      try {
        const params: any = {};
        if (options.from) params.from = options.from;
        if (options.to) params.to = options.to;

        const data = await client.sdk.emailApiService.getEmailApiSummary(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Transactional email stats
  reports
    .command('transactional-emails')
    .description('Get transactional email statistics')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options) => {
      const spinner = ora('Fetching transactional email statistics...').start();
      try {
        const params: any = {};
        if (options.from) params.from = options.from;
        if (options.to) params.to = options.to;

        const data = await client.sdk.transactionalEmailService.getEmailsStats(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List campaigns exports
  reports
    .command('campaigns-exports')
    .description('List campaign report exports')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (options) => {
      const spinner = ora('Fetching campaign report exports...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.reportService.listCampaignsReportsExports(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create campaigns export
  reports
    .command('export-campaigns')
    .description('Create and download a campaigns report export')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .option('--status <status>', 'Filter by status')
    .option('--no-wait', 'Create export without waiting for completion')
    .action(async (options) => {
      try {
        const params: any = {};
        if (options.from) params.from = options.from;
        if (options.to) params.to = options.to;
        if (options.status) params.status = options.status;

        // Create the export
        const spinner = ora('Creating campaign report export...').start();
        const exportResponse = await client.sdk.reportService.createCampaignsReportsExport({ requestBody: params });
        spinner.succeed('Export job created');

        const exportId = exportResponse.data?.id;
        if (!exportId) {
          formatter.error('Export ID not returned');
          process.exit(1);
        }

        // If --no-wait flag is set, just show the export ID
        if (options.wait === false) {
          formatter.info(`Export ID: ${exportId}`);
          formatter.info(`Check status with: cakemail reports campaigns-export ${exportId}`);
          formatter.output(exportResponse);
          return;
        }

        // Poll until export is ready
        const result = await pollUntilComplete(
          async () => {
            const status = await client.sdk.reportService.getCampaignsReportsExport({
              exportId: exportId
            });

            const exportStatus = status.data?.status;
            const complete = exportStatus === 'ready' || exportStatus === 'error';

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
          formatter.info(`Export completed. Download with: cakemail reports download-campaigns-export ${exportId}`);
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

  // Get campaigns export
  reports
    .command('campaigns-export <id>')
    .description('Get a campaigns report export status')
    .action(async (id) => {
      const spinner = ora(`Fetching export ${id}...`).start();
      try {
        const data = await client.sdk.reportService.getCampaignsReportsExport({ exportId: id });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Download campaigns export
  reports
    .command('download-campaigns-export <id>')
    .description('Download a campaigns report export')
    .action(async (id) => {
      const spinner = ora(`Downloading export ${id}...`).start();
      try {
        const data = await client.sdk.reportService.downloadCampaignsReportsExport({ exportId: id });
        spinner.stop();
        formatter.success('Export downloaded');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete campaigns export
  reports
    .command('delete-campaigns-export <id>')
    .description('Delete a campaigns report export')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (id, options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('campaigns report export', id, [
          'Export file will be permanently deleted'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting export ${id}...`).start();
      try {
        await client.sdk.reportService.deleteCampaignsReportsExport({ exportId: id });
        spinner.stop();
        formatter.success(`Export ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return reports;
}
