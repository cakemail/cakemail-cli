# Cakemail CLI UX Improvements - Implementation Plan

## Context
The Cakemail CLI is built on the official SDK with 100% API coverage (232 operations). Current implementation uses environment variables for auth and supports JSON/table/compact output formats. Goal is to widen the audience by improving UX for both technical and non-technical users.

## Priority 1: Critical for User Adoption

### 1.1 Interactive Auth Setup
**Problem:** Environment variable-only auth intimidates non-technical users
**Solution:** Add interactive auth configuration

```bash
cakemail auth setup
# Interactive prompts:
# - Choose auth method (email/password or access token)
# - Save to ~/.cakemail/config.json
# - Validate credentials immediately
# - Show success with user info

cakemail auth status
# Display: current auth method, authenticated user, token expiry

cakemail auth logout
# Clear stored credentials, confirm action
```

**Implementation Notes:**
- Store config in `~/.cakemail/config.json`
- Encrypt sensitive data (password/token)
- Support project-local `.cakemail/config.json` (overrides global)
- Priority: Auth flag > Project config > Global config > Env vars

### 1.2 Actionable Error Messages
**Problem:** Raw API errors aren't helpful
**Solution:** Translate API errors to actionable messages

**Examples:**
```
❌ Current: "403 Forbidden"
✅ Improved: "Sender 'john@example.com' is not verified. 
             Run: cakemail senders resend-confirmation 789"

❌ Current: "422 Validation Error"  
✅ Improved: "Campaign missing required field 'subject'. 
             Add with: --subject 'Your Subject'"

❌ Current: "401 Unauthorized"
✅ Improved: "Authentication failed. Your credentials may be expired.
             Run: cakemail auth setup"
```

**Implementation Notes:**
- Create error translator middleware
- Map common API error codes to user-friendly messages
- Include suggested fix commands
- Show full error with `--debug` flag

### 1.3 Email Preview (--preview flag)
**Problem:** No way to see email before sending
**Solution:** Preview rendered HTML in browser

```bash
cakemail emails send -t user@example.com --html-file email.html --preview
# → Opens rendered HTML in default browser
# → Shows variables, personalization
# → Does NOT send email

cakemail campaigns test 123 --preview
# → Render campaign without sending test
```

**Implementation Notes:**
- Create temp HTML file with styles inlined
- Open with system default browser
- Clean up temp file after viewing
- Support `--preview-only` (preview without other actions)

### 1.4 Natural Date Parsing
**Problem:** ISO 8601 timestamps are hard to remember
**Solution:** Accept human-friendly date formats

```bash
# Current (still supported):
cakemail campaigns schedule 123 -d "2025-10-15T10:00:00Z"

# New options:
cakemail campaigns schedule 123 -d "tomorrow 10am"
cakemail campaigns schedule 123 -d "Oct 15 10:00"
cakemail campaigns schedule 123 -d "next monday 2pm"
cakemail campaigns schedule 123 -d "+2 days"
cakemail campaigns schedule 123 -d "2025-10-15 10:00"  # Simpler format
```

**Implementation Notes:**
- Use library like `chrono-node` or `date-fns` for parsing
- Default to user's timezone, show what was parsed
- Validate parsed date is in future for scheduling
- Show parsed datetime before confirming: "Scheduling for Oct 15, 2025 10:00 AM EDT"

### 1.5 Quickstart Wizard
**Problem:** New users don't know where to start
**Solution:** Guided onboarding flow

```bash
cakemail quickstart
# Interactive wizard:
# 1. Check auth (or run auth setup)
# 2. "Let's send your first email"
# 3. Create/select sender → verify email
# 4. Create/select list
# 5. Add test contact
# 6. Create simple template or use HTML
# 7. Send test email
# 8. "Success! 🎉 Next steps: [suggestions]"
```

**Implementation Notes:**
- Skip completed steps (if sender exists, don't recreate)
- Save progress (can resume if interrupted)
- Offer "skip" option at each step
- End with summary of created resources and next steps

## Priority 2: High Value, Medium Effort

### 2.1 Interactive Mode for Missing Required Fields
**Problem:** Users must remember all required flags
**Solution:** Prompt for missing required fields

```bash
# User runs:
cakemail campaigns create -n "My Campaign"

# CLI prompts:
# → "Which list? (showing your 5 most recent)"
#    1. Newsletter Subscribers (123) - 5,234 contacts
#    2. Customers (456) - 1,847 contacts
#    ...
# → "Which sender? (showing verified senders)"  
# → "Which template? (or press Enter to skip)"
```

**Implementation Notes:**
- Only prompt in TTY (skip if piped/scripted)
- Show most relevant options (recent, frequently used)
- Allow typing to search/filter
- Support `--no-interactive` to disable prompts

### 2.2 Confirmation for Dangerous Operations
**Problem:** Easy to accidentally delete/cancel
**Solution:** Add confirmation prompts (without --force)

```bash
cakemail campaigns delete 123
# → "Delete campaign 'Black Friday Sale' (123)? 
#    This cannot be undone. [y/N]"

cakemail campaigns cancel 456
# → "Cancel scheduled campaign 'Newsletter' (456)?
#    This will stop delivery to 10,234 remaining contacts. [y/N]"
```

**Implementation Notes:**
- Skip confirmation with `--force` or `-y`
- Skip in non-interactive mode
- Show impact (e.g., "5,234 contacts", "scheduled for tomorrow")
- Require typing full resource name for very dangerous ops

### 2.3 Rich Table Output
**Problem:** Table output lacks visual hierarchy
**Solution:** Enhance table with colors, better formatting

**Features:**
- Color-code status (green=delivered/active, yellow=scheduled/pending, red=failed/bounced)
- Show relative dates ("2 hours ago" vs "2025-10-11T14:30:00Z")
- Truncate long fields intelligently (hover/expand in supported terminals)
- Add `--watch` for live updates

```bash
cakemail campaigns list -f table
# Shows colorized status, relative dates

cakemail campaigns get 123 --watch
# Live updates: delivered count, opens, clicks (refresh every 5s)
```

**Implementation Notes:**
- Use `chalk` for colors
- Respect `NO_COLOR` env var
- Use `date-fns` for relative dates
- Implement watch with setInterval, clear screen between updates

### 2.4 Search/Find Commands
**Problem:** List + grep is clunky
**Solution:** Built-in fuzzy search

```bash
cakemail campaigns find "black friday"
# Searches: name, subject, tags
# Returns ranked results

cakemail templates find "newsletter"
cakemail senders find "john"

# Shorthand for recent:
cakemail campaigns list --recent      # last 10
cakemail campaigns list --recent 25   # last 25
```

**Implementation Notes:**
- Use fuzzy matching (fuzzysort or similar)
- Search across multiple fields (name, subject, tags, etc.)
- Rank results by relevance
- Support `--exact` for non-fuzzy search

### 2.5 Smart File Handling
**Problem:** Must specify file type and all details
**Solution:** Auto-detect and infer from files

```bash
# Auto-detect HTML vs text:
cakemail emails send -t user@example.com email.html
# → Infers subject from <title>
# → Detects HTML content type

# Support stdin:
cat newsletter.html | cakemail emails send -t user@example.com -s "Newsletter"

# Read subject from file:
cakemail emails send -t user@example.com email.html
# If email.html has <title>Weekly Newsletter</title>
# → Uses as subject (can override with -s)
```

**Implementation Notes:**
- Detect file extension (.html, .txt, .md)
- Parse HTML for `<title>` tag as default subject
- Support stdin with `process.stdin`
- Show what was inferred: "Using subject from HTML: 'Weekly Newsletter'"

## Priority 3: Power User Features

### 3.1 Configuration Management
```bash
cakemail config set default.sender-id 456
cakemail config set default.list-id 123
cakemail config set default.format compact
cakemail config get default.sender-id
cakemail config list  # Show all settings

# Now creates campaign with defaults:
cakemail campaigns create -n "Weekly Newsletter"
```

### 3.2 Shell Completion
```bash
# Generate completions:
cakemail completion bash > /etc/bash_completion.d/cakemail
cakemail completion zsh > ~/.zsh/completions/_cakemail
cakemail completion fish > ~/.config/fish/completions/cakemail.fish

# Autocomplete:
# - Commands and subcommands
# - Flag names
# - Dynamic values (campaign names, list IDs from recent items)
```

### 3.3 Bulk Operations
```bash
# Import from CSV:
cakemail contacts import 123 contacts.csv
# → Smart column mapping (auto-detect email, first_name, etc.)
# → Prompt for custom field mapping
# → Show progress bar

# Export to CSV:
cakemail contacts export 123 contacts.csv

# Bulk actions:
cakemail campaigns list --status scheduled | cakemail campaigns pause --stdin
```

### 3.4 Dry Run Mode
```bash
cakemail emails send -t user@example.com --html email.html --dry-run
# → "Would send email to user@example.com with subject: 'Newsletter'"

cakemail campaigns schedule 123 -d "tomorrow 10am" --dry-run  
# → "Would schedule campaign 'Black Friday' for Oct 12, 2025 10:00 AM EDT"

cakemail contacts import 123 contacts.csv --dry-run
# → "Would import 5,234 contacts (2 duplicates, 3 invalid emails)"
```

### 3.5 Built-in Aliases & Custom Aliases
```bash
# Built-in shortcuts:
cakemail c list    # campaigns list
cakemail t list    # templates list  
cakemail s list    # senders list
cakemail l list    # lists list

# User-defined aliases:
cakemail alias add send-newsletter "campaigns create -n 'Newsletter' -l 123 -s 456"
cakemail alias list
cakemail alias remove send-newsletter

# Use alias:
cakemail send-newsletter --subject "Weekly Update"
```

### 3.6 Template Scaffolding
```bash
cakemail templates scaffold newsletter
# → Generates newsletter.html with boilerplate

cakemail templates scaffold transactional --type order-confirmation
# → Generates order-confirmation.html

cakemail init campaign
# → Creates campaign.yaml with commented examples

cakemail init workflow
# → Creates workflow.yaml template
```

## Priority 4: Nice to Have

### 4.1 Enhanced Help & Examples
```bash
cakemail campaigns create --help
# Show flags AND 2-3 real examples at bottom

cakemail examples campaigns
# List common campaign operations with copy-paste commands

cakemail examples emails
# List common email scenarios
```

### 4.2 Improved Default Output (no args)
```bash
cakemail  # No arguments
# → "Welcome to Cakemail CLI! 👋
#    
#    Not configured yet? Run: cakemail auth setup
#    First time? Run: cakemail quickstart
#    Need help? Run: cakemail --help
#    
#    Quick commands:
#      cakemail campaigns list    - View campaigns
#      cakemail emails send       - Send an email
#      cakemail templates list    - View templates"
```

### 4.3 Better Scripting Support
```bash
# Compact JSON for jq:
cakemail campaigns list -f json --no-pretty

# Exit codes:
# 0 = success
# 1 = validation error  
# 2 = auth error
# 3 = not found
# 4 = rate limit
# 5 = API error

# Quiet mode (only output ID/result):
cakemail campaigns create -n "Test" --quiet
# Output: 123

# Verbose mode:
cakemail campaigns create -n "Test" --verbose
# Shows: API requests, response times, full responses
```

### 4.4 Update Notifications
```bash
# Check for updates on command run (max once per day)
# → "Update available: 1.2.3 → 1.3.0
#    Run: npm update -g @cakemail-org/cakemail-cli"

cakemail update check
cakemail update install  # If possible for installation method
```

## Implementation Guidelines

### Project Structure
```
src/
├── commands/          # Command implementations
├── utils/
│   ├── auth.ts       # Auth management
│   ├── config.ts     # Config management  
│   ├── errors.ts     # Error translation
│   ├── prompts.ts    # Interactive prompts
│   ├── parsers.ts    # Date parsing, etc.
│   └── formatters.ts # Output formatting
├── middleware/        # CLI middleware (auth, validation, etc.)
└── cli.ts            # Main entry point
```

### Key Libraries to Consider
- `inquirer` or `prompts` - Interactive prompts
- `chalk` - Terminal colors
- `ora` - Spinners/loading
- `cli-table3` - Tables
- `date-fns` or `chrono-node` - Date parsing
- `fuzzysort` - Fuzzy search
- `conf` - Config management
- `update-notifier` - Update checks
- `open` - Open browser for preview

### Testing Strategy
- Unit tests for utilities (date parsing, error translation)
- Integration tests for commands
- E2E tests for critical flows (auth setup, quickstart)
- Manual testing for interactive features

### Backwards Compatibility
- Keep all existing commands/flags working
- New features opt-in where possible
- Document breaking changes clearly
- Provide migration guide if needed

## Success Metrics
- Reduction in "how do I" support questions
- Increase in CLI adoption vs API direct usage
- User feedback on ease of use
- Time to first successful email send for new users

## Next Steps
1. Review and prioritize features with team
2. Create GitHub issues for each priority tier
3. Implement Priority 1 features first (biggest impact)
4. Gather user feedback after each release
5. Iterate based on usage analytics and feedback