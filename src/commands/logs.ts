import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { displayError } from '../utils/errors.js';
import { autoDetectList } from '../utils/defaults.js';

export function createLogsCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const logs = new Command('logs')
    .description('View activity logs');

  // Get campaign logs
  logs
    .command('campaign <campaign-id>')
    .description('View logs for a campaign')
    .option('--start-time <timestamp>', 'Start time (Unix timestamp)')
    .option('--end-time <timestamp>', 'End time (Unix timestamp)')
    .option('-p, --page <number>', 'Page number')
    .option('--per-page <number>', 'Results per page')
    .option('--with-count', 'Include total count')
    .option('--filter <filter>', 'Filter (e.g., "type==open;email==user@example.com")')
    .option('--sort <sort>', 'Sort by field: +time, -log_id, etc.')
    .option('--cursor <cursor>', 'Cursor for pagination')
    .action(async (campaignId, options) => {
      const spinner = ora(`Fetching logs for campaign ${campaignId}...`).start();
      try {
        const params: any = {
          campaignId: parseInt(campaignId)
        };
        if (options.startTime) params.startTime = parseInt(options.startTime);
        if (options.endTime) params.endTime = parseInt(options.endTime);
        if (options.page) params.page = parseInt(options.page);
        if (options.perPage) params.perPage = parseInt(options.perPage);
        if (options.withCount) params.withCount = true;
        if (options.filter) params.filter = options.filter;
        if (options.sort) params.sort = options.sort;
        if (options.cursor) params.cursor = options.cursor;

        const data = await client.sdk.logService.getCampaignLogs(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs campaign',
          resource: 'campaign',
          resourceId: campaignId,
          operation: 'fetch logs'
        });
        process.exit(1);
      }
    });

  // Get list logs
  logs
    .command('list [list-id]')
    .description('View logs for a list (auto-detects if only one list exists)')
    .option('--start-time <timestamp>', 'Start time (Unix timestamp)')
    .option('--end-time <timestamp>', 'End time (Unix timestamp)')
    .option('-p, --page <number>', 'Page number')
    .option('--per-page <number>', 'Results per page')
    .option('--with-count', 'Include total count')
    .option('--filter <filter>', 'Filter (e.g., "type==subscribe;email==user@example.com")')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Fetching logs for list ${detectedListId}...`).start();
      try {
        const params: any = {
          listId: detectedListId
        };
        if (options.startTime) params.startTime = parseInt(options.startTime);
        if (options.endTime) params.endTime = parseInt(options.endTime);
        if (options.page) params.page = parseInt(options.page);
        if (options.perPage) params.perPage = parseInt(options.perPage);
        if (options.withCount) params.withCount = true;
        if (options.filter) params.filter = options.filter;

        const data = await client.sdk.logService.getListLogs(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs list',
          resource: 'list',
          resourceId: detectedListId,
          operation: 'fetch logs'
        });
        process.exit(1);
      }
    });

  // Export campaign logs
  logs
    .command('campaign-export <campaign-id>')
    .description('Create a campaign log export')
    .option('--description <description>', 'Export description')
    .option('--filter <filter>', 'Filter logs to export')
    .action(async (campaignId, options) => {
      const spinner = ora(`Creating log export for campaign ${campaignId}...`).start();
      try {
        const payload: any = {};
        if (options.description) payload.description = options.description;
        if (options.filter) payload.filter = options.filter;

        const data = await client.sdk.logService.campaignLogExportCreate({
          campaignId: parseInt(campaignId),
          requestBody: payload
        });

        spinner.stop();
        formatter.success('Campaign log export created successfully');
        formatter.output(data);
        formatter.info('\nUse the export ID to download: cakemail logs campaign-export-download <campaign-id> <export-id>');
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs campaign-export',
          resource: 'campaign',
          resourceId: campaignId,
          operation: 'create log export'
        });
        process.exit(1);
      }
    });

  // Download campaign log export
  logs
    .command('campaign-export-download <campaign-id> <export-id>')
    .description('Download a campaign log export')
    .action(async (campaignId, exportId) => {
      const spinner = ora('Fetching download URL...').start();
      try {
        const data = await client.sdk.logService.campaignLogExportDownload({
          campaignId: parseInt(campaignId),
          campaignLogExportId: exportId
        });

        spinner.stop();
        formatter.success('Export download URL retrieved');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs campaign-export-download',
          resource: 'campaign log export',
          resourceId: exportId,
          operation: 'download'
        });
        process.exit(1);
      }
    });

  // Export list logs
  logs
    .command('list-export [list-id]')
    .description('Create a list log export (auto-detects if only one list exists)')
    .option('--description <description>', 'Export description')
    .option('--filter <filter>', 'Filter logs to export')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Creating log export for list ${detectedListId}...`).start();
      try {
        const payload: any = {};
        if (options.description) payload.description = options.description;
        if (options.filter) payload.filter = options.filter;

        const data = await client.sdk.logService.listLogsExportCreate({
          listId: detectedListId,
          requestBody: payload
        });

        spinner.stop();
        formatter.success('List log export created successfully');
        formatter.output(data);
        formatter.info('\nUse the export ID to download: cakemail logs list-export-download <list-id> <export-id>');
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs list-export',
          resource: 'list',
          resourceId: detectedListId,
          operation: 'create log export'
        });
        process.exit(1);
      }
    });

  // Download list log export
  logs
    .command('list-export-download [list-id] <export-id>')
    .description('Download a list log export (auto-detects if only one list exists)')
    .action(async (listId, exportId) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching download URL...').start();
      try {
        const data = await client.sdk.logService.listLogsExportDownload({
          listId: detectedListId,
          listLogsExportId: exportId
        });

        spinner.stop();
        formatter.success('Export download URL retrieved');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'logs list-export-download',
          resource: 'list log export',
          resourceId: exportId,
          operation: 'download'
        });
        process.exit(1);
      }
    });

  return logs;
}
