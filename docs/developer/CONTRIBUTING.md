# Contributing to Cakemail CLI

Thank you for your interest in contributing to the Cakemail CLI! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm
- A Cakemail account for testing

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cakemail/cli.git
   cd cli
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your test credentials
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Test locally**
   ```bash
   npm start -- campaigns list
   # or
   node dist/cli.js campaigns list
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Add TypeScript types for all new code

3. **Build and test**
   ```bash
   npm run build
   npm start -- <command> <args>
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Test additions or changes

Examples:
```
feat: add reports command for campaign analytics
fix: correct sender confirmation flow
docs: update README with new examples
chore: update dependencies to latest versions
```

## Code Guidelines

### TypeScript

- Use TypeScript for all code
- Provide types for all function parameters and return values
- Avoid `any` type when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Error Handling

- Always handle errors gracefully
- Provide clear, actionable error messages
- Exit with appropriate exit codes (1 for errors)

### Output

- Use the `OutputFormatter` for all output
- Support all three output formats: JSON, table, compact
- Use `ora` spinners for long-running operations

## Adding New Commands

To add a new command category:

1. **Create command file**: `src/commands/yourcommand.ts`

2. **Follow the pattern**:
   ```typescript
   import { Command } from 'commander';
   import { CakemailClient } from '../client.js';
   import { OutputFormatter } from '../utils/output.js';
   import ora from 'ora';

   export function createYourCommand(client: CakemailClient, formatter: OutputFormatter): Command {
     const cmd = new Command('yourcommand')
       .description('Description of your command');

     cmd
       .command('list')
       .description('List items')
       .action(async (options) => {
         const spinner = ora('Fetching...').start();
         try {
           const data = await client.sdk.yourService.list(options);
           spinner.stop();
           formatter.output(data);
         } catch (error: any) {
           spinner.stop();
           formatter.error(error.message);
           process.exit(1);
         }
       });

     return cmd;
   }
   ```

3. **Register in CLI**: Add to `src/cli.ts`
   ```typescript
   import { createYourCommand } from './commands/yourcommand.js';
   // ...
   program.addCommand(createYourCommand(client, formatter));
   ```

4. **Update documentation**:
   - Add command to README.md
   - Update API_COVERAGE.md

## SDK Integration

The CLI is built on the official [@cakemail-org/cakemail-sdk](https://www.npmjs.com/package/@cakemail-org/cakemail-sdk).

- Always use SDK methods: `client.sdk.serviceName.method()`
- Follow SDK 2.0 object-based API patterns
- Wrap request bodies in `requestBody` property
- Handle SDK errors appropriately

Example:
```typescript
// SDK 2.0 pattern
const data = await client.sdk.senderService.createSender({
  requestBody: {
    name: options.name,
    email: options.email
  }
});
```

## Testing

Currently, the CLI uses manual testing. Before submitting a PR:

1. Test all affected commands
2. Test with different output formats (`-f json`, `-f table`, `-f compact`)
3. Test error cases (invalid IDs, missing params, etc.)
4. Test with both email/password and access token authentication

## Documentation

- Update README.md for user-facing changes
- Update API_COVERAGE.md for new commands
- Add JSDoc comments for complex functions
- Include usage examples in command descriptions

## Pull Request Process

1. **Before submitting**:
   - Ensure code builds: `npm run build`
   - Test thoroughly
   - Update documentation
   - Write clear commit messages

2. **Submit PR**:
   - Provide clear description of changes
   - Reference any related issues
   - List breaking changes (if any)
   - Include testing steps

3. **PR Review**:
   - Address review feedback promptly
   - Keep commits clean and focused
   - Squash commits if requested

## Questions or Issues?

- **Bug reports**: Open an issue with reproduction steps
- **Feature requests**: Open an issue describing the use case
- **Questions**: Open a discussion or issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
