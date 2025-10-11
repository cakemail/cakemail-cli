# Cakemail CLI - Profile-Based UX System Implementation Plan

## Executive Summary

Create an adaptive CLI experience that automatically tailors its interface, output format, verbosity, and interactions based on user type (developer vs marketer) while remaining flexible enough for users to access any feature regardless of their profile.

## Core Principle

**Profiles are intelligent defaults, not restrictions.** Any user can access any feature; profiles simply optimize the default experience.

---

## 1. User Profiles

### 1.1 Profile Types

#### Developer Profile
**Characteristics:**
- Comfortable with JSON, scripting, piping
- Values precision, completeness, composability
- Prefers minimal interactivity
- Expects standard exit codes and machine-readable output

**Default Settings:**
```json
{
  "profile": "developer",
  "output": {
    "format": "json",
    "colors": "minimal",
    "pretty_print": false,
    "show_tips": false
  },
  "behavior": {
    "interactive_prompts": false,
    "confirm_destructive": false,
    "auto_open_browser": false,
    "show_progress": false
  },
  "display": {
    "date_format": "iso8601",
    "show_ids": true,
    "show_api_details": true,
    "verbose_errors": true
  }
}
```

#### Marketer Profile
**Characteristics:**
- Visual learners, appreciate color and formatting
- Values clarity, guidance, safety
- Comfortable with interactive workflows
- Prefers human-readable output

**Default Settings:**
```json
{
  "profile": "marketer",
  "output": {
    "format": "compact",
    "colors": "rich",
    "pretty_print": true,
    "show_tips": true
  },
  "behavior": {
    "interactive_prompts": true,
    "confirm_destructive": true,
    "auto_open_browser": true,
    "show_progress": true
  },
  "display": {
    "date_format": "relative",
    "show_ids": false,
    "show_api_details": false,
    "verbose_errors": false
  }
}
```

#### Balanced Profile
**Characteristics:**
- Mix of both workflows
- Context-dependent preferences
- Default fallback

**Default Settings:**
```json
{
  "profile": "balanced",
  "output": {
    "format": "table",
    "colors": "moderate",
    "pretty_print": true,
    "show_tips": true
  },
  "behavior": {
    "interactive_prompts": "auto",
    "confirm_destructive": true,
    "auto_open_browser": false,
    "show_progress": true
  },
  "display": {
    "date_format": "friendly",
    "show_ids": true,
    "show_api_details": false,
    "verbose_errors": false
  }
}
```

---

## 2. Profile Selection & Detection

### 2.1 Explicit Profile Selection

**During Initial Setup:**
```bash
$ cakemail auth setup

Welcome to Cakemail CLI! 👋

First, let's set up your authentication...
[auth flow]

✓ Authentication successful!

One more thing - what best describes how you'll use Cakemail?

  1. 👨‍💻 Developer/Technical user
     • Scripting and automation
     • JSON output and piping  
     • Minimal interactivity

  2. 📊 Marketer/Business user
     • Campaign management
     • Visual formatting and guides
     • Interactive workflows

  3. 🔄 Both/Balanced
     • Mix of technical and business tasks
     • Flexible workflow

Your choice (1-3): _

💡 You can change this anytime with: cakemail config profile <type>
```

### 2.2 Auto-Detection (Optional Enhancement)

**Signals for Developer Profile:**
```javascript
function detectDeveloperSignals() {
  const signals = [];
  
  // Environment indicators
  if (process.env.CI) signals.push({ score: 5, reason: 'CI environment' });
  if (process.env.GITHUB_ACTIONS) signals.push({ score: 5, reason: 'GitHub Actions' });
  if (!process.stdout.isTTY) signals.push({ score: 3, reason: 'Piped output' });
  
  // Shell indicators
  if (process.env.SHELL?.includes('zsh')) signals.push({ score: 1, reason: 'Zsh shell' });
  if (process.env.TERM_PROGRAM === 'iTerm.app') signals.push({ score: 1, reason: 'iTerm' });
  
  // Command history (if accessible)
  // Check for: git, docker, npm, yarn, etc.
  
  return signals;
}

function detectMarketerSignals() {
  const signals = [];
  
  // GUI indicators
  if (process.env.DISPLAY) signals.push({ score: 2, reason: 'GUI display available' });
  if (process.env.TERM_PROGRAM === 'Apple_Terminal') signals.push({ score: 1, reason: 'Terminal.app' });
  
  // First-time user (no command history)
  signals.push({ score: 1, reason: 'New user' });
  
  return signals;
}

function autoDetectProfile() {
  const devScore = detectDeveloperSignals().reduce((sum, s) => sum + s.score, 0);
  const markScore = detectMarketerSignals().reduce((sum, s) => sum + s.score, 0);
  
  if (devScore > markScore + 3) return 'developer';
  if (markScore > devScore + 1) return 'marketer';
  return 'balanced';
}
```

**Suggested Profile (Don't Auto-Apply):**
```bash
$ cakemail auth setup
# After auth...

💡 Based on your environment, we recommend the "Developer" profile.
   Would you like to use this? [Y/n] _
   
   (Or choose: 1=Developer, 2=Marketer, 3=Balanced)
```

---

## 3. Profile-Aware Output

### 3.1 Output Formats by Profile

#### Developer: JSON (default)
```bash
$ cakemail campaigns list
[
  {
    "id": 123,
    "name": "Black Friday Sale",
    "status": "delivered",
    "created_at": "2025-10-10T08:00:00Z",
    "sent_at": "2025-10-11T12:00:00Z",
    "list_id": 456,
    "stats": {
      "delivered": 15234,
      "opened": 3656,
      "clicked": 892
    }
  }
]
```

**Features:**
- No pretty printing (compact JSON for piping)
- All fields included
- ISO 8601 timestamps
- Exit code: 0 (success), non-zero (error)

#### Marketer: Compact (default)
```bash
$ cakemail campaigns list

📧 Recent Campaigns
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Black Friday Sale
   Sent 2 hours ago • 15,234 delivered • 24% opened • 6% clicked
   
⏰ Weekly Newsletter
   Scheduled for tomorrow at 10:00 AM • 8,500 recipients
   
📝 Product Launch
   Draft • Last edited yesterday
   
🗄  Summer Sale (archived)
   Sent Jun 15 • 12,100 delivered • 31% opened

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Showing 4 campaigns • Use --all to see more

💡 Tip: Use 'cakemail campaigns get 123' to see full details
```

**Features:**
- Emoji status indicators (✅ ⏰ 📝 🗄 ❌)
- Relative timestamps ("2 hours ago")
- Percentage calculations shown
- Contextual tips
- Visual separators

#### Balanced: Table (default)
```bash
$ cakemail campaigns list

ID    Name                Status      Sent              Delivered  Opens
────────────────────────────────────────────────────────────────────────
123   Black Friday Sale   delivered   2 hours ago       15,234     24%
456   Weekly Newsletter   scheduled   Tomorrow 10:00am  8,500      -
789   Product Launch      draft       -                 -          -
321   Summer Sale         archived    Jun 15            12,100     31%

4 campaigns total
```

**Features:**
- Table format with key fields
- Mix of relative and absolute dates
- Color coding (green=delivered, yellow=scheduled, gray=draft)
- Balanced information density

### 3.2 Error Messages by Profile

#### Developer Profile
```bash
$ cakemail campaigns send 999

Error: Campaign not found (404)
  
Details:
  Request: GET /api/v1/campaigns/999
  Response: {"error": "not_found", "message": "Campaign with ID 999 does not exist"}
  
Suggestions:
  • List available campaigns: cakemail campaigns list
  • Check campaign ID is correct
  
Exit code: 3
```

#### Marketer Profile
```bash
$ cakemail campaigns send 999

❌ Oops! We couldn't find that campaign.

The campaign with ID 999 doesn't exist in your account.

What you can do:
  📋 View all campaigns: cakemail campaigns list
  🔍 Search campaigns:   cakemail campaigns find "keyword"
  
Need help? Visit: https://support.cakemail.com
```

### 3.3 Help Content by Profile

#### Developer Profile
```bash
$ cakemail campaigns --help

SYNOPSIS
  cakemail campaigns <command> [options]

COMMANDS
  list                  List campaigns with filtering
  get <id>              Get campaign details
  create                Create new campaign
  update <id>           Update campaign
  schedule <id>         Schedule campaign
  send <id>             Send campaign immediately
  delete <id>           Delete campaign

OPTIONS
  -f, --format <type>   Output format: json|table|compact (default: json)
  --filter <expr>       Filter expression: status==delivered;name==Newsletter
  --sort <field>        Sort: +name, -created_on, +sent_at
  -l, --limit <n>       Limit results (default: 50)
  -p, --page <n>        Page number (default: 1)

EXAMPLES
  # List delivered campaigns as JSON
  cakemail campaigns list --filter "status==delivered" -f json
  
  # Get campaign and extract name with jq
  cakemail campaigns get 123 | jq -r '.name'
  
  # Schedule campaign for specific time
  cakemail campaigns schedule 123 -d "2025-10-15T10:00:00Z"
```

#### Marketer Profile
```bash
$ cakemail campaigns --help

📧 Campaign Management

Common Tasks:
  
  📋 View all campaigns
     cakemail campaigns list
  
  👁  View campaign details
     cakemail campaigns get <campaign-id>
  
  📝 Create a new campaign
     cakemail campaigns create
  
  ⏰ Schedule a campaign
     cakemail campaigns schedule <campaign-id> --when "tomorrow 10am"
  
  📤 Send a campaign now
     cakemail campaigns send <campaign-id>

Examples:

  See your recent campaigns:
    cakemail campaigns list
  
  Schedule a campaign for next Monday:
    cakemail campaigns schedule 123 --when "next monday 10am"
  
  Send a test before scheduling:
    cakemail campaigns test 123 --email your@email.com

💡 Tip: Most commands work interactively - just leave out the options
   and we'll ask you what you need!

Need more help? Visit: https://docs.cakemail.com
```

---

## 4. Behavior Adaptations

### 4.1 Interactive Prompts

#### Developer Profile: Minimal/No Prompts
```bash
$ cakemail campaigns create
Error: Missing required argument: --name

Usage: cakemail campaigns create --name <name> --list-id <id> [options]

See 'cakemail campaigns create --help' for more information
```

#### Marketer Profile: Full Interactive
```bash
$ cakemail campaigns create

📝 Create New Campaign
━━━━━━━━━━━━━━━━━━━━━━━━

Campaign name: _ 
(e.g., "Weekly Newsletter - October 2025")
```

After entering name:
```bash
Campaign name: Weekly Newsletter ✓

Which list should receive this campaign?

  1. 📧 Newsletter Subscribers (5,234 contacts)
     Last updated: 2 days ago
  
  2. 👥 Customers (1,847 contacts)
     Last updated: 1 week ago
  
  3. 🎯 VIP List (234 contacts)
     Last updated: yesterday

Choose (1-3) or type to search: _
```

### 4.2 Confirmation Dialogs

#### Developer Profile: No Confirmation (unless --confirm)
```bash
$ cakemail campaigns delete 123
Campaign 123 deleted successfully
```

#### Marketer Profile: Always Confirm Destructive Actions
```bash
$ cakemail campaigns delete 123

⚠️  Delete Campaign?

Campaign: "Black Friday Sale"
Status:   Delivered
Sent to:  15,234 contacts
Sent at:  Oct 11, 2025 12:00 PM

⚠️  This action cannot be undone!

Type the campaign name to confirm: _
```

### 4.3 Progress Indicators

#### Developer Profile: No Progress (unless --verbose)
```bash
$ cakemail campaigns send 123
Campaign 123 sent successfully (delivered: 8234)
```

#### Marketer Profile: Rich Progress
```bash
$ cakemail campaigns send 123

📤 Sending Campaign...

✓ Validating campaign content
✓ Verifying sender email
✓ Preparing recipient list (8,234 contacts)
⏳ Sending emails... ████████████░░░░░░░░ 65% (5,352/8,234)

Press Ctrl+C to cancel
```

---

## 5. Profile Management Commands

### 5.1 View Current Profile
```bash
$ cakemail config profile

Current profile: marketer

Active settings:
  Output format:        compact
  Colors:              rich
  Interactive prompts: enabled
  Date format:         relative ("2 hours ago")
  Show tips:           enabled

Change profile: cakemail config profile <developer|marketer|balanced>
```

### 5.2 Switch Profiles
```bash
$ cakemail config profile developer

✓ Switched to developer profile

Changes applied:
  • Output format:      json (was: compact)
  • Interactive mode:   disabled (was: enabled)
  • Colors:            minimal (was: rich)
  • Show tips:         disabled (was: enabled)

Try it: cakemail campaigns list
```

### 5.3 Customize Profile
```bash
$ cakemail config set output.format table
✓ Output format set to 'table' (overrides profile default)

$ cakemail config set behavior.interactive_prompts false
✓ Interactive prompts disabled (overrides profile default)

$ cakemail config reset
⚠️  Reset all settings to profile defaults? [y/N] y
✓ Settings reset to 'marketer' profile defaults
```

### 5.4 Profile Override (Temporary)
```bash
# Use developer mode for single command
$ cakemail --profile developer campaigns list
[{"id": 123, ...}]

# Use marketer mode for single command  
$ cakemail --profile marketer campaigns list
📧 Recent Campaigns
━━━━━━━━━━━━━━━━━━━━━━
...

# Override specific settings
$ cakemail --format json --no-colors campaigns list
```

---

## 6. Context-Aware Features

### 6.1 Smart Command Detection

**Detect Scripting Context:**
```javascript
function isScriptingContext() {
  return (
    !process.stdout.isTTY ||          // Output is piped
    process.env.CI ||                  // In CI/CD
    process.argv.includes('--quiet') || // Explicit quiet mode
    process.argv.includes('-q')
  );
}

// Auto-disable interactive features in scripts
if (isScriptingContext() && profile === 'marketer') {
  config.behavior.interactive_prompts = false;
  config.output.colors = 'none';
  config.output.show_tips = false;
}
```

### 6.2 Adaptive Help

**Short Help for Developers:**
```bash
$ cakemail campaigns
Usage: cakemail campaigns <command>

Commands: list, get, create, update, schedule, send, delete

See 'cakemail campaigns --help' for details
```

**Guided Help for Marketers:**
```bash
$ cakemail campaigns

📧 Campaign Commands

What would you like to do?

  1. 📋 View all campaigns
  2. 📝 Create a new campaign  
  3. ⏰ Schedule a campaign
  4. 📤 Send a campaign
  5. 🔍 Search campaigns
  
  Or type 'help' for full command list

Choose (1-5): _
```

### 6.3 Date Input by Profile

#### Developer Profile: Accept ISO 8601
```bash
$ cakemail campaigns schedule 123 -d "2025-10-15T10:00:00Z"
✓ Campaign scheduled for 2025-10-15T10:00:00Z
```

#### Marketer Profile: Accept Natural Language
```bash
$ cakemail campaigns schedule 123 --when "tomorrow 10am"

⏰ Scheduling Campaign

Campaign: "Weekly Newsletter"
Send at:  Oct 12, 2025 at 10:00 AM EDT
          (tomorrow at 10:00 AM)

Recipients: 8,234 contacts

Confirm? [Y/n] _
```

---

## 7. Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Profile selection during setup
- Profile storage in config
- Basic profile loading

**Tasks:**
1. Create profile schema and defaults
2. Add profile selection to `cakemail auth setup`
3. Implement config storage (`~/.cakemail/config.json`)
4. Create profile loading mechanism
5. Add `cakemail config profile` commands

**Deliverables:**
- Users can select and switch profiles
- Profile preferences are stored and loaded
- Basic profile management commands work

### Phase 2: Output Adaptation (Week 3-4)

**Goals:**
- Different output formats per profile
- Profile-aware error messages
- Profile-specific help text

**Tasks:**
1. Create output formatter with profile awareness
2. Implement profile-specific error translation
3. Build adaptive help system
4. Add color scheme per profile
5. Implement date formatting per profile

**Deliverables:**
- Commands show different output based on profile
- Errors are formatted per user type
- Help text adapts to profile

### Phase 3: Behavior Adaptation (Week 5-6)

**Goals:**
- Interactive prompts for marketers
- Confirmation dialogs based on profile
- Progress indicators for marketers

**Tasks:**
1. Build interactive prompt system (using `inquirer`)
2. Implement confirmation dialogs for destructive ops
3. Add progress indicators with profile awareness
4. Create wizard flows for common tasks
5. Add auto-detection logic (optional)

**Deliverables:**
- Marketer profile has guided workflows
- Developer profile is scriptable
- Destructive actions have appropriate safeguards

### Phase 4: Polish & Testing (Week 7-8)

**Goals:**
- Profile override flags working
- Context detection (CI, piping, etc.)
- Comprehensive testing

**Tasks:**
1. Implement `--profile` flag for command override
2. Add scripting context detection
3. Create profile switching migration guide
4. Write tests for each profile mode
5. User testing with both personas

**Deliverables:**
- Profile system is production-ready
- Both developer and marketer workflows tested
- Documentation complete

---

## 8. Configuration Schema

### 8.1 Config File Structure
```json
{
  "version": "1.0",
  "profile": "marketer",
  "auth": {
    "method": "password",
    "email": "user@example.com",
    "token": "encrypted_token_here"
  },
  "profiles": {
    "developer": {
      "output": {
        "format": "json",
        "colors": "minimal",
        "pretty_print": false,
        "show_tips": false
      },
      "behavior": {
        "interactive_prompts": false,
        "confirm_destructive": false,
        "auto_open_browser": false,
        "show_progress": false
      },
      "display": {
        "date_format": "iso8601",
        "show_ids": true,
        "show_api_details": true,
        "verbose_errors": true
      }
    },
    "marketer": {
      "output": {
        "format": "compact",
        "colors": "rich",
        "pretty_print": true,
        "show_tips": true
      },
      "behavior": {
        "interactive_prompts": true,
        "confirm_destructive": true,
        "auto_open_browser": true,
        "show_progress": true
      },
      "display": {
        "date_format": "relative",
        "show_ids": false,
        "show_api_details": false,
        "verbose_errors": false
      }
    },
    "custom": {
      // User overrides stored here
      "output": {
        "format": "table"  // Custom override
      }
    }
  },
  "defaults": {
    "list_id": 123,
    "sender_id": 456
  }
}
```

### 8.2 Priority Order
```
1. Command-line flags (--format json)
2. Profile override flag (--profile developer)
3. Custom profile settings (config.profiles.custom)
4. Active profile settings (config.profiles[config.profile])
5. Hard-coded defaults
```

---

## 9. Testing Strategy

### 9.1 Unit Tests
```javascript
describe('Profile System', () => {
  describe('Profile Loading', () => {
    test('loads developer profile defaults', () => {
      const config = loadProfile('developer');
      expect(config.output.format).toBe('json');
      expect(config.behavior.interactive_prompts).toBe(false);
    });
    
    test('loads marketer profile defaults', () => {
      const config = loadProfile('marketer');
      expect(config.output.format).toBe('compact');
      expect(config.behavior.interactive_prompts).toBe(true);
    });
  });
  
  describe('Profile Override', () => {
    test('command flag overrides profile', () => {
      const config = loadProfile('marketer');
      const overridden = applyOverrides(config, { format: 'json' });
      expect(overridden.output.format).toBe('json');
    });
  });
});
```

### 9.2 Integration Tests
```javascript
describe('Profile-Aware Commands', () => {
  test('developer profile outputs JSON by default', async () => {
    setProfile('developer');
    const output = await exec('cakemail campaigns list');
    expect(() => JSON.parse(output)).not.toThrow();
  });
  
  test('marketer profile outputs formatted text', async () => {
    setProfile('marketer');
    const output = await exec('cakemail campaigns list');
    expect(output).toContain('📧 Recent Campaigns');
  });
  
  test('--profile flag overrides current profile', async () => {
    setProfile('marketer');
    const output = await exec('cakemail --profile developer campaigns list');
    expect(() => JSON.parse(output)).not.toThrow();
  });
});
```

### 9.3 User Acceptance Testing

**Developer Persona Testing:**
- ✅ Can pipe output to jq without issues
- ✅ Receives only necessary output (no tips/hints)
- ✅ Can script complex workflows
- ✅ Error messages include API details
- ✅ No interactive prompts interrupt automation

**Marketer Persona Testing:**
- ✅ Understands output without technical knowledge
- ✅ Interactive wizards guide through tasks
- ✅ Receives helpful tips and suggestions
- ✅ Can complete tasks without reading docs
- ✅ Destructive actions require confirmation

---

## 10. Migration & Rollout

### 10.1 Existing Users

**First run after update:**
```bash
$ cakemail campaigns list

🎉 New: Profile-based experience!

We've added profiles to optimize Cakemail CLI for your workflow.

Based on your usage, we recommend: Developer profile
  • JSON output by default
  • Optimized for scripting
  • Minimal interactivity

Would you like to:
  1. Use Developer profile (recommended)
  2. Use Marketer profile  
  3. Use Balanced profile
  4. Keep current settings (no profile)

Choose (1-4): _
```

### 10.2 New Users

**Integrated into onboarding:**
```bash
$ cakemail auth setup
# Profile selection happens during initial setup
```

### 10.3 Opt-Out Option

**Users can disable profiles:**
```bash
$ cakemail config profile none
✓ Profiles disabled - using classic mode

All settings will use defaults or explicit flags.
Re-enable with: cakemail config profile <type>
```

---

## 11. Success Metrics

### 11.1 Quantitative Metrics
- **Profile adoption rate**: % of users who select a profile
- **Profile retention**: % users who keep their profile vs switching
- **Feature usage by profile**: 
  - Interactive mode usage (marketers)
  - Piping/scripting usage (developers)
- **Error rate reduction**: Fewer errors after profile-aware messaging
- **Time to first success**: Time for new users to send first email

### 11.2 Qualitative Metrics
- User feedback on profile appropriateness
- Support ticket reduction related to "how do I..."
- User testimonials from both personas
- Community engagement (GitHub issues, discussions)

### 11.3 Success Criteria
- ✅ 70%+ of users select a profile during onboarding
- ✅ 80%+ of marketers use interactive mode
- ✅ 80%+ of developers use JSON output with piping
- ✅ 30% reduction in basic "how to" support questions
- ✅ 4+ star average rating from both personas

---

## 12. Documentation Requirements

### 12.1 User Docs

**For Marketers:**
- Visual guide with screenshots
- Step-by-step tutorials
- Video walkthroughs
- "Common tasks" cookbook

**For Developers:**
- API reference style docs
- Scripting examples
- Integration guides
- JSON schema documentation

### 12.2 In-CLI Help

**Profile-aware examples in help:**
```bash
# Developer help shows scriptable examples
$ cakemail campaigns create --help
Examples:
  cakemail campaigns create \
    --name "Weekly" \
    --list-id 123 \
    --template-id 456 \
    --format json | jq -r '.id'

# Marketer help shows interactive examples  
$ cakemail campaigns create --help
Examples:
  Create a campaign interactively:
    cakemail campaigns create
  
  Create with basic info (we'll ask for the rest):
    cakemail campaigns create --name "Weekly Newsletter"
```

---

## 13. Future Enhancements

### 13.1 Advanced Auto-Detection
- Machine learning from usage patterns
- Automatic profile switching based on context
- Team-wide profile recommendations

### 13.2 Custom Profiles
```bash
$ cakemail config profile create automation
Based on: developer
Name: automation

$ cakemail config profile automation set output.format json
$ cakemail config profile automation set behavior.show_progress true
```

### 13.3 Profile Sharing
```bash
# Export profile for team
$ cakemail config profile export > team-profile.json

# Import profile
$ cakemail config profile import team-profile.json
```

### 13.4 Context-Aware Profiles
```bash
# Auto-switch based on directory
# .cakemail/config in project root:
{
  "profile": "developer",  // Use developer mode in this project
  "defaults": {
    "list_id": 123
  }
}
```

---

## 14. Risk Mitigation

### 14.1 Risks & Mitigation

**Risk: Users confused by profile selection**
- Mitigation: Clear descriptions, auto-detection with suggestions
- Fallback: "Balanced" profile as safe default

**Risk: Profiles too restrictive**
- Mitigation: Easy override flags, profile switching
- Fallback: "None" option to disable profiles

**Risk: Breaking existing scripts**
- Mitigation: Only apply to new users, migration opt-in
- Fallback: `--classic` flag to use old behavior

**Risk: Maintenance complexity**
- Mitigation: Shared output formatter, test coverage
- Fallback: Feature flag to disable profiles

### 14.2 Rollback Plan

**If profiles cause issues:**
1. Feature flag to disable profiles system-wide
2. Revert to single default behavior
3. Keep config structure for future re-enable
4. Communicate clearly to users

---

## 15. Next Steps

### Immediate (Week 1)
1. Review and approve this plan
2. Set up feature branch
3. Create GitHub issues for each phase
4. Begin Phase 1 implementation

### Short-term (Month 1)
1. Complete Phases 1-2
2. Internal testing with both personas
3. Beta release to select users
4. Gather initial feedback

### Long-term (Month 2-3)
1. Complete Phases 3-4
2. Public release
3. Monitor metrics
4. Iterate based on feedback

---

## Appendix: Example Workflows

### Developer Workflow Example
```bash
# List campaigns, filter with jq, create new campaign
TEMPLATE_ID=$(cakemail templates list -f json | \
  jq -r '.[] | select(.name=="Newsletter") | .id')

CAMPAIGN_ID=$(cakemail campaigns create \
  --name "Weekly $(date +%Y-%m-%d)" \
  --list-id 123 \
  --template-id $TEMPLATE_ID \
  --quiet)

# Schedule for tomorrow 10am
cakemail campaigns schedule $CAMPAIGN_ID \
  -d "$(date -d 'tomorrow 10:00' -Iseconds)" \
  --format json | jq -r '.scheduled_for'
```

### Marketer Workflow Example
```bash
# Interactive campaign creation
$ cakemail campaigns create

📝 Create New Campaign
━━━━━━━━━━━━━━━━━━━━━━━━

Campaign name: Weekly Newsletter
Which list? Newsletter Subscribers (5,234 contacts)
Which template? Newsletter Template
Subject: Your Weekly Update - October 2025

Preview in browser? [Y/n] y
[Browser opens with preview]

Schedule or send now?
  1. 📤 Send now
  2. ⏰ Schedule for later
  3. 💾 Save as draft

Choose (1-3): 2

When should we send?
  tomorrow 10am

✓ Campaign scheduled for Oct 12, 2025 at 10:00 AM EDT

🎉 All set! We'll send to 5,234 contacts tomorrow morning.

Track it: cakemail campaigns get 123
```