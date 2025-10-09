#!/usr/bin/env node

import { Command } from 'commander';
import { CakemailClient } from './client.js';
import { OutputFormatter, OutputFormat } from './utils/output.js';
import { getConfig } from './utils/config.js';
import { createCampaignsCommand } from './commands/campaigns.js';
import { createListsCommand } from './commands/lists.js';
import { createContactsCommand } from './commands/contacts.js';
import { createSendersCommand } from './commands/senders.js';
import { createWebhooksCommand } from './commands/webhooks.js';
import { createEmailsCommand } from './commands/emails.js';
import { createTemplatesCommand } from './commands/templates.js';
import chalk from 'chalk';

async function main() {
  const program = new Command();

  program
    .name('cakemail')
    .description('Official Cakemail CLI - Command-line interface for the Cakemail API')
    .version('0.5.0')
    .option('-f, --format <format>', 'Output format (json|table|compact)', 'json')
    .option('--access-token <token>', 'Cakemail access token (overrides env)')
    .option('--email <email>', 'Cakemail account email (overrides env)')
    .option('--password <password>', 'Cakemail account password (overrides env)');

  try {
    // Get config (don't require credentials for help/version)
    const options = program.opts();
    const config = getConfig(false);

    // Override with CLI options
    if (options.accessToken) config.accessToken = options.accessToken;
    if (options.email) config.email = options.email;
    if (options.password) config.password = options.password;

    // Create client and formatter
    // Client will fail on first API call if credentials are missing
    const client = new CakemailClient(config);
    const formatter = new OutputFormatter(options.format as OutputFormat);

    // Add commands
    program.addCommand(createCampaignsCommand(client, formatter));
    program.addCommand(createListsCommand(client, formatter));
    program.addCommand(createContactsCommand(client, formatter));
    program.addCommand(createSendersCommand(client, formatter));
    program.addCommand(createWebhooksCommand(client, formatter));
    program.addCommand(createEmailsCommand(client, formatter));
    program.addCommand(createTemplatesCommand(client, formatter));

    // Parse
    await program.parseAsync(process.argv);

  } catch (error: any) {
    console.error(chalk.red('Error:'), error.message);
    if (error.message.includes('Missing credentials')) {
      console.error(chalk.yellow('\nTip:'), 'Set credentials in environment variables or .env file:');
      console.error('  CAKEMAIL_ACCESS_TOKEN=your_access_token');
      console.error('  or');
      console.error('  CAKEMAIL_EMAIL=your@email.com');
      console.error('  CAKEMAIL_PASSWORD=your_password');
    }
    process.exit(1);
  }
}

main();
