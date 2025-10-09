import Table from 'cli-table3';
import chalk from 'chalk';
import { OutputFormat } from './config.js';

export class OutputFormatter {
  private formatGetter: () => OutputFormat;

  constructor(formatOrGetter: OutputFormat | (() => OutputFormat) = 'json') {
    if (typeof formatOrGetter === 'function') {
      this.formatGetter = formatOrGetter;
    } else {
      this.formatGetter = () => formatOrGetter;
    }
  }

  private getFormat(): OutputFormat {
    return this.formatGetter();
  }

  output(data: any, fields?: string[]): void {
    switch (this.getFormat()) {
      case 'json':
        console.log(JSON.stringify(data, null, 2));
        break;
      case 'table':
        this.outputTable(data, fields);
        break;
      case 'compact':
        this.outputCompact(data);
        break;
    }
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  private outputTable(data: any, fields?: string[]): void {
    if (!data) {
      console.log('No data');
      return;
    }

    // Handle paginated responses with 'data' property
    let items = data;
    if (data.data && Array.isArray(data.data)) {
      items = data.data;
      // Show pagination info if available
      if (data.count !== undefined) {
        console.log(chalk.gray(`Total: ${data.count} items`));
      }
    }

    // Ensure we have an array
    items = Array.isArray(items) ? items : [items];

    if (items.length === 0) {
      console.log('No results');
      return;
    }

    // Determine which fields to show
    const keys = fields || this.getDisplayFields(items[0]);

    const table = new Table({
      head: keys.map(k => chalk.cyan(k)),
      style: {
        head: [],
        border: ['gray']
      }
    });

    items.forEach((item: any) => {
      table.push(keys.map(k => this.formatValue(item[k])));
    });

    console.log(table.toString());
  }

  private getDisplayFields(item: any): string[] {
    // Common important fields to show first
    const priorityFields = ['id', 'name', 'email', 'status', 'subject', 'created_on', 'updated_on'];
    const allKeys = Object.keys(item);

    // Filter out nested objects and arrays for table display
    const simpleKeys = allKeys.filter(key => {
      const value = item[key];
      return typeof value !== 'object' || value === null;
    });

    // Sort: priority fields first, then alphabetically
    return simpleKeys.sort((a, b) => {
      const aIndex = priorityFields.indexOf(a);
      const bIndex = priorityFields.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }

  private outputCompact(data: any): void {
    // Handle paginated responses with 'data' property
    let items = data;
    if (data.data && Array.isArray(data.data)) {
      items = data.data;
      // Show pagination info if available
      if (data.count !== undefined) {
        console.log(chalk.gray(`Total: ${data.count} items\n`));
      }
    }

    if (Array.isArray(items)) {
      items.forEach(item => {
        // Try different common field combinations
        if (item.id && item.name) {
          console.log(`${chalk.yellow(item.id.toString().padStart(6))} ${chalk.white('│')} ${chalk.bold(item.name)}${item.status ? chalk.gray(` (${item.status})`) : ''}`);
        } else if (item.id && item.email) {
          console.log(`${chalk.yellow(item.id.toString().padStart(6))} ${chalk.white('│')} ${chalk.bold(item.email)}${item.status ? chalk.gray(` (${item.status})`) : ''}`);
        } else if (item.id && item.subject) {
          console.log(`${chalk.yellow(item.id.toString().padStart(6))} ${chalk.white('│')} ${chalk.bold(item.subject)}${item.status ? chalk.gray(` (${item.status})`) : ''}`);
        } else if (item.id) {
          console.log(`${chalk.yellow(item.id.toString().padStart(6))} ${chalk.white('│')} ${this.compactObjectSummary(item)}`);
        } else {
          console.log(this.compactObjectSummary(item));
        }
      });
    } else if (typeof items === 'object' && items !== null) {
      // Single object - show key details in a compact card format
      const obj = items;

      // Header with ID and name/email/subject
      if (obj.id && obj.name) {
        console.log(`${chalk.yellow(obj.id.toString())} ${chalk.white('│')} ${chalk.bold(obj.name)}${obj.status ? chalk.gray(` (${obj.status})`) : ''}`);
      } else if (obj.id && obj.email) {
        console.log(`${chalk.yellow(obj.id.toString())} ${chalk.white('│')} ${chalk.bold(obj.email)}${obj.status ? chalk.gray(` (${obj.status})`) : ''}`);
      } else if (obj.id && obj.subject) {
        console.log(`${chalk.yellow(obj.id.toString())} ${chalk.white('│')} ${chalk.bold(obj.subject)}${obj.status ? chalk.gray(` (${obj.status})`) : ''}`);
      } else if (obj.id) {
        console.log(`${chalk.yellow(obj.id.toString())} ${chalk.white('│')} ${chalk.bold('Details')}`);
      }

      // Show other important fields
      const importantFields = ['created_on', 'updated_on', 'scheduled_for', 'type', 'language'];
      const shownFields = new Set(['id', 'name', 'email', 'subject', 'status']);

      Object.entries(obj).forEach(([key, value]) => {
        if (shownFields.has(key)) return;
        if (value === null || value === undefined) return;

        // Show important fields or simple values
        if (importantFields.includes(key) || (typeof value !== 'object' && typeof value !== 'function')) {
          if (typeof value === 'object') {
            // Skip nested objects in compact view
            return;
          }
          console.log(`  ${chalk.gray(key.padEnd(18))} ${chalk.white('│')} ${this.formatValue(value)}`);
        }
      });
    } else {
      console.log(this.formatValue(items));
    }
  }

  private compactObjectSummary(obj: any): string {
    // Create a compact one-line summary of an object
    const parts: string[] = [];
    const excludeKeys = ['id']; // Already shown

    Object.entries(obj).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;
      if (value === null || value === undefined) return;
      if (typeof value === 'object') return; // Skip nested objects

      if (['name', 'email', 'subject'].includes(key)) {
        parts.unshift(chalk.bold(String(value)));
      } else if (key === 'status') {
        parts.push(chalk.gray(`(${value})`));
      } else if (typeof value === 'string' && value.length < 50) {
        parts.push(`${key}: ${value}`);
      }
    });

    return parts.join(' ');
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return chalk.gray('null');
    if (typeof value === 'boolean') return value ? chalk.green('true') : chalk.red('false');
    if (typeof value === 'object') {
      const str = JSON.stringify(value);
      return str.length > 100 ? str.substring(0, 97) + '...' : str;
    }
    return String(value);
  }
}
