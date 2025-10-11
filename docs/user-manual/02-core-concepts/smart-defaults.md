# Smart Defaults

Learn how the CLI automatically detects resources to streamline your workflow.

## Overview

Smart Defaults (introduced in v1.4.0) eliminate repetitive parameter inputs by auto-detecting common resources like lists and senders. If you have only one list or one confirmed sender, the CLI automatically uses it - no need to specify IDs every time!

**Key Benefits:**
- Zero-configuration workflow for users with single lists
- Fewer command-line parameters to remember
- Session caching for fast repeated operations
- Helpful suggestions when multiple resources exist

---

## How Auto-Detection Works

When a command needs a list ID or sender ID, the CLI:

1. **Checks if parameter was provided** - If you specified `--list-id`, it uses that
2. **Looks in session cache** - Recent API calls are cached for 5 minutes
3. **Fetches from API** - If not cached, makes API call to list resources
4. **Auto-detects single resource** - If exactly one exists, uses it automatically
5. **Prompts or errors** - If multiple exist, shows options (interactive) or error (batch)

---

## Commands with Auto-Detection

### List Auto-Detection (14 commands)

These commands make `list-id` optional when you have exactly one list:

**Contact Management:**
- `contacts list [list-id]` - List contacts
- `contacts add [list-id]` - Add contact
- `contacts export [list-id]` - Export contacts
- `contacts exports [list-id]` - List exports

**Segments:**
- `segments list [list-id]` - List segments
- `segments get [list-id] <segment-id>` - Get segment
- `segments create [list-id]` - Create segment
- `segments update [list-id] <segment-id>` - Update segment
- `segments delete [list-id] <segment-id>` - Delete segment
- `segments contacts [list-id] <segment-id>` - List segment contacts

**Custom Attributes:**
- `attributes list [list-id]` - List attributes
- `attributes get [list-id] <name>` - Get attribute
- `attributes create [list-id]` - Create attribute
- `attributes delete [list-id] <name>` - Delete attribute

### Sender Auto-Detection (1 command)

This command makes `sender-id` optional when you have exactly one confirmed sender:

- `campaigns create` - Auto-detects both list ID and sender ID

---

## Single Resource Scenario

When you have exactly one list (or sender), the CLI uses it automatically.

**Example: List Contacts (Single List)**

```bash
$ cakemail contacts list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)

┌──────────────────────┬────────────────────┬──────────────┐
│ Email                │ Status             │ Subscribed   │
├──────────────────────┼────────────────────┼──────────────┤
│ john@example.com     │ ✓ active           │ 2 days ago   │
│ jane@example.com     │ ✓ active           │ 5 days ago   │
└──────────────────────┴────────────────────┴──────────────┘
```

**What Happened:**
1. No `--list-id` provided
2. CLI fetched lists from API
3. Found exactly one list (ID: 123)
4. Used it automatically
5. Shows confirmation message

---

## Multiple Resources Scenario

When multiple lists exist, behavior depends on your profile and environment.

### Interactive Mode (Marketer/Balanced Profiles in TTY)

The CLI shows an interactive selection menu:

```bash
$ cakemail contacts list
```

**Output:**
```
Multiple lists found. Please select one:

? Select a list:
  ❯ Newsletter Subscribers (1,234 contacts)
    Product Updates (567 contacts)
    VIP Customers (89 contacts)
```

After selection, command proceeds with chosen list.

### Non-Interactive Mode (Developer Profile or Scripts)

The CLI returns an error with suggestions:

```bash
$ cakemail contacts list
```

**Output:**
```
Error: Multiple lists found. Please specify --list-id <id>

Available lists:
  123: Newsletter Subscribers (1,234 contacts)
  456: Product Updates (567 contacts)
  789: VIP Customers (89 contacts)

Example:
  cakemail contacts list --list-id 123
```

**Solution:** Provide `--list-id`:
```bash
cakemail contacts list --list-id 123
```

---

## Session Caching

To improve performance, the CLI caches resource lookups for 5 minutes.

**How It Works:**
1. First call fetches lists from API
2. Result cached in memory
3. Subsequent calls within 5 minutes use cache
4. Cache expires after 5 minutes

**Example:**
```bash
# First call - fetches from API
$ cakemail contacts list
✓ Auto-detected list: 123

# Second call within 5 minutes - uses cache (instant)
$ cakemail segments list
✓ Auto-detected list: 123

# Third call within 5 minutes - uses cache (instant)
$ cakemail attributes list
✓ Auto-detected list: 123
```

**Benefits:**
- Faster command execution
- Reduced API calls
- Better user experience
- Lower API rate limit usage

**Cache Scope:**
- Per CLI session (process)
- Not persisted to disk
- Cleared after 5 minutes
- Separate for lists and senders

---

## Sender Auto-Detection

The `campaigns create` command auto-detects senders, but only confirmed ones.

### Single Confirmed Sender

```bash
$ cakemail campaigns create --name "Weekly Newsletter" --list-id 123
```

**Output:**
```
✓ Auto-detected sender: 456 (Marketing Team <marketing@company.com>)
✓ Campaign created: 789
```

### Multiple Confirmed Senders (Interactive)

```bash
$ cakemail campaigns create --name "Weekly Newsletter" --list-id 123
```

**Output:**
```
? Select a sender:
  ❯ Marketing Team <marketing@company.com> (Confirmed)
    Sales Team <sales@company.com> (Confirmed)
    Support <support@company.com> (Confirmed)
```

### No Confirmed Senders

```bash
$ cakemail campaigns create --name "Weekly Newsletter" --list-id 123
```

**Output:**
```
Error: No confirmed senders found. Please verify a sender first.

To create a sender:
  cakemail senders create --name "Marketing Team" --email "marketing@company.com"

Then confirm via the email link sent to the sender address.
```

**Note:** Only **confirmed** senders are considered for auto-detection. Pending senders are excluded.

---

## Disabling Auto-Detection

If you want to explicitly provide IDs every time, you have options:

### Option 1: Always Provide Parameters

```bash
cakemail contacts list --list-id 123
cakemail segments create --list-id 123 --name "Active Users"
```

### Option 2: Use Developer Profile

Developer profile skips interactive prompts:

```bash
cakemail config profile-set developer
cakemail contacts list  # Error if list-id not provided
```

### Option 3: Use Batch Mode

```bash
cakemail --batch contacts list --list-id 123
```

---

## Best Practices

### 1. Let Auto-Detection Work

For single-list users, embrace auto-detection:

```bash
# Good - simple and clear
cakemail contacts list

# Unnecessary - adds extra typing
cakemail contacts list --list-id 123
```

### 2. Provide IDs in Scripts

In automation, always provide IDs explicitly:

```bash
#!/bin/bash
# Good - explicit and reliable
cakemail contacts export --list-id 123

# Avoid - depends on account state
cakemail contacts export
```

### 3. Use Cache for Repeated Operations

Group related commands together to benefit from caching:

```bash
# These all use the cached list lookup
cakemail contacts list
cakemail segments list
cakemail attributes list
```

### 4. Profile-Aware Workflows

Choose profile based on your needs:
- **Marketer**: Interactive prompts when multiple resources exist
- **Balanced**: Interactive in terminal, error in scripts
- **Developer**: Always require explicit IDs

---

## Troubleshooting

### "Multiple lists found" Error

**Problem:** Getting error even though you want to use a specific list

**Solution:** Provide `--list-id`:
```bash
cakemail contacts list --list-id 123
```

Or switch to interactive profile:
```bash
cakemail config profile-set marketer
cakemail contacts list  # Will show selection menu
```

---

### Auto-Detection Not Working

**Problem:** CLI asks for list-id even though you have only one list

**Solutions:**

1. **Check you actually have lists:**
   ```bash
   cakemail lists list
   ```

2. **Verify the parameter name:**
   ```bash
   # Correct
   cakemail contacts list

   # Wrong - this command doesn't support auto-detection
   cakemail lists get --list-id 123  # 'list-id' is required parameter here
   ```

3. **Clear and retry:**
   Sometimes caching issues occur. Start a new terminal session.

---

### Unwanted Interactive Prompts

**Problem:** Getting prompts in scripts

**Solutions:**

1. **Use batch mode:**
   ```bash
   cakemail --batch contacts list --list-id 123
   ```

2. **Switch to developer profile:**
   ```bash
   cakemail config profile-set developer
   ```

3. **Always provide parameters:**
   ```bash
   cakemail contacts list --list-id 123 --limit 100
   ```

---

## Commands That Don't Support Auto-Detection

These commands always require explicit IDs:

**Resource-Specific Operations:**
- `lists get <id>` - Specific list required
- `lists update <id>` - Specific list required
- `lists delete <id>` - Specific list required
- `campaigns get <id>` - Specific campaign required
- `senders get <id>` - Specific sender required

**Reason:** These operate on a specific resource, not a default one.

---

## Examples

### Example 1: Quick Contact Export

**Scenario:** Export contacts from your only list

```bash
# Old way (pre-v1.4.0)
cakemail lists list  # Find list ID
cakemail contacts export --list-id 123

# New way (v1.4.0+)
cakemail contacts export
# ✓ Auto-detected list: 123 (Newsletter Subscribers)
# ✓ Export created: 456
```

---

### Example 2: Create Segment Workflow

**Scenario:** Create and populate a segment

```bash
# All these commands use the same cached list
cakemail segments create --name "Active Users" --conditions "status==active"
# ✓ Auto-detected list: 123

cakemail segments list
# ✓ Auto-detected list: 123 (cached)

cakemail segments contacts 789
# ✓ Auto-detected list: 123 (cached)
```

---

### Example 3: Multi-List Account

**Scenario:** Working with multiple lists interactively

```bash
# Marketer profile enables interactive selection
cakemail config profile-set marketer

cakemail contacts list
# ? Select a list:
#   ❯ Newsletter (1,234 contacts)
#     Product Updates (567 contacts)

# Choose "Newsletter" from menu
# [Shows Newsletter contacts]

cakemail segments list
# ? Select a list:
#   ❯ Newsletter (1,234 contacts)
#     Product Updates (567 contacts)

# Choose "Newsletter" again
# [Shows Newsletter segments]
```

---

### Example 4: Scripted Multi-List Operations

**Scenario:** Script that works with specific lists

```bash
#!/bin/bash
# Always provide list-id in scripts

NEWSLETTER_LIST=123
PRODUCT_LIST=456

# Export from both lists
cakemail contacts export --list-id $NEWSLETTER_LIST
cakemail contacts export --list-id $PRODUCT_LIST

echo "Exports created for both lists"
```

---

## Related Features

Smart Defaults work together with other CLI features:

- **[Profile System](./profile-system.md)** - Controls interactive vs non-interactive behavior
- **[Interactive Prompts](./profile-system.md#interactive-prompts)** - Shows selection menus in interactive mode
- **[Batch Mode](../01-getting-started/configuration.md#global-flags)** - Disables all auto-detection prompts

---

## Next Steps

- [Profile System](./profile-system.md) - Configure interactive behavior
- [Campaign Creation](../04-campaign-management/campaigns-basics.md) - See smart defaults in action
- [Contact Management](../05-contact-management/contacts.md) - Work with contacts using auto-detection
