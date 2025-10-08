import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createWebhooksCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const webhooks = new Command('webhooks')
    .description('Manage webhooks');

  // List webhooks
  webhooks
    .command('list')
    .description('List all webhooks')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .action(async (options) => {
      const spinner = ora('Fetching webhooks...').start();
      try {
        const params: any = {};
        if (options.limit) params.per_page = options.limit;
        if (options.page) params.page = options.page;

        const data = await client.get('/webhooks', { params });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get webhook
  webhooks
    .command('get <id>')
    .description('Get webhook details')
    .action(async (id) => {
      const spinner = ora(`Fetching webhook ${id}...`).start();
      try {
        const data = await client.get(`/webhooks/${id}`);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create webhook
  webhooks
    .command('create')
    .description('Create a new webhook')
    .requiredOption('-u, --url <url>', 'Webhook URL')
    .requiredOption('-e, --events <events>', 'Comma-separated list of events (e.g., email.sent,email.opened)')
    .option('-n, --name <name>', 'Webhook name')
    .option('-s, --secret <secret>', 'Webhook secret for signature verification')
    .action(async (options) => {
      const spinner = ora('Creating webhook...').start();
      try {
        const payload: any = {
          url: options.url,
          events: options.events.split(',').map((e: string) => e.trim()),
        };
        if (options.name) payload.name = options.name;
        if (options.secret) payload.secret = options.secret;

        const data = await client.post('/webhooks', payload);
        spinner.stop();
        formatter.success(`Webhook created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update webhook
  webhooks
    .command('update <id>')
    .description('Update a webhook')
    .option('-u, --url <url>', 'Webhook URL')
    .option('-e, --events <events>', 'Comma-separated list of events')
    .option('-n, --name <name>', 'Webhook name')
    .option('-s, --secret <secret>', 'Webhook secret')
    .action(async (id, options) => {
      const spinner = ora(`Updating webhook ${id}...`).start();
      try {
        const payload: any = {};
        if (options.url) payload.url = options.url;
        if (options.events) payload.events = options.events.split(',').map((e: string) => e.trim());
        if (options.name) payload.name = options.name;
        if (options.secret) payload.secret = options.secret;

        const data = await client.patch(`/webhooks/${id}`, payload);
        spinner.stop();
        formatter.success(`Webhook ${id} updated`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Archive webhook
  webhooks
    .command('archive <id>')
    .description('Archive a webhook')
    .action(async (id) => {
      const spinner = ora(`Archiving webhook ${id}...`).start();
      try {
        await client.post(`/webhooks/${id}/archive`);
        spinner.stop();
        formatter.success(`Webhook ${id} archived`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Unarchive webhook
  webhooks
    .command('unarchive <id>')
    .description('Unarchive a webhook')
    .action(async (id) => {
      const spinner = ora(`Unarchiving webhook ${id}...`).start();
      try {
        await client.post(`/webhooks/${id}/unarchive`);
        spinner.stop();
        formatter.success(`Webhook ${id} unarchived`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return webhooks;
}
