import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createCampaignsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const campaigns = new Command('campaigns')
    .description('Manage email campaigns');

  // List campaigns
  campaigns
    .command('list')
    .description('List all campaigns')
    .option('-s, --status <status>', 'Filter by status')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .option('--sort <sort>', 'Sort by field: +name, -created_on, +scheduled_for, etc.')
    .option('--filter <filter>', 'Filter (e.g., "status==delivered;name==Newsletter")')
    .action(async (options) => {
      const spinner = ora('Fetching campaigns...').start();
      try {
        const params: any = {};
        if (options.status) params.status = options.status;
        if (options.limit) params.per_page = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);
        if (options.sort) params.sort = options.sort;
        if (options.filter) params.filter = options.filter;

        const data = await client.sdk.campaigns.list(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get campaign
  campaigns
    .command('get <id>')
    .description('Get campaign details')
    .action(async (id) => {
      const spinner = ora(`Fetching campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.get(parseInt(id));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create campaign
  campaigns
    .command('create')
    .description('Create a new campaign')
    .requiredOption('-n, --name <name>', 'Campaign name')
    .requiredOption('-l, --list-id <id>', 'List ID')
    .option('-s, --sender-id <id>', 'Sender ID')
    .option('-t, --template-id <id>', 'Template ID')
    .option('--subject <subject>', 'Email subject')
    .action(async (options) => {
      const spinner = ora('Creating campaign...').start();
      try {
        const payload: any = {
          name: options.name,
          list_id: parseInt(options.listId),
        };
        if (options.senderId) payload.sender_id = parseInt(options.senderId);
        if (options.templateId) payload.template_id = parseInt(options.templateId);
        if (options.subject) payload.subject = options.subject;

        const data = await client.sdk.campaigns.create(payload);
        spinner.stop();
        formatter.success(`Campaign created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Schedule campaign
  campaigns
    .command('schedule <id>')
    .description('Schedule a campaign')
    .requiredOption('-d, --date <datetime>', 'Schedule datetime (ISO 8601)')
    .action(async (id, options) => {
      const spinner = ora(`Scheduling campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.schedule(parseInt(id), {
          scheduled_at: options.date,
        });
        spinner.stop();
        formatter.success(`Campaign ${id} scheduled for ${options.date}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Send test
  campaigns
    .command('test <id>')
    .description('Send a test email')
    .requiredOption('-e, --email <email>', 'Recipient email address')
    .action(async (id, options) => {
      const spinner = ora(`Sending test email...`).start();
      try {
        await client.sdk.campaigns.sendTest(parseInt(id), [options.email]);
        spinner.stop();
        formatter.success(`Test email sent to ${options.email}`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update campaign
  campaigns
    .command('update <id>')
    .description('Update a campaign')
    .option('-n, --name <name>', 'Campaign name')
    .option('-l, --list-id <id>', 'List ID')
    .option('-s, --sender-id <id>', 'Sender ID')
    .option('-t, --template-id <id>', 'Template ID')
    .option('--subject <subject>', 'Email subject')
    .action(async (id, options) => {
      const spinner = ora(`Updating campaign ${id}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.listId) payload.list_id = parseInt(options.listId);
        if (options.senderId) payload.sender_id = parseInt(options.senderId);
        if (options.templateId) payload.template_id = parseInt(options.templateId);
        if (options.subject) payload.subject = options.subject;

        const data = await client.sdk.campaigns.update(parseInt(id), payload);
        spinner.stop();
        formatter.success(`Campaign ${id} updated`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete campaign
  campaigns
    .command('delete <id>')
    .description('Delete a campaign')
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting campaign ${id}...`).start();
      try {
        await client.sdk.campaigns.delete(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Archive campaign
  campaigns
    .command('archive <id>')
    .description('Archive a campaign')
    .action(async (id) => {
      const spinner = ora(`Archiving campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.archive(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} archived`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Unarchive campaign
  campaigns
    .command('unarchive <id>')
    .description('Unarchive a campaign')
    .action(async (id) => {
      const spinner = ora(`Unarchiving campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.unarchive(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} unarchived`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Cancel campaign
  campaigns
    .command('cancel <id>')
    .description('Cancel a campaign')
    .action(async (id) => {
      const spinner = ora(`Canceling campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.cancel(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} canceled`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Suspend campaign
  campaigns
    .command('suspend <id>')
    .description('Suspend a campaign')
    .action(async (id) => {
      const spinner = ora(`Suspending campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.suspend(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} suspended`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Resume campaign
  campaigns
    .command('resume <id>')
    .description('Resume a campaign')
    .action(async (id) => {
      const spinner = ora(`Resuming campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.resume(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} resumed`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Reschedule campaign
  campaigns
    .command('reschedule <id>')
    .description('Reschedule a campaign')
    .requiredOption('-d, --date <datetime>', 'New schedule datetime (ISO 8601)')
    .action(async (id, options) => {
      const spinner = ora(`Rescheduling campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.reschedule(parseInt(id), {
          scheduled_at: options.date,
        });
        spinner.stop();
        formatter.success(`Campaign ${id} rescheduled for ${options.date}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Unschedule campaign
  campaigns
    .command('unschedule <id>')
    .description('Unschedule a campaign')
    .action(async (id) => {
      const spinner = ora(`Unscheduling campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.unschedule(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} unscheduled`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List campaign links
  campaigns
    .command('links <id>')
    .description('List campaign links')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (id, options) => {
      const spinner = ora(`Fetching links for campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.getLinks(parseInt(id));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return campaigns;
}
