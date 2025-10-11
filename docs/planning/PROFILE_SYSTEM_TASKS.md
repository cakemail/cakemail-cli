# Profile System Implementation - Task Tracker

**Status:** Planning
**Started:** 2025-10-11
**Target Completion:** TBD

---

## Phase 1: Foundation (2 weeks)

### Week 1

- [ ] **Task 1.1:** Create profile schema and types
  - File: `src/types/profile.ts`
  - Define ProfileType, ProfileConfig interfaces
  - Define default profiles (developer, marketer, balanced)
  - Estimated: 2 hours

- [ ] **Task 1.2:** Implement config file storage
  - File: `src/utils/config-file.ts`
  - Create `~/.cakemail/config.json` management
  - Load, save, merge config
  - Handle migration from `.env`
  - Estimated: 4 hours

- [ ] **Task 1.3:** Add profile selection to auth setup
  - File: `src/commands/auth.ts`
  - Add profile selection prompts
  - Save selected profile to config
  - Estimated: 3 hours

### Week 2

- [ ] **Task 1.4:** Create profile loading mechanism
  - File: `src/utils/config.ts`
  - Load profile from config file
  - Apply profile defaults
  - Handle priority order (flags > custom > profile > defaults)
  - Estimated: 4 hours

- [ ] **Task 1.5:** Add profile management commands
  - File: `src/commands/config.ts`
  - `config profile` - Show current profile
  - `config profile <type>` - Switch profile
  - `config set <key> <value>` - Override setting
  - `config reset` - Reset to profile defaults
  - Estimated: 4 hours

- [ ] **Task 1.6:** Update getConfig() to support profiles
  - File: `src/utils/config.ts`
  - Integrate profile loading with existing config
  - Ensure backward compatibility with `.env`
  - Estimated: 3 hours

- [ ] **Task 1.7:** Testing & Documentation
  - Write unit tests for profile loading
  - Test migration from `.env` to config.json
  - Update README with profile info
  - Estimated: 4 hours

**Phase 1 Total:** ~24 hours

---

## Phase 2: Output Adaptation (3 weeks)

### Week 3

- [ ] **Task 2.1:** Profile-aware output formatter
  - File: `src/utils/output.ts`
  - Accept profile config in constructor
  - Apply format based on profile.output.format
  - Apply color scheme based on profile.output.colors
  - Estimated: 4 hours

- [ ] **Task 2.2:** Implement color schemes
  - Add "minimal" color scheme (developer)
  - Add "rich" color scheme (marketer) - already have most of this
  - Add "moderate" color scheme (balanced)
  - Estimated: 3 hours

- [ ] **Task 2.3:** Profile-specific date formatting
  - ISO 8601 for developer
  - Relative dates for marketer (already implemented)
  - Friendly dates for balanced
  - Estimated: 2 hours

### Week 4

- [ ] **Task 2.4:** Profile-aware error messages
  - File: `src/utils/errors.ts`
  - Technical errors for developer (with API details)
  - Friendly errors for marketer (with guidance)
  - Balanced for balanced profile
  - Estimated: 5 hours

- [ ] **Task 2.5:** Tips and hints system
  - Show tips for marketer profile
  - Hide tips for developer profile
  - Contextual tips based on command
  - Estimated: 3 hours

- [ ] **Task 2.6:** Profile-aware help system
  - Different help text per profile
  - Technical examples for developers
  - Interactive examples for marketers
  - Estimated: 6 hours

### Week 5

- [ ] **Task 2.7:** Update all commands to use profile-aware output
  - Update formatter initialization in cli.ts
  - Test each command with different profiles
  - Ensure consistent experience
  - Estimated: 6 hours

- [ ] **Task 2.8:** Testing & Documentation
  - Test output with each profile
  - Visual regression testing
  - Update docs with examples
  - Estimated: 4 hours

**Phase 2 Total:** ~33 hours

---

## Phase 3: Behavior Adaptation (3 weeks)

### Week 6

- [ ] **Task 3.1:** Interactive prompt system
  - File: `src/utils/interactive.ts`
  - Wrapper around inquirer
  - Profile-aware (only prompt if profile.behavior.interactive_prompts)
  - Handle missing required arguments
  - Estimated: 5 hours

- [ ] **Task 3.2:** Make confirmations profile-aware
  - File: `src/utils/confirm.ts`
  - Check profile.behavior.confirm_destructive
  - Auto-skip for developer profile
  - Always show for marketer profile
  - Estimated: 2 hours

- [ ] **Task 3.3:** Add interactive prompts to campaigns create
  - Prompt for missing required fields
  - Show list selection with details
  - Show sender selection
  - Preview before creation
  - Estimated: 5 hours

### Week 7

- [ ] **Task 3.4:** Add interactive prompts to more commands
  - lists create
  - contacts add
  - templates create
  - senders create
  - Estimated: 6 hours

- [ ] **Task 3.5:** Progress indicators profile awareness
  - File: `src/utils/progress.ts`
  - Show for marketer/balanced
  - Hide for developer (or only with --verbose)
  - Estimated: 2 hours

- [ ] **Task 3.6:** Scripting mode detection
  - Detect piped output (!stdout.isTTY)
  - Detect CI environment
  - Auto-disable interactivity when detected
  - Estimated: 3 hours

### Week 8

- [ ] **Task 3.7:** Testing interactive mode
  - Test prompts with each profile
  - Test scripting mode detection
  - Test backward compatibility
  - Estimated: 5 hours

- [ ] **Task 3.8:** Documentation
  - Interactive mode examples
  - Scripting examples per profile
  - Estimated: 3 hours

**Phase 3 Total:** ~31 hours

---

## Phase 4: Polish & Testing (2 weeks)

### Week 9

- [ ] **Task 4.1:** Add --profile override flag
  - File: `src/cli.ts`
  - Parse --profile flag globally
  - Override config.profile temporarily
  - Estimated: 2 hours

- [ ] **Task 4.2:** Add --batch flag
  - Disable all interactivity
  - Useful for marketer scripting
  - Estimated: 1 hour

- [ ] **Task 4.3:** Profile preview command
  - `config profile preview <type>`
  - Show example output for each command
  - Estimated: 3 hours

- [ ] **Task 4.4:** Migration for existing users
  - Detect first run after profile update
  - Prompt for profile selection
  - Migrate .env to config.json
  - Estimated: 4 hours

### Week 10

- [ ] **Task 4.5:** Comprehensive testing
  - Unit tests for all profile logic
  - Integration tests for each profile
  - Test migration paths
  - Test backward compatibility
  - Estimated: 8 hours

- [ ] **Task 4.6:** Documentation overhaul
  - Update README with profile system
  - Add profile selection guide
  - Add examples per profile
  - Update CHANGELOG
  - Estimated: 4 hours

- [ ] **Task 4.7:** Beta testing preparation
  - Create beta branch
  - Write beta testing guide
  - Recruit beta testers
  - Estimated: 2 hours

**Phase 4 Total:** ~24 hours

---

## Beta Testing (2-3 weeks)

- [ ] Beta test with 2-3 developers
- [ ] Beta test with 2-3 marketers
- [ ] Collect feedback
- [ ] Iterate on issues
- [ ] Polish rough edges

---

## Release

- [ ] Final testing
- [ ] Update version to 1.5.0
- [ ] Publish to npm
- [ ] Update Homebrew formula
- [ ] Announce release
- [ ] Monitor for issues

---

## Total Estimated Time

- Phase 1: 24 hours (~3 days)
- Phase 2: 33 hours (~4 days)
- Phase 3: 31 hours (~4 days)
- Phase 4: 24 hours (~3 days)
- **Total: ~112 hours (~14 working days)**
- **With buffer: ~3 weeks of full-time work**

---

## Notes

- This tracker uses simple markdown checkboxes
- Update dates as you complete tasks
- Add notes inline as needed
- No external tools required
- Easy to grep and track progress

---

## Completed Tasks

[Move completed tasks here as you finish them]

