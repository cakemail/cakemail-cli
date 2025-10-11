import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { displayError, validate } from '../utils/errors.js';
import { confirmDelete } from '../utils/confirm.js';
import { autoDetectList, autoDetectSender } from '../utils/defaults.js';
import { promptText, promptSelect, createSpinner } from '../utils/interactive.js';
import chalk from 'chalk';

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
      // Validate ID
      const validation = validate.id(id, 'Campaign ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      const spinner = ora(`Fetching campaign ${id}...`).start();
      try {
        const data = await client.sdk.campaigns.get(parseInt(id));
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'campaigns get',
          resource: 'campaign',
          resourceId: id,
          operation: 'fetch'
        });
        process.exit(1);
      }
    });

  // Create campaign
  campaigns
    .command('create')
    .description('Create a new campaign (auto-detects list and sender if only one exists)')
    .option('-n, --name <name>', 'Campaign name')
    .option('-l, --list-id <id>', 'List ID (auto-detected if only one list exists)')
    .option('-s, --sender-id <id>', 'Sender ID (auto-detected if only one confirmed sender exists)')
    .option('-t, --template-id <id>', 'Template ID')
    .option('--subject <subject>', 'Email subject')
    .action(async (options) => {
      const profileConfig = formatter.getProfile();

      // Interactive prompt for campaign name if not provided
      let campaignName = options.name;
      if (!campaignName) {
        campaignName = await promptText('Campaign name:', {
          required: true,
          profileConfig
        });

        if (!campaignName) {
          formatter.error('Campaign name is required');
          formatter.info('Usage: cakemail campaigns create --name "My Campaign"');
          process.exit(1);
        }
      }
      // Interactive prompt for list selection
      let listId = options.listId;
      if (!listId) {
        // Try auto-detect first
        listId = await autoDetectList(client, formatter, options.listId, { useCache: true });

        // If auto-detect failed and we're in interactive mode, show selection prompt
        if (!listId) {
          try {
            const listsData = await client.sdk.lists.list();
            const lists = listsData.data || listsData;

            if (Array.isArray(lists) && lists.length > 0) {
              console.log(chalk.cyan('\nAvailable Lists:\n'));

              const selectedList = await promptSelect(
                'Select a list:',
                lists.map(list => ({
                  name: list.name,
                  value: list.id,
                  description: `${list.subscribers_count || 0} contacts`
                })),
                { required: true, profileConfig }
              );

              listId = selectedList;
            }
          } catch (error: any) {
            // Ignore errors, will fail validation below
          }
        }

        if (!listId) {
          formatter.error('List ID is required');
          formatter.info('Usage: cakemail campaigns create --name "My Campaign" --list-id <id>');
          process.exit(1);
        }
      }

      // Interactive prompt for sender selection
      let senderId = options.senderId;
      if (!senderId) {
        // Try auto-detect first
        senderId = await autoDetectSender(client, formatter, options.senderId, {
          useCache: true,
          requireConfirmed: true
        });

        // If auto-detect failed and we're in interactive mode, show selection prompt
        if (!senderId) {
          try {
            const sendersData = await client.sdk.senderService.listSenders({ perPage: 100 });
            const senders = sendersData.data || sendersData;

            if (Array.isArray(senders) && senders.length > 0) {
              console.log(chalk.cyan('\nAvailable Confirmed Senders:\n'));

              const selectedSender = await promptSelect(
                'Select a sender:',
                senders.map(sender => ({
                  name: `${sender.name} <${sender.email}>`,
                  value: sender.id,
                  description: sender.confirmed ? 'Confirmed' : 'Pending'
                })),
                { required: true, profileConfig }
              );

              senderId = selectedSender;
            }
          } catch (error: any) {
            // Ignore errors, will fail validation below
          }
        }

        if (!senderId) {
          formatter.error('Sender ID is required');
          formatter.info('Usage: cakemail campaigns create --name "My Campaign" --sender-id <id>');
          process.exit(1);
        }
      }

      // Profile-aware spinner
      const spinner = createSpinner('Creating campaign...', profileConfig);
      spinner.start();

      try {
        const payload: any = {
          name: campaignName,
          list_id: listId,
          sender_id: senderId,
        };
        if (options.templateId) payload.template_id = parseInt(options.templateId);
        if (options.subject) payload.subject = options.subject;

        const data = await client.sdk.campaigns.create(payload);
        spinner.succeed(`Campaign created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.fail('Failed to create campaign');
        displayError(error, {
          command: 'campaigns create',
          resource: 'campaign',
          operation: 'create',
          profileConfig
        });
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
      // Validate campaign ID
      const idValidation = validate.id(id, 'Campaign ID');
      if (!idValidation.valid) {
        formatter.error(idValidation.error!);
        process.exit(1);
      }

      // Validate email
      const emailValidation = validate.email(options.email);
      if (!emailValidation.valid) {
        formatter.error(emailValidation.error!);
        process.exit(1);
      }

      const spinner = ora(`Sending test email...`).start();
      try {
        await client.sdk.campaigns.sendTest(parseInt(id), [options.email]);
        spinner.stop();
        formatter.success(`Test email sent to ${options.email}`);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'campaigns test',
          resource: 'campaign',
          resourceId: id,
          operation: 'send test email'
        });
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
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (id, options) => {
      // Validate ID
      const validation = validate.id(id, 'Campaign ID');
      if (!validation.valid) {
        formatter.error(validation.error!);
        process.exit(1);
      }

      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const profileConfig = formatter.getProfile();
        const confirmed = await confirmDelete('campaign', id, [
          'Campaign will be permanently deleted',
          'This action cannot be undone'
        ], profileConfig);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting campaign ${id}...`).start();
      try {
        await client.sdk.campaigns.delete(parseInt(id));
        spinner.stop();
        formatter.success(`Campaign ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        displayError(error, {
          command: 'campaigns delete',
          resource: 'campaign',
          resourceId: id,
          operation: 'delete'
        });
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
