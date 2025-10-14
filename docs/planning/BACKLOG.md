# Cakemail CLI - Master Backlog

**Last Updated:** 2025-10-14
**Current Version:** 1.6.0
**Project Status:** Active Development

---

## 📊 Overview

This document tracks all planned work for the Cakemail CLI across multiple dimensions:
- **UX Improvements** (v1.4.0 - v1.7.0)
- **API Coverage Expansion** (v1.3.0 - v1.6.0+)
- **Profile System** (v1.5.0)

---

## ✅ Recently Completed

### v1.6.0 - Testing Infrastructure + Bug Fixes ✅ SHIPPED (2025-10-14)

**Status:** ✅ COMPLETED AND SHIPPED
**Test Coverage:** 0% → 6% (with infrastructure for 100%)

#### Testing Infrastructure Added
- [x] **Vitest Test Framework** - Modern test runner with coverage reporting
- [x] **Integration Tests** - 5 passing tests against real Cakemail API
- [x] **PTY Test Infrastructure** - Simulate real terminal sessions with colors/spinners
- [x] **Mock HTTP Server** - Express-based server for isolated subprocess testing
- [x] **Test Documentation** - Complete guides (PTY_TESTING_GUIDE.md, PTY_SETUP.md)
- [x] **Test Scripts** - npm test, test:integration, test:pty, test:coverage, test:ci

#### Bug Fixes
- [x] **Pagination** - Support new SDK pagination format (nested pagination object)
- [x] **Table Rendering** - Fix column width calculation to handle undefined values

#### Key Features
- **Real API Testing** - Integration tests validate against live Cakemail API
- **Terminal Simulation** - PTY tests verify exact user experience (colors, spinners, prompts)
- **Mock Server** - Express server enables realistic subprocess testing without external dependencies
- **CI/CD Ready** - Full test suite for automated testing pipelines
- **Node Version Aware** - Clear documentation for Node 18-20 requirement for PTY tests

**Impact:** Established comprehensive testing infrastructure for ongoing quality assurance

---

### v1.6.0 - API Coverage Expansion ✅ SHIPPED (2025-10-11)

**Status:** ✅ COMPLETED AND SHIPPED
**Coverage:** 108 → 136 commands (46% → 59% coverage)

#### New Command Groups (30 commands total)
- [x] Tags (5 commands) - List, show, create, update, delete tags
- [x] Interests (5 commands) - List, show, create, update, delete interests
- [x] Contact Interests (2 commands) - Add/remove interests from contacts (bulk operations)
- [x] Campaign Enhancements (3 commands) - Show HTML, stats, extended filtering
- [x] Activity Logs (3 commands) - Campaign logs, list logs, show log entry
- [x] Transactional Templates (12 commands) - Full CRUD + send/test/render operations

#### Key Features
- **Tags Management** - Create and assign tags to contacts
- **Interests Management** - Track subscriber interests with bulk operations
- **Transactional Templates** - Complete template lifecycle with variable support
- **Activity Logs** - Campaign and list activity tracking with filtering
- **Campaign Stats** - Direct access to campaign statistics
- **Auto-Detection** - List ID auto-detection for transactional templates

**Impact:** Major API coverage increase, reaching 59% of total Cakemail API (136/232 commands)

---

### v1.5.0 - Profile System ✅ SHIPPED (2025-10-11)

**Status:** ✅ COMPLETED AND SHIPPED

#### Profile System Implementation (All Phases Complete)
- [x] **Phase 1: Foundation** - Profile schema, config storage, profile selection
- [x] **Phase 2: Output Adaptation** - Color schemes, date formats, error messages, tips
- [x] **Phase 3: Behavior Adaptation** - Interactive prompts, confirmations, progress indicators
- [x] **Phase 4: Polish & Testing** - `--profile` flag, `--batch` flag, preview command

#### New Profile Management Commands (6 commands)
- [x] `config profile` - Show current profile and settings
- [x] `config profile-set <type>` - Switch profiles (developer|marketer|balanced)
- [x] `config preview <type>` - Preview profile without switching
- [x] `config set <key> <value>` - Customize individual settings
- [x] `config reset` - Reset to profile defaults
- [x] `config show` - Show complete configuration

#### Three User Profiles
- [x] **Developer Profile** - JSON, minimal colors, no prompts, no confirmations
- [x] **Marketer Profile** - Compact, rich colors, prompts, confirmations, tips
- [x] **Balanced Profile** - Table, moderate colors, auto-detect (default)

#### Interactive Features
- [x] Smart environment detection (TTY, CI, batch mode)
- [x] Interactive campaign creation with list/sender selection
- [x] Interactive list creation with name prompt
- [x] Profile-aware confirmations for destructive operations
- [x] Profile-aware progress indicators
- [x] Auto-detection of single resources

#### Configuration System
- [x] Config stored in `~/.cakemail/config.json`
- [x] Automatic migration from `.env`
- [x] Profile selection in auth flow
- [x] Lazy evaluation for runtime overrides
- [x] Configuration priority: CLI flags > Env vars > Overrides > Profile > Defaults

#### Global Flags
- [x] `--profile <type>` - Override profile for single command
- [x] `--batch` - Explicit scripting mode (disable all prompts)

**Documentation:**
- [x] Complete CHANGELOG entry with examples
- [x] Updated README with Profile System section
- [x] Interactive usage examples
- [x] Profile management commands documented

**Impact:** Transformative UX improvement - CLI now adapts to user type (developer vs marketer)

---

### v1.4.0 - Seamless Authentication & Enhanced Output ✅ SHIPPED (2025-10-11)

### Seamless Authentication & Multi-Tenant Support
- [x] Interactive authentication prompts
- [x] Multi-tenant account management (5 commands)
- [x] Account context management with `.env` persistence
- [x] Account commands: show, list, use, test, logout

### Progress Indicators
- [x] Visual progress bars for bulk operations
- [x] Polling progress with elapsed time
- [x] Multi-step progress indicators
- [x] `--no-wait` flag for async operations

### Enhanced Error Handling
- [x] User-friendly error messages with context
- [x] HTTP status code mapping (400, 401, 403, 404, 409, 422, 429, 500, 502, 503)
- [x] Pre-flight validation helpers
- [x] Colored output with actionable help text

### Interactive Confirmations
- [x] Interactive Y/N prompts for all delete operations (13 commands)
- [x] Visual danger indicators (⚠)
- [x] Context-specific details about consequences
- [x] `--force` flag for automation

### Smart Defaults
- [x] Auto-detect list ID when only one exists (14 commands)
- [x] Auto-detect sender ID when only one confirmed sender exists (1 command)
- [x] Session caching with 5-minute TTL
- [x] Helpful suggestions when multiple resources exist

### Enhanced Output Formatting ✨ NEW
- [x] JSON syntax highlighting with color-coded keys/values
- [x] Color-coded status badges with emoji indicators
- [x] Relative time formatting for dates
- [x] Number formatting with thousands separators
- [x] Enhanced pagination display with navigation hints
- [x] Better null/empty value handling
- [x] Smart field truncation
- [x] Bold column headers and improved table styling
- [x] Compact mode with status badges inline
- [x] Warning method added to OutputFormatter

---

## 🎯 Current Focus

### Active Work
- **Status:** Just completed Testing Infrastructure + Bug Fixes (v1.6.0) ✅
- **Next Decision:** Choose next feature from backlog

### What We Just Shipped (v1.6.0)
- ✅ Comprehensive testing infrastructure (Vitest, integration tests, PTY tests)
- ✅ Bug fixes for pagination and table rendering
- ✅ 30 new commands across 6 feature areas (from earlier in v1.6.0)
- ✅ Tags and Interests management
- ✅ Transactional templates with full lifecycle
- ✅ Activity logs and campaign enhancements
- ✅ 59% API coverage achieved (136/232 commands)
- ✅ 6% test coverage established with room to grow to 100%

### Quick Wins Available (< 3 days each)
- Natural date parsing (2-3 days)
- Email preview (1-2 days)
- ~~Campaign enhancements~~ ✅ v1.6.0
- ~~Tags commands~~ ✅ v1.6.0
- ~~Interests commands~~ ✅ v1.6.0

---

## 📋 Backlog by Category

---

## 1️⃣ UX Improvements (v1.4.0 - v1.7.0)

Based on: `UX_IMPLEMENTATION_PLAN.md`

### v1.4.0 - Critical UX Foundations ✅ IN PROGRESS

**Status:** ~90% Complete
**Remaining Items:**

#### ❌ Interactive Auth Setup
**Priority:** CRITICAL
**Effort:** Medium (3-5 days)
**Status:** NOT STARTED (Auth works via .env, needs interactive setup)

**What:**
- `cakemail auth setup` - Interactive credential configuration
- `cakemail auth status` - Show current auth status
- `cakemail auth logout` - Clear stored credentials
- Config file: `~/.cakemail/config.json` with encryption

**Implementation:**
- Create `src/commands/auth.ts`
- Create `src/utils/config-manager.ts`
- Modify `src/utils/config.ts`
- Libraries: Already have `inquirer`, need config encryption

**Why Not Done:**
- Current `.env` approach works
- Interactive setup is nice-to-have, not critical
- May be superseded by profile system

**Decision Needed:** Skip or implement before profile system?

#### ❌ Natural Date Parsing
**Priority:** HIGH
**Effort:** Low (2-3 days)
**Status:** NOT STARTED

**What:**
- Accept "tomorrow 10am", "next monday", "+2 days"
- Use `chrono-node` for parsing
- Show confirmation: "Parsed 'tomorrow 10am' as Oct 12, 2025 10:00 AM"

**Files:**
- Create `src/utils/date-parser.ts`
- Modify `src/commands/campaigns.ts` (schedule, reschedule)
- Modify `src/commands/reports.ts` (date filtering)

**Libraries:**
- `chrono-node` - Natural language date parsing
- `date-fns` - Date manipulation (already have)

**Decision Needed:** Include in v1.4.0 or defer to v1.5.0?

#### ❌ Quickstart Wizard
**Priority:** CRITICAL
**Effort:** High (5-7 days)
**Status:** NOT STARTED

**What:**
- `cakemail quickstart` - Guided onboarding to send first email
- Steps: Check auth → Get/create sender → Get/create list → Add test contact → Send test email
- Interactive wizard with progress indicators

**Files:**
- Create `src/commands/quickstart.ts`
- Create `src/utils/wizard-helpers.ts`

**Dependencies:**
- Interactive auth setup (or can skip with .env)
- Smart defaults (✅ already have)

**Decision Needed:** Critical for onboarding, but requires auth setup first?

---

### v1.5.0 - Enhanced Usability

**Status:** NOT STARTED
**Estimated:** 2-3 weeks

#### Email Preview
**Priority:** HIGH
**Effort:** Low (1-2 days)

**What:**
- `cakemail campaigns preview <id>` - Open campaign in browser
- `cakemail templates preview <id>` - Open template in browser
- Use `open` library to launch browser

**Files:**
- Create `src/utils/preview.ts`
- Modify campaign/template commands

#### Interactive Mode for Missing Fields
**Priority:** HIGH
**Effort:** Medium (3-5 days)

**What:**
- If required field missing, prompt interactively (marketer profile)
- Example: `cakemail campaigns create` → prompts for name, list, sender
- Skip in non-TTY environments

**Files:**
- Create `src/middleware/interactive-prompts.ts`
- Modify all command files

#### Confirmation for Dangerous Operations ✅ DONE
- [x] Implemented in v1.4.0

#### Rich Table Output ✅ DONE
- [x] Implemented in v1.4.0

#### Search/Find Commands
**Priority:** MEDIUM
**Effort:** Medium (3-4 days)

**What:**
- `cakemail campaigns find <query>` - Fuzzy search campaigns
- `cakemail templates find <query>` - Fuzzy search templates
- `cakemail senders find <query>` - Fuzzy search senders

**Libraries:**
- `fuzzysort` - Fuzzy search

#### Smart File Handling
**Priority:** LOW
**Effort:** Medium (2-3 days)

**What:**
- Auto-detect HTML/text from files
- Parse HTML with `cheerio`
- Validate HTML before upload

**Files:**
- Create `src/utils/file-parser.ts`

---

### v1.6.0 - Power User Features

**Status:** NOT STARTED
**Estimated:** 2-3 weeks

#### Configuration Management
**Priority:** HIGH
**Effort:** Medium (3-4 days)

**What:**
- `cakemail config list` - Show all config
- `cakemail config get <key>` - Get value
- `cakemail config set <key> <value>` - Set value
- `cakemail config reset` - Reset to defaults

**Files:**
- Create `src/commands/config.ts`
- Expand `src/utils/config-manager.ts`

#### Shell Completion
**Priority:** MEDIUM
**Effort:** Medium (2-3 days)

**What:**
- `cakemail completion bash` - Generate bash completion
- `cakemail completion zsh` - Generate zsh completion
- Auto-complete commands, flags, IDs

**Libraries:**
- `omelette` or built-in completion

#### Bulk Operations Enhancement
**Priority:** MEDIUM
**Effort:** Medium (3-4 days)

**What:**
- Progress bars for imports/exports
- Batch API calls
- Resume interrupted operations

**Libraries:**
- `cli-progress`

#### Dry Run Mode
**Priority:** MEDIUM
**Effort:** Medium (2-3 days)

**What:**
- `--dry-run` flag for all write operations
- Show what would happen without executing

**Files:**
- Create `src/middleware/dry-run.ts`

#### Aliases
**Priority:** LOW
**Effort:** Low (1-2 days)

**What:**
- `cakemail c list` → `cakemail campaigns list`
- `cakemail ls` → `cakemail lists list`
- Custom user aliases

**Files:**
- Create `src/commands/alias.ts`

#### Template Scaffolding
**Priority:** LOW
**Effort:** Medium (2-3 days)

**What:**
- `cakemail init` - Generate project structure
- Template library with common patterns

**Files:**
- Create `src/commands/init.ts`

---

### v1.7.0+ - Nice to Have

**Status:** NOT STARTED
**Estimated:** Ongoing

- Enhanced help with examples
- Improved default output
- Better scripting support (exit codes, quiet mode, verbose mode)
- Update notifications
- `--watch` mode for real-time updates

---

## 2️⃣ API Coverage Expansion (v1.3.0 - v1.7.0+)

Based on: `API_COVERAGE.md`

**Current Coverage:** 136 / 232 commands (59%)
**Target v1.7.0:** 180+ / 232 commands (78%+)

### v1.3.0 - Analytics & Data Operations ✅ COMPLETED

**Status:** ✅ SHIPPED (2025-10-11)
**Added:** 47 new commands (56 → 103 commands)

- [x] Reports & Analytics (12 commands)
- [x] Contact Import/Export (9 commands)
- [x] Segments (6 commands)
- [x] Custom Attributes (4 commands)
- [x] Suppression List (7 commands)
- [x] Extended List Operations (7 commands)
- [x] Extended Email API (2 commands)

**Coverage:** 24% → 44% (103/232 commands)

---

### v1.6.0 - API Coverage Expansion ✅ COMPLETED (2025-10-11)

**Status:** ✅ SHIPPED
**API Coverage:** 46% → 59% (108 → 136 commands)

**Completed:**
- [x] Account management (5 commands) - show, list, use, test, logout [v1.4.0]
- [x] Tags (5 commands) - list, show, create, update, delete [v1.6.0]
- [x] Interests (5 commands) - list, show, create, update, delete [v1.6.0]
- [x] Contact Interests (2 commands) - add-interests, remove-interests [v1.6.0]
- [x] Transactional Templates (12 commands) - Full CRUD + send/test/render [v1.6.0]
- [x] Activity Logs (3 commands) - campaign, list, show [v1.6.0]
- [x] Campaign Enhancements (3 commands) - show-html, stats, extended filtering [v1.6.0]

**Original Target:** 140 commands (60% coverage)
**Actual Achievement:** 136 commands (59% coverage) - 96% of target
**Gap:** 4 commands remaining to reach 60%

---

### v1.7.0+ - Enterprise & Automation

**Status:** NOT STARTED
**Target:** 180+ / 232 commands (78%+ coverage)
**Gap:** 44+ commands to implement

#### Workflows (18 commands)
**Priority:** MEDIUM
**Effort:** High (10-15 days)

```bash
# Workflow management
cakemail workflows list
cakemail workflows create --name "Welcome Series"
cakemail workflows update <id>
cakemail workflows delete <id>
cakemail workflows activate <id>
cakemail workflows deactivate <id>
cakemail workflows lock <id>
cakemail workflows unlock <id>

# Workflow actions
cakemail workflows actions <workflow-id>
cakemail workflows action-create <workflow-id>
cakemail workflows action-update <workflow-id> <action-id>
cakemail workflows action-delete <workflow-id> <action-id>
cakemail workflows action-test <workflow-id> <action-id>

# Workflow analytics
cakemail workflows report <workflow-id> <action-id>
cakemail workflows logs <workflow-id> <action-id>
```

#### Account & User Management (13 commands) - PARTIALLY DONE
**Priority:** MEDIUM
**Effort:** Medium (6-8 days)
**Status:** 5/13 done (account commands)

**Remaining:**
```bash
# Account management (5 done, 3 remaining)
cakemail account update
cakemail account convert-to-org

# Sub-accounts (8 remaining)
cakemail sub-accounts list
cakemail sub-accounts create
cakemail sub-accounts suspend <id>

# Users (8 remaining)
cakemail users list
cakemail users create
cakemail users update <id>
cakemail users delete <id>
```

#### Domain & DKIM (7 commands)
**Priority:** MEDIUM
**Effort:** Medium (4-5 days)

```bash
cakemail domains show
cakemail domains update
cakemail domains validate
cakemail dkim list
cakemail dkim create --domain example.com
cakemail dkim delete <id>
```

#### Forms (5 commands)
**Priority:** LOW
**Effort:** Low (2-3 days)

```bash
cakemail forms list
cakemail forms create
cakemail forms update <id>
cakemail forms delete <id>
cakemail forms analytics <id>
```

#### Remaining Low-Priority Services
- Tasks (3 commands)
- System Emails (3 commands)
- Links (1 command)
- Logos (2 commands)
- Token (3 commands)
- Relay Management (6 commands)

---

## 3️⃣ Profile System (v1.5.0) ✅ COMPLETED

Based on: `cakemail-profile-system-plan.md` and `PROFILE_SYSTEM_TASKS.md`

**Status:** ✅ SHIPPED (2025-10-11)
**Actual Time:** Completed in single session
**Priority:** HIGH (transformative for UX)

### Phase 1: Foundation ✅ COMPLETED
- [x] Create profile schema and types
- [x] Implement config file storage (~/.cakemail/config.json)
- [x] Add profile selection to auth setup
- [x] Create profile loading mechanism
- [x] Add profile management commands
- [x] Update getConfig() to support profiles
- [x] Testing & Documentation

### Phase 2: Output Adaptation ✅ COMPLETED
- [x] Profile-aware output formatter
- [x] Implement color schemes (minimal/rich/moderate/none)
- [x] Profile-specific date formatting (iso8601/friendly/relative)
- [x] Profile-aware error messages (technical vs friendly)
- [x] Tips and hints system
- [x] Update all commands to use profile-aware output
- [x] Testing & Documentation

### Phase 3: Behavior Adaptation ✅ COMPLETED
- [x] Interactive prompt system with environment detection
- [x] Make confirmations profile-aware
- [x] Add interactive prompts to campaigns create
- [x] Add interactive prompts to lists create
- [x] Progress indicators profile awareness
- [x] Scripting mode detection (TTY, CI, batch)
- [x] Testing interactive mode
- [x] Documentation

### Phase 4: Polish & Testing ✅ COMPLETED
- [x] Add --profile override flag
- [x] Add --batch flag
- [x] Profile preview command
- [x] No migration needed (pre-public release)
- [x] Build verification
- [x] Documentation overhaul (CHANGELOG, README)

**Total Actual Time:** Single development session (faster than estimated)

**Profiles Implemented:**
- **Developer:** JSON output, no interactivity, minimal colors, technical errors, ISO8601 dates
- **Marketer:** Compact output, rich colors, interactive prompts, friendly errors, relative dates
- **Balanced:** Table output, moderate colors, auto interactivity, balanced errors, friendly dates (default)

**Files Created:**
- `src/types/profile.ts` - Profile type system
- `src/utils/config-file.ts` - Config file management
- `src/utils/interactive.ts` - Interactive prompt system
- `src/commands/config.ts` - Profile management commands

**Files Enhanced:**
- `src/cli.ts` - Profile flags and integration
- `src/utils/config.ts` - Profile loading
- `src/utils/output.ts` - Profile-aware output
- `src/utils/errors.ts` - Profile-aware errors
- `src/utils/confirm.ts` - Profile-aware confirmations
- `src/commands/campaigns.ts` - Interactive create
- `src/commands/lists.ts` - Interactive create

---

## 🔄 Priority Matrix

Based on **Impact × Urgency** scoring:

### 🔴 CRITICAL (Do Now)
1. ~~**Complete v1.6.0 API Coverage**~~ ✅ COMPLETED (30 commands added)
2. **Quickstart Wizard** - Critical for new user onboarding (currently no guided flow)

### 🟡 HIGH (Do Next)
3. ~~**Profile System**~~ ✅ COMPLETED (v1.5.0)
4. **Natural Date Parsing** - Reduces friction significantly
5. **Email Preview** - Frequently requested feature
6. **Interactive Auth Setup** - Makes onboarding smoother

### 🟢 MEDIUM (Do Later)
7. **v1.7.0 API Coverage** - Workflows, Domain/DKIM (enterprise features)
8. **Search/Find Commands** - Nice quality of life improvement
9. ~~**Configuration Management**~~ ✅ COMPLETED (v1.5.0 Profile System)
10. **Shell Completion** - Developer convenience

### ⚪ LOW (Nice to Have)
11. **Template Scaffolding**
12. **Aliases**
13. **Forms Management**
14. **Update Notifications**

---

## 📊 Effort Estimates

### By Category

**UX Improvements:**
- v1.4.0 remaining: ~15-20 days
- v1.5.0: ~15-20 days
- v1.6.0: ~15-20 days
- v1.7.0+: Ongoing
- **Profile System:** ~70-80 days (14-16 weeks)

**API Coverage:**
- ~~v1.6.0 (30 commands)~~ ✅ COMPLETED
- v1.7.0+ (44+ commands): ~25-30 days

**Total Backlog:** ~100-150 days (20-30 weeks of full-time work)

### Quick Wins (< 3 days each)
- Natural date parsing (2-3 days)
- Email preview (1-2 days)
- ~~Campaign enhancements~~ ✅ v1.6.0
- ~~Tags commands~~ ✅ v1.6.0
- ~~Interests commands~~ ✅ v1.6.0
- Aliases (1-2 days)

### Medium Effort (3-7 days each)
- Interactive auth setup (3-5 days)
- ~~Interactive mode for missing fields~~ ✅ v1.5.0
- Search/find commands (3-4 days)
- ~~Configuration management~~ ✅ v1.5.0
- ~~Transactional templates~~ ✅ v1.6.0
- ~~Campaign logs~~ ✅ v1.6.0
- Smart file handling (2-3 days)

### Large Effort (> 7 days each)
- Quickstart wizard (5-7 days)
- ~~Profile system~~ ✅ v1.5.0 (70-80 days / 14-16 weeks)
- Workflows (10-15 days)
- Bulk operations enhancement (3-4 days base, ongoing)

---

## 🎯 Recommended Roadmap

### Current Progress (v1.6.0)
✅ **Completed:**
- v1.5.0 Profile System (3 profiles, interactive prompts, configuration management)
- v1.6.0 API Coverage (30 commands: tags, interests, transactional templates, logs)
- 136/232 commands = 59% API coverage

### Option A: Quick UX Wins + v1.7.0 API Coverage (Recommended)

**Timeline:** 3-4 months

1. **Quick UX Wins** (2-3 weeks)
   - Natural date parsing
   - Email preview
   - Search/find commands
   - Interactive auth setup

2. **v1.7.0 API Coverage** (8-10 weeks)
   - Workflows (18 commands)
   - Account/User Management (13 commands)
   - Domain/DKIM (7 commands)
   - Forms (5 commands)
   - Target: 136 → 180+ commands (59% → 78% coverage)

3. **Polish & Ship** (2-3 weeks)
   - Shell completion
   - Final UX polish
   - Documentation

**Result:** v1.7.0 with 78% API coverage + enhanced UX

---

### Option B: Enterprise Features First

**Timeline:** 3-4 months

1. **v1.7.0 API Coverage** (8-10 weeks)
   - Focus on enterprise features (Workflows, Account/User, Domain/DKIM)
   - 136 → 180+ commands

2. **Quick UX Wins** (2-3 weeks)
   - Natural date parsing
   - Email preview
   - Interactive auth

3. **Advanced Features** (4-5 weeks)
   - Search/find commands
   - Shell completion
   - Bulk operations enhancement

**Result:** v1.7.0 with 78% API coverage, defer advanced UX

---

### Option C: UX Excellence Path

**Timeline:** 2-3 months

1. **Complete UX Suite** (4-5 weeks)
   - Quickstart wizard
   - Natural date parsing
   - Email preview
   - Interactive auth setup
   - Search/find commands
   - Smart file handling

2. **Developer Experience** (2-3 weeks)
   - Shell completion
   - Aliases
   - Dry run mode
   - Better scripting support

3. **Defer API Coverage** to v1.7.0

**Result:** v1.7.0 with exceptional UX, 59% API coverage (defer to v1.8.0)

---

## 💡 Decision Framework

### When to Choose API Coverage
- Users asking for specific missing features
- Need enterprise features (workflows, domains)
- Want higher headline number (78% vs 60%)
- Have specific integration requirements

### When to Choose Profile System
- Want to dramatically improve UX for non-developers
- New user adoption is priority
- Want to differentiate from other CLIs
- Have time for transformative work

### When to Choose Quick Wins
- Need to ship something fast
- Want to validate direction
- Building momentum
- Testing user response

---

## 📝 Notes

**Current State (v1.6.0):**
- 136 commands implemented (59% API coverage)
- ✅ Complete Profile System with 3 profiles
- ✅ Interactive prompts and confirmations
- ✅ Tags, Interests, Transactional Templates, Activity Logs
- Strong UX foundation: auth, errors, smart defaults, enhanced output
- Missing: Quickstart wizard, natural date parsing, advanced API coverage

**Key Decisions Needed:**
1. Focus on UX wins (Option C) or push to 78% API coverage (Option A/B)?
2. Implement quickstart wizard now or after v1.7.0?
3. Interactive auth setup - priority or skip?
4. Natural date parsing - high priority or defer?

**Dependencies:**
- ~~Profile system~~ ✅ COMPLETED (v1.5.0)
- Quickstart wizard works better with interactive auth setup
- Natural date parsing is independent
- v1.7.0 API coverage doesn't block UX features

---

## 📞 How to Use This Backlog

### For Planning
- Review priority matrix
- Choose option (A/B/C) based on goals
- Break down into 2-week sprints
- Track progress weekly

### For Tracking
- Mark items [x] when complete
- Update estimates as you learn
- Add new items as discovered
- Review quarterly

### For Communication
- Show stakeholders the roadmap
- Explain trade-offs clearly
- Get feedback on priorities
- Share progress updates

---

## 📚 Documentation & Marketing (Post-Implementation)

**Every completed feature requires:**

### 1. Technical Documentation
- [ ] Update README.md with new commands
- [ ] Add examples to command help text
- [ ] Update ARCHITECTURE.md if patterns change
- [ ] Add to API_COVERAGE.md if API feature

### 2. User Documentation
- [ ] Write user guide section
- [ ] Add how-to examples
- [ ] Create troubleshooting section if needed
- [ ] Add FAQ entries for common questions

### 3. CHANGELOG.md Entry
**Must include:**
- **What was added** - Clear feature description
- **Why it matters** - Business value / user benefit
- **How to use** - Basic example
- **Breaking changes** - If any

**Example:**
```markdown
## [1.5.0] - 2025-10-20

### Added - Natural Date Parsing

**What:** Accept human-readable dates like "tomorrow 10am", "next Monday", "+2 days"
**Why:** Removes friction from scheduling - no need to calculate ISO 8601 dates
**Example:**
  cakemail campaigns schedule 123 --date "tomorrow 10am"
  Parsed "tomorrow 10am" as Oct 12, 2025 10:00 AM EDT
  ✓ Campaign scheduled
```

### 4. Marketing Materials

**For Each Major Feature (v1.5.0+):**

#### Release Announcement
**Format:** Blog post / Email / Social media
**Sections:**
- Problem statement (what pain point does this solve?)
- Solution overview (what we built)
- Key benefits (3-5 bullet points)
- Visual examples (screenshots/GIFs)
- How to get started
- Call to action

**Example for Natural Date Parsing:**
```markdown
# Say Goodbye to ISO 8601 Date Confusion

**The Problem:**
Scheduling campaigns required calculating ISO 8601 timestamps like
"2025-10-12T10:00:00-04:00" - frustrating and error-prone.

**The Solution:**
Cakemail CLI now understands natural dates:
- "tomorrow 10am"
- "next Monday at 2pm"
- "+3 days"

**Key Benefits:**
✓ Faster scheduling - no date calculations needed
✓ Fewer errors - see exactly what you're scheduling
✓ More intuitive - write dates like you think

**Example:**
$ cakemail campaigns schedule 123 --date "tomorrow 10am"
Parsed "tomorrow 10am" as Oct 12, 2025 10:00 AM EDT
✓ Campaign scheduled

**Get Started:**
npm update -g @cakemail-org/cakemail-cli

**Learn More:** [link to docs]
```

#### Feature Comparison Table
**For major features, create before/after comparison:**

| Before | After | Improvement |
|--------|-------|-------------|
| Calculate ISO date | Type "tomorrow 10am" | 90% faster |
| Manual timezone math | Auto-detected | Zero errors |
| Check calendar app | Natural language | Intuitive |

#### Video/GIF Demo
**30-60 second demonstration:**
1. Show old painful way
2. Show new easy way
3. Highlight time saved

#### Social Media Posts
**Twitter/LinkedIn templates:**

**Short version (Twitter):**
```
🎉 New in Cakemail CLI v1.5:
Natural date parsing!

Before: "2025-10-12T10:00:00-04:00"
After: "tomorrow 10am"

📦 npm update -g @cakemail-org/cakemail-cli
📖 https://docs.cakemail.com/cli

#EmailMarketing #DevTools #CLI
```

**Long version (LinkedIn):**
```
We just shipped a game-changer for Cakemail CLI users 🚀

v1.5.0 introduces natural date parsing. Instead of calculating
ISO 8601 timestamps, just write dates like you think:

❌ Before:
cakemail campaigns schedule 123 --date "2025-10-12T10:00:00-04:00"

✅ After:
cakemail campaigns schedule 123 --date "tomorrow 10am"

The CLI parses your intent, shows you exactly what will happen,
and handles all the timezone math.

Simple. Fast. Error-free.

Update now:
npm update -g @cakemail-org/cakemail-cli

#EmailMarketing #DeveloperTools #CLI #ProductivityHack
```

### 5. User Manual Section Template

**For each new command group:**

```markdown
# [Feature Name] Guide

## Overview
[2-3 sentence description of what this enables]

## Prerequisites
- [Required accounts/permissions]
- [Required data/setup]

## Quick Start

### Basic Usage
[Simplest possible example with explanation]

### Common Scenarios

#### Scenario 1: [User goal]
[Step-by-step with commands and explanations]

#### Scenario 2: [User goal]
[Step-by-step with commands and explanations]

## Command Reference

### command-name
**Description:** [What it does]
**Usage:** cakemail command-name [options]
**Options:**
- `--flag` - Description
**Examples:**
[3-5 real-world examples with context]

## Tips & Best Practices
- [Tip 1]
- [Tip 2]
- [Tip 3]

## Troubleshooting

### Error: [Common error message]
**Cause:** [Why this happens]
**Solution:** [How to fix]

## Related Commands
- [command-1] - [When to use]
- [command-2] - [When to use]
```

### 6. Marketing Checklist Per Feature

When completing ANY feature from backlog:

**Week of Completion:**
- [ ] Write CHANGELOG entry with examples
- [ ] Update README.md
- [ ] Update user manual/docs site

**Week After Release:**
- [ ] Write release announcement blog post
- [ ] Create before/after comparison table
- [ ] Record demo video/GIF (30-60 sec)
- [ ] Prepare social media posts (Twitter, LinkedIn)

**Two Weeks After Release:**
- [ ] Publish blog post
- [ ] Post to social media
- [ ] Share in relevant communities (Reddit, HN if major)
- [ ] Email existing users (if major feature)
- [ ] Update comparison pages vs competitors

**One Month After Release:**
- [ ] Gather user feedback
- [ ] Update docs based on questions
- [ ] Create FAQ entries from support tickets
- [ ] Plan iteration if needed

---

## 🔗 Integration with Other Documents

### CHANGELOG.md ← → BACKLOG.md Synchronization

**Rule:** CHANGELOG = Past, BACKLOG = Future

**Process:**

1. **Feature Planning** (now)
   ```markdown
   # BACKLOG.md
   ### Natural Date Parsing
   **Status:** NOT STARTED
   **Priority:** HIGH
   ```

2. **Development**
   ```markdown
   # BACKLOG.md
   ### Natural Date Parsing
   **Status:** IN PROGRESS
   ```

3. **Completion**
   ```markdown
   # BACKLOG.md
   ### Natural Date Parsing
   **Status:** ✅ COMPLETED

   # CHANGELOG.md
   ## [Unreleased]
   ### Added - Natural Date Parsing
   - Accept "tomorrow 10am", "next Monday", "+2 days"
   - Uses chrono-node for parsing
   - Shows confirmation of parsed date
   ```

4. **Release**
   ```markdown
   # BACKLOG.md
   [Remove or mark ✅ SHIPPED v1.5.0]

   # CHANGELOG.md
   ## [1.5.0] - 2025-10-20
   ### Added - Natural Date Parsing
   [Full description with examples]
   ```

### Cross-Reference Guide

**When working on a feature:**
1. Find it in BACKLOG.md (current status)
2. Read detailed plan in:
   - UX_IMPLEMENTATION_PLAN.md (for UX features)
   - API_COVERAGE.md (for API features)
   - PROFILE_SYSTEM_PLAN.md (for profile features)
3. Implement following ARCHITECTURE.md patterns
4. Update BACKLOG.md status → ✅ COMPLETED
5. Add to CHANGELOG.md → [Unreleased]
6. Create docs/marketing per checklist above

**All information is self-contained:**
- BACKLOG.md has full feature descriptions
- References to other docs are for ADDITIONAL detail only
- A new AI can work from BACKLOG.md alone

---

**Last Updated:** 2025-10-11
**Next Review:** When v1.4.0 decision is made
**Owner:** François Lane

---

## 📋 Quick Reference

**For New AI Onboarding:**
1. Read [PROJECT_INDEX.md](PROJECT_INDEX.md) first
2. Then read this file (BACKLOG.md)
3. Check [CHANGELOG.md](CHANGELOG.md) to see what's been built
4. You now have 90% of context needed

**For Current Work:**
- See "🎯 Current Focus" section above
- Check "Priority Matrix" for what to do next
- Read detailed plan for chosen feature
- Follow implementation → documentation → marketing process

