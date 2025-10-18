# Profile System

Learn how the Cakemail CLI adapts to your workflow with three user profiles.

## Overview

The Profile System allows the CLI to adapt its behavior to match your role and preferences. Choose from three profiles, each optimized for different use cases:

- **Developer Profile** - Fast, scriptable, minimal output
- **Marketer Profile** - Guided, interactive, safe
- **Balanced Profile** - Best of both worlds (default)

## Why Profiles?

Different users have different needs:

- **Developers** want speed, JSON output, and no interruptions
- **Marketers** need guidance, confirmations, and visual clarity
- **Everyone** benefits from adaptive behavior in different contexts

The Profile System eliminates the need to manually configure dozens of settings. Pick a profile and get sensible defaults instantly.

---

## The Three Profiles

### Developer Profile

Optimized for automation, scripting, and experienced users.

**Characteristics:**
- **Output Format**: JSON (machine-readable)
- **Colors**: None (plain text for logs)
- **Date Format**: ISO8601 (2025-10-11T14:30:00Z)
- **Interactive Prompts**: Disabled (no interruptions)
- **Confirmations**: Disabled (trusts you know what you're doing)
- **Progress Indicators**: Hidden (faster output)
- **Error Messages**: Technical (full details, API context)
- **Tips & Hints**: Disabled (you know the CLI)
- **List Defaults**: API defaults (50 items per page, default sort order)

**Best For:**
- CI/CD pipelines
- Shell scripts and automation
- Log parsing and data processing
- Experienced CLI users who want speed

**Example:**
```bash
$ cakemail config profile-set developer
$ cakemail campaigns create --name "Weekly Newsletter" --list-id 123 --sender-id 456
{"id":789,"name":"Weekly Newsletter","status":"draft","list_id":123,"sender_id":456}
```

---

### Marketer Profile

Optimized for safety, guidance, and visual clarity.

**Characteristics:**
- **Output Format**: Compact (human-readable summaries)
- **Colors**: Rich (full color highlighting)
- **Date Format**: Relative ("2 hours ago", "3 days ago")
- **Interactive Prompts**: Enabled (guides you through)
- **Confirmations**: Always confirm (safety first)
- **Progress Indicators**: Shown (visual feedback)
- **Error Messages**: Friendly (clear explanations, suggestions)
- **Tips & Hints**: Enabled (helpful guidance)
- **List Defaults**: Curated experience (25 items per page, sort by newest first)

**Best For:**
- Marketing team members
- Occasional CLI users
- Learning the CLI
- Operations where safety is critical

**Example:**
```bash
$ cakemail config profile-set marketer
$ cakemail campaigns create
Campaign name: Weekly Newsletter
? Select a list: › Newsletter Subscribers (1,234 contacts)
? Select a sender: › Marketing Team <marketing@company.com>
✓ Campaign created: 789

Campaign: Weekly Newsletter
Status: 🟡 draft
Created: just now
```

---

### Balanced Profile (Default)

The perfect middle ground for most users.

**Characteristics:**
- **Output Format**: Table (structured, readable)
- **Colors**: Moderate (status indicators only)
- **Date Format**: Friendly ("Oct 11, 2025")
- **Interactive Prompts**: Auto-detect (enabled in TTY, disabled in scripts)
- **Confirmations**: Auto-detect (confirm in interactive mode)
- **Progress Indicators**: Shown (helpful feedback)
- **Error Messages**: Balanced (clear but detailed)
- **Tips & Hints**: Auto-detect (shown when helpful)
- **List Defaults**: API defaults (50 items per page, default sort order)

**Best For:**
- Most users (recommended default)
- Mixed interactive and scripted usage
- Teams with varied skill levels
- Flexible workflows

**Example:**
```bash
$ cakemail config profile-set balanced
$ cakemail campaigns list --limit 3
┌────────┬──────────────────────┬──────────┬─────────────┐
│ ID     │ Name                 │ Status   │ Created     │
├────────┼──────────────────────┼──────────┼─────────────┤
│ 789    │ Weekly Newsletter    │ 🟢 sent  │ Oct 11 2025 │
│ 788    │ Product Update       │ 🟡 draft │ Oct 10 2025 │
│ 787    │ Flash Sale           │ 🔵 scheduled │ Oct 9 2025 │
└────────┴──────────────────────┴──────────┴─────────────┘
```

---

## Profile Features in Detail

### Output Formats

Each profile defaults to a different output format:

| Profile | Format | Best For |
|---------|--------|----------|
| Developer | `json` | Parsing, piping, automation |
| Marketer | `compact` | Quick summaries, key info |
| Balanced | `table` | Structured data, readability |

You can override the format for any command:
```bash
cakemail -f json campaigns list  # Force JSON regardless of profile
```

---

### Color Schemes

Visual styling adapts to your profile:

**None** (Developer)
- Plain text output
- No ANSI color codes
- Perfect for logs and piping

**Moderate** (Balanced)
- Status indicators in color (✓ green, ✗ red)
- Warnings in yellow
- Errors in red
- Headers in bold

**Rich** (Marketer)
- Full color palette
- Status badges with emoji
- Highlighted sections
- Color-coded values

---

### Date Formatting

Dates are displayed differently based on your profile:

**ISO8601** (Developer)
```
2025-10-11T14:30:00Z
```

**Friendly** (Balanced)
```
Oct 11, 2025 at 2:30 PM
```

**Relative** (Marketer)
```
2 hours ago
3 days ago
just now
```

---

### Interactive Prompts

Profiles control when the CLI prompts for missing information.

**Developer Profile** - Never prompts
```bash
$ cakemail campaigns create --name "Newsletter"
Error: Missing required parameter: --list-id
```

**Marketer Profile** - Always prompts
```bash
$ cakemail campaigns create
Campaign name: Newsletter
? Select a list: › Newsletter Subscribers (1,234 contacts)
? Select a sender: › Marketing Team <marketing@company.com>
✓ Campaign created
```

**Balanced Profile** - Auto-detects context
```bash
# Interactive (TTY detected)
$ cakemail campaigns create
Campaign name: Newsletter
[... prompts shown ...]

# Non-interactive (pipe or CI detected)
$ echo "cakemail campaigns create" | bash
Error: Missing required parameter: --list-id
```

---

### Confirmation Behavior

Destructive operations (delete, etc.) behave differently by profile:

**Developer Profile** - No confirmations
```bash
$ cakemail campaigns delete 789
✓ Campaign 789 deleted
```

**Marketer Profile** - Always confirm
```bash
$ cakemail campaigns delete 789
⚠ Delete campaign 789?
  Campaign will be permanently deleted
  This action cannot be undone

Delete campaign? (y/N):
```

**Balanced Profile** - Auto-detect
```bash
# Interactive terminal: confirms
$ cakemail campaigns delete 789
Delete campaign? (y/N):

# Script or CI: skips confirmation
$ ./deploy.sh  # contains delete command
✓ Campaign 789 deleted
```

All profiles support `--force` to skip confirmation:
```bash
cakemail campaigns delete 789 --force
```

---

### Progress Indicators

Long-running operations show progress differently:

**Developer** - Hidden (output only when complete)
```bash
$ cakemail contacts export 123
{"export_id":456,"status":"completed"}
```

**Marketer** - Full progress with spinner
```bash
$ cakemail contacts export 123
⠋ Exporting contacts... (attempt 1/30, 5s elapsed)
⠙ Exporting contacts... (attempt 2/30, 10s elapsed)
✓ Export complete
```

**Balanced** - Simple progress
```bash
$ cakemail contacts export 123
Exporting contacts...
✓ Export complete
```

---

### Error Messages

Errors adapt to your technical level:

**Developer** - Technical details
```
Error: HTTP 404 Not Found
Resource: Campaign (ID: 999)
Endpoint: GET /campaigns/999
Response: {"error":"resource_not_found","message":"Campaign not found"}
```

**Marketer** - Friendly explanation
```
✗ Campaign not found
  Campaign with ID '999' doesn't exist

💡 Tip: To see all campaigns, use:
   cakemail campaigns list
```

**Balanced** - Clear and actionable
```
Error: Campaign not found (ID: 999)
Suggestion: Use 'cakemail campaigns list' to see available campaigns
```

---

### List Defaults

Profiles control default pagination and sorting behavior for list commands.

**Developer Profile** - API defaults
```bash
$ cakemail campaigns list
# Returns 50 items per page (API default)
# Uses API default sort order
```

**Marketer Profile** - Curated experience
```bash
$ cakemail campaigns list
# Returns 25 items per page (more manageable)
# Sorts by newest first (-created_on)
# Shows: "Showing 1-25 of 150 • Page 1 of 6"
```

**Balanced Profile** - API defaults
```bash
$ cakemail campaigns list
# Returns 50 items per page (API default)
# Uses API default sort order
```

**Override with Explicit Flags:**
```bash
# All profiles respect explicit flags
$ cakemail campaigns list --limit 50 --sort "+name"
# Returns 50 items sorted by name (regardless of profile)
```

**Affected Commands:**
- `campaigns list`
- `contacts list`
- `lists list`
- `senders list`
- `templates list`
- All other list operations

**Why Different Defaults?**
- **Developer**: Wants full control, prefers API behavior (50 items, default sort)
- **Marketer**: Benefits from smaller pages and newest-first sorting (25 items, `-created_on`)
- **Balanced**: Uses API defaults for consistency (50 items, default sort)

---

## Profile Management

### View Current Profile

```bash
cakemail config profile
```

**Output:**
```
Current Profile: balanced

Settings:
  Output Format: table
  Color Scheme: moderate
  Date Format: friendly
  Show Progress: true
  Interactive Prompts: auto
  Confirmations: auto
  Error Style: balanced
  Show Tips: auto
```

---

### Switch Profiles

```bash
# Switch to developer mode
cakemail config profile-set developer

# Switch to marketer mode
cakemail config profile-set marketer

# Switch to balanced mode (default)
cakemail config profile-set balanced
```

---

### Preview Before Switching

See what a profile looks like before committing:

```bash
cakemail config preview developer
```

**Output:**
```
Developer Profile Settings:
  Output Format: json
  Color Scheme: none
  Date Format: iso8601
  Show Progress: false
  Interactive Prompts: never
  Confirmations: never
  Error Style: technical
  Show Tips: false

This profile is optimized for:
- Automation and scripting
- CI/CD pipelines
- Fast, non-interactive execution
- Machine-readable output
```

---

### Override Profile Once

Use a different profile for a single command without switching:

```bash
# Use developer mode just for this command
cakemail --profile developer campaigns list

# Use marketer mode just for this command
cakemail --profile marketer campaigns create
```

---

### Customize Profile Settings

Profiles provide defaults, but you can customize individual settings:

```bash
# Keep balanced profile, but use JSON output
cakemail config set output_format json

# Keep developer profile, but enable colors
cakemail config set color_scheme moderate

# View all custom settings
cakemail config show
```

---

### Reset to Profile Defaults

Remove customizations and restore profile defaults:

```bash
cakemail config reset
```

---

## Batch Mode

Disable all interactive features for a single command:

```bash
# Force non-interactive mode (regardless of profile)
cakemail --batch campaigns create --name "Newsletter" --list-id 123 --sender-id 456
```

**Batch mode:**
- Disables all prompts
- Skips all confirmations
- Hides progress indicators
- Returns errors immediately

**Use batch mode for:**
- CI/CD pipelines
- Cron jobs
- Shell scripts
- Automated workflows

---

## Environment Detection

The CLI automatically detects its environment:

**Interactive Terminal (TTY)**
- Prompts enabled (balanced/marketer profiles)
- Colors enabled
- Progress indicators shown
- Confirmations shown

**Non-Interactive (Pipe, CI, Cron)**
- Prompts disabled
- Colors may be disabled
- Progress indicators hidden
- Confirmations skipped

**Environment Variables:**
```bash
# Force batch mode
export CAKEMAIL_BATCH_MODE=true

# Detected automatically:
# - CI=true (GitLab, Travis, Jenkins)
# - GITHUB_ACTIONS=true
# - Non-TTY input/output
```

---

## Profile Configuration Storage

Profile settings are stored in:
```
~/.cakemail/config.json
```

**Example config.json:**
```json
{
  "profile": "balanced",
  "custom_settings": {
    "output_format": "json"
  },
  "auth": {
    "access_token": "your_token"
  },
  "defaults": {
    "current_account_id": 12345
  }
}
```

**Migration from .env:**
- First time you run the new system, credentials are migrated from `.env`
- `.env` files still work (backward compatible)
- Profile settings only in `config.json`

---

## Configuration Priority

When multiple config sources exist:

1. **CLI flags** (highest priority)
   ```bash
   cakemail --profile developer -f table campaigns list
   ```

2. **Custom settings**
   ```bash
   cakemail config set output_format json
   ```

3. **Profile defaults**
   ```bash
   cakemail config profile-set balanced
   ```

4. **Environment variables**
   ```bash
   export CAKEMAIL_OUTPUT_FORMAT=compact
   ```

5. **Hard-coded defaults** (lowest priority)

---

## Use Cases & Examples

### Use Case 1: Developer Writing a Script

**Goal:** Fast, non-interactive JSON output

```bash
# Set developer profile once
cakemail config profile-set developer

# Script runs without prompts or confirmations
#!/bin/bash
campaigns=$(cakemail campaigns list)
echo "$campaigns" | jq '.data[] | select(.status == "draft")'
```

---

### Use Case 2: Marketer Running Manual Commands

**Goal:** Guided, safe, visual output

```bash
# Set marketer profile
cakemail config profile-set marketer

# Interactive creation with guidance
cakemail campaigns create
# [Interactive prompts guide you through]

# Safe deletion with confirmation
cakemail campaigns delete 789
# [Confirms before deleting]
```

---

### Use Case 3: Team Lead Using Both

**Goal:** Interactive when exploring, non-interactive when automating

```bash
# Use balanced profile (default)
cakemail config profile-set balanced

# Interactive when in terminal
cakemail campaigns create
# [Shows prompts in TTY]

# Automatic in scripts
./deploy-campaign.sh
# [No prompts in script]
```

---

### Use Case 4: CI/CD Pipeline

**Goal:** Fully automated, machine-readable

```bash
# In CI environment (GitHub Actions, GitLab CI, etc.)
# Automatically detects CI and disables interactivity

# Or explicitly use developer profile
cakemail --profile developer campaigns list

# Or use --batch flag
cakemail --batch campaigns create --name "Auto Newsletter" --list-id 123 --sender-id 456
```

---

## Troubleshooting

### Profile Not Applying

**Problem:** Changes to profile don't seem to take effect

**Solutions:**
1. Check custom settings override profile:
   ```bash
   cakemail config show
   ```

2. Reset custom settings:
   ```bash
   cakemail config reset
   ```

3. Check environment variables:
   ```bash
   env | grep CAKEMAIL
   ```

---

### Unwanted Prompts in Scripts

**Problem:** Script hangs waiting for input

**Solutions:**
1. Use developer profile:
   ```bash
   cakemail config profile-set developer
   ```

2. Use `--batch` flag:
   ```bash
   cakemail --batch campaigns create --name "Newsletter" --list-id 123
   ```

3. Provide all required parameters:
   ```bash
   cakemail campaigns create --name "Newsletter" --list-id 123 --sender-id 456
   ```

---

### Missing Confirmations

**Problem:** Deletions happen without confirmation

**Solutions:**
1. Check current profile:
   ```bash
   cakemail config profile
   ```

2. Switch to marketer or balanced:
   ```bash
   cakemail config profile-set balanced
   ```

3. Confirmations are skipped in:
   - Developer profile
   - CI environments
   - Non-TTY contexts
   - When using `--force` flag

---

## Best Practices

### 1. Choose the Right Profile

- **Developer**: CI/CD, automation, scripting
- **Marketer**: Manual operations, learning, safety-critical tasks
- **Balanced**: Most users, mixed usage

### 2. Override When Needed

Don't switch profiles frequently. Instead, use `--profile` for one-off changes:
```bash
# Keep your default, but use developer mode once
cakemail --profile developer campaigns list
```

### 3. Use Batch Mode in Scripts

Always use `--batch` in scripts to prevent hangs:
```bash
#!/bin/bash
cakemail --batch campaigns create --name "Newsletter" --list-id 123 --sender-id 456
```

### 4. Customize Minimally

Let profiles provide defaults. Only customize when truly needed:
```bash
# Good: Use profile defaults
cakemail config profile-set balanced

# Avoid: Over-customizing defeats the purpose
cakemail config set output_format json
cakemail config set color_scheme rich
cakemail config set date_format relative
# ... (now you've rebuilt marketer profile manually)
```

---

