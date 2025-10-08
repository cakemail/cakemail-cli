import Table from 'cli-table3';
import chalk from 'chalk';

export type OutputFormat = 'json' | 'table' | 'compact';

export class OutputFormatter {
  constructor(private format: OutputFormat = 'json') {}

  output(data: any, fields?: string[]): void {
    switch (this.format) {
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

    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) {
      console.log('No results');
      return;
    }

    const keys = fields || Object.keys(items[0]);
    const table = new Table({
      head: keys.map(k => chalk.cyan(k)),
    });

    items.forEach(item => {
      table.push(keys.map(k => this.formatValue(item[k])));
    });

    console.log(table.toString());
  }

  private outputCompact(data: any): void {
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.id && item.name) {
          console.log(`${chalk.yellow(item.id)}: ${item.name}`);
        } else {
          console.log(this.formatValue(item));
        }
      });
    } else {
      console.log(this.formatValue(data));
    }
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
