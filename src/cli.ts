#!/usr/bin/env node

import { Command } from 'commander';
import { CakemailClient } from './client.js';
import { OutputFormatter } from './utils/output.js';
import { getConfig, OutputFormat } from './utils/config.js';
import { createCampaignsCommand } from './commands/campaigns.js';
import { createListsCommand } from './commands/lists.js';
import { createContactsCommand } from './commands/contacts.js';
import { createSendersCommand } from './commands/senders.js';
import { createWebhooksCommand } from './commands/webhooks.js';
import { createEmailsCommand } from './commands/emails.js';
import { createTemplatesCommand } from './commands/templates.js';
import { createReportsCommand } from './commands/reports.js';
import { createSegmentsCommand } from './commands/segments.js';
import { createAttributesCommand } from './commands/attributes.js';
import { createSuppressedCommand } from './commands/suppressed.js';
import { createAccountCommand } from './commands/account.js';
import { createTagsCommand } from './commands/tags.js';
import { createInterestsCommand } from './commands/interests.js';
import { createLogsCommand } from './commands/logs.js';
import { createTransactionalTemplatesCommand } from './commands/transactional-templates.js';
import { registerConfigCommands } from './commands/config.js';
import { getProfileConfig } from './utils/config-file.js';
import chalk from 'chalk';

async function main() {
  const program = new Command();

  program
    .name('cakemail')
    .description('Official Cakemail CLI - Command-line interface for the Cakemail API')
    .version('1.7.0')
    .option('-f, --format <format>', 'Output format (json|table|compact)')
    .option('--profile <type>', 'Override profile for this command (developer|marketer|balanced)')
    .option('--batch', 'Run in batch/scripting mode (disable all interactive prompts)')
    .option('--access-token <token>', 'Cakemail access token (overrides env)')
    .option('--email <email>', 'Cakemail account email (overrides env)')
    .option('--password <password>', 'Cakemail account password (overrides env)')
    .option('--account <id>', 'Account ID to use for this command (overrides current account)');

  try {
    // Check if this is a help/version command that doesn't need credentials
    const args = process.argv.slice(2);

    // Check if it's root-level help/version (single flag only)
    const isRootHelp = (args.length === 1) &&
                       (args[0] === '-h' || args[0] === '--help' ||
                        args[0] === '-V' || args[0] === '--version');

    // Check if it's a help request for any subcommand
    const isSubcommandHelp = args.includes('-h') || args.includes('--help');

    // For root help/version only, skip auth and commands
    if (isRootHelp) {
      await program.parseAsync(process.argv);
      return;
    }

    // For subcommand help, we need to add commands but can skip auth
    // For everything else, we need full auth
    const needsAuth = !isSubcommandHelp;

    // Get config with interactive authentication if needed
    const config = await getConfig(needsAuth, needsAuth);

    // Create client and formatter (use dummy values for help commands)
    const client = new CakemailClient(
      needsAuth ? config : { accessToken: 'dummy', profileConfig: config.profileConfig }
    );
    const formatter = new OutputFormatter(
      () => {
        const opts = program.opts();
        // Override config with CLI options
        if (opts.accessToken) config.accessToken = opts.accessToken;
        if (opts.email) config.email = opts.email;
        if (opts.password) config.password = opts.password;
        if (opts.account) config.currentAccountId = opts.account;

        // Priority: CLI flag > env var > profile config > default
        return (opts.format as OutputFormat) || config.outputFormat || 'json';
      },
      () => {
        const opts = program.opts();

        // Handle --batch flag by setting environment variable
        if (opts.batch) {
          process.env.CAKEMAIL_BATCH_MODE = 'true';
        }

        // Handle --profile override
        if (opts.profile) {
          const validProfiles = ['developer', 'marketer', 'balanced'];

          if (!validProfiles.includes(opts.profile)) {
            console.error(chalk.red(`Invalid profile: ${opts.profile}`));
            console.error(chalk.gray(`Valid profiles: ${validProfiles.join(', ')}`));
            process.exit(1);
          }

          return getProfileConfig(opts.profile);
        }

        // Return default profile config
        return config.profileConfig;
      }
    );

    // Add commands
    registerConfigCommands(program);
    program.addCommand(createAccountCommand(client, formatter));
    program.addCommand(createCampaignsCommand(client, formatter));
    program.addCommand(createListsCommand(client, formatter));
    program.addCommand(createContactsCommand(client, formatter));
    program.addCommand(createSendersCommand(client, formatter));
    program.addCommand(createWebhooksCommand(client, formatter));
    program.addCommand(createEmailsCommand(client, formatter));
    program.addCommand(createTemplatesCommand(client, formatter));
    program.addCommand(createReportsCommand(client, formatter));
    program.addCommand(createSegmentsCommand(client, formatter));
    program.addCommand(createAttributesCommand(client, formatter));
    program.addCommand(createSuppressedCommand(client, formatter));
    program.addCommand(createTagsCommand(client, formatter));
    program.addCommand(createInterestsCommand(client, formatter));
    program.addCommand(createLogsCommand(client, formatter));
    program.addCommand(createTransactionalTemplatesCommand(client, formatter));

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
