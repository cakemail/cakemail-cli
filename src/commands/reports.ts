import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createReportsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const reports = new Command('reports')
    .description('View analytics and reports');

  // Campaign report
  reports
    .command('campaign <id>')
    .description('Get campaign analytics and statistics')
    .action(async (id) => {
      const spinner = ora(`Fetching campaign ${id} report...`).start();
      try {
        const data = await client.sdk.reportService.getCampaignStats({ campaignId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Campaign links report
  reports
    .command('campaign-links <id>')
    .description('Get campaign link click analytics')
    .action(async (id) => {
      const spinner = ora(`Fetching link analytics for campaign ${id}...`).start();
      try {
        const data = await client.sdk.reportService.getCampaignLinksStats({ campaignId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List report
  reports
    .command('list <id>')
    .description('Get list analytics and statistics')
    .action(async (id) => {
      const spinner = ora(`Fetching list ${id} report...`).start();
      try {
        const data = await client.sdk.reportService.getListStats({ listId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
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
    .description('Create a campaigns report export')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .option('--status <status>', 'Filter by status')
    .action(async (options) => {
      const spinner = ora('Creating campaign report export...').start();
      try {
        const params: any = {};
        if (options.from) params.from = options.from;
        if (options.to) params.to = options.to;
        if (options.status) params.status = options.status;

        const data = await client.sdk.reportService.createCampaignsReportsExport({ requestBody: params });
        spinner.stop();
        formatter.success('Campaign report export created');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
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
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
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
