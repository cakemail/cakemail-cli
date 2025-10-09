import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';
import fs from 'fs';

export function createTemplatesCommand(client: CakemailClient, formatter: OutputFormatter): Command {
  const templates = new Command('templates')
    .description('Manage email templates');

  // List templates
  templates
    .command('list')
    .description('List all templates')
    .option('-l, --limit <number>', 'Limit number of results')
    .option('-p, --page <number>', 'Page number')
    .option('-f, --filter <filter>', 'Filter by tag, name, or ownership (e.g., "name==Newsletter")')
    .option('-s, --sort <sort>', 'Sort by field (e.g., "+name", "-created_on")')
    .action(async (options) => {
      const spinner = ora('Fetching templates...').start();
      try {
        const params: any = {};
        if (options.limit) params.perPage = parseInt(options.limit);
        if (options.page) params.page = parseInt(options.page);
        if (options.filter) params.filter = options.filter;
        if (options.sort) params.sort = options.sort;

        const data = await client.sdk.templateService.listTemplates(params);
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Get template
  templates
    .command('get <id>')
    .description('Get template details')
    .action(async (id) => {
      const spinner = ora(`Fetching template ${id}...`).start();
      try {
        const data = await client.sdk.templateService.getTemplate({ templateId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Create template
  templates
    .command('create')
    .description('Create a new template')
    .requiredOption('-n, --name <name>', 'Template name')
    .option('--html <html>', 'HTML content')
    .option('--html-file <path>', 'Path to HTML file')
    .option('--text <text>', 'Plain text content')
    .option('--text-file <path>', 'Path to text file')
    .option('--subject <subject>', 'Default email subject')
    .option('--tags <tags>', 'Comma-separated tags')
    .action(async (options) => {
      const spinner = ora('Creating template...').start();
      try {
        const payload: any = {
          name: options.name,
        };

        // HTML content
        if (options.htmlFile) {
          payload.html = fs.readFileSync(options.htmlFile, 'utf-8');
        } else if (options.html) {
          payload.html = options.html;
        }

        // Text content
        if (options.textFile) {
          payload.text = fs.readFileSync(options.textFile, 'utf-8');
        } else if (options.text) {
          payload.text = options.text;
        }

        // Subject
        if (options.subject) {
          payload.subject = options.subject;
        }

        // Tags
        if (options.tags) {
          payload.tags = options.tags.split(',').map((t: string) => t.trim());
        }

        const data = await client.sdk.templateService.createTemplate({ requestBody: payload });
        spinner.stop();
        formatter.success(`Template created: ${data.id}`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Update template
  templates
    .command('update <id>')
    .description('Update a template')
    .option('-n, --name <name>', 'Template name')
    .option('--html <html>', 'HTML content')
    .option('--html-file <path>', 'Path to HTML file')
    .option('--text <text>', 'Plain text content')
    .option('--text-file <path>', 'Path to text file')
    .option('--subject <subject>', 'Default email subject')
    .option('--tags <tags>', 'Comma-separated tags')
    .action(async (id, options) => {
      const spinner = ora(`Updating template ${id}...`).start();
      try {
        const payload: any = {};

        if (options.name) payload.name = options.name;

        // HTML content
        if (options.htmlFile) {
          payload.html = fs.readFileSync(options.htmlFile, 'utf-8');
        } else if (options.html) {
          payload.html = options.html;
        }

        // Text content
        if (options.textFile) {
          payload.text = fs.readFileSync(options.textFile, 'utf-8');
        } else if (options.text) {
          payload.text = options.text;
        }

        // Subject
        if (options.subject) {
          payload.subject = options.subject;
        }

        // Tags
        if (options.tags) {
          payload.tags = options.tags.split(',').map((t: string) => t.trim());
        }

        const data = await client.sdk.templateService.patchTemplate({
          templateId: parseInt(id),
          requestBody: payload
        });
        spinner.stop();
        formatter.success(`Template ${id} updated`);
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Render template
  templates
    .command('render <id>')
    .description('Render/preview a template')
    .action(async (id) => {
      const spinner = ora(`Rendering template ${id}...`).start();
      try {
        const data = await client.sdk.templateService.renderTemplate({ templateId: parseInt(id) });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  // Delete template
  templates
    .command('delete <id>')
    .description('Delete a template')
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        formatter.info('Use --force to confirm deletion');
        process.exit(1);
      }

      const spinner = ora(`Deleting template ${id}...`).start();
      try {
        await client.sdk.templateService.deleteTemplate({ templateId: parseInt(id) });
        spinner.stop();
        formatter.success(`Template ${id} deleted`);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return templates;
}
