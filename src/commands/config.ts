/**
 * Config Management Commands
 *
 * Manage profile settings and configuration
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  getCurrentProfile,
  setCurrentProfile,
  getProfileConfig,
  setProfileConfigValue,
  resetProfileConfig,
  loadConfigFile,
  deleteConfigFile
} from '../utils/config-file.js';
import { ProfileType, PROFILE_DESCRIPTIONS } from '../types/profile.js';

export function registerConfigCommands(program: Command): void {
  const config = program
    .command('config')
    .description('Manage CLI configuration and profiles');

  // Show current profile
  config
    .command('profile')
    .description('Show current profile and settings')
    .action(showProfile);

  // Switch profile
  config
    .command('profile-set <type>')
    .description('Switch to a different profile (developer|marketer|balanced)')
    .action(switchProfile);

  // Set custom config value
  config
    .command('set <key> <value>')
    .description('Set a custom configuration value (e.g., output.format table)')
    .action(setConfigValue);

  // Reset to profile defaults
  config
    .command('reset')
    .description('Reset all custom settings to profile defaults')
    .action(resetConfig);

  // Show all config
  config
    .command('show')
    .description('Show complete configuration')
    .action(showAllConfig);

  // Preview profile
  config
    .command('preview <type>')
    .description('Preview settings for a profile without switching (developer|marketer|balanced)')
    .action(previewProfile);

  // Logout command
  program
    .command('logout')
    .description('Log out and clear authentication tokens')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(logout);
}

/**
 * Show current profile and active settings
 */
function showProfile(): void {
  const profile = getCurrentProfile();
  const config = getProfileConfig();

  console.log(chalk.cyan('\n📋 Current Profile\n'));
  console.log(chalk.white(`Profile: ${chalk.bold(profile)}`));
  console.log(chalk.gray(`(${PROFILE_DESCRIPTIONS[profile].name})\n`));

  console.log(chalk.cyan('Active Settings:\n'));
  console.log(chalk.gray('Output:'));
  console.log(`  Format:              ${chalk.white(config.output.format)}`);
  console.log(`  Colors:              ${chalk.white(config.output.colors)}`);
  console.log(`  Pretty print:        ${chalk.white(config.output.pretty_print ? 'enabled' : 'disabled')}`);
  console.log(`  Show tips:           ${chalk.white(config.output.show_tips ? 'enabled' : 'disabled')}`);

  console.log(chalk.gray('\nBehavior:'));
  console.log(`  Interactive prompts: ${chalk.white(config.behavior.interactive_prompts === true ? 'enabled' : config.behavior.interactive_prompts === false ? 'disabled' : 'auto')}`);
  console.log(`  Confirm destructive: ${chalk.white(config.behavior.confirm_destructive ? 'enabled' : 'disabled')}`);
  console.log(`  Auto open browser:   ${chalk.white(config.behavior.auto_open_browser ? 'enabled' : 'disabled')}`);
  console.log(`  Show progress:       ${chalk.white(config.behavior.show_progress ? 'enabled' : 'disabled')}`);

  console.log(chalk.gray('\nDisplay:'));
  console.log(`  Date format:         ${chalk.white(config.display.date_format)}`);
  console.log(`  Show IDs:            ${chalk.white(config.display.show_ids ? 'yes' : 'no')}`);
  console.log(`  Show API details:    ${chalk.white(config.display.show_api_details ? 'yes' : 'no')}`);
  console.log(`  Verbose errors:      ${chalk.white(config.display.verbose_errors ? 'yes' : 'no')}`);

  console.log(chalk.gray('\n' + '─'.repeat(50)));
  console.log(chalk.gray('\nQuick actions:'));
  console.log(chalk.gray(`  Change profile: ${chalk.cyan('cakemail config profile-set <type>')}`));
  console.log(chalk.gray(`  Customize:      ${chalk.cyan('cakemail config set <key> <value>')}`));
  console.log(chalk.gray(`  Reset:          ${chalk.cyan('cakemail config reset')}`));
  console.log(chalk.gray(`  View all:       ${chalk.cyan('cakemail config show')}`));
  console.log(chalk.gray(`  Logout:         ${chalk.cyan('cakemail logout')}\n`));
}

/**
 * Switch to a different profile
 */
function switchProfile(type: string): void {
  const validProfiles: ProfileType[] = ['developer', 'marketer', 'balanced'];

  if (!validProfiles.includes(type as ProfileType)) {
    console.error(chalk.red(`\n✗ Invalid profile type: ${type}`));
    console.log(chalk.gray(`\nValid profiles: ${validProfiles.join(', ')}\n`));
    process.exit(1);
  }

  const oldProfile = getCurrentProfile();
  const newProfile = type as ProfileType;

  setCurrentProfile(newProfile);

  console.log(chalk.green(`\n✓ Switched to ${chalk.bold(newProfile)} profile\n`));

  // Show changes
  const oldConfig = getProfileConfig(oldProfile);
  const newConfig = getProfileConfig(newProfile);

  console.log(chalk.cyan('Changes applied:\n'));

  if (oldConfig.output.format !== newConfig.output.format) {
    console.log(`  ${chalk.gray('•')} Output format:      ${chalk.yellow(oldConfig.output.format)} → ${chalk.green(newConfig.output.format)}`);
  }

  if (oldConfig.output.colors !== newConfig.output.colors) {
    console.log(`  ${chalk.gray('•')} Colors:             ${chalk.yellow(oldConfig.output.colors)} → ${chalk.green(newConfig.output.colors)}`);
  }

  if (oldConfig.behavior.interactive_prompts !== newConfig.behavior.interactive_prompts) {
    const oldValue = oldConfig.behavior.interactive_prompts === true ? 'enabled' : oldConfig.behavior.interactive_prompts === false ? 'disabled' : 'auto';
    const newValue = newConfig.behavior.interactive_prompts === true ? 'enabled' : newConfig.behavior.interactive_prompts === false ? 'disabled' : 'auto';
    console.log(`  ${chalk.gray('•')} Interactive mode:   ${chalk.yellow(oldValue)} → ${chalk.green(newValue)}`);
  }

  if (oldConfig.output.show_tips !== newConfig.output.show_tips) {
    console.log(`  ${chalk.gray('•')} Show tips:          ${chalk.yellow(oldConfig.output.show_tips ? 'enabled' : 'disabled')} → ${chalk.green(newConfig.output.show_tips ? 'enabled' : 'disabled')}`);
  }

  console.log(chalk.gray(`\nTry it: ${chalk.cyan('cakemail campaigns list')}\n`));
}

/**
 * Set a custom config value
 */
function setConfigValue(key: string, value: string): void {
  // Parse value to appropriate type
  let parsedValue: any = value;

  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (value === 'null') parsedValue = null;
  else if (!isNaN(Number(value))) parsedValue = Number(value);

  try {
    setProfileConfigValue(key, parsedValue);
    console.log(chalk.green(`\n✓ Set ${chalk.cyan(key)} to ${chalk.bold(String(parsedValue))}\n`));
    console.log(chalk.gray(`This overrides your profile default.\n`));
    console.log(chalk.gray(`Reset with: ${chalk.cyan('cakemail config reset')}\n`));
  } catch (error) {
    console.error(chalk.red(`\n✗ Failed to set config value: ${error}\n`));
    process.exit(1);
  }
}

/**
 * Reset custom config to profile defaults
 */
function resetConfig(): void {
  const profile = getCurrentProfile();

  resetProfileConfig();

  console.log(chalk.green(`\n✓ Settings reset to ${chalk.bold(profile)} profile defaults\n`));
  console.log(chalk.gray(`View settings: ${chalk.cyan('cakemail config profile')}\n`));
}

/**
 * Show all configuration including auth and defaults
 */
function showAllConfig(): void {
  const configFile = loadConfigFile();

  if (!configFile) {
    console.log(chalk.yellow('\n⚠ No configuration file found\n'));
    console.log(chalk.gray(`Run ${chalk.cyan('cakemail auth')} to set up authentication.\n`));
    return;
  }

  console.log(chalk.cyan('\n📋 Complete Configuration\n'));

  // Profile
  console.log(chalk.white('Profile:'));
  console.log(`  ${chalk.gray('Type:')}             ${chalk.white(configFile.profile || 'balanced')}`);

  // Auth
  if (configFile.auth) {
    console.log(chalk.white('\nAuthentication:'));
    if (configFile.auth.email) {
      console.log(`  ${chalk.gray('Email:')}            ${chalk.white(configFile.auth.email)}`);
    }
    if (configFile.auth.base_url) {
      console.log(`  ${chalk.gray('API Base URL:')}     ${chalk.white(configFile.auth.base_url)}`);
    }
    if (configFile.auth.token) {
      console.log(`  ${chalk.gray('Token:')}            ${chalk.gray('[stored]')}`);
    }
  }

  // Defaults
  if (configFile.defaults) {
    console.log(chalk.white('\nDefaults:'));
    if (configFile.defaults.list_id) {
      console.log(`  ${chalk.gray('List ID:')}          ${chalk.white(configFile.defaults.list_id)}`);
    }
    if (configFile.defaults.sender_id) {
      console.log(`  ${chalk.gray('Sender ID:')}        ${chalk.white(configFile.defaults.sender_id)}`);
    }
    if (configFile.defaults.account_id) {
      console.log(`  ${chalk.gray('Account ID:')}       ${chalk.white(configFile.defaults.account_id)}`);
    }
  }

  // Profile settings
  const profileConfig = getProfileConfig();
  console.log(chalk.white('\nProfile Settings:'));
  console.log(chalk.gray('  (see "cakemail config profile" for details)'));

  console.log(chalk.gray('\n' + '─'.repeat(50)));
  console.log(chalk.gray(`\nConfig file: ${chalk.cyan('~/.cakemail/config.json')}\n`));
}

/**
 * Preview a profile's settings without switching
 */
function previewProfile(type: string): void {
  const validProfiles: ProfileType[] = ['developer', 'marketer', 'balanced'];

  if (!validProfiles.includes(type as ProfileType)) {
    console.error(chalk.red(`\n✗ Invalid profile type: ${type}`));
    console.log(chalk.gray(`\nValid profiles: ${validProfiles.join(', ')}\n`));
    process.exit(1);
  }

  const profile = type as ProfileType;
  const config = getProfileConfig(profile);
  const currentProfile = getCurrentProfile();

  console.log(chalk.cyan(`\n👁️  Preview: ${chalk.bold(profile)} Profile\n`));
  console.log(chalk.gray(`${PROFILE_DESCRIPTIONS[profile].name}`));

  // Show description
  console.log(chalk.white('\nDescription:'));
  PROFILE_DESCRIPTIONS[profile].description.forEach(line => {
    console.log(chalk.gray(`  • ${line}`));
  });

  console.log(chalk.cyan('\n⚙️  Settings:\n'));

  console.log(chalk.gray('Output:'));
  console.log(`  Format:              ${chalk.white(config.output.format)}`);
  console.log(`  Colors:              ${chalk.white(config.output.colors)}`);
  console.log(`  Pretty print:        ${chalk.white(config.output.pretty_print ? 'enabled' : 'disabled')}`);
  console.log(`  Show tips:           ${chalk.white(config.output.show_tips ? 'enabled' : 'disabled')}`);

  console.log(chalk.gray('\nBehavior:'));
  console.log(`  Interactive prompts: ${chalk.white(config.behavior.interactive_prompts === true ? 'enabled' : config.behavior.interactive_prompts === false ? 'disabled' : 'auto')}`);
  console.log(`  Confirm destructive: ${chalk.white(config.behavior.confirm_destructive ? 'enabled' : 'disabled')}`);
  console.log(`  Auto open browser:   ${chalk.white(config.behavior.auto_open_browser ? 'enabled' : 'disabled')}`);
  console.log(`  Show progress:       ${chalk.white(config.behavior.show_progress ? 'enabled' : 'disabled')}`);

  console.log(chalk.gray('\nDisplay:'));
  console.log(`  Date format:         ${chalk.white(config.display.date_format)}`);
  console.log(`  Show IDs:            ${chalk.white(config.display.show_ids ? 'yes' : 'no')}`);
  console.log(`  Show API details:    ${chalk.white(config.display.show_api_details ? 'yes' : 'no')}`);
  console.log(`  Verbose errors:      ${chalk.white(config.display.verbose_errors ? 'yes' : 'no')}`);

  console.log(chalk.gray('\n' + '─'.repeat(50)));

  if (currentProfile === profile) {
    console.log(chalk.green(`\n✓ This is your current profile\n`));
  } else {
    console.log(chalk.gray(`\nCurrent profile: ${chalk.white(currentProfile)}`));
    console.log(chalk.gray(`Switch to this profile: ${chalk.cyan(`cakemail config profile-set ${profile}`)}`));
    console.log(chalk.gray(`Try it once: ${chalk.cyan(`cakemail --profile ${profile} campaigns list`)}\n`));
  }
}

/**
 * Logout and clear authentication
 */
async function logout(options: any): Promise<void> {
  const configFile = loadConfigFile();

  if (!configFile) {
    console.log(chalk.yellow('\n⚠ Not logged in\n'));
    return;
  }

  // Show what will be deleted
  console.log(chalk.cyan('\n🚪 Logout\n'));

  if (configFile.auth?.email) {
    console.log(chalk.gray(`Currently logged in as: ${chalk.white(configFile.auth.email)}`));
  }

  console.log(chalk.gray('\nThis will remove:'));
  console.log(chalk.gray('  • Authentication tokens'));
  console.log(chalk.gray('  • Profile settings'));
  console.log(chalk.gray('  • All saved configuration\n'));

  // Confirm unless --force is used
  if (!options.force) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Are you sure you want to log out?',
        default: false
      }
    ]);

    if (!answer.confirmed) {
      console.log(chalk.gray('\nLogout cancelled\n'));
      return;
    }
  }

  // Delete the config file
  try {
    const deleted = deleteConfigFile();

    if (deleted) {
      console.log(chalk.green('\n✓ Logged out successfully\n'));
      console.log(chalk.gray('Run any command to log in again.\n'));
    } else {
      console.log(chalk.yellow('\n⚠ No configuration file found\n'));
    }
  } catch (error: any) {
    console.error(chalk.red(`\n✗ Failed to logout: ${error.message}\n`));
    process.exit(1);
  }
}
