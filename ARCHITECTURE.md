# Cakemail CLI Architecture

## Overview

The Cakemail CLI is built from the Cakemail OpenAPI specification using TypeScript and Commander.js. It provides a type-safe, user-friendly command-line interface for interacting with the Cakemail API.

## Project Structure

```
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── client.ts              # API client with authentication
│   ├── commands/              # Command modules
│   │   ├── campaigns.ts       # Campaign management commands
│   │   ├── lists.ts           # List management commands
│   │   ├── contacts.ts        # Contact management commands
│   │   └── senders.ts         # Sender management commands
│   └── utils/
│       ├── config.ts          # Configuration and credentials
│       └── output.ts          # Output formatting (JSON/table/compact)
├── dist/                      # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Key Components

### 1. API Client (`client.ts`)

- Handles HTTP requests to the Cakemail API
- Manages authentication (API key or email/password)
- Automatic token refresh
- Error handling and formatting

### 2. Command Modules (`commands/`)

Each command module:
- Uses Commander.js to define CLI commands
- Receives a `CakemailClient` instance
- Receives an `OutputFormatter` instance
- Implements CRUD operations for a specific resource
- Provides user-friendly options and flags

### 3. Output Formatting (`utils/output.ts`)

Supports three output formats:
- **JSON**: Full API response (default)
- **Table**: Tabular view with column headers
- **Compact**: Minimal ID and name view

### 4. Configuration (`utils/config.ts`)

Loads credentials from:
1. Environment variables
2. `.env` file
3. CLI flags (highest priority)

## Authentication

The CLI supports two authentication methods:

1. **API Token** (recommended for production):
   ```bash
   CAKEMAIL_API_KEY=your_token
   ```

2. **Email/Password** (uses `/token` endpoint):
   ```bash
   CAKEMAIL_EMAIL=your@email.com
   CAKEMAIL_PASSWORD=your_password
   ```

## Adding New Commands

To add a new command module:

1. Create `src/commands/resource.ts`:
```typescript
import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createResourceCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const resource = new Command('resource')
    .description('Manage resources');

  resource
    .command('list')
    .description('List all resources')
    .action(async () => {
      const spinner = ora('Fetching resources...').start();
      try {
        const data = await client.get('/resources');
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return resource;
}
```

2. Add to `src/cli.ts`:
```typescript
import { createResourceCommand } from './commands/resource.js';

// In main():
program.addCommand(createResourceCommand(client, formatter));
```

3. Rebuild:
```bash
npm run build
```

## Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Rebuild**: `npm run build`
3. **Test locally**: `node dist/cli.js <command>`
4. **Use watch mode**: `npm run dev` (auto-rebuilds on changes)

## OpenAPI Integration

The CLI is designed to map directly to the Cakemail OpenAPI spec:

- Each OpenAPI tag becomes a command group (e.g., `campaigns`, `lists`)
- Each operation becomes a subcommand (e.g., `list`, `get`, `create`)
- Operation parameters become command options
- Path parameters become command arguments

### Future: Auto-Generation

The current implementation is hand-crafted for the most common operations. Future versions could include:

1. **Type Generation**:
   ```bash
   npm run generate:types
   # Uses openapi-typescript to generate src/types/api.ts
   ```

2. **Command Generation**:
   - Parse OpenAPI spec
   - Generate command modules automatically
   - Include parameter validation from schemas

## Dependencies

### Production
- `commander`: CLI framework
- `axios`: HTTP client
- `chalk`: Terminal colors
- `ora`: Loading spinners
- `cli-table3`: Table formatting
- `dotenv`: Environment variable loading

### Development
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `openapi-typescript`: OpenAPI type generation (future)

## Error Handling

The CLI provides helpful error messages:

1. **Missing credentials**: Shows how to configure
2. **API errors**: Displays HTTP status and error message
3. **Validation errors**: Shows which parameters are missing

## Testing

To test the CLI with actual API calls:

1. Set up credentials:
   ```bash
   cp .env.example .env
   # Edit .env
   ```

2. Test commands:
   ```bash
   # List campaigns
   node dist/cli.js campaigns list

   # Get campaign in table format
   node dist/cli.js -f table campaigns get 123

   # Create a list
   node dist/cli.js lists create -n "Test List"
   ```

## Publishing

To publish to npm:

1. Update version in `package.json`
2. Build: `npm run build`
3. Publish: `npm publish --access public`

Users can then install globally:
```bash
npm install -g @cakemail/cli
cakemail campaigns list
```

## Current Implementation Status

### ✅ Implemented
- Campaigns: list, get, create, schedule, test, delete
- Lists: list, get, create, delete
- Contacts: list, get, add, update, delete, unsubscribe
- Senders: list, get, create, delete
- Authentication (API key and email/password)
- Output formatting (JSON, table, compact)
- Error handling
- Help system

### 🚧 Future Enhancements
- Reports commands
- Templates commands
- Workflows commands
- Segments commands
- Custom attributes commands
- Batch operations
- Interactive mode
- Config file support
- Auto-completion
- Progress bars for long operations
- Export/import commands
- Webhook management

## API Coverage

Currently implements ~25 of 149 available endpoints, focusing on the most commonly used operations for campaigns, lists, contacts, and senders.
