import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import { saveCredentials, testCredentials } from '../utils/auth.js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { confirmAction } from '../utils/confirm.js';

export function createAccountCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const account = new Command('account')
    .description('Manage account context and multi-tenant access');

  // Show current account
  account
    .command('show')
    .description('Display current account details')
    .action(async () => {
      const spinner = ora('Fetching account details...').start();
      try {
        const data = await client.sdk.accountService.getSelfAccount();
        spinner.stop();

        const currentAccountId = process.env.CAKEMAIL_CURRENT_ACCOUNT_ID;
        if (currentAccountId) {
          formatter.info(`Current account context: ${currentAccountId}`);
        }

        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // List all accessible accounts
  account
    .command('list')
    .description('List all accessible accounts (parent and sub-accounts)')
    .option('-r, --recursive', 'Include nested sub-accounts')
    .action(async (options) => {
      const spinner = ora('Fetching accessible accounts...').start();
      try {
        // Get main account
        const mainAccount = await client.sdk.accountService.getSelfAccount();
        const accounts: Array<{ id: string; name?: string }> = [mainAccount.data];

        // Get sub-accounts
        const subAccounts = await client.sdk.subAccountService.listAccounts({
          partnerAccountId: parseInt(mainAccount.data.id),
          recursive: options.recursive !== false
        });

        if (subAccounts.data && subAccounts.data.length > 0) {
          accounts.push(...subAccounts.data);
        }

        spinner.stop();

        // Mark current account
        const currentAccountId = process.env.CAKEMAIL_CURRENT_ACCOUNT_ID || mainAccount.data.id;

        console.log(chalk.cyan('Available accounts:\n'));
        accounts.forEach(acc => {
          const isCurrent = acc.id === currentAccountId;
          const marker = isCurrent ? chalk.green('• ') : '  ';
          const suffix = isCurrent ? chalk.gray(' (current)') : '';
          console.log(`${marker}${acc.name || `Account ${acc.id}`} (ID: ${acc.id})${suffix}`);
        });
        console.log('');

        formatter.info(`Total accessible accounts: ${accounts.length}`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Switch active account
  account
    .command('use <id>')
    .description('Switch active account context')
    .action(async (id: string) => {
      const spinner = ora('Switching account context...').start();
      try {
        const accountId = id;

        // Verify the account exists and is accessible
        // First check if it's the main account
        const mainAccount = await client.sdk.accountService.getSelfAccount();

        if (mainAccount.data.id === accountId) {
          // It's the main account
          spinner.stop();
        } else {
          // Check sub-accounts
          const subAccounts = await client.sdk.subAccountService.listAccounts({
            partnerAccountId: parseInt(mainAccount.data.id),
            recursive: true
          });

          const hasAccess = subAccounts.data?.some(acc => acc.id === accountId);

          if (!hasAccess) {
            spinner.stop();
            formatter.error(`Account ${accountId} not found or not accessible`);
            process.exit(1);
          }

          spinner.stop();
        }

        // Update .env file with new account context
        const envPath = join(process.cwd(), '.env');
        let envContent = '';

        if (existsSync(envPath)) {
          envContent = readFileSync(envPath, 'utf-8');
        }

        // Parse existing env variables
        const envLines = envContent.split('\n');
        const envVars: Record<string, string> = {};

        envLines.forEach(line => {
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            envVars[match[1].trim()] = match[2].trim();
          }
        });

        // Update account ID
        envVars['CAKEMAIL_CURRENT_ACCOUNT_ID'] = accountId;

        // Rebuild .env content
        const newEnvContent = Object.entries(envVars)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n') + '\n';

        writeFileSync(envPath, newEnvContent, 'utf-8');

        // Get account name for confirmation
        let accountName = `Account ${accountId}`;
        if (mainAccount.data.id === accountId) {
          accountName = mainAccount.data.name || accountName;
        } else {
          const subAccounts = await client.sdk.subAccountService.listAccounts({
            partnerAccountId: parseInt(mainAccount.data.id),
            recursive: true
          });
          const targetAccount = subAccounts.data?.find(acc => acc.id === accountId);
          if (targetAccount) {
            accountName = targetAccount.name || accountName;
          }
        }

        formatter.success(`Now using: ${accountName} (ID: ${accountId})`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Test current credentials
  account
    .command('test')
    .description('Validate current credentials')
    .action(async () => {
      const spinner = ora('Testing credentials...').start();
      try {
        const email = process.env.CAKEMAIL_EMAIL;
        const password = process.env.CAKEMAIL_PASSWORD;

        if (!email || !password) {
          spinner.stop();
          formatter.error('No credentials found in .env file');
          process.exit(1);
        }

        const isValid = await testCredentials(email, password);

        spinner.stop();

        if (isValid) {
          formatter.success('Credentials are valid');

          // Show account info
          const accountData = await client.sdk.accountService.getSelfAccount();
          const account = accountData.data;
          console.log(chalk.gray(`\nAuthenticated as: ${email}`));
          console.log(chalk.gray(`Account: ${account.name || `ID ${account.id}`}`));
        } else {
          formatter.error('Invalid credentials');
          process.exit(1);
        }
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Logout (remove credentials)
  account
    .command('logout')
    .description('Remove credentials from .env file')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmAction('Log out and remove credentials?', [
          'Credentials will be removed from .env file',
          'You will need to re-authenticate'
        ], 'low');

        if (!confirmed) {
          formatter.info('Logout cancelled');
          return;
        }
      }

      try {
        const envPath = join(process.cwd(), '.env');

        if (!existsSync(envPath)) {
          formatter.info('No .env file found');
          return;
        }

        const envContent = readFileSync(envPath, 'utf-8');
        const envLines = envContent.split('\n');
        const envVars: Record<string, string> = {};

        envLines.forEach(line => {
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            envVars[match[1].trim()] = match[2].trim();
          }
        });

        // Remove auth-related variables
        delete envVars['CAKEMAIL_EMAIL'];
        delete envVars['CAKEMAIL_PASSWORD'];
        delete envVars['CAKEMAIL_ACCESS_TOKEN'];
        delete envVars['CAKEMAIL_CURRENT_ACCOUNT_ID'];

        // Rebuild .env content
        const newEnvContent = Object.entries(envVars)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n') + '\n';

        writeFileSync(envPath, newEnvContent, 'utf-8');

        formatter.success('Logged out successfully');
        formatter.info('Credentials removed from .env file');
      } catch (error: any) {
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return account;
}
