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
    .version('0.6.0')
    .option('-f, --format <format>', 'Output format (json|table|compact)', 'json')
    .option('--access-token <token>', 'Cakemail access token (overrides env)')
    .option('--email <email>', 'Cakemail account email (overrides env)')
    .option('--password <password>', 'Cakemail account password (overrides env)');

  try {
    // Get config (don't require credentials for help/version)
    const config = getConfig(false);

    // Create client and formatter with lazy format evaluation
    // Client will fail on first API call if credentials are missing
    const client = new CakemailClient(config);
    const formatter = new OutputFormatter(() => {
      const opts = program.opts();
      // Override config with CLI options
      if (opts.accessToken) config.accessToken = opts.accessToken;
      if (opts.email) config.email = opts.email;
      if (opts.password) config.password = opts.password;
      return opts.format as OutputFormat || 'json';
    });

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
