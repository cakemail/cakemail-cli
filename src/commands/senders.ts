import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createSendersCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const senders = new Command('senders')
    .description('Manage email senders');

  // List senders
  senders
    .command('list')
    .description('List all senders')
    .action(async () => {
      const spinner = ora('Fetching senders...').start();
      try {
        const data = await client.get('/brands/default/senders');
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get sender
  senders
    .command('get <id>')
    .description('Get sender details')
    .action(async (id) => {
      const spinner = ora(`Fetching sender ${id}...`).start();
      try {
        const data = await client.get(`/brands/default/senders/${id}`);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create sender
  senders
    .command('create')
    .description('Create a new sender')
    .requiredOption('-n, --name <name>', 'Sender name')
    .requiredOption('-e, --email <email>', 'Sender email')
    .action(async (options) => {
      const spinner = ora('Creating sender...').start();
      try {
        const payload = {
          name: options.name,
          email: options.email,
        };

        const data = await client.post('/brands/default/senders', payload);
        spinner.stop();
        formatter.success(`Sender created: ${data.id}`);
        formatter.info('A confirmation email has been sent to verify this sender');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete sender
  senders
    .command('delete <id>')
    .description('Delete a sender')
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting sender ${id}...`).start();
      try {
        await client.delete(`/brands/default/senders/${id}`);
        spinner.stop();
        formatter.success(`Sender ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return senders;
}
