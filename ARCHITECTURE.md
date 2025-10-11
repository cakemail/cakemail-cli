# Cakemail CLI Architecture

## Overview

The Cakemail CLI is built on the official [@cakemail-org/cakemail-sdk](https://www.npmjs.com/package/@cakemail-org/cakemail-sdk) v2.0, providing a type-safe, developer-friendly command-line interface for the Cakemail email marketing platform. The CLI wraps the SDK to deliver intuitive commands while maintaining 100% API coverage through direct SDK access.

**Current Version:** 1.2.0
**SDK Version:** @cakemail-org/cakemail-sdk v2.0.0
**Package Name:** @cakemail-org/cakemail-cli
**Binary Name:** `cakemail`

## Project Structure

```
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── client.ts              # SDK wrapper with configuration
│   ├── commands/              # Command modules
│   │   ├── campaigns.ts       # Campaign management (15 commands)
│   │   ├── lists.ts           # List management (4 commands)
│   │   ├── contacts.ts        # Contact management (6 commands)
│   │   ├── senders.ts         # Sender management (7 commands)
│   │   ├── templates.ts       # Template management (6 commands)
│   │   ├── webhooks.ts        # Webhook management (6 commands)
│   │   └── emails.ts          # Email API v2 (3 commands)
│   └── utils/
│       ├── config.ts          # Configuration and credentials
│       └── output.ts          # Output formatting (JSON/table/compact)
├── dist/                      # Compiled JavaScript
├── cakemail.rb                # Homebrew formula
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── HOMEBREW.md
```

## Key Components

### 1. SDK Wrapper (`client.ts`)

The `CakemailClient` class wraps the official Cakemail SDK, providing:
- Authentication configuration (email/password or access token)
- SDK instance exposure via `client.sdk`
- Consistent error handling
- Base URL configuration

```typescript
import { CakemailClient as SDK } from '@cakemail-org/cakemail-sdk';

export class CakemailClient {
  public sdk: SDK;

  constructor(config: CakemailConfig) {
    this.sdk = new SDK({
      email: config.email,
      password: config.password,
      baseURL: config.baseURL || 'https://api.cakemail.dev'
    });
  }
}
```

**Key Design Decision:** The CLI doesn't implement HTTP calls directly—it delegates to the SDK. This ensures:
- Type safety from SDK's TypeScript definitions
- Automatic updates when SDK adds features
- Consistency with other SDK consumers
- Reliability (SDK is thoroughly tested)

### 2. Command Modules (`commands/`)

Each command module:
- Uses Commander.js to define CLI commands
- Receives a `CakemailClient` instance (which exposes the SDK)
- Receives an `OutputFormatter` instance
- Calls SDK methods via `client.sdk.serviceName.method()`
- Provides user-friendly options and flags

**SDK 2.0 Object-Based API Pattern:**
```typescript
// All SDK methods use object parameters
const data = await client.sdk.senderService.createSender({
  requestBody: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});

// Pagination uses camelCase
const campaigns = await client.sdk.campaigns.list({
  perPage: 50,
  page: 2,
  sort: '-created_on'
});
```

### 3. Output Formatting (`utils/output.ts`)

Supports three output formats:
- **JSON**: Full API response (default) - pipeable to jq, scripts
- **Table**: Tabular view with column headers - human-readable
- **Compact**: Minimal ID and name view - quick scanning

Format selection priority:
1. CLI flag: `cakemail -f table campaigns list`
2. Environment variable: `CAKEMAIL_OUTPUT_FORMAT=compact`
3. Default: `json`

### 4. Configuration (`utils/config.ts`)

Loads credentials from (priority order):
1. CLI flags: `--email`, `--password`, `--access-token`
2. Environment variables: `CAKEMAIL_EMAIL`, `CAKEMAIL_PASSWORD`, `CAKEMAIL_ACCESS_TOKEN`
3. `.env` file (loaded from current working directory)

**Security Note:** Credentials are never stored persistently. The CLI reads them on each invocation.

## Authentication

The CLI supports two authentication methods via the SDK:

1. **Email/Password** (OAuth2 Password Grant):
   ```bash
   CAKEMAIL_EMAIL=your@email.com
   CAKEMAIL_PASSWORD=your_password
   ```
   The SDK automatically obtains and refreshes OAuth2 tokens.

2. **Access Token** (for CI/CD):
   ```bash
   CAKEMAIL_ACCESS_TOKEN=your_token
   ```

The SDK handles token management, expiration, and refresh automatically.

## SDK Integration Architecture

### Why SDK-Based vs Direct HTTP?

**SDK Approach (Current):**
- ✅ Type safety from SDK TypeScript definitions
- ✅ Automatic API updates (SDK updates = CLI updates)
- ✅ Tested, reliable HTTP layer
- ✅ Consistent error handling
- ✅ OAuth2 complexity abstracted
- ✅ 100% API coverage available

**Direct HTTP Approach (Previous):**
- ❌ Manual type definitions
- ❌ Manual OAuth2 implementation
- ❌ Breaking when API changes
- ❌ Duplicate maintenance burden

### SDK Services Used

The SDK provides two API styles:

**1. Legacy Resources (v1 compatibility):**
```typescript
client.sdk.campaigns.list(params)
client.sdk.lists.create(payload)
client.sdk.contacts.get(id)
```

**2. Generated Services (v2, object-based):**
```typescript
client.sdk.campaignService.listCampaigns({ perPage: 50 })
client.sdk.senderService.createSender({ requestBody: {...} })
client.sdk.templateService.getTemplate({ templateId: 123 })
```

The CLI uses the most appropriate style for each resource.

## Adding New Commands

To add a new command leveraging the SDK:

### 1. Create Command Module

`src/commands/reports.ts`:
```typescript
import { Command } from 'commander';
import { CakemailClient } from '../client.js';
import { OutputFormatter } from '../utils/output.js';
import ora from 'ora';

export function createReportsCommand(
  client: CakemailClient,
  formatter: OutputFormatter
): Command {
  const reports = new Command('reports')
    .description('Campaign analytics and reporting');

  reports
    .command('campaign <campaign-id>')
    .description('Get campaign analytics report')
    .action(async (campaignId) => {
      const spinner = ora('Fetching campaign report...').start();
      try {
        // Use SDK service directly
        const data = await client.sdk.reportService.getCampaignReport({
          campaignId: parseInt(campaignId)
        });
        spinner.stop();
        formatter.output(data);
      } catch (error: any) {
        spinner.stop();
        formatter.error(error.message);
        process.exit(1);
      }
    });

  return reports;
}
```

### 2. Register in CLI

`src/cli.ts`:
```typescript
import { createReportsCommand } from './commands/reports.js';

// In main():
program.addCommand(createReportsCommand(client, formatter));
```

### 3. Rebuild and Test

```bash
npm run build
cakemail reports campaign 123
```

## Development Workflow

### Local Development

1. **Install dependencies**: `npm install`
2. **Make changes** to TypeScript files in `src/`
3. **Build**: `npm run build`
4. **Test**: `node dist/cli.js <command>` or `cakemail <command>` if installed globally
5. **Watch mode**: `npm run dev` (auto-rebuilds on changes)

### Testing Workflow

```bash
# Set up test credentials
cp .env.example .env
# Edit .env with dev/test credentials

# Test commands
cakemail campaigns list
cakemail -f table senders list
cakemail contacts add 123 -e test@example.com

# Test output formats
cakemail campaigns list | jq '.data[0].name'
cakemail -f compact lists list
```

### Building for Distribution

```bash
# Clean build
npm run clean && npm run build

# Test binary
./dist/cli.js --version

# Test installation
npm pack
npm install -g ./cakemail-org-cakemail-cli-1.2.0.tgz
cakemail --version
```

## Distribution

The CLI is distributed via three channels:

### 1. npm
```bash
npm install -g @cakemail-org/cakemail-cli
```

**Publishing:**
```bash
npm version patch  # or minor, major
npm run build
npm publish --access public
```

### 2. Homebrew
```bash
brew tap cakemail/cakemail
brew install cakemail-cli
```

**Updating Formula:**
```bash
# Get new tarball SHA256
curl -sL https://registry.npmjs.org/@cakemail-org/cakemail-cli/-/cakemail-cli-VERSION.tgz | shasum -a 256

# Update ~/homebrew-cakemail/Formula/cakemail-cli.rb
# Update URL and SHA256
# Commit and push
```

### 3. npx (no installation)
```bash
npx @cakemail-org/cakemail-cli campaigns list
```

## Dependencies

### Production Dependencies
- **@cakemail-org/cakemail-sdk**: Official SDK with 100% API coverage
- **commander**: CLI framework with subcommands and help
- **chalk**: Terminal colors for better UX
- **ora**: Loading spinners for async operations
- **cli-table3**: Table formatting
- **dotenv**: Environment variable loading from .env files

### Development Dependencies
- **typescript**: TypeScript compiler
- **@types/node**: Node.js type definitions

### Dependency Strategy
- Minimal, well-maintained dependencies
- No build-time transpilation beyond TypeScript
- All dependencies are mature open-source projects

## Error Handling

The CLI provides helpful error messages at multiple levels:

### 1. Configuration Errors
```
Error: Email and password are required for SDK authentication

Tip: Set credentials in environment variables or .env file:
  CAKEMAIL_EMAIL=your@email.com
  CAKEMAIL_PASSWORD=your_password
```

### 2. API Errors
```
Error: Campaign not found (404)
Failed to retrieve campaign with ID: 12345
```

### 3. Validation Errors
```
Error: Missing required option: --email
Try: cakemail contacts add 123 --email test@example.com
```

### Exit Codes
- **0**: Success
- **1**: Error (configuration, API, validation, etc.)

## Version Strategy

The CLI follows [Semantic Versioning](https://semver.org/):

- **Patch** (1.2.x): Bug fixes, no breaking changes
- **Minor** (1.x.0): New commands, backward compatible
- **Major** (x.0.0): Breaking changes (command signature changes, SDK major updates)

### Breaking Changes
Breaking changes are announced 2 minor versions ahead with deprecation warnings:
```
Warning: The --key option is deprecated and will be removed in v2.0.0
Please use --api-key instead
```

## Current Implementation Status

### ✅ Implemented (56 commands)
- **Campaigns**: 15 commands (full lifecycle)
- **Lists**: 4 commands (core CRUD)
- **Contacts**: 6 commands (core CRUD)
- **Senders**: 7 commands (complete management)
- **Templates**: 6 commands (complete management)
- **Webhooks**: 6 commands (complete management)
- **Email API v2**: 3 commands (transactional emails)

### 📦 Available via SDK (not yet CLI commands)
- Reports and analytics (ReportService)
- Segments (SegmentService)
- Custom attributes (CustomAttributeService)
- Contact tagging (TagsService)
- Workflows and automation (WorkflowService)
- Forms (FormService)
- Sub-accounts (SubAccountService)
- And 20+ more services (see API_COVERAGE.md)

### 🎯 Roadmap

**v1.3.0 - High-Value Commands:**
- Reports (campaign analytics, list stats)
- Segments (contact segmentation)
- Custom attributes management

**v1.4.0 - Bulk Operations:**
- Contact import/export
- Bulk tagging
- Batch operations

**v1.5.0 - Advanced Features:**
- Workflows and automation
- Forms management
- Sub-account operations

## Testing

### Manual Testing
```bash
# Test authentication
cakemail campaigns list

# Test output formats
cakemail -f json campaigns list
cakemail -f table senders list
cakemail -f compact lists list

# Test piping
cakemail campaigns list | jq '.data[0]'

# Test error handling
cakemail campaigns get 999999  # Non-existent ID
```

### CI/CD Testing
The CLI is suitable for automated testing in pipelines:
```yaml
# GitHub Actions example
- name: Test CLI
  env:
    CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
    CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
  run: |
    npm install -g @cakemail-org/cakemail-cli
    cakemail campaigns list --status active
```

### SDK Compatibility
The CLI version pins to a specific SDK version to ensure stability. SDK updates are tested before releasing a new CLI version.

## Performance Considerations

- **Startup time**: ~500ms (Node.js + SDK initialization)
- **API calls**: Direct SDK calls (no additional overhead)
- **Memory**: Minimal (~50MB resident)
- **Concurrency**: Single-threaded (Node.js event loop)

For high-volume operations, consider:
- Batch API endpoints (when available)
- Direct SDK usage in custom scripts
- Parallel execution of multiple CLI invocations

## Security

### Credential Management
- Never commit credentials to git (`.env` is gitignored)
- Use environment variables in CI/CD (not stored in repos)
- Rotate credentials regularly
- Use access tokens for automated systems

### Supply Chain
- All dependencies are verified via npm
- `package-lock.json` ensures reproducible builds
- No post-install scripts
- Regular dependency audits: `npm audit`

## Troubleshooting

### Common Issues

**"Email and password are required"**
- Set credentials in `.env` or environment variables
- Verify `.env` is in current working directory

**"Command not found: cakemail"**
- Install globally: `npm install -g @cakemail-org/cakemail-cli`
- Or use npx: `npx @cakemail-org/cakemail-cli`

**"Invalid credentials"**
- Verify email and password are correct
- Check for special characters in password (quote in .env if needed)

**"Network error" or timeouts**
- Check internet connection
- Verify API base URL (default: https://api.cakemail.dev)
- Check firewall/proxy settings

### Debug Mode
Set `NODE_ENV=development` for verbose SDK logging (if implemented by SDK).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Pull request process
- Command prioritization criteria

## License

MIT License - See [LICENSE](LICENSE) file

---

*Last Updated: 2025-10-10*
*CLI Version: 1.2.0*
*SDK Version: @cakemail-org/cakemail-sdk v2.0.0*
