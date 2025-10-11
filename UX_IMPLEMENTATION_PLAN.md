# Cakemail CLI UX Implementation Plan

## Executive Summary

This plan outlines the phased implementation of UX improvements for the Cakemail CLI, transforming it from a developer-focused tool to a user-friendly CLI accessible to both technical and non-technical users.

**Current State (v1.3.0):**
- 104 commands (45% API coverage)
- Environment variable auth only
- JSON/table/compact output
- Strong foundation, but steep learning curve

**Target State (v2.0.0):**
- Interactive auth and onboarding
- User-friendly error messages
- Natural language date parsing
- Preview capabilities
- Guided workflows for new users

---

## Phase 1: Critical UX Foundations (v1.4.0) - 3-4 weeks

**Goal:** Remove barriers to adoption for new users

### Milestone 1.4.0 Features

#### 1. Interactive Auth Setup (Week 1)
**Priority:** CRITICAL - Blocks all non-technical users
**Effort:** Medium
**Dependencies:** None

**Implementation:**
```typescript
// src/commands/auth.ts
export function createAuthCommand(client, formatter) {
  const auth = new Command('auth')
    .description('Manage authentication');

  auth.command('setup')
    .description('Interactive auth configuration')
    .action(async () => {
      // 1. Prompt for auth method (email/password or token)
      // 2. Validate credentials
      // 3. Save to ~/.cakemail/config.json (encrypted)
      // 4. Show success message with account info
    });

  auth.command('status')
    .description('Show current auth status')
    .action(async () => {
      // Show: method, user, expiry
    });

  auth.command('logout')
    .description('Clear stored credentials')
    .action(async () => {
      // Remove config file, confirm
    });
}
```

**Files to create/modify:**
- Create: `src/commands/auth.ts`
- Create: `src/utils/config-manager.ts` (handles ~/.cakemail/config.json)
- Create: `src/utils/encryption.ts` (encrypt/decrypt credentials)
- Modify: `src/utils/config.ts` (add config file support)
- Modify: `src/cli.ts` (add auth command)

**Library additions:**
- `inquirer` - Interactive prompts
- `node-keytar` or `crypto` - Secure credential storage
- `conf` - Config file management

**Testing:**
- Unit tests for config manager
- Integration tests for auth flow
- Test priority: CLI flag > Project config > Global config > Env vars

---

#### 2. Actionable Error Messages (Week 1-2)
**Priority:** CRITICAL - Current errors frustrate users
**Effort:** Medium
**Dependencies:** None

**Implementation:**
```typescript
// src/utils/error-translator.ts
export class ErrorTranslator {
  static translate(error: any): string {
    // Map API error codes to user-friendly messages
    const errorMap = {
      401: {
        message: 'Authentication failed. Your credentials may be expired.',
        suggestion: 'Run: cakemail auth setup'
      },
      403: {
        message: (error) => this.handle403(error),
        suggestion: (error) => this.suggest403(error)
      },
      422: {
        message: (error) => this.handleValidation(error),
        suggestion: (error) => this.suggestValidation(error)
      },
      404: {
        message: (error) => `${error.resource} not found`,
        suggestion: 'Check the ID and try again'
      }
    };

    // Special handlers for specific error scenarios
  }

  private static handle403(error: any): string {
    if (error.message.includes('sender')) {
      return `Sender '${error.details.email}' is not verified.`;
    }
    if (error.message.includes('permission')) {
      return 'You don\'t have permission for this action.';
    }
    return 'Access denied.';
  }

  private static suggest403(error: any): string {
    if (error.message.includes('sender')) {
      return `Run: cakemail senders resend-confirmation ${error.details.id}`;
    }
    return 'Contact your account administrator.';
  }
}
```

**Files to create/modify:**
- Create: `src/utils/error-translator.ts`
- Create: `src/utils/error-patterns.ts` (common error patterns)
- Modify: `src/utils/output.ts` (integrate error translator)
- Modify: All command files (wrap API calls with error translation)

**Testing:**
- Unit tests for each error code
- Integration tests with real API errors
- Test with `--debug` flag shows full error

---

#### 3. Natural Date Parsing (Week 2)
**Priority:** HIGH - ISO 8601 is a major pain point
**Effort:** Low
**Dependencies:** None

**Implementation:**
```typescript
// src/utils/date-parser.ts
import { parseDate } from 'chrono-node';
import { formatISO, parse, addDays, addHours } from 'date-fns';

export class DateParser {
  static parse(input: string, userTimezone?: string): string {
    // Try multiple parsing strategies:

    // 1. Relative dates: "tomorrow", "+2 days", "next monday"
    if (input.startsWith('+') || input.includes('next') || input.includes('tomorrow')) {
      return this.parseRelative(input);
    }

    // 2. Natural language: "Oct 15 10:00", "tomorrow 10am"
    const chronoResult = parseDate(input);
    if (chronoResult) {
      return formatISO(chronoResult);
    }

    // 3. ISO 8601 (keep existing support)
    if (this.isISO8601(input)) {
      return input;
    }

    // 4. Simple format: "2025-10-15 10:00"
    try {
      const parsed = parse(input, 'yyyy-MM-dd HH:mm', new Date());
      return formatISO(parsed);
    } catch (e) {
      throw new Error(`Cannot parse date: "${input}". Try: "tomorrow 10am" or "2025-10-15 10:00"`);
    }
  }

  static confirm(parsed: string, original: string): boolean {
    // Show what was parsed, ask for confirmation
    console.log(chalk.cyan(`Parsed "${original}" as: ${format(parseISO(parsed), 'PPpp')}`));
    // Return true to confirm
  }
}
```

**Files to create/modify:**
- Create: `src/utils/date-parser.ts`
- Modify: `src/commands/campaigns.ts` (schedule, reschedule)
- Modify: `src/commands/reports.ts` (date filtering)

**Library additions:**
- `chrono-node` - Natural language date parsing
- `date-fns` - Date manipulation and formatting

**Testing:**
- Unit tests for each date format
- Test timezone handling
- Test future date validation

---

#### 4. Quickstart Wizard (Week 3)
**Priority:** CRITICAL - First user experience
**Effort:** High
**Dependencies:** Auth setup, error messages

**Implementation:**
```typescript
// src/commands/quickstart.ts
import inquirer from 'inquirer';

export function createQuickstartCommand(client, formatter) {
  return new Command('quickstart')
    .description('Guided onboarding: send your first email')
    .action(async () => {
      const wizard = new QuickstartWizard(client, formatter);
      await wizard.run();
    });
}

class QuickstartWizard {
  async run() {
    console.log(chalk.bold.blue('\n🚀 Welcome to Cakemail CLI!\n'));
    console.log('Let\'s get you set up and send your first email.\n');

    // Step 1: Check auth
    await this.checkAuth();

    // Step 2: Get/create sender
    const sender = await this.getSender();

    // Step 3: Get/create list
    const list = await this.getList();

    // Step 4: Add test contact
    const contact = await this.addTestContact(list.id);

    // Step 5: Create/select template
    const content = await this.getContent();

    // Step 6: Send test email
    await this.sendTestEmail(sender, contact, content);

    // Step 7: Success & next steps
    this.showSuccess();
  }

  private async checkAuth() {
    try {
      await this.client.sdk.accountService.getSelfAccount();
      console.log(chalk.green('✓ Already authenticated\n'));
    } catch (error) {
      console.log(chalk.yellow('Need to set up authentication first...\n'));
      // Run auth setup
      const authCmd = createAuthCommand(this.client, this.formatter);
      await authCmd.parseAsync(['node', 'cli', 'auth', 'setup']);
    }
  }

  private async getSender() {
    const { senders } = await this.client.sdk.senderService.listSenders({});

    if (senders.length === 0) {
      console.log(chalk.cyan('No senders found. Let\'s create one.\n'));
      return await this.createSender();
    }

    const { sender } = await inquirer.prompt([{
      type: 'list',
      name: 'sender',
      message: 'Choose a sender:',
      choices: [
        ...senders.map(s => ({
          name: `${s.name} <${s.email}> ${s.confirmed ? '✓' : '⚠️ Unverified'}`,
          value: s
        })),
        { name: '+ Create new sender', value: 'new' }
      ]
    }]);

    if (sender === 'new') {
      return await this.createSender();
    }

    if (!sender.confirmed) {
      console.log(chalk.yellow(`\n⚠️  Sender "${sender.email}" needs verification.`));
      console.log(`Check your email and confirm, or run:`);
      console.log(chalk.cyan(`  cakemail senders resend-confirmation ${sender.id}\n`));
    }

    return sender;
  }

  private async createSender() {
    const { name, email } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Sender name:',
        default: 'My Company'
      },
      {
        type: 'input',
        name: 'email',
        message: 'Sender email:',
        validate: (input) => this.validateEmail(input)
      }
    ]);

    const sender = await this.client.sdk.senderService.createSender({
      requestBody: { name, email }
    });

    console.log(chalk.green('\n✓ Sender created!'));
    console.log(chalk.yellow('→ Verification email sent. Check your inbox.\n'));

    return sender;
  }

  // Similar methods for list, contact, content, sending...

  private showSuccess() {
    console.log(chalk.bold.green('\n🎉 Success! Your first email has been sent.\n'));
    console.log('Next steps:');
    console.log('  • View campaigns: ' + chalk.cyan('cakemail campaigns list'));
    console.log('  • Create template: ' + chalk.cyan('cakemail templates create'));
    console.log('  • Manage contacts: ' + chalk.cyan('cakemail contacts list <list-id>'));
    console.log('  • View analytics: ' + chalk.cyan('cakemail reports campaign <id>'));
    console.log('\nDocumentation: https://docs.cakemail.com/cli\n');
  }
}
```

**Files to create/modify:**
- Create: `src/commands/quickstart.ts`
- Create: `src/utils/wizard-helpers.ts` (shared wizard utilities)
- Modify: `src/cli.ts` (add quickstart command)

**Library additions:**
- `inquirer` - Interactive prompts
- `ora` - Already included, use for spinners

**Testing:**
- Integration tests for each step
- Test skip functionality
- Test resume from interruption

---

### v1.4.0 Release Checklist

**Code:**
- [ ] All features implemented and tested
- [ ] Unit tests passing (target: 80%+ coverage for new code)
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Code review completed

**Documentation:**
- [ ] README updated with auth setup instructions
- [ ] New commands documented
- [ ] Quickstart guide added
- [ ] Migration guide from v1.3
- [ ] CHANGELOG updated

**Release:**
- [ ] Version bumped to 1.4.0
- [ ] Build and test locally
- [ ] Publish to npm
- [ ] Update Homebrew formula
- [ ] Announce release

---

## Phase 2: Enhanced Usability (v1.5.0) - 2-3 weeks

**Goal:** Polish the experience and add power user features

### Milestone 1.5.0 Features

#### 1. Email Preview (Week 1)
**Files:** `src/utils/preview.ts`, modify `src/commands/emails.ts`
**Libraries:** `open` (open browser)

#### 2. Interactive Mode for Missing Fields (Week 1-2)
**Files:** `src/middleware/interactive-prompts.ts`, modify all command files
**Libraries:** `inquirer`

#### 3. Confirmation for Dangerous Operations (Week 2)
**Files:** `src/middleware/confirmation.ts`, modify delete/cancel commands
**Libraries:** `inquirer`

#### 4. Rich Table Output (Week 2)
**Files:** Modify `src/utils/output.ts`
**Libraries:** `chalk`, `date-fns`

#### 5. Search/Find Commands (Week 2-3)
**Files:** Add `find` subcommands to campaigns, templates, senders
**Libraries:** `fuzzysort`

#### 6. Smart File Handling (Week 3)
**Files:** `src/utils/file-parser.ts`, modify `src/commands/emails.ts`
**Libraries:** `cheerio` (parse HTML)

---

## Phase 3: Power User Features (v1.6.0) - 2-3 weeks

**Goal:** Advanced workflows and customization

### Milestone 1.6.0 Features

#### 1. Configuration Management (Week 1)
**Files:** Create `src/commands/config.ts`, expand `src/utils/config-manager.ts`

#### 2. Shell Completion (Week 1)
**Files:** Create `src/commands/completion.ts`
**Libraries:** `omelette` or built-in completion

#### 3. Bulk Operations Enhancement (Week 2)
**Files:** Enhance contact import/export, add progress bars
**Libraries:** `cli-progress`

#### 4. Dry Run Mode (Week 2)
**Files:** `src/middleware/dry-run.ts`, modify all write operations

#### 5. Aliases (Week 3)
**Files:** Create `src/commands/alias.ts`, add alias resolver

#### 6. Template Scaffolding (Week 3)
**Files:** Create `src/commands/init.ts`, add template library

---

## Phase 4: Nice to Have (v1.7.0+) - Ongoing

### Features
- Enhanced help with examples
- Improved default output
- Better scripting support (exit codes, quiet mode, verbose mode)
- Update notifications
- `--watch` mode for real-time updates

---

## Implementation Strategy

### Week-by-Week Breakdown (First 4 Weeks - v1.4.0)

**Week 1:**
- Days 1-2: Auth setup command (setup, status, logout)
- Days 3-4: Config manager and encryption
- Day 5: Testing and documentation

**Week 2:**
- Days 1-2: Error translator and pattern matching
- Days 3-4: Natural date parsing
- Day 5: Testing and integration

**Week 3:**
- Days 1-3: Quickstart wizard (all steps)
- Days 4-5: Testing and polish

**Week 4:**
- Days 1-2: Integration testing
- Days 3-4: Documentation and examples
- Day 5: Release prep and publish

### Development Workflow

1. **Feature Branch Strategy:**
   - `feat/auth-setup`
   - `feat/error-messages`
   - `feat/date-parsing`
   - `feat/quickstart-wizard`

2. **Testing Strategy:**
   - Write tests before implementation (TDD)
   - Unit tests for utilities
   - Integration tests for commands
   - Manual testing for interactive features

3. **Code Review:**
   - All features require review
   - Check UX, error handling, edge cases
   - Verify backwards compatibility

4. **Documentation:**
   - Update README for each feature
   - Add examples to docs
   - Update API_COVERAGE.md
   - Create migration guides

---

## Dependencies and Libraries

### New Dependencies for v1.4.0:
```json
{
  "dependencies": {
    "inquirer": "^9.2.0",          // Interactive prompts
    "conf": "^11.0.0",              // Config management
    "chrono-node": "^2.7.0",        // Date parsing
    "date-fns": "^2.30.0"           // Date formatting
  }
}
```

### For Future Versions:
```json
{
  "dependencies": {
    "fuzzysort": "^2.0.0",          // Fuzzy search (v1.5)
    "open": "^9.1.0",               // Open browser (v1.5)
    "cheerio": "^1.0.0-rc.12",      // Parse HTML (v1.5)
    "cli-progress": "^3.12.0",      // Progress bars (v1.6)
    "omelette": "^0.4.0",           // Shell completion (v1.6)
    "update-notifier": "^6.0.0"     // Update checks (v1.7)
  }
}
```

---

## Success Metrics

### Quantitative:
- **Time to first email:** < 5 minutes for new users (via quickstart)
- **Auth setup success rate:** > 95%
- **Error resolution rate:** > 80% (users resolve errors without support)
- **CLI adoption:** +50% increase in WAU
- **Support tickets:** -30% "how do I" questions

### Qualitative:
- User feedback surveys (NPS score)
- Community feedback (GitHub issues, discussions)
- Internal team feedback
- Customer success team feedback

---

## Risk Mitigation

### Risk 1: Breaking Changes
**Mitigation:**
- Maintain backwards compatibility for all existing commands
- Add new features as opt-in (flags, new commands)
- Provide clear migration guides
- Test extensively with real users

### Risk 2: Complexity Creep
**Mitigation:**
- Keep features focused and simple
- Don't over-engineer
- Prioritize based on user feedback
- Can always add more later

### Risk 3: Performance
**Mitigation:**
- Lazy load dependencies (especially for interactive features)
- Cache config and frequently-used data
- Optimize API calls (batch when possible)
- Test with large datasets

### Risk 4: Platform Compatibility
**Mitigation:**
- Test on macOS, Linux, Windows
- Test with different terminal emulators
- Handle non-TTY environments gracefully
- Provide fallbacks for unsupported features

---

## Next Immediate Steps

1. **This Week (Week 1):**
   - [ ] Create feature branch `feat/ux-v1.4`
   - [ ] Install new dependencies (`inquirer`, `conf`, `chrono-node`, `date-fns`)
   - [ ] Create project structure (commands/auth.ts, utils/config-manager.ts, etc.)
   - [ ] Implement auth setup command
   - [ ] Write unit tests for auth
   - [ ] Manual testing

2. **Get User Feedback:**
   - [ ] Share plan with internal team
   - [ ] Get feedback from beta users
   - [ ] Adjust priorities based on feedback

3. **Track Progress:**
   - [ ] Create GitHub project board
   - [ ] Create issues for each feature
   - [ ] Weekly progress updates
   - [ ] Demo to stakeholders

---

## Appendix: Architecture Changes

### Config File Structure

```json
{
  "version": "1.4.0",
  "auth": {
    "method": "email", // or "token"
    "email": "user@example.com",
    "password": "encrypted_password",
    "token": "encrypted_token",
    "baseURL": "https://api.cakemail.dev"
  },
  "defaults": {
    "senderId": 456,
    "listId": 123,
    "outputFormat": "compact"
  },
  "quickstart": {
    "completed": true,
    "completedAt": "2025-10-11T10:00:00Z"
  }
}
```

### Directory Structure

```
~/.cakemail/
├── config.json          # Global config
└── cache/               # Cached data (lists, senders, etc.)
    ├── senders.json
    └── lists.json

project/.cakemail/
└── config.json          # Project-local config (overrides global)
```

### Error Translation Map

```typescript
// src/utils/error-patterns.ts
export const ERROR_PATTERNS = {
  401: {
    patterns: [
      {
        match: /invalid credentials/i,
        message: 'Invalid email or password',
        suggestion: 'Run: cakemail auth setup'
      },
      {
        match: /token expired/i,
        message: 'Your session has expired',
        suggestion: 'Run: cakemail auth setup'
      }
    ],
    default: {
      message: 'Authentication failed',
      suggestion: 'Check your credentials'
    }
  },
  403: {
    patterns: [
      {
        match: /sender.*not verified/i,
        message: (details) => `Sender '${details.email}' is not verified`,
        suggestion: (details) => `Run: cakemail senders resend-confirmation ${details.id}`
      },
      {
        match: /permission denied/i,
        message: 'You don\'t have permission for this action',
        suggestion: 'Contact your account administrator'
      }
    ]
  },
  // ... more error patterns
};
```

---

*Last Updated: 2025-10-11*
*Version: 1.0*
*Author: Claude Code*
