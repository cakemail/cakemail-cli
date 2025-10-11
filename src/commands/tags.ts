import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import { confirmDelete } from '../utils/confirm.js';

export function createTagsCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const tags = new Command('tags')
    .description('Manage contact tags');

  // List tags
  tags
    .command('list')
    .description('List all contact tags')
    .option('-p, --page <number>', 'Page number', '1')
    .option('--per-page <number>', 'Results per page', '50')
    .option('--with-count', 'Include contact count for each tag')
    .action(async (options) => {
      const spinner = ora('Fetching tags...').start();
      try {
        const page = parseInt(options.page);
        const perPage = parseInt(options.perPage);

        const data = await client.sdk.tagsService.listTags({
          page,
          perPage,
          withCount: options.withCount ? true : undefined
        });

        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Show tag
  tags
    .command('show <tag>')
    .description('Show details of a specific tag')
    .action(async (tag) => {
      const spinner = ora(`Fetching tag ${tag}...`).start();
      try {
        const data = await client.sdk.tagsService.showTag({ tag });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create tag
  tags
    .command('create')
    .description('Create a new contact tag')
    .requiredOption('-n, --name <name>', 'Tag name')
    .action(async (options) => {
      const spinner = ora('Creating tag...').start();
      try {
        const data = await client.sdk.tagsService.createTag({
          requestBody: { tag: options.name }
        });

        spinner.stop();
        formatter.success(`Tag "${options.name}" created successfully`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update tag
  tags
    .command('update <tag>')
    .description('Update a contact tag')
    .requiredOption('-n, --name <name>', 'New tag name')
    .action(async (tag, options) => {
      const spinner = ora(`Updating tag ${tag}...`).start();
      try {
        const data = await client.sdk.tagsService.patchTag({
          tag,
          requestBody: { tag: options.name }
        });

        spinner.stop();
        formatter.success(`Tag updated successfully`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete tag
  tags
    .command('delete <tag>')
    .description('Delete a contact tag')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (tag, options) => {
      // Interactive confirmation (unless --force is used)
      if (!options.force) {
        const confirmed = await confirmDelete('tag', tag, [
          'Tag will be removed from all contacts',
          'This action cannot be undone'
        ]);

        if (!confirmed) {
          formatter.info('Deletion cancelled');
          return;
        }
      }

      const spinner = ora(`Deleting tag ${tag}...`).start();
      try {
        await client.sdk.tagsService.deleteTag({ tag });
        spinner.stop();
        formatter.success(`Tag "${tag}" deleted successfully`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return tags;
}
