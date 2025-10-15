import Table from 'cli-table3';
import chalk from 'chalk';
import { OutputFormat, ProfileConfig } from './config.js';
import { ColorScheme } from '../types/profile.js';

export class OutputFormatter {
  private formatGetter: () => OutputFormat;
  private profileConfigGetter?: () => ProfileConfig | undefined;

  constructor(
    formatOrGetter: OutputFormat | (() => OutputFormat) = 'json',
    profileConfigGetter?: () => ProfileConfig | undefined
  ) {
    if (typeof formatOrGetter === 'function') {
      this.formatGetter = formatOrGetter;
    } else {
      this.formatGetter = () => formatOrGetter;
    }
    this.profileConfigGetter = profileConfigGetter;
  }

  private getFormat(): OutputFormat {
    return this.formatGetter();
  }

  private getProfileConfig(): ProfileConfig | undefined {
    return this.profileConfigGetter?.();
  }

  /**
   * Get profile config (public accessor for commands)
   */
  public getProfile(): ProfileConfig | undefined {
    return this.getProfileConfig();
  }

  private getColorScheme(): ColorScheme {
    return this.getProfileConfig()?.output.colors || 'rich';
  }

  private shouldShowTips(): boolean {
    return this.getProfileConfig()?.output.show_tips ?? true;
  }

  /**
   * Apply color based on profile's color scheme
   */
  private applyColor(text: string, colorFn: (text: string) => string): string {
    const scheme = this.getColorScheme();

    switch (scheme) {
      case 'none':
        return text; // No colors
      case 'minimal':
        // Only basic colors for minimal scheme
        return colorFn === chalk.red || colorFn === chalk.green ? colorFn(text) : text;
      case 'moderate':
      case 'rich':
      default:
        return colorFn(text); // Full colors
    }
  }

  /**
   * Conditionally show tip based on profile
   */
  private showTip(message: string): void {
    if (this.shouldShowTips()) {
      console.log(this.applyColor('💡 ', chalk.gray) + this.applyColor(message, chalk.gray));
    }
  }

  output(data: any, fields?: string[]): void {
    switch (this.getFormat()) {
      case 'json':
        this.outputJson(data);
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

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Output JSON with syntax highlighting
   */
  private outputJson(data: any): void {
    const jsonString = JSON.stringify(data, null, 2);
    const highlighted = this.highlightJson(jsonString);
    console.log(highlighted);
  }

  /**
   * Syntax highlighting for JSON output
   */
  private highlightJson(jsonString: string): string {
    return jsonString
      // Keys (property names)
      .replace(/"([^"]+)":/g, (match, key) => `${chalk.cyan(`"${key}":`)}`)
      // String values
      .replace(/: "([^"]*)"/g, (match, value) => `: ${chalk.green(`"${value}"`)}`)
      // Numbers
      .replace(/: (\d+\.?\d*)/g, (match, num) => `: ${chalk.yellow(num)}`)
      // Booleans
      .replace(/: (true|false)/g, (match, bool) => `: ${bool === 'true' ? chalk.magenta('true') : chalk.magenta('false')}`)
      // Null
      .replace(/: null/g, `: ${chalk.gray('null')}`);
  }

  private outputTable(data: any, fields?: string[]): void {
    if (!data) {
      console.log('No data');
      return;
    }

    // Handle paginated responses with 'data' property
    let items = data;
    let pagination: any = {};

    if (data.data && Array.isArray(data.data)) {
      items = data.data;
      // Handle both old format (count/page/per_page at root) and new format (nested in pagination object)
      const paginationSource = data.pagination || data;
      pagination = {
        count: paginationSource.count || data.count,
        page: paginationSource.page || data.page,
        perPage: paginationSource.per_page || data.per_page,
        totalPages: (paginationSource.count || data.count) && (paginationSource.per_page || data.per_page)
          ? Math.ceil((paginationSource.count || data.count) / (paginationSource.per_page || data.per_page))
          : undefined
      };
    }

    // Ensure we have an array
    items = Array.isArray(items) ? items : [items];

    // Filter out undefined/null items
    items = items.filter((item: any) => item !== null && item !== undefined);

    if (items.length === 0) {
      console.log(chalk.gray('No results'));
      return;
    }

    // Show enhanced pagination info
    this.displayPaginationHeader(pagination, items.length);

    // Determine which fields to show
    const keys = fields || this.getDisplayFields(items[0]);

    const tableOptions: any = {
      head: keys.map(k => chalk.cyan.bold(k)),
      style: {
        head: [],
        border: ['gray']
      }
    };

    // Only add colWidths if we have specific widths to set
    const colWidths = this.calculateColumnWidths(items, keys);
    if (colWidths) {
      tableOptions.colWidths = colWidths;
    }

    const table = new Table(tableOptions);

    items.forEach((item: any) => {
      table.push(keys.map(k => this.formatTableValue(item, k)));
    });

    console.log(table.toString());

    // Show pagination footer with hints
    this.displayPaginationFooter(pagination);
  }

  /**
   * Display pagination header with item counts
   */
  private displayPaginationHeader(pagination: any, itemCount: number): void {
    if (!pagination.count) return;

    const start = ((pagination.page || 1) - 1) * (pagination.perPage || itemCount) + 1;
    const end = start + itemCount - 1;

    const parts = [
      chalk.gray(`Showing ${chalk.white(`${this.formatNumber(start)}-${this.formatNumber(end)}`)} of ${chalk.white(this.formatNumber(pagination.count))}`),
    ];

    if (pagination.totalPages) {
      parts.push(chalk.gray(`• Page ${chalk.white(pagination.page || 1)} of ${chalk.white(pagination.totalPages)}`));
    }

    console.log(parts.join(' '));
    console.log(); // Empty line for spacing
  }

  /**
   * Display pagination footer with navigation hints
   */
  private displayPaginationFooter(pagination: any): void {
    if (!pagination.totalPages || pagination.totalPages <= 1) return;

    const currentPage = pagination.page || 1;
    const hasNext = currentPage < pagination.totalPages;
    const hasPrev = currentPage > 1;

    if (hasNext || hasPrev) {
      console.log(); // Empty line for spacing
      const hints: string[] = [];

      if (hasPrev) {
        hints.push(chalk.gray(`Previous: ${chalk.cyan(`--page ${currentPage - 1}`)}`));
      }
      if (hasNext) {
        hints.push(chalk.gray(`Next: ${chalk.cyan(`--page ${currentPage + 1}`)}`));
      }

      console.log(chalk.gray('💡 ') + hints.join(' • '));
    }
  }

  /**
   * Calculate optimal column widths
   */
  private calculateColumnWidths(items: any[], keys: string[]): number[] | undefined {
    // Let cli-table3 handle width automatically for now
    // Could implement smart width calculation in the future
    return undefined;
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
    let pagination: any = {};

    if (data.data && Array.isArray(data.data)) {
      items = data.data;
      // Handle both old format (count/page/per_page at root) and new format (nested in pagination object)
      const paginationSource = data.pagination || data;
      pagination = {
        count: paginationSource.count || data.count,
        page: paginationSource.page || data.page,
        perPage: paginationSource.per_page || data.per_page,
        totalPages: (paginationSource.count || data.count) && (paginationSource.per_page || data.per_page)
          ? Math.ceil((paginationSource.count || data.count) / (paginationSource.per_page || data.per_page))
          : undefined
      };
    }

    if (Array.isArray(items)) {
      // Show enhanced pagination for lists
      if (pagination.count) {
        const start = ((pagination.page || 1) - 1) * (pagination.perPage || items.length) + 1;
        const end = start + items.length - 1;
        console.log(chalk.gray(`Showing ${chalk.white(`${this.formatNumber(start)}-${this.formatNumber(end)}`)} of ${chalk.white(this.formatNumber(pagination.count))}`));
        console.log();
      }

      items.forEach(item => {
        // Build compact line with status badge
        const idStr = item.id ? chalk.yellow(item.id.toString().padStart(6)) : '';
        const separator = chalk.gray('│');

        // Main content (name/email/subject)
        let mainContent = '';
        if (item.name) {
          mainContent = chalk.bold.white(item.name);
        } else if (item.email) {
          mainContent = chalk.bold.white(item.email);
        } else if (item.subject) {
          mainContent = chalk.bold.white(item.subject);
        } else {
          mainContent = this.compactObjectSummary(item);
        }

        // Status badge
        let statusBadge = '';
        if (item.status) {
          statusBadge = ' ' + this.formatStatus(item.status);
        } else if (item.confirmed !== undefined) {
          statusBadge = item.confirmed ? chalk.green(' ✓') : chalk.yellow(' ⏳');
        }

        // Additional metadata (dates, etc.)
        let metadata = '';
        if (item.created_on || item.updated_on || item.scheduled_for) {
          const dateField = item.scheduled_for || item.updated_on || item.created_on;
          metadata = chalk.gray(` • ${this.formatDate(dateField)}`);
        }

        console.log(`${idStr} ${separator} ${mainContent}${statusBadge}${metadata}`);
      });

      // Show pagination footer
      if (pagination.totalPages && pagination.totalPages > 1) {
        console.log();
        const currentPage = pagination.page || 1;
        const hints: string[] = [];

        if (currentPage > 1) {
          hints.push(chalk.gray(`Previous: ${chalk.cyan(`--page ${currentPage - 1}`)}`));
        }
        if (currentPage < pagination.totalPages) {
          hints.push(chalk.gray(`Next: ${chalk.cyan(`--page ${currentPage + 1}`)}`));
        }

        if (hints.length > 0) {
          console.log(chalk.gray('💡 ') + hints.join(' • '));
        }
      }
    } else if (typeof items === 'object' && items !== null) {
      // Single object - show key details in a compact card format
      const obj = items;

      // Header with ID and name/email/subject
      const idStr = obj.id ? chalk.yellow(obj.id.toString()) : '';
      const separator = chalk.gray('│');

      let mainContent = '';
      if (obj.name) {
        mainContent = chalk.bold.white(obj.name);
      } else if (obj.email) {
        mainContent = chalk.bold.white(obj.email);
      } else if (obj.subject) {
        mainContent = chalk.bold.white(obj.subject);
      } else {
        mainContent = chalk.bold('Details');
      }

      let statusBadge = '';
      if (obj.status) {
        statusBadge = ' ' + this.formatStatus(obj.status);
      } else if (obj.confirmed !== undefined) {
        statusBadge = obj.confirmed ? chalk.green(' ✓ Confirmed') : chalk.yellow(' ⏳ Pending');
      }

      console.log(`${idStr} ${separator} ${mainContent}${statusBadge}`);
      console.log();

      // Show other important fields
      const importantFields = ['created_on', 'updated_on', 'scheduled_for', 'type', 'language', 'list_id', 'sender_id', 'template_id'];
      const shownFields = new Set(['id', 'name', 'email', 'subject', 'status', 'confirmed']);

      Object.entries(obj).forEach(([key, value]) => {
        if (shownFields.has(key)) return;
        if (value === null || value === undefined) return;

        // Show important fields or simple values
        if (importantFields.includes(key) || (typeof value !== 'object' && typeof value !== 'function')) {
          if (typeof value === 'object') {
            // Skip nested objects in compact view
            return;
          }

          let formattedValue = this.formatValue(value);

          // Apply special formatting for dates and numbers
          if (key.includes('_on') || key.includes('_at') || key.includes('date')) {
            formattedValue = this.formatDate(value);
          } else if (typeof value === 'number') {
            formattedValue = chalk.yellow(this.formatNumber(value));
          }

          console.log(`  ${chalk.gray(key.padEnd(18))} ${chalk.gray('│')} ${formattedValue}`);
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

  /**
   * Format value for table display with enhanced colors and formatting
   */
  private formatTableValue(item: any, key: string): string {
    const value = item[key];

    // Handle null/undefined
    if (value === null || value === undefined) return chalk.gray('—');

    // Status field - apply status-specific colors
    if (key === 'status') {
      return this.formatStatus(value);
    }

    // Confirmed field (for senders)
    if (key === 'confirmed') {
      return value ? chalk.green('✓ Yes') : chalk.yellow('⏳ Pending');
    }

    // Boolean values
    if (typeof value === 'boolean') {
      return value ? chalk.green('✓') : chalk.gray('✗');
    }

    // Date fields - format with relative time
    if (key.includes('_on') || key.includes('_at') || key.includes('date')) {
      return this.formatDate(value);
    }

    // Numbers - format with commas
    if (typeof value === 'number') {
      return chalk.yellow(this.formatNumber(value));
    }

    // Objects/arrays - truncate
    if (typeof value === 'object') {
      const str = JSON.stringify(value);
      return str.length > 50 ? chalk.gray(str.substring(0, 47) + '...') : chalk.gray(str);
    }

    // Strings - truncate if too long
    const str = String(value);
    if (str.length > 60) {
      return str.substring(0, 57) + '...';
    }

    return str;
  }

  /**
   * Format status with color-coded badges
   */
  private formatStatus(status: string): string {
    const statusLower = String(status).toLowerCase();

    // Campaign statuses
    if (statusLower === 'draft') return chalk.gray('⚪ draft');
    if (statusLower === 'scheduled') return chalk.blue('🔵 scheduled');
    if (statusLower === 'sending') return chalk.yellow('🟡 sending');
    if (statusLower === 'sent' || statusLower === 'delivered') return chalk.green('🟢 sent');
    if (statusLower === 'failed') return chalk.red('🔴 failed');
    if (statusLower === 'cancelled') return chalk.gray('⚫ cancelled');
    if (statusLower === 'suspended') return chalk.yellow('🟠 suspended');

    // Contact statuses
    if (statusLower === 'active') return chalk.green('✓ active');
    if (statusLower === 'unsubscribed') return chalk.gray('✗ unsubscribed');
    if (statusLower === 'bounced') return chalk.red('⚠ bounced');

    // Default - just colorize
    return chalk.white(status);
  }

  /**
   * Format date based on profile settings
   */
  private formatDate(dateString: any): string {
    if (!dateString) return this.applyColor('—', chalk.gray);

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);

      const dateFormat = this.getProfileConfig()?.display.date_format || 'relative';

      switch (dateFormat) {
        case 'iso8601':
          return this.formatDateISO(date);
        case 'friendly':
          return this.formatDateFriendly(date);
        case 'relative':
        default:
          return this.formatDateRelative(date);
      }
    } catch {
      return String(dateString);
    }
  }

  /**
   * Format date as ISO 8601 (for developer profile)
   */
  private formatDateISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date in friendly format (for balanced profile)
   * Example: "Oct 12, 2025 10:30 AM"
   */
  private formatDateFriendly(date: Date): string {
    const now = new Date();
    const diffDay = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Show relative for very recent dates
    if (diffDay === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return this.applyColor(`Today ${displayHours}:${minutes} ${ampm}`, chalk.gray);
    } else if (diffDay === 1) {
      return this.applyColor('Yesterday', chalk.gray);
    } else if (diffDay === -1) {
      return this.applyColor('Tomorrow', chalk.gray);
    }

    // Format: "Oct 12, 2025"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return this.applyColor(`${month} ${day}, ${year}`, chalk.gray);
  }

  /**
   * Format date with relative time (for marketer profile)
   * Example: "2 hours ago"
   */
  private formatDateRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    // Show relative time for recent dates
    if (diffSec < 60) return this.applyColor('just now', chalk.gray);
    if (diffMin < 60) return this.applyColor(`${diffMin}m ago`, chalk.gray);
    if (diffHour < 24) return this.applyColor(`${diffHour}h ago`, chalk.gray);
    if (diffDay < 7) return this.applyColor(`${diffDay}d ago`, chalk.gray);

    // Show formatted date for older dates
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return this.applyColor(`${year}-${month}-${day}`, chalk.gray);
  }

  /**
   * Format number with thousands separator
   */
  private formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  /**
   * Legacy formatValue for compact mode
   */
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
