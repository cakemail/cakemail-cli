# Migration Guide: v1.4 to v1.5

Complete guide for upgrading from Cakemail CLI v1.4 to v1.5.

## Overview

Version 1.5.0 introduces the Profile System while maintaining 100% backward compatibility with v1.4. All existing commands, scripts, and workflows continue to work without changes.

**What's New in v1.5.0:**
- Three user profiles (developer, marketer, balanced)
- 6 profile management commands
- Interactive prompt system
- Profile-aware confirmations
- Global `--profile` and `--batch` flags
- Configuration storage in `~/.cakemail/config.json`

**Migration Effort:** Low
- No breaking changes
- Opt-in feature adoption
- Automatic credential migration
- Backward-compatible configuration

---

## Breaking Changes

**None!** Version 1.5.0 is fully backward compatible with v1.4.

All existing:
- Commands work identically
- Scripts continue running
- `.env` files still work
- Environment variables still work
- CLI flags still work

---

## What Changed

### 1. Configuration Storage

**v1.4.0:**
```
All configuration via .env files and environment variables
```

**v1.5.0:**
```
Profile settings in ~/.cakemail/config.json
Authentication still supports .env files (backward compatible)
```

**Migration:**
- Automatic on first v1.5 command
- Credentials migrated from `.env` to `config.json`
- `.env` files still work (backward compatible)
- No action required from you

---

### 2. Profile System (New)

**v1.4.0:**
```
Fixed CLI behavior for all users
```

**v1.5.0:**
```
Three profiles adapt to your workflow:
- developer: Fast, non-interactive, JSON
- marketer: Interactive, guided, safe
- balanced: Auto-detect context (default)
```

**Migration:**
- On first run, you'll select a profile
- Default is "balanced" (similar to v1.4 behavior)
- Can change anytime with `cakemail config profile-set <type>`

---

### 3. Interactive Features

**v1.4.0:**
```
Interactive prompts always shown in TTY
Confirmations always shown
```

**v1.5.0:**
```
Behavior depends on profile:
- Developer: No prompts, no confirmations
- Marketer: Always prompt, always confirm
- Balanced: Auto-detect (TTY vs script)
```

**Migration:**
- If you liked v1.4 behavior: Use balanced profile (default)
- If you want faster automation: Use developer profile
- If you want more guidance: Use marketer profile

---

### 4. New Commands

Six new config commands for profile management:

```bash
cakemail config profile                    # Show current profile
cakemail config profile-set <type>         # Switch profiles
cakemail config preview <type>             # Preview profile
cakemail config set <key> <value>          # Customize settings
cakemail config reset                      # Reset to profile defaults
cakemail config show                       # Show complete configuration
```

---

### 5. New Global Flags

Two new global flags available on all commands:

```bash
--profile <type>    # Override profile for single command
--batch             # Force non-interactive mode
```

**Examples:**
```bash
cakemail --profile developer campaigns list
cakemail --batch campaigns delete 123
```

---

## Migration Steps

### Step 1: Upgrade

**Via Homebrew:**
```bash
brew upgrade cakemail-cli
```

**Via npm:**
```bash
npm update -g @cakemail-org/cakemail-cli
```

**Verify version:**
```bash
cakemail --version
# Should show: 1.5.0
```

---

### Step 2: First Run

On your first v1.5 command, you'll see profile selection:

```bash
$ cakemail campaigns list
```

**If you have .env credentials:**
```
✓ Credentials found
✓ Migrating configuration to ~/.cakemail/config.json

? Select your preferred profile:
  ❯ Balanced - Best of both worlds (recommended)
    Developer - Fast, non-interactive, JSON output
    Marketer - Interactive, guided, safe

✓ Profile set to: balanced
✓ Migration complete

[... your command runs ...]
```

**If you don't have credentials:**
```
Welcome to Cakemail CLI v1.5.0!

? Email: your@email.com
? Password: [hidden]

✓ Authentication successful

? Select your preferred profile:
  ❯ Balanced - Best of both worlds (recommended)
    Developer - Fast, non-interactive, JSON output
    Marketer - Interactive, guided, safe

✓ Profile set to: balanced
✓ Configuration saved

[... your command runs ...]
```

---

### Step 3: Choose Your Profile

Select the profile that matches your workflow:

**Choose Balanced if:**
- ✅ You run both interactive and scripted commands
- ✅ You want v1.4-like behavior (default)
- ✅ You want auto-detection of interactive vs batch contexts
- ✅ You're not sure which to choose

**Choose Developer if:**
- ✅ You primarily use CLI in scripts
- ✅ You want JSON output by default
- ✅ You want maximum speed (no prompts/confirmations)
- ✅ You're comfortable with CLI tools

**Choose Marketer if:**
- ✅ You're new to command-line tools
- ✅ You want interactive guidance
- ✅ You want safety confirmations on destructive operations
- ✅ You prefer visual, colored output

**You can change profiles anytime:**
```bash
cakemail config profile-set developer
cakemail config profile-set marketer
cakemail config profile-set balanced
```

---

### Step 4: Test Your Workflows

Run your typical commands and verify they work as expected:

```bash
# List campaigns
cakemail campaigns list

# Create resources
cakemail lists create --name "Test List"

# Delete operations (may now prompt based on profile)
cakemail campaigns delete 123
```

**If behavior changed unexpectedly:**
```bash
# Check your profile
cakemail config profile

# Try balanced profile (most v1.4-like)
cakemail config profile-set balanced

# Or use --profile flag to test
cakemail --profile balanced campaigns list
```

---

### Step 5: Update Scripts (Optional)

Your v1.4 scripts work without changes, but you can optimize them:

**v1.4 Script:**
```bash
#!/bin/bash
# Works in v1.5 without changes
cakemail campaigns create --name "Newsletter" --list-id 123 --sender-id 456
cakemail campaigns delete 789 --force
```

**v1.5 Optimized Script:**
```bash
#!/bin/bash
# Use --batch to ensure non-interactive behavior
cakemail --batch campaigns create --name "Newsletter" --list-id 123 --sender-id 456
cakemail --batch campaigns delete 789 --force
```

**Why optimize?**
- `--batch` flag explicitly disables all interactive features
- Prevents future profile changes from affecting scripts
- Makes intent clear to other developers
- More robust in different environments

---

## Configuration Migration

### Automatic Migration

On first v1.5 run, the CLI:

1. **Looks for credentials** in `.env` file or environment
2. **Migrates to config.json** if found
3. **Preserves .env** file (still works, backward compatible)
4. **Prompts for profile** selection
5. **Saves configuration** to `~/.cakemail/config.json`

**Example Migration:**

**Before (v1.4):**
```
~/.cakemail/.env:
  CAKEMAIL_ACCESS_TOKEN=abc123
  CAKEMAIL_OUTPUT_FORMAT=compact
```

**After (v1.5):**
```
~/.cakemail/config.json:
  {
    "profile": "balanced",
    "auth": {
      "access_token": "abc123"
    },
    "custom_settings": {
      "output_format": "compact"
    }
  }

~/.cakemail/.env:
  # Still exists, still works (backward compatible)
  CAKEMAIL_ACCESS_TOKEN=abc123
  CAKEMAIL_OUTPUT_FORMAT=compact
```

### Manual Migration

If you prefer to migrate manually:

```bash
# 1. Set your profile
cakemail config profile-set balanced

# 2. Migrate your custom settings
cakemail config set output_format compact

# 3. Verify configuration
cakemail config show

# 4. (Optional) Remove .env file
rm ~/.cakemail/.env
```

---

## Feature Adoption Guide

### Adopt Profile System

**When:** First run

**How:**
1. Run any command
2. Select profile when prompted
3. Continue using CLI normally

**Benefit:** CLI adapts to your workflow

---

### Adopt Profile Switching

**When:** You have different workflows

**Example Scenarios:**

**Morning (exploring):**
```bash
cakemail config profile-set marketer
cakemail campaigns list  # Interactive, guided
```

**Afternoon (scripting):**
```bash
cakemail config profile-set developer
./deploy-campaigns.sh  # Fast, non-interactive
```

**Benefit:** Switch behavior based on task

---

### Adopt Temporary Profile Override

**When:** One-off commands with different needs

**Examples:**

```bash
# Normal profile: marketer
# Need quick JSON once
cakemail --profile developer campaigns get 123

# Normal profile: developer
# Need interactive creation once
cakemail --profile marketer campaigns create
```

**Benefit:** No permanent config changes needed

---

### Adopt Batch Mode

**When:** Writing new scripts

**Before:**
```bash
#!/bin/bash
cakemail campaigns delete 123 --force
```

**After:**
```bash
#!/bin/bash
cakemail --batch campaigns delete 123 --force
```

**Benefit:** Explicit non-interactive intent, profile-independent

---

## Backward Compatibility

### What Still Works

✅ **All v1.4 commands**
```bash
cakemail campaigns list
cakemail contacts add 123 --email "user@example.com"
```

✅ **All v1.4 flags**
```bash
cakemail -f json campaigns list
cakemail --account 12345 lists list
```

✅ **.env files**
```bash
# .env
CAKEMAIL_ACCESS_TOKEN=abc123
CAKEMAIL_OUTPUT_FORMAT=compact
```

✅ **Environment variables**
```bash
export CAKEMAIL_ACCESS_TOKEN=abc123
cakemail campaigns list
```

✅ **All v1.4 scripts**
```bash
#!/bin/bash
# Works identically in v1.5
cakemail campaigns create --name "Newsletter" --list-id 123
```

---

### Configuration Priority (Unchanged)

Priority order remains the same:

1. CLI flags (highest)
2. Environment variables
3. Configuration file
4. Defaults (lowest)

**New in v1.5:** Profile settings inserted between #3 and #4

**Complete Priority:**
1. CLI flags (`--profile`, `-f`, etc.)
2. Environment variables (`CAKEMAIL_OUTPUT_FORMAT`, etc.)
3. Custom settings (`config set`)
4. Profile defaults (new)
5. Hard-coded defaults

---

## Troubleshooting Migration

### Issue: Commands Prompt Unexpectedly

**Problem:** Scripts hang waiting for input

**Cause:** Marketer or balanced profile in interactive context

**Solutions:**

1. **Use developer profile:**
   ```bash
   cakemail config profile-set developer
   ```

2. **Use --batch flag:**
   ```bash
   cakemail --batch campaigns delete 123
   ```

3. **Provide all required parameters:**
   ```bash
   cakemail campaigns create --name "Newsletter" --list-id 123 --sender-id 456
   ```

---

### Issue: Different Output Format

**Problem:** Commands output different format than v1.4

**Cause:** Profile default differs from your v1.4 config

**Solutions:**

1. **Check current profile:**
   ```bash
   cakemail config profile
   ```

2. **Set output format:**
   ```bash
   cakemail config set output_format compact
   ```

3. **Or use -f flag:**
   ```bash
   cakemail -f compact campaigns list
   ```

---

### Issue: Missing Confirmations

**Problem:** Deletes happen without confirmation

**Cause:** Developer profile skips confirmations

**Solutions:**

1. **Switch to balanced or marketer:**
   ```bash
   cakemail config profile-set balanced
   ```

2. **Remove --force flag if used:**
   ```bash
   # Change from:
   cakemail campaigns delete 123 --force

   # To:
   cakemail campaigns delete 123
   ```

---

### Issue: Config File Migration Failed

**Problem:** Credentials not migrated to config.json

**Cause:** .env file in unexpected location

**Solutions:**

1. **Check .env location:**
   ```bash
   ls -la ~/.cakemail/.env
   ls -la .env
   ```

2. **Manually set credentials:**
   ```bash
   # Run any command, provide credentials when prompted
   cakemail campaigns list
   ```

3. **Or set access token:**
   ```bash
   export CAKEMAIL_ACCESS_TOKEN=your_token
   cakemail campaigns list
   ```

---

## Rollback Plan

If you need to roll back to v1.4:

### Via Homebrew

```bash
brew uninstall cakemail-cli
brew install cakemail-cli@1.4
```

### Via npm

```bash
npm uninstall -g @cakemail-org/cakemail-cli
npm install -g @cakemail-org/cakemail-cli@1.4.0
```

### Restore Configuration

v1.4 only reads `.env` files:

```bash
# If you still have .env file
ls ~/.cakemail/.env  # Should work immediately

# If you deleted .env, recreate it from config.json
cat ~/.cakemail/config.json  # Copy your access_token
echo 'CAKEMAIL_ACCESS_TOKEN=your_token' > ~/.cakemail/.env
```

---

## FAQ

### Do I need to update my scripts?

**No.** All v1.4 scripts work without changes in v1.5.

**Optional:** Add `--batch` flag for explicit non-interactive behavior.

---

### Will my .env file still work?

**Yes.** `.env` files are fully supported in v1.5 for backward compatibility.

---

### What happens to my credentials?

**Automatic migration:**
- Credentials copied from `.env` to `~/.cakemail/config.json`
- `.env` file preserved (still works)
- More secure storage in `config.json`

---

### Can I skip profile selection?

**No on first run.** You must select a profile once.

**After that:** Profile is saved, no more selection needed.

---

### Can I change my profile later?

**Yes, anytime:**
```bash
cakemail config profile-set developer
cakemail config profile-set marketer
cakemail config profile-set balanced
```

---

### What if I'm using v1.5 in CI/CD?

**Two options:**

1. **Set developer profile** (recommended):
   ```bash
   cakemail config profile-set developer
   ```

2. **Use --batch flag** on all commands:
   ```bash
   cakemail --batch campaigns list
   cakemail --batch campaigns delete 123
   ```

---

### How do I see what changed?

**View profile settings:**
```bash
cakemail config profile
```

**View complete configuration:**
```bash
cakemail config show
```

**Compare profiles:**
```bash
cakemail config preview developer
cakemail config preview marketer
cakemail config preview balanced
```

---

## Next Steps

- [Profile System](../02-core-concepts/profile-system.md) - Learn about the three profiles
- [Config Commands](../09-command-reference/config.md) - Master profile management
- [Configuration Guide](../01-getting-started/configuration.md) - Complete configuration reference

---

## Getting Help

**Issues after migration?**
1. Check your profile: `cakemail config profile`
2. Try balanced profile: `cakemail config profile-set balanced`
3. Review complete config: `cakemail config show`
4. Report bugs: [GitHub Issues](https://github.com/cakemail-org/cakemail-cli/issues)

**Questions about profiles?**
- Read [Profile System](../02-core-concepts/profile-system.md)
- Preview each profile: `cakemail config preview <type>`
- Experiment - you can always switch back!
