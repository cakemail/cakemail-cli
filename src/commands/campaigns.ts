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
    .action(async (options) => {
      const spinner = ora('Fetching campaigns...').start();
      try {
        const params: any = {};
        if (options.status) params.status = options.status;
        if (options.limit) params.per_page = options.limit;
        if (options.page) params.page = options.page;

        const data = await client.get('/campaigns', { params });
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
        const data = await client.get(`/campaigns/${id}`);
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

        const data = await client.post('/campaigns', payload);
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
        const data = await client.post(`/campaigns/${id}/schedule`, {
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
        await client.post(`/campaigns/${id}/send-test`, {
          email: options.email,
        });
        spinner.stop();
        formatter.success(`Test email sent to ${options.email}`);
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
        await client.delete(`/campaigns/${id}`);
        spinner.stop();
        formatter.success(`Campaign ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return campaigns;
}
