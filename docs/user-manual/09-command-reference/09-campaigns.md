# Campaign Commands

Manage email campaigns for your Cakemail account.

## Overview

Campaigns are email broadcasts sent to your contact lists. Use these commands to create, manage, schedule, and track email campaigns. Campaigns support templates, personalization, scheduling, and comprehensive lifecycle management.

**Available Commands:**
- [`campaigns list`](#campaigns-list) - List all campaigns
- [`campaigns get`](#campaigns-get) - Get campaign details
- [`campaigns create`](#campaigns-create) - Create a new campaign
- [`campaigns update`](#campaigns-update) - Update campaign properties
- [`campaigns delete`](#campaigns-delete) - Delete a campaign
- [`campaigns schedule`](#campaigns-schedule) - Schedule a campaign for sending
- [`campaigns reschedule`](#campaigns-reschedule) - Change scheduled send time
- [`campaigns unschedule`](#campaigns-unschedule) - Remove scheduling
- [`campaigns test`](#campaigns-test) - Send test email
- [`campaigns cancel`](#campaigns-cancel) - Cancel a scheduled/sending campaign
- [`campaigns suspend`](#campaigns-suspend) - Suspend a sending campaign
- [`campaigns resume`](#campaigns-resume) - Resume a suspended campaign
- [`campaigns archive`](#campaigns-archive) - Archive a campaign
- [`campaigns unarchive`](#campaigns-unarchive) - Unarchive a campaign
- [`campaigns links`](#campaigns-links) - List tracked links in campaign
- [`campaigns render`](#campaigns-render) - Render campaign HTML preview
- [`campaigns revisions`](#campaigns-revisions) - List campaign revision history
- [`campaigns blueprints`](#campaigns-blueprints) - List campaign blueprints/templates

**Key Features:**
- Interactive campaign creation with auto-detection
- Profile-aware confirmations for destructive operations
- Complete lifecycle management (draft → scheduled → sending → sent)
- Template support for reusable designs
- Test emails before sending
- Link tracking and analytics
- Revision history tracking

**Campaign Statuses:**
- `draft` - Campaign created but not scheduled
- `scheduled` - Scheduled for future sending
- `sending` - Currently being sent
- `sent` - Successfully sent to all recipients
- `suspended` - Temporarily paused
- `canceled` - Canceled before completion
- `archived` - Archived for historical reference

---

## campaigns list

List all campaigns in your account.

### Usage

```bash
cakemail campaigns list [options]
```

### Options

- `-s, --status <status>` - Filter by status (draft, scheduled, sending, sent, etc.)
- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number for pagination
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`, `+scheduled_for`)
- `--filter <filter>` - Filter expression (e.g., `"status==sent;name==Newsletter"`)

### Examples

**List all campaigns:**
```bash
$ cakemail campaigns list
```

**Output (Table format - Balanced profile):**
```
┌────┬──────────────────────┬──────────┬─────────────────────┐
│ ID │ Name                 │ Status   │ Scheduled For       │
├────┼──────────────────────┼──────────┼─────────────────────┤
│ 789│ Weekly Newsletter    │ 🟢 sent  │ Oct 11, 2025 9:00am │
│ 788│ Product Update       │ 🟡 draft │ -                   │
│ 787│ Flash Sale           │ 🔵 scheduled│ Oct 15, 2025 2:00pm│
└────┴──────────────────────┴──────────┴─────────────────────┘

Showing 1-3 of 156 campaigns
```

**Filter by status:**
```bash
$ cakemail campaigns list --status sent
```

**Sort by scheduled date:**
```bash
$ cakemail campaigns list --sort +scheduled_for
```

**Filter with complex expression:**
```bash
$ cakemail campaigns list --filter "status==sent;name==Newsletter"
```

**JSON output (Developer profile):**
```bash
$ cakemail --profile developer campaigns list --limit 2
```

**Output:**
```json
{
  "data": [
    {
      "id": 789,
      "name": "Weekly Newsletter",
      "status": "sent",
      "list_id": 123,
      "sender_id": 456,
      "scheduled_for": "2025-10-11T09:00:00Z",
      "sent_at": "2025-10-11T09:00:15Z",
      "created_on": "2025-10-10T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 2,
    "total": 156
  }
}
```

### Notes

- Default sort is by creation date (newest first)
- Status badges show visual indicators in table/compact formats
- Use pagination for large result sets
- Combine `--filter` and `--sort` for precise queries

---

## campaigns get

Get detailed information about a specific campaign.

### Usage

```bash
cakemail campaigns get <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Get campaign details:**
```bash
$ cakemail campaigns get 789
```

**Output:**
```
Campaign: Weekly Newsletter (789)

Status: 🟢 sent
List: Newsletter Subscribers (123)
Sender: Marketing Team <marketing@company.com> (456)

Schedule:
  Scheduled: Oct 11, 2025 at 9:00 AM
  Sent: Oct 11, 2025 at 9:00 AM (15s after scheduled)

Statistics:
  Recipients: 1,234
  Delivered: 1,198 (97.1%)
  Opens: 456 (38.1%)
  Clicks: 89 (7.4%)
  Bounces: 36 (2.9%)

Created: Oct 10, 2025 at 2:30 PM
```

**JSON output:**
```bash
$ cakemail -f json campaigns get 789
```

**Output:**
```json
{
  "id": 789,
  "name": "Weekly Newsletter",
  "status": "sent",
  "subject": "Your Weekly Update",
  "list_id": 123,
  "sender_id": 456,
  "template_id": 12,
  "scheduled_for": "2025-10-11T09:00:00Z",
  "sent_at": "2025-10-11T09:00:15Z",
  "created_on": "2025-10-10T14:30:00Z",
  "statistics": {
    "recipients": 1234,
    "delivered": 1198,
    "opens": 456,
    "clicks": 89,
    "bounces": 36
  }
}
```

### Notes

- Returns full campaign details including statistics
- Statistics only available after campaign is sent
- Use for verifying campaign configuration before sending

---

## campaigns create

Create a new email campaign.

### Usage

```bash
cakemail campaigns create [options]
```

### Options

- `-n, --name <name>` - Campaign name (optional - prompts if not provided)
- `-l, --list-id <id>` - List ID (optional - auto-detects or prompts)
- `-s, --sender-id <id>` - Sender ID (optional - auto-detects or prompts)
- `-t, --template-id <id>` - Template ID (optional)
- `--subject <subject>` - Email subject line (optional)

### Examples

**Interactive creation (Marketer/Balanced profile):**
```bash
$ cakemail campaigns create
```

**Output:**
```
Campaign name: Weekly Newsletter

✓ Auto-detected list: 123 (Newsletter Subscribers)

Available Confirmed Senders:

? Select a sender:
  ❯ Marketing Team <marketing@company.com> (Confirmed)
    Support <support@company.com> (Confirmed)

✓ Campaign created: 790

Campaign: Weekly Newsletter
  ID: 790
  Status: draft
  List: Newsletter Subscribers (1,234 contacts)
  Sender: Marketing Team
```

**Non-interactive creation:**
```bash
$ cakemail campaigns create \
  --name "Product Launch" \
  --list-id 123 \
  --sender-id 456 \
  --subject "Introducing Our New Product"
```

**Output:**
```
✓ Campaign created: 791

Campaign: Product Launch
  ID: 791
  Status: draft
```

**With template:**
```bash
$ cakemail campaigns create \
  --name "Monthly Newsletter" \
  --list-id 123 \
  --sender-id 456 \
  --template-id 12
```

**Developer profile (JSON):**
```bash
$ cakemail --profile developer campaigns create \
  --name "Newsletter" \
  --list-id 123 \
  --sender-id 456
```

**Output:**
```json
{
  "id": 792,
  "name": "Newsletter",
  "status": "draft",
  "list_id": 123,
  "sender_id": 456,
  "created_on": "2025-10-11T15:30:00Z"
}
```

### Interactive Behavior

**Auto-Detection:**
- If you have only one list, it's auto-detected
- If you have only one confirmed sender, it's auto-detected
- Interactive prompts shown for multiple options (in TTY)

**Marketer Profile:**
- Always shows interactive prompts for name, list, sender
- Provides helpful selection menus with contact counts

**Developer Profile:**
- No prompts - requires all parameters
- Fast, scriptable creation

**Balanced Profile:**
- Auto-detects when possible
- Prompts in interactive terminal
- No prompts in scripts

### Notes

- Campaign created in `draft` status
- Must add content and schedule before sending
- List and sender are required
- Template is optional (can design in web UI)
- See [Smart Defaults](/en/cli/core-concepts/smart-defaults/) for auto-detection details

---

## campaigns update

Update properties of an existing campaign.

### Usage

```bash
cakemail campaigns update <id> [options]
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-n, --name <name>` - New campaign name
- `-l, --list-id <id>` - New list ID
- `-s, --sender-id <id>` - New sender ID
- `-t, --template-id <id>` - New template ID
- `--subject <subject>` - New email subject

### Examples

**Update campaign name:**
```bash
$ cakemail campaigns update 790 --name "Weekly Update - October"
```

**Output:**
```
✓ Campaign 790 updated

Campaign: Weekly Update - October
  Status: draft
  Last updated: just now
```

**Update multiple properties:**
```bash
$ cakemail campaigns update 790 \
  --name "Newsletter v2" \
  --subject "Your Weekly Digest" \
  --sender-id 789
```

**Change list:**
```bash
$ cakemail campaigns update 790 --list-id 456
```

### Notes

- Can only update draft campaigns
- Sent campaigns cannot be modified
- Changing list ID resets recipient targeting
- All options are optional (update only what you specify)

---

## campaigns delete

Delete a campaign permanently.

### Usage

```bash
cakemail campaigns delete <id> [options]
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete with confirmation (Balanced/Marketer profile):**
```bash
$ cakemail campaigns delete 790
```

**Output:**
```
⚠ Delete campaign 'Weekly Newsletter'?
  Campaign will be permanently deleted
  This action cannot be undone

Delete campaign? (y/N): y

✓ Campaign 790 deleted
```

**Force delete (skip confirmation):**
```bash
$ cakemail campaigns delete 790 --force
```

**Developer profile (no confirmation):**
```bash
$ cakemail --profile developer campaigns delete 790
```

**Output:**
```json
{"success":true,"campaign_id":790}
```

### Confirmation Behavior

**Marketer Profile:**
- Always confirms, even with `--force`
- Shows detailed warning
- Safety-first approach

**Balanced Profile:**
- Confirms in interactive terminal
- Skips in scripts/CI
- Respects `--force` flag

**Developer Profile:**
- Never confirms
- Immediate deletion
- Trusts you know what you're doing

### Important Notes

⚠️ **Warning: Deletion is permanent**

- Campaign is permanently removed
- Statistics and reports are lost
- Cannot be undone
- Consider archiving instead if you need historical data

---

## campaigns schedule

Schedule a campaign for sending at a specific date and time.

### Usage

```bash
cakemail campaigns schedule <id> --date <datetime>
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-d, --date <datetime>` - Schedule datetime in ISO 8601 format (required)

### Examples

**Schedule campaign:**
```bash
$ cakemail campaigns schedule 790 --date "2025-10-15T09:00:00Z"
```

**Output:**
```
✓ Campaign 790 scheduled for 2025-10-15T09:00:00Z

Campaign: Weekly Newsletter
  Status: scheduled
  Scheduled for: Oct 15, 2025 at 9:00 AM
  Recipients: 1,234 contacts
```

**Schedule with local timezone:**
```bash
$ cakemail campaigns schedule 790 --date "2025-10-15T09:00:00-05:00"
```

### Date Format

Use ISO 8601 format:
- `2025-10-15T09:00:00Z` - UTC time
- `2025-10-15T09:00:00-05:00` - With timezone offset
- `2025-10-15T09:00:00` - Local time (assumes server timezone)

### Notes

- Campaign must be in `draft` status
- Date must be in the future
- Campaign content must be complete
- Test before scheduling (see `campaigns test`)
- Changes status from `draft` to `scheduled`

---

## campaigns reschedule

Change the scheduled send time for a campaign.

### Usage

```bash
cakemail campaigns reschedule <id> --date <datetime>
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-d, --date <datetime>` - New schedule datetime in ISO 8601 format (required)

### Examples

**Reschedule campaign:**
```bash
$ cakemail campaigns reschedule 790 --date "2025-10-16T10:00:00Z"
```

**Output:**
```
✓ Campaign 790 rescheduled for 2025-10-16T10:00:00Z

Campaign: Weekly Newsletter
  Old time: Oct 15, 2025 at 9:00 AM
  New time: Oct 16, 2025 at 10:00 AM
```

### Notes

- Campaign must be in `scheduled` status
- Cannot reschedule campaigns that are already sending
- New date must be in the future
- Use `unschedule` then `schedule` to change significantly

---

## campaigns unschedule

Remove scheduling from a campaign (returns to draft status).

### Usage

```bash
cakemail campaigns unschedule <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Unschedule campaign:**
```bash
$ cakemail campaigns unschedule 790
```

**Output:**
```
✓ Campaign 790 unscheduled

Campaign: Weekly Newsletter
  Status: draft (was scheduled)
  Previous schedule: Oct 15, 2025 at 9:00 AM
```

### Notes

- Campaign must be in `scheduled` status
- Returns campaign to `draft` status
- Does not delete campaign
- Can be rescheduled later

---

## campaigns test

Send a test email to verify campaign appearance and content.

### Usage

```bash
cakemail campaigns test <id> --email <email>
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-e, --email <email>` - Recipient email address (required)

### Examples

**Send test email:**
```bash
$ cakemail campaigns test 790 --email test@company.com
```

**Output:**
```
✓ Test email sent to test@company.com

Campaign: Weekly Newsletter
  Status: draft
  Test sent: just now
```

**Send to multiple testers:**
```bash
$ cakemail campaigns test 790 --email qa@company.com
$ cakemail campaigns test 790 --email stakeholder@company.com
```

### Notes

- Campaign must have content (not empty)
- Test emails don't count toward statistics
- Personalization fields show placeholder values
- Links are tracked (so you can test tracking)
- Always test before scheduling!

### Best Practice

```bash
# Complete test workflow
cakemail campaigns create --name "Newsletter" --list-id 123 --sender-id 456
# [Design content in web UI]
cakemail campaigns test 790 --email test@company.com
# [Review test email]
cakemail campaigns schedule 790 --date "2025-10-15T09:00:00Z"
```

---

## campaigns cancel

Cancel a scheduled or sending campaign.

### Usage

```bash
cakemail campaigns cancel <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Cancel scheduled campaign:**
```bash
$ cakemail campaigns cancel 790
```

**Output:**
```
✓ Campaign 790 canceled

Campaign: Weekly Newsletter
  Status: canceled (was scheduled)
  Was scheduled for: Oct 15, 2025 at 9:00 AM
```

**Cancel sending campaign:**
```bash
$ cakemail campaigns cancel 791
```

**Output:**
```
✓ Campaign 791 canceled

Campaign: Product Launch
  Status: canceled (was sending)
  Sent to: 234 of 1,234 contacts (19%)
  Canceled: Oct 11, 2025 at 9:05 AM
```

### Notes

- Can cancel `scheduled` or `sending` campaigns
- Cannot cancel `sent` campaigns (already delivered)
- Canceling during sending stops immediately
- Recipients who already received email keep it
- Campaign status changes to `canceled`
- Consider `suspend` for temporary pause

---

## campaigns suspend

Temporarily pause a sending campaign.

### Usage

```bash
cakemail campaigns suspend <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Suspend campaign:**
```bash
$ cakemail campaigns suspend 790
```

**Output:**
```
✓ Campaign 790 suspended

Campaign: Weekly Newsletter
  Status: suspended (was sending)
  Sent: 345 of 1,234 contacts (28%)
  Suspended: Oct 11, 2025 at 9:10 AM
```

### Notes

- Can only suspend `sending` campaigns
- Sending stops immediately
- Use `resume` to continue sending
- Recipients already sent to keep email
- Useful for addressing issues mid-send

---

## campaigns resume

Resume a suspended campaign.

### Usage

```bash
cakemail campaigns resume <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Resume campaign:**
```bash
$ cakemail campaigns resume 790
```

**Output:**
```
✓ Campaign 790 resumed

Campaign: Weekly Newsletter
  Status: sending (was suspended)
  Progress: 345 of 1,234 contacts (28%)
  Resumed: Oct 11, 2025 at 9:20 AM
```

### Notes

- Can only resume `suspended` campaigns
- Sending continues from where it stopped
- No duplicate sends to recipients
- Statistics continue accumulating

---

## campaigns archive

Archive a campaign for historical reference.

### Usage

```bash
cakemail campaigns archive <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Archive campaign:**
```bash
$ cakemail campaigns archive 790
```

**Output:**
```
✓ Campaign 790 archived

Campaign: Weekly Newsletter
  Status: archived
  Original status: sent
  Archived: Oct 11, 2025
```

### Notes

- Can archive campaigns in any status
- Archived campaigns don't appear in default lists
- Statistics and reports remain available
- Use for cleanup while preserving history
- Can be unarchived later

---

## campaigns unarchive

Restore an archived campaign.

### Usage

```bash
cakemail campaigns unarchive <id>
```

### Arguments

- `<id>` - Campaign ID (required)

### Examples

**Unarchive campaign:**
```bash
$ cakemail campaigns unarchive 790
```

**Output:**
```
✓ Campaign 790 unarchived

Campaign: Weekly Newsletter
  Status: sent (restored from archive)
  Unarchived: Oct 11, 2025
```

---

## campaigns links

List all tracked links in a campaign.

### Usage

```bash
cakemail campaigns links <id> [options]
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number

### Examples

**List campaign links:**
```bash
$ cakemail campaigns links 790
```

**Output:**
```
Campaign: Weekly Newsletter (790)

┌────┬────────────────────────────────┬────────┬─────────────┐
│ ID │ URL                            │ Clicks │ Unique      │
├────┼────────────────────────────────┼────────┼─────────────┤
│ 1  │ https://example.com/product    │ 123    │ 98          │
│ 2  │ https://example.com/blog       │ 67     │ 54          │
│ 3  │ https://example.com/contact    │ 12     │ 11          │
└────┴────────────────────────────────┴────────┴─────────────┘

Total: 3 links, 202 total clicks, 163 unique clicks
```

### Notes

- Only available after campaign is sent
- Shows click statistics per link
- Unique clicks = distinct contacts who clicked
- Total clicks = all clicks (including repeats)

---

## campaigns render

Render campaign HTML preview with optional personalization.

### Usage

```bash
cakemail campaigns render <id> [options]
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-c, --contact-id <id>` - Contact ID for personalization (optional)

### Examples

**Render campaign HTML:**
```bash
$ cakemail campaigns render 790
```

**Output:**
```
✓ Campaign 790 rendered successfully

Subject: Your Weekly Newsletter

HTML Preview:
<html>
<head><title>Weekly Newsletter</title></head>
<body>
  <h1>Hello {{first_name}}!</h1>
  <p>Here's your weekly update...</p>
</body>
</html>
```

**Render with contact personalization:**
```bash
$ cakemail campaigns render 790 --contact-id 456
```

**Output:**
```
✓ Campaign rendered with contact data

Contact: john@example.com (456)
  first_name: John
  last_name: Doe

Subject: Your Weekly Newsletter

HTML:
<html>
<body>
  <h1>Hello John!</h1>
  ...
</body>
</html>
```

### Use Cases

- Preview campaign before sending
- Test personalization with real contact data
- Save HTML for external review
- Debug rendering issues

---

## campaigns revisions

List revision history for a campaign.

### Usage

```bash
cakemail campaigns revisions <id> [options]
```

### Arguments

- `<id>` - Campaign ID (required)

### Options

- `-p, --page <number>` - Page number
- `--per-page <number>` - Results per page
- `--with-count` - Include total count

### Examples

**List campaign revisions:**
```bash
$ cakemail campaigns revisions 790
```

**Output:**
```
Campaign: Weekly Newsletter (790)

┌────────┬──────────────────────┬───────────────┬─────────────────────┐
│ Rev ID │ Changed By           │ Changes       │ Timestamp           │
├────────┼──────────────────────┼───────────────┼─────────────────────┤
│ 5      │ user@company.com     │ Subject       │ Oct 11, 2025 3:15pm │
│ 4      │ user@company.com     │ Content       │ Oct 11, 2025 2:45pm │
│ 3      │ user@company.com     │ Template      │ Oct 11, 2025 2:30pm │
│ 2      │ user@company.com     │ Sender        │ Oct 11, 2025 2:00pm │
│ 1      │ user@company.com     │ Created       │ Oct 10, 2025 2:30pm │
└────────┴──────────────────────┴───────────────┴─────────────────────┘

Total: 5 revisions
```

### Notes

- Tracks all campaign modifications
- Shows who made changes and when
- Useful for audit trail
- Cannot restore old revisions (view only)

---

## campaigns blueprints

List campaign blueprints (templates) available.

### Usage

```bash
cakemail campaigns blueprints [options]
```

### Options

- `-p, --page <number>` - Page number
- `--per-page <number>` - Results per page
- `--with-count` - Include total count
- `--filter <filter>` - Filter (e.g., `"name==Template;is_owner"`)
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`)

### Examples

**List all blueprints:**
```bash
$ cakemail campaigns blueprints
```

**Output:**
```
┌────┬──────────────────────┬───────────┬─────────────────────┐
│ ID │ Name                 │ Type      │ Created             │
├────┼──────────────────────┼───────────┼─────────────────────┤
│ 12 │ Newsletter Template  │ Custom    │ Oct 1, 2025         │
│ 45 │ Product Launch       │ Custom    │ Sep 15, 2025        │
│ 78 │ Welcome Series       │ System    │ Aug 20, 2025        │
└────┴──────────────────────┴───────────┴─────────────────────┘
```

**Filter to your templates:**
```bash
$ cakemail campaigns blueprints --filter "is_owner" --sort "+name"
```

### Notes

- Blueprints are reusable campaign templates
- Can be used when creating campaigns (`--template-id`)
- System blueprints provided by Cakemail
- Custom blueprints created by you

---

## Common Workflows

### Workflow 1: Create and Send Campaign

```bash
# 1. Create campaign
cakemail campaigns create \
  --name "Weekly Newsletter" \
  --list-id 123 \
  --sender-id 456

# Campaign created with ID 790

# 2. [Design content in web UI or via API]

# 3. Send test email
cakemail campaigns test 790 --email test@company.com

# 4. Schedule for sending
cakemail campaigns schedule 790 --date "2025-10-15T09:00:00Z"

# 5. Verify scheduling
cakemail campaigns get 790
```

---

### Workflow 2: Emergency Campaign Handling

```bash
# Issue discovered during send
cakemail campaigns suspend 790

# Fix the issue (update content, etc.)
cakemail campaigns update 790 --subject "Corrected: Newsletter"

# Resume sending
cakemail campaigns resume 790
```

---

### Workflow 3: Campaign Performance Review

```bash
# Get campaign details
cakemail campaigns get 790

# View link clicks
cakemail campaigns links 790

# Export detailed logs for analysis
cakemail logs campaign 790 --filter "type==click"
```

---

## Best Practices

### 1. Always Test Before Scheduling

```bash
# Good workflow
cakemail campaigns create --name "Newsletter" --list-id 123 --sender-id 456
cakemail campaigns test 790 --email test@company.com
# [Review test email]
cakemail campaigns schedule 790 --date "2025-10-15T09:00:00Z"
```

### 2. Use Descriptive Names

```bash
# Good
cakemail campaigns create --name "October Newsletter - Product Updates"

# Avoid
cakemail campaigns create --name "Campaign 1"
```

### 3. Archive Old Campaigns

```bash
# Keep workspace clean
cakemail campaigns list --status sent | jq -r '.data[].id' | \
  xargs -I {} cakemail campaigns archive {}
```

### 4. Monitor Sending Progress

```bash
# For large campaigns
cakemail campaigns get 790
# Check statistics during send
```

---

## Troubleshooting

### Campaign Not Scheduling

**Problem:** `Error: Campaign cannot be scheduled`

**Solutions:**
1. Verify campaign has content
2. Check campaign is in `draft` status
3. Ensure date is in future
4. Verify list has contacts

---

### Test Email Not Received

**Problem:** Test email doesn't arrive

**Solutions:**
1. Check spam folder
2. Verify sender is confirmed
3. Wait a few minutes (sending can be delayed)
4. Check email address spelling

---

### Cannot Update Campaign

**Problem:** `Error: Campaign cannot be modified`

**Solutions:**
1. Check campaign status (only `draft` can be updated)
2. Use `unschedule` first if scheduled
3. Cannot modify sent campaigns

---

