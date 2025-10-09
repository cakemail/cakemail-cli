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
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .option('--sort <sort>', 'Sort by field: +name, +email, -confirmed')
    .option('--filter <filter>', 'Filter (e.g., "confirmed==true;email==sender@example.com")')
    .action(async (options) => {
      const spinner = ora('Fetching senders...').start();
      try {
        const params: any = {};
        if (options.limit) params.perPage = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);
        if (options.sort) params.sort = options.sort;

        const data = await client.sdk.senderService.listSenders(params);
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
        const data = await client.sdk.senderService.getSender({ senderId: id });
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
        const data = await client.sdk.senderService.createSender({
          requestBody: {
            name: options.name,
            email: options.email,
          }
        });
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

  // Update sender
  senders
    .command('update <id>')
    .description('Update a sender')
    .option('-n, --name <name>', 'Sender name')
    .option('-e, --email <email>', 'Sender email')
    .action(async (id, options) => {
      const spinner = ora(`Updating sender ${id}...`).start();
      try {
        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.email) payload.email = options.email;

        const data = await client.sdk.senderService.patchSender({
          senderId: id,
          requestBody: payload
        });
        spinner.stop();
        formatter.success(`Sender ${id} updated`);
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
        await client.sdk.senderService.deleteSender({ senderId: id });
        spinner.stop();
        formatter.success(`Sender ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Confirm sender
  senders
    .command('confirm <confirmation-id>')
    .description('Confirm sender email using confirmation ID from email')
    .action(async (confirmationId) => {
      const spinner = ora(`Confirming sender...`).start();
      try {
        const data = await client.sdk.senderService.confirmSender({
          requestBody: {
            confirmation_id: confirmationId
          }
        });
        spinner.stop();
        formatter.success('Sender confirmed');
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Resend confirmation
  senders
    .command('resend-confirmation <id>')
    .description('Resend confirmation email')
    .action(async (id) => {
      const spinner = ora(`Resending confirmation for sender ${id}...`).start();
      try {
        await client.sdk.senderService.resendConfirmationEmail({ senderId: id });
        spinner.stop();
        formatter.success(`Confirmation email resent for sender ${id}`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return senders;
}
