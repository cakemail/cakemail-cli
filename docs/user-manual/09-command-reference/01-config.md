# Config Commands

Manage CLI configuration and profile settings.

## Overview

The config commands allow you to manage your CLI profile, customize settings, and view your complete configuration. Profile settings are stored in `~/.cakemail/config.json`.

**Available Commands:**
- [`config profile`](#config-profile) - Show current profile and settings
- [`config profile-set`](#config-profile-set) - Switch to a different profile
- [`config preview`](#config-preview) - Preview profile settings without switching
- [`config set`](#config-set) - Customize individual settings
- [`config reset`](#config-reset) - Reset all settings to profile defaults
- [`config show`](#config-show) - Show complete configuration
- [`logout`](#logout) - Log out and clear all authentication tokens

**Related Documentation:**
- [Profile System](/en/cli/core-concepts/profile-system/) - Complete profile guide
- [Configuration Guide](/en/cli/getting-started/configuration/) - Configuration overview
- [Authentication](/en/cli/getting-started/authentication/) - Authentication methods

---

## config profile

Show your current profile and all settings.

### Usage

```bash
cakemail config profile
```

### Output

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

### Description

Displays your active profile and all profile-controlled settings. Use this to understand your current CLI behavior.

### Output Formats

This command always outputs in a human-readable format, regardless of `-f` flag.

---

## config profile-set

Switch to a different profile.

### Usage

```bash
cakemail config profile-set <type>
```

### Arguments

- `<type>` - Profile type (required)
  - `developer` - Fast, non-interactive, JSON output
  - `marketer` - Interactive, guided, rich colors
  - `balanced` - Auto-detect context (default)

### Examples

**Switch to Developer Profile:**
```bash
$ cakemail config profile-set developer
✓ Profile set to: developer

Settings:
  Output Format: json
  Color Scheme: none
  Interactive Prompts: never
  Confirmations: never
  Show Progress: false
```

**Switch to Marketer Profile:**
```bash
$ cakemail config profile-set marketer
✓ Profile set to: marketer

Settings:
  Output Format: compact
  Color Scheme: rich
  Interactive Prompts: always
  Confirmations: always
  Show Progress: true
```

**Switch to Balanced Profile:**
```bash
$ cakemail config profile-set balanced
✓ Profile set to: balanced

Settings:
  Output Format: table
  Color Scheme: moderate
  Interactive Prompts: auto
  Confirmations: auto
```

### Notes

- Profile settings are saved to `~/.cakemail/config.json`
- Settings apply immediately to all subsequent commands
- Custom settings are preserved (but profile defaults may override)
- Use `config reset` to clear custom settings

---

## config preview

Preview a profile's settings without switching to it.

### Usage

```bash
cakemail config preview <type>
```

### Arguments

- `<type>` - Profile type to preview (required)
  - `developer`
  - `marketer`
  - `balanced`

### Example

```bash
$ cakemail config preview developer
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

To switch to this profile:
  cakemail config profile-set developer
```

### Use Cases

- **Exploring profiles** before committing to a switch
- **Comparing profiles** to find the right one for your workflow
- **Documentation** - understanding what each profile does

---

## config set

Customize individual profile settings.

### Usage

```bash
cakemail config set <key> <value>
```

### Arguments

- `<key>` - Setting name (required)
- `<value>` - Setting value (required)

### Available Settings

| Setting | Values | Description |
|---------|--------|-------------|
| `output_format` | `json`, `table`, `compact` | Default output format |
| `color_scheme` | `none`, `minimal`, `moderate`, `rich` | Color usage |
| `date_format` | `iso8601`, `friendly`, `relative` | Date display style |
| `show_progress` | `true`, `false` | Show progress indicators |
| `interactive_prompts` | `never`, `auto`, `always` | Interactive prompt behavior |
| `confirmations` | `never`, `auto`, `always` | Confirmation prompt behavior |
| `error_style` | `technical`, `balanced`, `friendly` | Error message style |
| `show_tips` | `true`, `false`, `auto` | Show helpful tips |

### Examples

**Change Output Format:**
```bash
$ cakemail config set output_format json
✓ Setting updated: output_format = json

Current settings now differ from profile defaults.
Use 'cakemail config reset' to restore profile defaults.
```

**Disable Colors:**
```bash
$ cakemail config set color_scheme none
✓ Setting updated: color_scheme = none
```

**Always Show Prompts:**
```bash
$ cakemail config set interactive_prompts always
✓ Setting updated: interactive_prompts = always
```

**Disable Progress Indicators:**
```bash
$ cakemail config set show_progress false
✓ Setting updated: show_progress = false
```

### Notes

- Custom settings override profile defaults
- Settings persist in `~/.cakemail/config.json`
- Use `config show` to see all custom settings
- Use `config reset` to clear custom settings and restore profile defaults

### Configuration Priority

When a setting is customized:
```
CLI flags > Custom settings > Profile defaults > Hard-coded defaults
```

Example:
```bash
# Custom setting
cakemail config set output_format json

# Profile default
cakemail config profile-set balanced  # (default: table)

# Result: JSON (custom setting wins)
cakemail campaigns list  # outputs JSON

# Override with flag
cakemail -f compact campaigns list  # outputs compact (flag wins)
```

---

## config reset

Reset all custom settings to profile defaults.

### Usage

```bash
cakemail config reset
```

### Example

```bash
$ cakemail config reset
⚠ Reset all custom settings to profile defaults?
  This will remove all customizations.

Reset settings? (y/N): y

✓ Settings reset to defaults for profile: balanced

Current Settings:
  Output Format: table
  Color Scheme: moderate
  Date Format: friendly
  Show Progress: true
```

### Description

Removes all custom settings and restores the defaults for your current profile. Profile selection is preserved - only custom setting overrides are cleared.

### What Gets Reset

- Output format override
- Color scheme override
- Date format override
- Progress indicator override
- Interactive prompts override
- Confirmation override
- Error style override
- Tips override

### What Stays

- Current profile selection
- Authentication credentials
- Account context

### Use Cases

- **Profile switching** - Clean slate when trying a different profile
- **Troubleshooting** - Eliminate custom settings as error source
- **Defaults** - Return to recommended profile settings

### Notes

- Requires confirmation (unless `--force` flag used)
- Cannot be undone (custom settings are lost)
- Profile remains unchanged (only custom overrides are cleared)

---

## config show

Show complete configuration including authentication and defaults.

### Usage

```bash
cakemail config show
```

### Example

```bash
$ cakemail config show
```

**Output:**
```json
{
  "profile": "balanced",
  "settings": {
    "output_format": "table",
    "color_scheme": "moderate",
    "date_format": "friendly",
    "show_progress": true,
    "interactive_prompts": "auto",
    "confirmations": "auto",
    "error_style": "balanced",
    "show_tips": "auto"
  },
  "custom_settings": {
    "output_format": "json"
  },
  "auth": {
    "method": "access_token",
    "has_token": true
  },
  "defaults": {
    "current_account_id": 12345
  },
  "config_file": "/Users/username/.cakemail/config.json"
}
```

### Description

Displays your complete CLI configuration in JSON format. Useful for:
- Debugging configuration issues
- Sharing configuration with support
- Understanding effective settings
- Auditing custom overrides

### Fields Explained

**profile**
- Currently active profile (developer, marketer, balanced)

**settings**
- Effective settings (combining profile defaults and custom overrides)

**custom_settings**
- Your custom overrides (if any)
- Empty object if using pure profile defaults

**auth**
- Authentication method in use
- Whether credentials are present (never shows actual credentials)

**defaults**
- Current account ID
- Other default values

**config_file**
- Path to configuration file

### Output Format

This command always outputs JSON, regardless of profile or `-f` flag.

---

## Global Override Flags

In addition to config commands, you can override settings per-command:

### --profile Flag

Use a different profile for a single command:

```bash
# Current profile: balanced
cakemail config profile
# Profile: balanced

# Override to developer for this command only
cakemail --profile developer campaigns list
# [outputs JSON]

# Next command uses balanced again
cakemail campaigns list
# [outputs table]
```

**Use Cases:**
- Quick non-interactive command in marketer profile
- Quick formatted output in developer profile
- Testing different profile behaviors

### --batch Flag

Force batch mode (non-interactive) for a single command:

```bash
cakemail --batch campaigns create --name "Newsletter" --list-id 123 --sender-id 456
```

**Batch mode disables:**
- Interactive prompts
- Confirmations
- Progress indicators
- Tips and hints

**Use Cases:**
- Shell scripts
- CI/CD pipelines
- Cron jobs
- Any automated workflow

---

## Examples

### Example 1: First-Time Profile Selection

```bash
# View all profiles
cakemail config preview developer
cakemail config preview marketer
cakemail config preview balanced

# Choose marketer profile
cakemail config profile-set marketer

# Verify
cakemail config profile
```

---

### Example 2: Developer Customization

```bash
# Start with developer profile
cakemail config profile-set developer

# But prefer tables over JSON sometimes
cakemail config set output_format table

# Now you get:
# - No prompts (developer profile)
# - No confirmations (developer profile)
# - Table output (custom setting)
```

---

### Example 3: Troubleshooting Configuration

```bash
# Something not working right?

# 1. Check current profile
cakemail config profile

# 2. View complete configuration
cakemail config show

# 3. Reset to defaults
cakemail config reset

# 4. Try again
cakemail campaigns list
```

---

### Example 4: Temporary Profile Override

```bash
# Set marketer profile
cakemail config profile-set marketer

# Need fast JSON output once
cakemail --profile developer campaigns list

# Back to marketer for next command
cakemail campaigns create
# [shows interactive prompts]
```

---

## Configuration File Location

Profile settings are stored in:
```
~/.cakemail/config.json
```

### File Structure

```json
{
  "profile": "balanced",
  "custom_settings": {
    "output_format": "json"
  },
  "auth": {
    "access_token": "your_token_here"
  },
  "defaults": {
    "current_account_id": 12345
  }
}
```

### Manual Editing

You can manually edit `config.json`, but use config commands when possible:
- Commands validate settings
- Commands provide helpful feedback
- Commands are cross-platform compatible

---

## Troubleshooting

### Settings Not Applied

**Problem:** Changed a setting but commands don't reflect it

**Solutions:**

1. **Check effective settings:**
   ```bash
   cakemail config show
   ```

2. **CLI flags override everything:**
   ```bash
   # This ignores your profile/custom settings
   cakemail -f json campaigns list
   ```

3. **Environment variables can override:**
   ```bash
   # Check for environment variable overrides
   env | grep CAKEMAIL
   ```

---

### Config File Missing

**Problem:** Config file deleted or corrupted

**Solution:**

Config file is created automatically on first use. Just run a command:
```bash
cakemail config profile-set balanced
```

---

### Lost Custom Settings

**Problem:** Custom settings disappeared

**Possible Causes:**

1. **Ran `config reset`:**
   - This clears all custom settings
   - Cannot be undone

2. **Switched profiles:**
   - Profile switch preserves custom settings
   - But profile defaults may override

3. **Config file deleted:**
   - Settings stored in `~/.cakemail/config.json`
   - If deleted, settings are lost

---

## logout

Log out and clear all authentication tokens and configuration.

### Usage

```bash
cakemail logout [options]
```

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Interactive Logout:**
```bash
$ cakemail logout
```

**Output:**
```
🚪 Logout

Currently logged in as: user@example.com

This will remove:
  • Authentication tokens
  • Profile settings
  • All saved configuration

? Are you sure you want to log out? (y/N) y

✓ Logged out successfully

Run any command to log in again.
```

**Force Logout (Skip Confirmation):**
```bash
$ cakemail logout --force
```

**Output:**
```
✓ Logged out successfully
```

### Description

The logout command removes all stored credentials and configuration from `~/.cakemail/config.json`. This includes:

- OAuth access tokens
- OAuth refresh tokens
- Profile settings
- Account context
- All custom configuration

After logging out, you'll need to authenticate again the next time you run a command.

### Use Cases

**Switching Accounts:**
```bash
# Log out from current account
$ cakemail logout --force

# Run any command to log in with different account
$ cakemail campaigns list
# [Prompts for credentials]
```

**Shared Machine:**
```bash
# Log out when done to protect credentials
$ cakemail logout --force
```

**Troubleshooting:**
```bash
# Clear all config and start fresh
$ cakemail logout --force
$ cakemail campaigns list
# [Fresh authentication flow]
```

### Notes

- Logout is profile-aware:
  - **Marketer profile**: Always confirms (unless `--force`)
  - **Developer profile**: Never confirms
  - **Balanced profile**: Confirms in TTY, skips in scripts
- The entire config file is deleted, not just authentication
- Cannot be undone - you'll need to re-authenticate
- Use `--force` in scripts to skip confirmation

### See Also

- [`config show`](#config-show) - View current configuration
- [Authentication Guide](/en/cli/getting-started/authentication/) - Learn about authentication methods

---

## Best Practices

### 1. Choose Profile First

Start with a profile that matches your workflow:
```bash
cakemail config profile-set marketer  # or developer or balanced
```

### 2. Customize Sparingly

Profiles provide sensible defaults. Only customize when necessary:
```bash
# Good - profile is usually enough
cakemail config profile-set developer

# Avoid - defeats the purpose of profiles
cakemail config set output_format table
cakemail config set color_scheme rich
cakemail config set interactive_prompts always
# (you've basically recreated marketer profile)
```

### 3. Use Temporary Overrides

For one-off changes, use flags instead of changing config:
```bash
# Good - temporary override
cakemail --profile developer campaigns list

# Avoid - changes persistent config
cakemail config set output_format json
cakemail campaigns list
cakemail config set output_format table
```

### 4. Document Team Profiles

For teams, document the recommended profile:
```bash
# In your project README:
# "This project uses developer profile for CI/CD"
cakemail config profile-set developer
```

---

