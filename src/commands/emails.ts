import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import fs from 'fs';

export function createEmailsCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const emails = new Command('emails')
    .description('Manage Email API v2 - Send and track transactional emails');

  // Submit email
  emails
    .command('send')
    .description('Submit an email to be sent')
    .requiredOption('-t, --to <email>', 'Recipient email address')
    .requiredOption('-s, --subject <subject>', 'Email subject')
    .option('--from-email <email>', 'Sender email address')
    .option('--from-name <name>', 'Sender name')
    .option('--reply-to <email>', 'Reply-to email address')
    .option('--html <html>', 'HTML content')
    .option('--html-file <path>', 'Path to HTML file')
    .option('--text <text>', 'Plain text content')
    .option('--text-file <path>', 'Path to text file')
    .option('--template-id <id>', 'Template ID to use')
    .option('--params <json>', 'Template parameters as JSON string')
    .option('--tracking', 'Enable tracking (open/click tracking)')
    .option('--tags <tags>', 'Comma-separated tags for categorization')
    .option('--headers <json>', 'Custom headers as JSON object')
    .option('--attachments <json>', 'Attachments as JSON array')
    .action(async (options) => {
      const spinner = ora('Submitting email...').start();
      try {
        const payload: any = {
          to: options.to,
          subject: options.subject,
        };

        // From
        if (options.fromEmail) {
          payload.from = { email: options.fromEmail };
          if (options.fromName) payload.from.name = options.fromName;
        }

        // Reply-to
        if (options.replyTo) {
          payload.reply_to = options.replyTo;
        }

        // Content
        if (options.templateId) {
          payload.template_id = options.templateId;
          if (options.params) {
            payload.params = JSON.parse(options.params);
          }
        } else {
          payload.content = {};

          if (options.htmlFile) {
            payload.content.html = fs.readFileSync(options.htmlFile, 'utf-8');
          } else if (options.html) {
            payload.content.html = options.html;
          }

          if (options.textFile) {
            payload.content.text = fs.readFileSync(options.textFile, 'utf-8');
          } else if (options.text) {
            payload.content.text = options.text;
          }

          if (!payload.content.html && !payload.content.text) {
            spinner.fail();
            formatter.error('Either --html/--html-file, --text/--text-file, or --template-id is required');
            process.exit(1);
          }
        }

        // Tracking
        if (options.tracking !== undefined) {
          payload.tracking = options.tracking;
        }

        // Tags
        if (options.tags) {
          payload.tags = options.tags.split(',').map((t: string) => t.trim());
        }

        // Headers
        if (options.headers) {
          payload.headers = JSON.parse(options.headers);
        }

        // Attachments
        if (options.attachments) {
          payload.attachments = JSON.parse(options.attachments);
        }

        const data = await client.post('/v2/emails', payload);
        spinner.stop();
        formatter.success(`Email submitted: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get email
  emails
    .command('get <email-id>')
    .description('Retrieve a submitted email')
    .action(async (emailId) => {
      const spinner = ora(`Fetching email ${emailId}...`).start();
      try {
        const data = await client.get(`/v2/emails/${emailId}`);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Render email
  emails
    .command('render <email-id>')
    .description('Render a submitted email (returns HTML)')
    .option('--as-submitted', 'Render the original submitted content')
    .option('--tracking', 'Enable tracking in rendered HTML')
    .action(async (emailId, options) => {
      const spinner = ora(`Rendering email ${emailId}...`).start();
      try {
        const params: any = {};
        if (options.asSubmitted !== undefined) params.as_submitted = options.asSubmitted;
        if (options.tracking !== undefined) params.tracking = options.tracking;

        const data = await client.get(`/v2/emails/${emailId}/render`, { params });
        spinner.stop();

        // Output raw HTML (not JSON)
        console.log(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return emails;
}
