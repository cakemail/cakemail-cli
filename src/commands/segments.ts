import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList } from '../utils/defaults.js';

export function createSegmentsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const segments = new Command('segments')
    .description('Manage contact segments');

  // List segments
  segments
    .command('list [list-id]')
    .description('List all segments in a list (auto-detects if only one list exists)')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching segments...').start();
      try {
        const params: any = {
          listId: detectedListId
        };
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.segmentService.listSegments(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get segment
  segments
    .command('get [list-id] <segment-id>')
    .description('Get segment details (auto-detects if only one list exists)')
    .action(async (listId, segmentId) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Fetching segment ${segmentId}...`).start();
      try {
        const data = await client.sdk.segmentService.getSegment({
          listId: detectedListId,
          segmentId: parseInt(segmentId)
        });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create segment
  segments
    .command('create [list-id]')
    .description('Create a new segment (auto-detects if only one list exists)')
    .requiredOption('-n, --name <name>', 'Segment name')
    .option('-c, --conditions <json>', 'Segment conditions as JSON')
    .action(async (listId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Creating segment...').start();
      try {
        const payload: any = {
          name: options.name
        };
        if (options.conditions) {
          payload.conditions = JSON.parse(options.conditions);
        }

        const data = await client.sdk.segmentService.createSegment({
          listId: detectedListId,
          requestBody: payload
        });
        spinner.stop();
        formatter.success(`Segment created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update segment
  segments
    .command('update [list-id] <segment-id>')
    .description('Update a segment (auto-detects if only one list exists)')
    .option('-n, --name <name>', 'Segment name')
    .option('-c, --conditions <json>', 'Segment conditions as JSON')
    .action(async (listId, segmentId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora(`Updating segment ${segmentId}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.conditions) {
          payload.conditions = JSON.parse(options.conditions);
        }

        const data = await client.sdk.segmentService.patchSegment({
          listId: detectedListId,
          segmentId: parseInt(segmentId),
          requestBody: payload
        });
        spinner.stop();
        formatter.success(`Segment ${segmentId} updated`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete segment
  segments
    .command('delete [list-id] <segment-id>')
    .description('Delete a segment (auto-detects if only one list exists)')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (listId, segmentId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('segment', segmentId, [
          'Segment will be permanently deleted'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting segment ${segmentId}...`).start();
      try {
        await client.sdk.segmentService.deleteSegment({
          listId: detectedListId,
          segmentId: parseInt(segmentId)
        });
        spinner.stop();
        formatter.success(`Segment ${segmentId} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List segment contacts
  segments
    .command('contacts [list-id] <segment-id>')
    .description('List contacts in a segment (auto-detects if only one list exists)')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (listId, segmentId, options) => {
      // Auto-detect list ID if not provided
      const detectedListId = await autoDetectList(client, formatter, listId, { useCache: true });

      if (!detectedListId) {
        process.exit(1);
      }

      const spinner = ora('Fetching segment contacts...').start();
      try {
        const params: any = {
          listId: detectedListId,
          segmentId: parseInt(segmentId)
        };
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);

        const data = await client.sdk.contactService.listContactsOfSegment(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return segments;
}
