# Changelog

All notable changes to the Cakemail CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2025-10-16

### Added - OAuth Authentication & Profile Enhancements

**OAuth Token-Based Authentication**
- Migrated from password-based to OAuth token authentication
- Access tokens and refresh tokens now stored in config file
- Token expiration tracking with `expires_in` field
- Automatic token refresh support (foundation for future implementation)
- Enhanced authentication flow with better error handling
- Account selection prompt when multiple accounts are available
- Improved first-time authentication experience

**Logout Command**
- `logout` - Log out and clear all authentication tokens
- Interactive confirmation prompt showing current user and what will be deleted
- `--force` flag to skip confirmation for scripting
- Gracefully handles case when user is already logged out
- Deletes entire config file including profile settings

**Profile-Based List Defaults**
- Marketer profile now defaults to 25 items per page (instead of API default 50)
- Marketer profile now sorts lists by newest first (`-created_on`)
- Applied to all list commands: campaigns, contacts, lists, senders, etc.
- Created reusable `applyListDefaults()` helper for consistent behavior
- Maintains backward compatibility with explicit `--limit` and `--sort` flags

**Enhanced Help System**
- `cakemail --help` now works without requiring authentication
- `cakemail --version` works without authentication
- Subcommand help (e.g., `cakemail config --help`) works without authentication
- Bare `cakemail` command still triggers authentication as intended
- Early return optimization for help/version commands

**Improved Configuration Display**
- `config profile` now shows all available quick actions including logout
- Added "View all" quick action for `config show` command
- Better organized help text with clear command examples
- Shows current profile and all active settings

### Fixed

**Date Display Issues**
- Fixed Unix timestamp conversion (seconds to milliseconds)
- Timestamps no longer show as 1970-01-01 dates
- Proper date formatting in all output modes (JSON, table, compact)
- Fixed in authentication tokens, campaign dates, and contact timestamps

**Profile Persistence**
- Fixed profile setting not being saved during authentication
- Profile selection now properly persists to config file
- Enhanced OAuth flow to maintain profile choice

**SDK Parameter Mapping**
- Fixed parameter naming inconsistencies across SDK services
- Senders command now correctly maps `per_page` to `perPage`
- Ensures all list commands work with profile defaults

### Changed

**Authentication Flow**
- Email/password flow now returns OAuth tokens instead of storing password
- Config file now stores `access_token`, `refresh_token`, and `expires_in`
- Password is never stored in config file (security improvement)
- Authentication method tracked in config (`password` or `token`)
- Profile selection integrated into initial authentication flow

**Configuration Structure**
- Added `auth.access_token` field (replaces legacy `token` field)
- Added `auth.refresh_token` field for token refresh
- Added `auth.expires_in` field for expiration tracking
- Added `auth.method` field to track authentication method
- Maintains backward compatibility with legacy `token` field

**List Command Behavior**
- All list commands now respect profile-based defaults
- Marketer profile provides more curated experience with smaller page sizes
- Developer profile still uses API defaults (50 items, default sort)
- Explicit flags (`--limit`, `--sort`) always override profile defaults

### Technical Improvements

**New Files**
- `src/utils/list-defaults.ts` - Reusable helper for applying profile-based defaults to list commands
  - `applyListDefaults()` function with proper parameter mapping
  - Handles `per_page`, `page`, and `sort` parameters
  - Profile-aware with fallback to API defaults

**Enhanced Files**
- `src/utils/auth.ts` - Complete OAuth authentication flow implementation
  - Account selection when multiple accounts available
  - Token extraction from OAuth response
  - Profile selection persistence
  - Better error handling and user feedback

- `src/utils/config-file.ts` - Enhanced config file management
  - `deleteConfigFile()` function for logout
  - Support for OAuth token fields
  - Maintains backward compatibility with legacy fields

- `src/commands/config.ts` - Logout command and improved help
  - `logout` command with interactive confirmation
  - Enhanced profile display with all quick actions
  - Better command organization

- `src/cli.ts` - Improved help and authentication logic
  - Early return for help/version commands
  - Conditional client creation for help scenarios
  - Better authentication skip logic

- `src/utils/config.ts` - OAuth token support
  - Load access_token and refresh_token from config
  - Support for token expiration tracking
  - Maintains backward compatibility

- `src/utils/output.ts` - Date formatting fixes
  - Proper Unix timestamp conversion (seconds → milliseconds)
  - Enhanced date display across all output modes

- `src/client.ts` - OAuth token authentication
  - Uses access_token from config instead of password
  - Maintains backward compatibility with old authentication

**Updated Commands**
- `src/commands/campaigns.ts` - Profile-based list defaults
- `src/commands/contacts.ts` - Profile-based list defaults
- `src/commands/lists.ts` - Profile-based list defaults
- `src/commands/senders.ts` - Profile-based list defaults with parameter mapping

### Security Improvements
- Password no longer stored in config file
- OAuth tokens used for API authentication
- Refresh token support for long-lived sessions
- Logout command completely removes all credentials

### Example Usage

**OAuth Authentication:**
```bash
# First-time authentication
$ cakemail campaigns list
⚠ Not authenticated
Please enter your Cakemail credentials:

Email: user@example.com
Password: ********

🔐 Authenticating...
✓ Authentication successful!

# Multiple accounts - selection prompt
? Select an account:
  › Cakemail (ID: 123456) ⭐
    Sub-Account A (ID: 789012)
    Sub-Account B (ID: 345678)

# Profile selection
? Select your profile:
  › 📊 Marketer - Interactive, user-friendly
    💻 Developer - Fast, scriptable
    ⚖️  Balanced - Best of both
```

**Logout:**
```bash
# Interactive logout
$ cakemail logout

🚪 Logout

Currently logged in as: user@example.com

This will remove:
  • Authentication tokens
  • Profile settings
  • All saved configuration

? Are you sure you want to log out? (y/N) y

✓ Logged out successfully

Run any command to log in again.

# Force logout (skip confirmation)
$ cakemail logout --force
```

**Profile-Based List Defaults (Marketer):**
```bash
# Marketer profile - gets 25 items, sorted by newest first
$ cakemail campaigns list
Showing 1-25 of 150 • Page 1 of 6
[Shows 25 newest campaigns]

# Override with explicit flags
$ cakemail campaigns list --limit 50 --sort "+name"
[Shows 50 campaigns sorted by name]
```

**Enhanced Config Profile Display:**
```bash
$ cakemail config profile

📋 Current Profile

Profile: marketer
(📊 Marketer/Business user)

[... settings display ...]

──────────────────────────────────────────────────

Quick actions:
  Change profile: cakemail config profile-set <type>
  Customize:      cakemail config set <key> <value>
  Reset:          cakemail config reset
  View all:       cakemail config show
  Logout:         cakemail logout
```

### Upgrade Notes

**For Existing Users:**
- On first command after upgrade, you'll be prompted to re-authenticate
- This is a one-time process to migrate from password to OAuth tokens
- Your profile settings will be preserved
- Previous .env configurations are still supported but will migrate to OAuth

**For New Users:**
- Simply run any command to start the authentication flow
- OAuth tokens are automatically managed
- No manual token management required

### Notes
- **No breaking changes** - All existing commands remain compatible
- OAuth migration is automatic and seamless
- Profile-based defaults improve UX without requiring configuration
- Logout provides clean way to switch accounts or remove credentials
- Help system now more accessible without authentication requirement
- All date display issues from previous versions are resolved

## [1.6.0] - 2025-10-14

### Added - Complete Testing Infrastructure

**Test Framework:**
- Vitest test framework with full configuration
- Integration tests for real API validation (5 tests)
- PTY (Pseudo-Terminal) test infrastructure for realistic user simulation
- Express-based mock HTTP server for subprocess testing
- Comprehensive test documentation and guides

**Testing Capabilities:**
- Real API integration tests with working credentials
- PTY tests simulate actual terminal sessions (colors, spinners, interactive prompts)
- Mock server handles OAuth, campaigns, lists, contacts, senders, templates
- Test helpers for CLI execution and PTY management
- Support for testing all output formats (JSON, table, compact)
- Coverage reporting with Vitest

**Test Scripts Added:**
```bash
npm test                  # Run all tests
npm run test:integration  # Test against real API
npm run test:pty          # Test with PTY (needs Node 18-20)
npm run test:coverage     # Generate coverage report
npm run test:ci           # CI/CD pipeline tests
```

**Test Documentation:**
- `tests/PTY_TESTING_GUIDE.md` - Complete PTY testing guide with examples
- `tests/PTY_SETUP.md` - Setup instructions and Node version requirements
- `tests/README.md` - Testing overview

**Node Version Compatibility:**
- PTY tests require Node 18.x or 20.x (node-pty compilation issue with Node 24+)
- Integration tests work on all Node versions ✅
- CLI works on all Node 18+ ✅

### Fixed - Pagination and Table Rendering

**Pagination Handling:**
- Fixed support for new SDK pagination format (nested `pagination` object)
- Maintains backward compatibility with old format (root-level fields)
- Handles both `data.pagination.count` and `data.count` formats

**Table Rendering:**
- Fixed table column width calculation to handle `undefined` values
- Prevents crashes when column width calculation returns no results
- Only applies `colWidths` when explicitly calculated

### Changed

- Test coverage: 0% → 6% (with room to grow to 100%)
- Dev dependencies: Added vitest, express, execa, strip-ansi, @vitest/coverage-v8
- Optional dependency: node-pty (for PTY testing on compatible Node versions)
- Package scripts: Removed placeholder test script, added comprehensive test suite

### Added - Complete API Coverage Sprint (30 new commands)

Massive API coverage expansion from 108 to 136 commands, achieving **59% API coverage** (136/232 operations). This completes nearly all of the v1.4.0 API coverage goals.

**Tags Management (5 commands)**
- `tags list` - List all contact tags with optional contact counts
- `tags show <tag>` - Show tag details including usage statistics
- `tags create -n <name>` - Create new global tag
- `tags update <tag> -n <name>` - Rename existing tag
- `tags delete <tag>` - Delete tag (with confirmation, removes from all contacts)

**Interests Management (5 commands)**
- `interests list [list-id]` - List interests (auto-detects if only one list)
- `interests get [list-id] <interest-name>` - Get interest details
- `interests create [list-id] -n <name>` - Create interest with optional alias
- `interests update [list-id] <interest-name>` - Update interest name/alias
- `interests delete [list-id] <interest-name>` - Delete interest (with confirmation)

**Contact-Level Interest Management (2 commands)**
- `contacts add-interests <list-id>` - Add interests to contacts (bulk via --contacts IDs or --query SQL)
- `contacts remove-interests <list-id>` - Remove interests from contacts (bulk operations supported)

**Campaign Enhancements (3 commands)**
- `campaigns render <id>` - Render campaign HTML preview with optional contact personalization
- `campaigns revisions <id>` - List campaign revision history with pagination
- `campaigns blueprints` - List campaign blueprints/templates with filtering

**Activity Logs (6 commands)**
- `logs campaign <id>` - View campaign activity logs with filtering and sorting
- `logs list [list-id]` - View list activity logs (auto-detects if only one list)
- `logs campaign-export <id>` - Create campaign log export to CSV
- `logs campaign-export-download <id> <export-id>` - Get download URL for campaign log export
- `logs list-export [list-id]` - Create list log export to CSV
- `logs list-export-download [list-id] <export-id>` - Get download URL for list log export

**Transactional Email Templates (9 commands)**
- `transactional-templates list [list-id]` - List templates (auto-detects if only one list)
- `transactional-templates show [list-id] <id>` - Show template details
- `transactional-templates create [list-id]` - Create template with HTML/text/subject
- `transactional-templates update [list-id] <id>` - Update template content
- `transactional-templates delete [list-id] <id>` - Delete template (with confirmation)
- `transactional-templates send [list-id] <id>` - Send to contact ID or email address
- `transactional-templates test [list-id] <id>` - Send test email with variables
- `transactional-templates render [list-id] <id>` - Render template HTML with variables

### API Coverage Progress
- **Before**: 108 commands (46% coverage)
- **After**: 136 commands (59% coverage)
- **Added**: 30 commands in this release
- **v1.4.0 Target**: 140 commands (60%) - 96% complete, just 4 commands away!

### Key Features
- **Auto-Detection**: All list-scoped commands support automatic list ID detection when only one list exists
- **Profile-Aware**: All new commands respect user profiles (developer/marketer/balanced) for output formatting and interactivity
- **Interactive Confirmations**: Delete operations include profile-aware confirmation prompts (can be skipped with --force)
- **Bulk Operations**: Contact interest management supports bulk operations via contact IDs or SQL queries
- **Progress Indicators**: Tag/interest bulk operations show progress with elapsed time
- **Error Handling**: Enhanced error messages with context-specific suggestions for all new commands
- **SDK Integration**: All commands use @cakemail-org/cakemail-sdk v2.0 for API calls

### Example Usage

**Tags Management:**
```bash
# List all tags with contact counts
$ cakemail tags list --with-count
✓ Tags retrieved successfully
┌────┬─────────┬────────────────┬─────────────────────┐
│ ID │ Name    │ Contacts Count │ Created At          │
├────┼─────────┼────────────────┼─────────────────────┤
│ 1  │ vip     │ 342            │ 2025-09-15 10:23:11 │
│ 2  │ premium │ 128            │ 2025-09-20 14:05:42 │
└────┴─────────┴────────────────┴─────────────────────┘

# Create and manage tags
$ cakemail tags create --name "early-adopter"
$ cakemail tags update "early-adopter" --name "beta-tester"
$ cakemail tags delete "old-tag"
```

**Interests Management:**
```bash
# Create interest (auto-detects list if only one exists)
$ cakemail interests create --name "Product Updates" --alias "updates"

# Bulk add interests to contacts
$ cakemail contacts add-interests 123 -i "updates,news" -c "1,2,3"
$ cakemail contacts add-interests 123 -i "promotions" -q "status==active"

# Remove interests from contacts
$ cakemail contacts remove-interests 123 -i "old-interest" -q "tags==inactive"
```

**Campaign Enhancements:**
```bash
# Render campaign with contact personalization
$ cakemail campaigns render 789 --contact-id 456

# View campaign revision history
$ cakemail campaigns revisions 789

# Browse campaign blueprints
$ cakemail campaigns blueprints --filter "is_owner" --sort "+name"
```

**Activity Logs:**
```bash
# View campaign logs with filtering
$ cakemail logs campaign 789 --filter "type==open" --sort "+time"

# Export campaign logs to CSV
$ cakemail logs campaign-export 789 --description "Q4 Analytics"
$ cakemail logs campaign-export-download 789 export-id-123

# View and export list activity
$ cakemail logs list --start-time 1696118400 --filter "type==subscribe"
```

**Transactional Templates:**
```bash
# Create template
$ cakemail transactional-templates create \
  --name "Order Confirmation" \
  --subject "Your order #{{order_id}}" \
  --html "<h1>Thank you!</h1>" \
  --sender-id 456

# Send with variables
$ cakemail transactional-templates send 123 \
  --email user@example.com \
  --variables '{"order_id":"12345","total":"$99.99"}'

# Test template
$ cakemail transactional-templates test 123 \
  --email test@example.com \
  --variables '{"order_id":"TEST"}'

# Render preview
$ cakemail transactional-templates render 123 \
  --contact-id 456 \
  --variables '{"order_id":"12345"}'
```

### Changed
- Coverage increased from 108 to 136 commands (46% → 59% API coverage)
- Contact commands now include interest management operations
- Campaign commands now include render, revisions, and blueprints
- Version bumped to 1.6.0

### Technical Improvements
- Created `src/commands/tags.ts` - Complete tags management
- Created `src/commands/interests.ts` - Interest CRUD operations
- Created `src/commands/logs.ts` - Activity logs and exports
- Created `src/commands/transactional-templates.ts` - Full transactional template lifecycle
- Enhanced `src/commands/campaigns.ts` - Added render, revisions, blueprints
- Enhanced `src/commands/contacts.ts` - Added add-interests, remove-interests
- All new commands follow SDK-based architecture with proper error handling
- All commands support profile-aware output and confirmations

### Documentation
- Updated API coverage metrics to reflect 59% completion
- Added comprehensive examples for all new command groups
- Documented bulk operations for interest management

### Notes
- **No breaking changes** - All existing commands remain compatible
- All new delete operations respect profile settings for confirmations
- Bulk operations show progress indicators for better UX
- Auto-detection makes commands work with zero configuration for single-list users
- Full backward compatibility with v1.5.0 commands
- Nearly achieved v1.4.0 target of 60% API coverage (96% complete)

## [1.5.0] - 2025-10-11

### Added - Complete Profile System

**Three User Profiles with Adaptive Behavior**
- **Developer Profile**: JSON output, minimal colors, no prompts, no confirmations, ISO8601 dates, verbose errors, show API details
- **Marketer Profile**: Compact output, rich colors, interactive prompts, confirmations, relative dates, friendly errors, helpful tips
- **Balanced Profile** (Default): Table output, moderate colors, auto-detect prompts, confirmations, friendly dates, balanced errors

**Profile Management Commands (6 commands)**
- `config profile` - Show current profile and all settings
- `config profile-set <type>` - Switch to different profile (developer|marketer|balanced)
- `config preview <type>` - Preview profile settings without switching
- `config set <key> <value>` - Customize individual settings
- `config reset` - Reset all settings to profile defaults
- `config show` - Show complete configuration including auth and defaults

**Interactive Prompt System**
- Smart environment detection (TTY, CI, batch mode)
- Profile-aware prompts that respect user preferences
- Interactive text, number, select, multi-select, confirm, and password prompts
- Automatic prompt suppression in non-interactive environments
- `promptText()`, `promptNumber()`, `promptSelect()`, `promptMultiSelect()`, `promptConfirm()`, `promptPassword()`

**Smart Resource Selection with Interactive Prompts**
- `campaigns create` - Interactive prompts for campaign name, list selection, and sender selection
- `lists create` - Interactive prompt for list name and optional language
- Auto-detects single resources (lists, senders) or shows interactive selection menu
- Displays resource details during selection (e.g., "Newsletter List (1,234 contacts)")

**Profile-Aware Confirmations**
- Developer profile: Skip all confirmations (trusts the developer)
- Marketer profile: Always confirm destructive operations (safety first)
- Balanced profile: Confirm in interactive mode, skip in scripts
- Automatic confirmation suppression in CI/batch environments

**Global CLI Flags**
- `--profile <type>` - Override profile for single command without switching
- `--batch` - Explicit scripting mode (disable all interactive prompts)
- Works with all commands: `cakemail --profile developer campaigns list`

**Profile-Aware Output Features**
- Color schemes: none (no colors), minimal (red/green only), moderate, rich (full colors)
- Date formats: iso8601 (machine-readable), friendly (human-readable), relative (time ago)
- Error messages: technical (developer) vs friendly (marketer) based on profile
- Progress indicators: shown/hidden based on profile settings
- Tips and hints: enabled for marketer, disabled for developer

**Configuration Storage**
- Profile settings stored in `~/.cakemail/config.json`
- Automatic migration from `.env` to config file
- Profile selection integrated into first-time auth flow
- Backward compatible with existing `.env` configurations

### Changed
- `OutputFormatter` now accepts profile config getter for adaptive behavior
- `confirmDelete()` and related functions now accept optional `profileConfig` parameter
- Interactive prompts automatically skip in non-TTY and CI environments
- `campaigns create` and `lists create` now have optional `--name` parameter (prompts if missing)
- All confirmation functions now respect profile settings
- Error display adapts to profile (technical vs friendly)
- Spinners adapt to profile (shown/hidden based on `show_progress` setting)

### Technical Improvements
- Created `src/types/profile.ts` - Complete profile type system with 3 profiles
- Created `src/utils/config-file.ts` - Profile config storage and management
- Created `src/utils/interactive.ts` - Interactive prompt system with environment detection
- Enhanced `src/utils/confirm.ts` - Profile-aware confirmations
- Enhanced `src/utils/errors.ts` - Profile-aware error messages
- Enhanced `src/commands/campaigns.ts` - Interactive create with smart resource selection
- Enhanced `src/commands/lists.ts` - Interactive create
- Added `getProfile()` public method to `OutputFormatter`
- Profile config uses lazy evaluation pattern for runtime overrides

### Configuration Priority
```
CLI flags (--profile, --batch) > Env vars > Custom overrides > Profile defaults > Hard-coded defaults
```

### Example Usage

**Switch Profiles:**
```bash
cakemail config profile-set developer  # Fast, scriptable, no interruptions
cakemail config profile-set marketer   # Guided, interactive, safe
cakemail config profile-set balanced   # Best of both worlds (default)
```

**Preview Before Switching:**
```bash
cakemail config preview developer  # See what developer mode looks like
```

**Override Profile Once:**
```bash
cakemail --profile developer campaigns list  # Use developer mode just once
cakemail --batch campaigns create ...        # Disable prompts for this command
```

**Interactive Campaign Creation (Marketer Profile):**
```bash
$ cakemail campaigns create
Campaign name: Weekly Newsletter
? Select a list: › Newsletter Subscribers (1,234 contacts)
? Select a sender: › Marketing Team <marketing@company.com>
✓ Campaign created: 789
```

**Scripted Campaign Creation (Developer Profile):**
```bash
$ cakemail campaigns create --name "Weekly Newsletter" --list-id 123 --sender-id 456
{"id":789,"name":"Weekly Newsletter","status":"draft"}
```

### Documentation
- Reorganized all documentation into `/docs` structure
- Created comprehensive user manual with 11 sections
- Added developer documentation (ARCHITECTURE, AUTH, CONTRIBUTING)
- Added planning documents (BACKLOG, PROFILE_SYSTEM_TASKS)
- Archived old documentation for reference

### Notes
- **No breaking changes** - All existing commands remain compatible
- Profile system is opt-in - balanced profile is the default
- Developers can use `--profile developer` for fast, non-interactive behavior
- Marketers get guided experience with safety confirmations
- Scripts automatically detect non-TTY and skip prompts
- Full backward compatibility with `.env` based configuration

## [1.4.0] - 2025-10-11

### Added - Seamless Authentication, Multi-Tenant Support & Enhanced Output

**Enhanced Output Formatting - Visual Polish**
- JSON syntax highlighting with color-coded keys, values, booleans, and nulls
- Color-coded status badges with emoji indicators for quick visual scanning
- Relative time formatting for dates (e.g., "2h ago", "3d ago")
- Number formatting with thousands separators (1,234 instead of 1234)
- Enhanced pagination display showing item ranges and page navigation hints
- Better null/empty value handling with visual indicators (—)
- Status-specific colors and emoji:
  - Campaigns: 🟢 sent, 🔵 scheduled, 🟡 sending, ⚪ draft, 🔴 failed
  - Contacts: ✓ active, ✗ unsubscribed, ⚠ bounced
  - Senders: ✓ confirmed, ⏳ pending
- Smart field truncation for long values in table/compact views
- Bold column headers and improved table styling
- Compact mode now shows status badges and metadata inline
- Warning method added to OutputFormatter for consistency

**Pagination Enhancements:**
```bash
# Before:
Total: 150 items
[table data]

# After:
Showing 1-25 of 150 • Page 1 of 6
[table data with colored status badges]

💡 Next: --page 2
```

**Status Badge Examples:**
- Campaign list: Shows "🟢 sent" instead of just "sent"
- Sender list: Shows "✓ Yes" or "⏳ Pending" for confirmation status
- Contact list: Shows "✓ active" or "✗ unsubscribed"

### Added - Seamless Authentication & Multi-Tenant Support

**Interactive Authentication**
- Seamless inline authentication prompts when credentials are missing
- No separate setup command required - authenticate on first use
- Interactive email/password prompts using inquirer
- Automatic credential validation via API
- Credentials automatically saved to `.env` file
- Welcome message shows total accessible accounts

**Multi-Tenant Account Management (5 new commands)**
- `account show` - Display current account details
- `account list` - List all accessible accounts (parent + sub-accounts)
- `account use <id>` - Switch active account context
- `account test` - Validate current credentials
- `account logout --force` - Remove credentials from .env

**Account Context Management**
- New `CAKEMAIL_CURRENT_ACCOUNT_ID` environment variable
- Global `--account <id>` flag to override context per-command
- Account context persists in `.env` file between sessions

**Progress Indicators for Long-Running Operations**
- Visual progress bars for bulk operations (batch tagging, multiple deletes)
- Polling progress with elapsed time and attempt tracking for async exports
- Multi-step progress indicators for complex workflows
- `--no-wait` flag for export commands to return immediately
- Progress utilities: `PollingProgress`, `BatchProgress`, `MultiStepProgress`, `pollUntilComplete()`

**Enhanced Error Handling & Validation**
- User-friendly error messages with context-aware suggestions
- HTTP status code mapping (400, 401, 403, 404, 409, 422, 429, 500, 502, 503)
- Error pattern matching for common scenarios (network errors, email validation, resource not found)
- Pre-flight validation helpers: email format, ID validation, date format, required fields, JSON parsing
- Colored output with actionable help text and command suggestions
- Enhanced error display in commands: campaigns, lists, reports, contacts, senders

**Example Error Messages:**
```
✗ Error: Campaign not found
→ Campaign with ID '999' doesn't exist
💡 Tip: To see all campaigns, use: cakemail campaigns list
```

**Interactive Confirmations for Destructive Operations**
- Interactive Y/N prompts for all delete operations (13 commands enhanced)
- Visual danger indicators (⚠) with clear warnings about what will be deleted
- Context-specific details about consequences (e.g., "All contacts will be deleted")
- Graceful cancellation with informative messages
- `--force` flag still available for automation/scripting purposes
- Consistent confirmation UX across all destructive operations

**Enhanced Commands with Interactive Confirmations:**
- `campaigns delete` - Warns about permanent deletion
- `lists delete` - HIGH DANGER: Warns about contact and segment deletion
- `lists form-delete` - Warns about website forms breaking
- `contacts delete` - Warns about contact history loss
- `contacts export-delete` - Confirms export file deletion
- `reports delete-campaigns-export` - Confirms export deletion
- `attributes delete` - Warns about data loss from all contacts
- `segments delete` - Confirms segment deletion
- `senders delete` - Confirms sender deletion
- `templates delete` - Warns about campaign impacts
- `suppressed delete` - Warns email will receive emails again
- `suppressed export-delete` - Confirms export deletion
- `account logout` - LOW DANGER: Confirms credential removal

**Smart Defaults - Auto-Detection of Resources**
- Auto-detects list ID when only one list exists (14 commands enhanced)
- Auto-detects sender ID when only one confirmed sender exists (1 command)
- Session caching with 5-minute TTL for frequently used resources
- Helpful suggestions when multiple resources exist
- Zero-configuration workflow for single-list users

**Commands with Smart Defaults (list-id now optional):**
- `contacts list [list-id]` - Auto-detects list
- `contacts add [list-id]` - Auto-detects list
- `contacts export [list-id]` - Auto-detects list
- `contacts exports [list-id]` - Auto-detects list
- `segments list [list-id]` - Auto-detects list
- `segments get [list-id] <segment-id>` - Auto-detects list
- `segments create [list-id]` - Auto-detects list
- `segments update [list-id] <segment-id>` - Auto-detects list
- `segments delete [list-id] <segment-id>` - Auto-detects list
- `segments contacts [list-id] <segment-id>` - Auto-detects list
- `attributes list [list-id]` - Auto-detects list
- `attributes get [list-id] <name>` - Auto-detects list
- `attributes create [list-id]` - Auto-detects list
- `attributes delete [list-id] <name>` - Auto-detects list
- `campaigns create` - Auto-detects list-id AND sender-id

**Example Smart Default Behavior:**
```bash
# Before (required list-id):
$ cakemail contacts list 123

# After (auto-detects if you have one list):
$ cakemail contacts list
Auto-detected list: 123 (My Newsletter List)
[shows contacts]

# Multiple resources scenario:
$ cakemail contacts list
Multiple lists found. Please specify --list-id <id>
Available lists:
  123: Newsletter List
  456: Product Updates
```

### Changed
- `getConfig()` is now async to support interactive authentication
- Config loading detects help/version commands to skip authentication
- Export commands now poll until completion by default (with `--no-wait` option)
- Error handling now validates inputs before API calls to catch errors early
- All delete operations now require interactive confirmation (or `--force` flag)
- `--force` flag description changed from "Skip confirmation" to "Skip confirmation prompt"
- List-id and sender-id parameters now optional in 15 commands with auto-detection
- Commands with `<list-id>` changed to `[list-id]` to indicate optional parameter
- Coverage increased from 103 to 108 commands (44% → 46% API coverage)

### Dependencies
- Added `inquirer@^9.3.8` for interactive prompts
- Added `@types/inquirer@^9.0.9` for TypeScript support

### Documentation
- Updated `.env.example` with multi-tenant account context
- Added account management examples to README
- Documented seamless authentication flow

### Technical Improvements
- Created `src/utils/progress.ts` with 4 progress indicator types
- Created `src/utils/errors.ts` with comprehensive error handling utilities
- Created `src/utils/confirm.ts` with interactive confirmation utilities
- Enhanced `src/utils/output.ts` with advanced formatting capabilities:
  - JSON syntax highlighting using regex-based colorization
  - Status badge formatting with campaign/contact/sender-specific colors
  - Relative date formatting with human-readable output
  - Enhanced pagination with range display and navigation hints
  - Number formatting with locale-aware thousands separators
- Enhanced 10 command files with validation and better error messages
- Enhanced 10 command files with interactive confirmations (13 delete operations total)
- All error messages include suggestions and help text for resolution
- All delete operations now have consistent confirmation UX
- All output modes (JSON, table, compact) now have enhanced visual formatting

### Notes
- First-time users are prompted for credentials inline with their first command
- Multi-tenant users can easily switch between parent and sub-accounts
- Progress indicators provide real-time feedback for long operations
- Error messages guide users toward resolution with specific suggestions
- Interactive confirmations make destructive operations safer while maintaining scriptability with `--force`
- No breaking changes - all v1.3 commands remain compatible (but now require confirmation)

## [1.3.0] - 2025-10-11

### Added - Analytics & Data Operations (47 new commands)

**Reports & Analytics (12 commands)**
- `reports campaign <id>` - Campaign analytics and statistics
- `reports campaign-links <id>` - Link click analytics
- `reports list <id>` - List growth and engagement statistics
- `reports account` - Account-wide analytics
- `reports emails` - Email API statistics with date filtering
- `reports emails-summary` - Email API activity summary
- `reports transactional-emails` - Transactional email statistics
- `reports campaigns-exports` - List campaign report exports
- `reports export-campaigns` - Create campaign report export
- `reports campaigns-export <id>` - Get export status
- `reports download-campaigns-export <id>` - Download export
- `reports delete-campaigns-export <id>` - Delete export

**Contact Import/Export (9 commands)**
- Contact import command - Planned for future release (requires CSV parser)
- `contacts export <list-id>` - Create contacts export with filtering
- `contacts exports <list-id>` - List all contact exports
- `contacts export-get <list-id> <export-id>` - Get export status
- `contacts export-download <list-id> <export-id>` - Download export file
- `contacts export-delete <list-id> <export-id>` - Delete export
- `contacts tag <list-id> <contact-id>` - Tag individual contact
- `contacts untag <list-id> <contact-id>` - Remove tags from contact
- `contacts tag-bulk <list-id>` - Tag multiple contacts at once
- `contacts untag-bulk <list-id>` - Remove tags from multiple contacts

**Segments (6 commands)**
- `segments list <list-id>` - List all segments in a list
- `segments get <list-id> <segment-id>` - Get segment details
- `segments create <list-id>` - Create new segment with conditions
- `segments update <list-id> <segment-id>` - Update segment
- `segments delete <list-id> <segment-id>` - Delete segment
- `segments contacts <list-id> <segment-id>` - List contacts in segment

**Custom Attributes (4 commands)**
- `attributes list <list-id>` - List all custom attributes
- `attributes get <list-id> <name>` - Get attribute details
- `attributes create <list-id>` - Create custom attribute (text, number, date, boolean)
- `attributes delete <list-id> <name>` - Delete custom attribute

**Suppression List (7 commands)**
- `suppressed list` - List all suppressed email addresses
- `suppressed add <email>` - Add email to suppression list
- `suppressed delete <email>` - Remove email from suppression list
- `suppressed exports` - List suppression exports
- `suppressed export` - Create suppression list export
- `suppressed export-get <export-id>` - Get export status
- `suppressed export-download <export-id>` - Download export

**Extended List Operations (7 commands)**
- `lists update <id>` - Update list name and parameters
- `lists archive <id>` - Archive a list
- `lists accept-policy <id>` - Accept policy for a list
- `lists forms <id>` - List subscription form endpoints
- `lists form-create <id>` - Create subscription form endpoint
- `lists form-delete <list-id> <form-id>` - Delete subscription form

**Extended Email API (2 commands)**
- `emails logs` - Email API activity logs with filtering
- `emails tags` - List all email tags

### Changed
- Coverage increased from 56 to 103 commands (24% → 44% API coverage)
- Enhanced contact management with bulk tagging operations
- Improved data portability with import/export capabilities

### Documentation
- Complete rewrite of API_COVERAGE.md with detailed v1.3 roadmap
- Added coverage expansion plan for v1.3-v1.5
- Added priority matrix for feature development
- Added implementation timeline and effort estimates
- Updated API coverage table with 25 categories
- Created UX_IMPLEMENTATION_PLAN.md for future improvements

### Notes
- All new commands follow SDK-based architecture
- Maintains backwards compatibility with all v1.2 commands
- File upload support for contact imports (CSV/JSON)
- Export operations support async task monitoring

## [1.2.0] - 2025-10-10

### Changed
- **BREAKING**: Renamed package from `@cakemail-org/cli` to `@cakemail-org/cakemail-cli`
- **BREAKING**: Renamed Homebrew formula from `cakemail` to `cakemail-cli`
- Binary name remains `cakemail` for ease of use

### Migration
- npm users: `npm install -g @cakemail-org/cakemail-cli`
- Homebrew users: `brew uninstall cakemail && brew install cakemail-cli`
- Old package `@cakemail-org/cli` deprecated with migration message

## [1.1.2] - 2025-10-10

### Changed
- **BREAKING**: Migrated to new SDK package name `@cakemail-org/cakemail-sdk` (was `cakemail-sdk`)
- Updated all documentation references to new SDK package name

### Added
- Homebrew distribution support via `brew tap cakemail/cakemail`
- HOMEBREW.md with complete Homebrew setup guide

## [1.1.1] - 2025-10-10

### Security
- Pre-publication security cleanup
- Enhanced .gitignore patterns

### Documentation
- Added CONTRIBUTING.md with development guidelines
- Added CHANGELOG.md with version history
- Fixed package name in ARCHITECTURE.md

### Fixed
- Replaced console.log with formatter.output in emails render command

## [1.1.0] - 2025-10-10

### Added
- Full migration to official @cakemail-org/cakemail-sdk v2.0 with 100% API coverage (232 operations)
- Complete senders management (7 commands)
- Complete templates management (6 commands)
- User-configurable default output format via `CAKEMAIL_OUTPUT_FORMAT` environment variable

### Changed
- **BREAKING**: Sender confirmation now uses single confirmation ID: `senders confirm <confirmation-id>` (was `senders confirm <id> -k <key>`)
- All commands now use SDK 2.0 services (object-based API)
- Updated all SDK method calls to use object-based parameters
- Improved authentication error messages

### Fixed
- Console.log replaced with formatter.output in emails render command
- URL encoding for authentication parameters
- .env loading now uses current working directory

### Documentation
- Complete rewrite of API_COVERAGE.md to reflect SDK-based approach
- Updated README with SDK reference and all new commands
- Added comprehensive examples for all command categories

## [1.0.0] - 2025-10-09

### Added
- Initial migration to official @cakemail-org/cakemail-sdk v1.1.0
- SDK integration for campaigns, lists, contacts, emails, and webhooks

### Changed
- Replaced custom HTTP client with SDK wrapper
- All migrated commands now use `client.sdk.*` methods

## [0.5.0] - 2025-10-09

### Added
- Email API v2 support for transactional emails
- `emails send` - Submit transactional emails with HTML/text or templates
- `emails get` - Retrieve submitted email details
- `emails render` - Render email HTML
- Template support with file uploads
- Custom headers, attachments, and tracking options

## [0.4.0] - 2025-10-08

### Added
- Complete campaign lifecycle management (15 commands)
- Campaign scheduling, rescheduling, and unscheduling
- Campaign suspension and resumption
- Campaign cancellation
- Test email sending
- Campaign archiving and unarchiving
- Campaign links listing
- Advanced filtering and sorting for campaigns

## [0.3.0] - 2025-10-08

### Added
- Complete template management (6 commands)
- `templates create` with HTML/text file upload support
- `templates update` with file upload support
- `templates render` for template preview
- Template deletion with confirmation
- Advanced filtering and sorting for templates

## [0.2.0] - 2025-10-08

### Added
- Webhooks management (6 commands)
- `webhooks create` with event subscriptions
- `webhooks update` for webhook configuration
- `webhooks archive` and `webhooks unarchive`
- Webhook secret support for signature verification

## [0.1.3] - 2025-10-08

### Fixed
- Removed unsupported format options from documentation

## [0.1.2] - 2025-10-08

### Fixed
- Corrected API base URL to api.cakemail.dev

## [0.1.1] - 2025-10-08

### Fixed
- API base URL configuration

## [0.1.0] - 2025-10-08

### Added
- Initial release
- Campaigns management (list, get, create, update, delete)
- Lists management (list, get, create, delete)
- Contacts management (list, get, add, update, delete, unsubscribe)
- Senders management (list, get, create, update, delete)
- Three output formats: JSON, table, compact
- Environment variable configuration
- Access token and email/password authentication
- Advanced filtering and sorting
- Pagination support

[1.1.0]: https://github.com/cakemail/cakemail-cli/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cakemail/cakemail-cli/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/cakemail/cakemail-cli/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/cakemail/cakemail-cli/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/cakemail/cakemail-cli/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/cakemail/cakemail-cli/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/cakemail/cakemail-cli/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/cakemail/cakemail-cli/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/cakemail/cakemail-cli/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/cakemail/cakemail-cli/releases/tag/v0.1.0
