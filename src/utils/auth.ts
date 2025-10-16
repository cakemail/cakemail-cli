import inquirer from 'inquirer';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CakemailClient as SDK } from '@cakemail-org/cakemail-sdk';
import chalk from 'chalk';
import { ProfileType, PROFILE_DESCRIPTIONS } from '../types/profile.js';
import { updateConfigFile, configFileExists } from './config-file.js';

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Prompts the user to select their profile type
 */
export async function promptForProfile(): Promise<ProfileType> {
  console.log(chalk.cyan('\n✨ One more thing - let\'s personalize your experience!\n'));
  console.log(chalk.white('What best describes how you\'ll use Cakemail CLI?\n'));

  // Build choices from profile descriptions
  const choices = Object.entries(PROFILE_DESCRIPTIONS).map(([key, info], index) => {
    const description = info.description.map(d => `     ${chalk.gray('•')} ${d}`).join('\n');
    return {
      name: `${index + 1}. ${info.name}\n${description}\n`,
      value: key as ProfileType,
      short: info.name
    };
  });

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'profile',
      message: 'Choose your profile:',
      choices,
      pageSize: 10
    }
  ]);

  console.log(chalk.gray(`\n💡 You can change this anytime with: ${chalk.cyan('cakemail config profile <type>')}\n`));

  return answer.profile;
}

/**
 * Prompts the user for their Cakemail credentials
 */
export async function promptForCredentials(): Promise<Credentials> {
  console.log(chalk.yellow('⚠ Not authenticated'));
  console.log(chalk.gray('Please enter your Cakemail credentials:\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email:',
      validate: (input: string) => {
        if (!input || !input.includes('@')) {
          return 'Please enter a valid email address';
        }
        return true;
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
      mask: '*',
      validate: (input: string) => {
        if (!input || input.length < 1) {
          return 'Please enter your password';
        }
        return true;
      }
    }
  ]);

  return {
    email: answers.email,
    password: answers.password
  };
}

/**
 * Tests credentials by attempting to authenticate with the API
 * Returns token information if successful
 */
export async function testCredentials(email: string, password: string): Promise<{
  valid: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  accounts?: number[];
}> {
  try {
    const sdk = new SDK({
      email,
      password,
      baseURL: process.env.CAKEMAIL_API_BASE || 'https://api.cakemail.dev'
    });

    // Get tokens using the TokenService
    const tokenResponse = await sdk.tokenService.createToken({
      formData: {
        grant_type: 'password',
        username: email,
        password: password
      }
    });

    // Handle potential MFA challenge
    if ('challenge' in tokenResponse) {
      // MFA is enabled - for now we'll return false
      // TODO: Implement MFA flow
      console.log(chalk.yellow('⚠ Multi-factor authentication is enabled on this account'));
      console.log(chalk.gray('MFA support is coming soon. Please disable MFA temporarily.'));
      return { valid: false };
    }

    return {
      valid: true,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
      accounts: tokenResponse.accounts
    };
  } catch (error: any) {
    return { valid: false };
  }
}

/**
 * Saves credentials to .env file in current working directory
 */
export function saveCredentials(email: string, password: string, accountId?: string): void {
  const envPath = join(process.cwd(), '.env');
  let envContent = '';

  // Read existing .env if it exists
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

  // Update credentials
  envVars['CAKEMAIL_EMAIL'] = email;
  envVars['CAKEMAIL_PASSWORD'] = password;

  if (accountId !== undefined) {
    envVars['CAKEMAIL_CURRENT_ACCOUNT_ID'] = accountId;
  }

  // Rebuild .env content
  const newEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';

  writeFileSync(envPath, newEnvContent, 'utf-8');
}

/**
 * Interactive authentication flow - prompts for credentials and saves them
 */
export async function authenticateInteractively(): Promise<Credentials> {
  const credentials = await promptForCredentials();

  console.log(chalk.gray('\nValidating credentials...'));

  const authResult = await testCredentials(credentials.email, credentials.password);

  if (!authResult.valid) {
    console.log(chalk.red('✗ Invalid credentials. Please try again.\n'));
    // Retry
    return authenticateInteractively();
  }

  console.log(chalk.green('✓ Authenticated'));

  // Fetch account info to show welcome message
  let accountId: string | undefined;
  try {
    const sdk = new SDK({
      email: credentials.email,
      password: credentials.password,
      baseURL: process.env.CAKEMAIL_API_BASE || 'https://api.cakemail.dev'
    });

    const accountResponse = await sdk.accountService.getSelfAccount();
    const account = accountResponse.data;
    accountId = account.id;

    // List all accessible accounts with count
    const accountsResponse = await sdk.subAccountService.listAccounts({
      partnerAccountId: parseInt(account.id),
      recursive: true,
      withCount: true
    });

    // Use actual count from pagination if available, otherwise show "X+" for first page
    const subAccountCount = accountsResponse.pagination?.count ?? accountsResponse.data?.length ?? 0;
    const totalAccounts = 1 + subAccountCount;
    const hasMorePages = accountsResponse.pagination?.count === null && (accountsResponse.data?.length || 0) >= 50;

    const accountMessage = hasMorePages
      ? `Welcome! You have access to ${totalAccounts}+ accounts.`
      : `Welcome! You have access to ${totalAccounts} account${totalAccounts > 1 ? 's' : ''}.`;

    console.log(chalk.cyan(`\n${accountMessage}`));

    if (totalAccounts > 1) {
      console.log(chalk.gray(`Use 'cakemail account list' to see all accounts.`));
      console.log(chalk.gray(`Use 'cakemail account use <id>' to switch accounts.`));
    }
  } catch (error) {
    // If we can't fetch account info, just show basic welcome
    console.log(chalk.cyan('\nWelcome!\n'));
  }

  // Check if this is first-time setup (no config file exists yet)
  const isFirstTimeSetup = !configFileExists();

  // Prompt for profile selection on first-time setup
  let selectedProfile: ProfileType | undefined;
  if (isFirstTimeSetup) {
    selectedProfile = await promptForProfile();
    console.log(chalk.green(`✓ Profile set to: ${PROFILE_DESCRIPTIONS[selectedProfile].name}`));
  }

  // Save to config file (preferred) or fallback to .env
  if (isFirstTimeSetup || configFileExists()) {
    // Save to config file with tokens
    const configUpdate: any = {
      version: '1.0',
      auth: {
        method: 'token',
        access_token: authResult.accessToken,
        refresh_token: authResult.refreshToken,
        expires_in: authResult.expiresIn,
        email: credentials.email,
        base_url: process.env.CAKEMAIL_API_BASE || 'https://api.cakemail.dev'
      },
      defaults: accountId ? { account_id: accountId } : undefined
    };

    // Only set profile during first-time setup to avoid overwriting user's profile choice
    if (isFirstTimeSetup) {
      configUpdate.profile = selectedProfile || 'balanced';
    }

    updateConfigFile(configUpdate);
    console.log(chalk.green('✓ Configuration saved to ~/.cakemail/config.json'));
  } else {
    // Fallback to .env for backward compatibility
    saveCredentials(credentials.email, credentials.password, accountId);
    console.log(chalk.green('✓ Credentials saved to .env'));
  }

  console.log(chalk.gray('\n' + '─'.repeat(50) + '\n'));

  return credentials;
}
