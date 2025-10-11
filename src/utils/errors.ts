import chalk from 'chalk';
import { ProfileConfig } from '../types/profile.js';

/**
 * Enhanced error handling with user-friendly messages and suggestions
 */

export interface ErrorContext {
  command: string;
  resource?: string;
  resourceId?: string | number;
  operation?: string;
  profileConfig?: ProfileConfig;
}

export interface EnhancedError {
  message: string;
  suggestion?: string;
  help?: string;
  docsUrl?: string;
}

/**
 * Common HTTP status codes and their user-friendly messages
 */
const HTTP_ERROR_MESSAGES: Record<number, (context: ErrorContext) => EnhancedError> = {
  400: (ctx) => ({
    message: 'Invalid request parameters',
    suggestion: ctx.operation
      ? `Check the parameters for '${ctx.operation}' operation`
      : 'Please check your command arguments and try again',
    help: 'Use --help to see available options'
  }),

  401: (ctx) => ({
    message: 'Authentication failed',
    suggestion: 'Your credentials are invalid or expired',
    help: [
      'To re-authenticate, run: cakemail account logout --force',
      'Then run any command to authenticate again',
      'Or check your .env file credentials'
    ].join('\n')
  }),

  403: (ctx) => ({
    message: 'Permission denied',
    suggestion: ctx.resource
      ? `You don't have permission to access this ${ctx.resource}`
      : 'You don\'t have permission to perform this action',
    help: ctx.resourceId
      ? `Check if ${ctx.resource} ${ctx.resourceId} exists and you have access`
      : 'Verify your account permissions'
  }),

  404: (ctx) => ({
    message: ctx.resource
      ? `${capitalize(ctx.resource)} not found`
      : 'Resource not found',
    suggestion: ctx.resourceId && ctx.resource
      ? `${capitalize(ctx.resource)} with ID '${ctx.resourceId}' doesn't exist`
      : `The requested ${ctx.resource || 'resource'} doesn't exist`,
    help: getListCommandSuggestion(ctx.resource)
  }),

  409: (ctx) => ({
    message: 'Conflict - resource already exists',
    suggestion: ctx.resource
      ? `This ${ctx.resource} already exists or conflicts with existing data`
      : 'The resource already exists',
    help: 'Try updating the existing resource instead of creating a new one'
  }),

  422: (ctx) => ({
    message: 'Validation error',
    suggestion: 'One or more fields have invalid values',
    help: 'Check the error details above for specific field errors'
  }),

  429: (ctx) => ({
    message: 'Rate limit exceeded',
    suggestion: 'You\'re making too many requests',
    help: 'Wait a moment before trying again, or reduce request frequency'
  }),

  500: (ctx) => ({
    message: 'Server error',
    suggestion: 'Something went wrong on the Cakemail server',
    help: 'This is not your fault. Please try again in a few moments or contact support'
  }),

  502: (ctx) => ({
    message: 'Bad gateway',
    suggestion: 'The Cakemail API is temporarily unavailable',
    help: 'Please try again in a few moments'
  }),

  503: (ctx) => ({
    message: 'Service unavailable',
    suggestion: 'The Cakemail API is temporarily down for maintenance',
    help: 'Please try again later'
  })
};

/**
 * Common error patterns and their user-friendly messages
 */
const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  handler: (match: RegExpMatchArray, context: ErrorContext) => EnhancedError;
}> = [
  {
    pattern: /network|ECONNREFUSED|ENOTFOUND|timeout/i,
    handler: (match, ctx) => ({
      message: 'Network connection error',
      suggestion: 'Unable to connect to the Cakemail API',
      help: [
        'Check your internet connection',
        'Verify the API endpoint is correct',
        'Check if there\'s a firewall blocking the connection'
      ].join('\n')
    })
  },
  {
    pattern: /email.*required|invalid.*email/i,
    handler: (match, ctx) => ({
      message: 'Invalid email address',
      suggestion: 'Please provide a valid email address',
      help: 'Example: user@example.com'
    })
  },
  {
    pattern: /list.*not.*found/i,
    handler: (match, ctx) => ({
      message: 'List not found',
      suggestion: ctx.resourceId
        ? `List ${ctx.resourceId} doesn't exist or you don't have access`
        : 'The specified list doesn\'t exist',
      help: 'Use: cakemail lists list    to see all available lists'
    })
  },
  {
    pattern: /campaign.*not.*found/i,
    handler: (match, ctx) => ({
      message: 'Campaign not found',
      suggestion: ctx.resourceId
        ? `Campaign ${ctx.resourceId} doesn't exist or you don't have access`
        : 'The specified campaign doesn\'t exist',
      help: 'Use: cakemail campaigns list    to see all campaigns'
    })
  },
  {
    pattern: /contact.*not.*found/i,
    handler: (match, ctx) => ({
      message: 'Contact not found',
      suggestion: ctx.resourceId
        ? `Contact ${ctx.resourceId} doesn't exist in this list`
        : 'The specified contact doesn\'t exist',
      help: 'Use: cakemail contacts list <list-id>    to see contacts'
    })
  },
  {
    pattern: /Missing.*CAKEMAIL/i,
    handler: (match, ctx) => ({
      message: 'Missing credentials',
      suggestion: 'Authentication credentials are not configured',
      help: [
        'Set credentials in .env file or environment variables:',
        '  CAKEMAIL_EMAIL=your@email.com',
        '  CAKEMAIL_PASSWORD=your_password',
        '',
        'Or run any command to authenticate interactively'
      ].join('\n')
    })
  }
];

/**
 * Get list command suggestion for a resource type
 */
function getListCommandSuggestion(resource?: string): string | undefined {
  if (!resource) return undefined;

  const commands: Record<string, string> = {
    'list': 'cakemail lists list',
    'campaign': 'cakemail campaigns list',
    'contact': 'cakemail contacts list <list-id>',
    'sender': 'cakemail senders list',
    'template': 'cakemail templates list',
    'webhook': 'cakemail webhooks list',
    'segment': 'cakemail segments list <list-id>',
    'attribute': 'cakemail attributes list <list-id>'
  };

  const command = commands[resource.toLowerCase()];
  return command ? `To see all ${resource}s, use: ${command}` : undefined;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse API error response
 */
function parseApiError(error: any): { statusCode?: number; message: string; details?: any } {
  // Check for SDK/Axios error structure
  if (error.response) {
    return {
      statusCode: error.response.status,
      message: error.response.data?.message || error.response.data?.error || error.message,
      details: error.response.data
    };
  }

  // Check for SDK ApiError structure
  if (error.status) {
    return {
      statusCode: error.status,
      message: error.body?.message || error.message,
      details: error.body
    };
  }

  // Fallback to error message
  return {
    message: error.message || 'An unknown error occurred'
  };
}

/**
 * Enhance error with user-friendly message and suggestions
 */
export function enhanceError(error: any, context: ErrorContext): EnhancedError {
  const parsed = parseApiError(error);

  // Try HTTP status code mapping first
  if (parsed.statusCode && HTTP_ERROR_MESSAGES[parsed.statusCode]) {
    const enhanced = HTTP_ERROR_MESSAGES[parsed.statusCode](context);

    // Add validation details for 422 errors
    if (parsed.statusCode === 422 && parsed.details?.errors) {
      enhanced.suggestion = formatValidationErrors(parsed.details.errors);
    }

    return enhanced;
  }

  // Try pattern matching
  for (const { pattern, handler } of ERROR_PATTERNS) {
    const match = parsed.message.match(pattern);
    if (match) {
      return handler(match, context);
    }
  }

  // Fallback to original error message
  return {
    message: parsed.message,
    suggestion: 'An unexpected error occurred',
    help: 'If this persists, please report it at: https://github.com/cakemail/cli/issues'
  };
}

/**
 * Format validation errors from API response
 */
function formatValidationErrors(errors: any): string {
  if (Array.isArray(errors)) {
    return errors.map(err => {
      if (typeof err === 'string') return err;
      if (err.field && err.message) return `${err.field}: ${err.message}`;
      if (err.loc && err.msg) return `${err.loc.join('.')}: ${err.msg}`;
      return JSON.stringify(err);
    }).join('\n');
  }

  if (typeof errors === 'object') {
    return Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');
  }

  return String(errors);
}

/**
 * Display enhanced error to user (profile-aware)
 */
export function displayError(error: any, context: ErrorContext): void {
  const enhanced = enhanceError(error, context);
  const profile = context.profileConfig;
  const verboseErrors = profile?.display.verbose_errors ?? false;
  const showApiDetails = profile?.display.show_api_details ?? false;

  // For developer profile: show technical details
  if (verboseErrors && showApiDetails) {
    displayDeveloperError(error, enhanced, context);
  } else {
    // For marketer/balanced profile: show friendly error
    displayFriendlyError(enhanced, context);
  }
}

/**
 * Display friendly error message (marketer/balanced profile)
 */
function displayFriendlyError(enhanced: EnhancedError, context: ErrorContext): void {
  // Main error message
  console.error(chalk.red('✗ Oops!'), chalk.bold(enhanced.message));

  // Suggestion
  if (enhanced.suggestion) {
    console.error(chalk.yellow('\n→'), enhanced.suggestion);
  }

  // Help text
  if (enhanced.help) {
    console.error(chalk.gray('\n💡 What you can do:'));
    enhanced.help.split('\n').forEach(line => {
      console.error(chalk.gray('  ' + line));
    });
  }

  // Docs URL
  if (enhanced.docsUrl) {
    console.error(chalk.cyan('\n📖 Learn more:'), enhanced.docsUrl);
  }

  console.error(''); // Empty line for spacing
}

/**
 * Display technical error message (developer profile)
 */
function displayDeveloperError(error: any, enhanced: EnhancedError, context: ErrorContext): void {
  const parsed = parseApiError(error);

  // Main error message
  console.error(chalk.red('Error:'), enhanced.message);

  // Status code and details
  if (parsed.statusCode) {
    console.error(chalk.gray(`Status: ${parsed.statusCode}`));
  }

  if (context.operation) {
    console.error(chalk.gray(`Operation: ${context.operation}`));
  }

  if (context.resource && context.resourceId) {
    console.error(chalk.gray(`Resource: ${context.resource} (${context.resourceId})`));
  }

  // API response details
  if (parsed.details) {
    console.error(chalk.gray('\nAPI Response:'));
    console.error(chalk.gray(JSON.stringify(parsed.details, null, 2)));
  }

  // Suggestion
  if (enhanced.suggestion) {
    console.error(chalk.yellow('\nSuggestion:'), enhanced.suggestion);
  }

  // Help text
  if (enhanced.help) {
    console.error(chalk.gray('\nHelp:'));
    enhanced.help.split('\n').forEach(line => {
      console.error(chalk.gray('  ' + line));
    });
  }

  console.error(''); // Empty line for spacing
}

/**
 * Validation helpers
 */
export const validate = {
  /**
   * Validate email format
   */
  email(email: string): { valid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        error: `Invalid email format: ${email}`
      };
    }
    return { valid: true };
  },

  /**
   * Validate ID is a positive integer
   */
  id(id: string | number, resourceName: string = 'ID'): { valid: boolean; error?: string } {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId) || numId <= 0) {
      return {
        valid: false,
        error: `${resourceName} must be a positive number, got: ${id}`
      };
    }
    return { valid: true };
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  date(date: string): { valid: boolean; error?: string } {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return {
        valid: false,
        error: `Invalid date format: ${date}. Expected: YYYY-MM-DD (e.g., 2025-01-15)`
      };
    }

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return {
        valid: false,
        error: `Invalid date: ${date}`
      };
    }

    return { valid: true };
  },

  /**
   * Validate required field
   */
  required(value: any, fieldName: string): { valid: boolean; error?: string } {
    if (value === undefined || value === null || value === '') {
      return {
        valid: false,
        error: `${fieldName} is required`
      };
    }
    return { valid: true };
  },

  /**
   * Validate JSON string
   */
  json(jsonString: string, fieldName: string = 'JSON'): { valid: boolean; error?: string; parsed?: any } {
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, parsed };
    } catch (e) {
      return {
        valid: false,
        error: `Invalid ${fieldName}: ${(e as Error).message}`
      };
    }
  }
};
