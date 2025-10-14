# Campaign Basics

Create, manage, and monitor email campaigns sent to contact lists.

## Overview

Campaigns are email messages sent to multiple recipients on a contact list. Unlike transactional emails (one-to-one), campaigns are typically used for:
- **Newsletters** - Regular updates to subscribers
- **Promotions** - Marketing and sales campaigns
- **Announcements** - Product launches, events
- **Educational content** - Tips, guides, courses

## Campaign Workflow

1. **Create** campaign with list, sender, and template
2. **Test** by sending to yourself
3. **Schedule** for future delivery
4. **Monitor** status and analytics
5. **Archive** when complete

## List Campaigns

```bash
cakemail campaigns list [options]
```

**Options:**
- `-l, --limit <number>` - Results per page
- `-p, --page <number>` - Page number
- `--sort <sort>` - Sort order (+name, -created_on)
- `--filter <filter>` - Filter criteria
- `-s, --status <status>` - Filter by status

**Examples:**
```bash
# All campaigns
cakemail campaigns list

# Recent campaigns
cakemail campaigns list --sort "-created_on" --limit 10

# Delivered campaigns
cakemail campaigns list --filter "status==delivered"

# Scheduled campaigns
cakemail campaigns list -s scheduled
```

**Campaign statuses:**
- `draft` - Not yet scheduled
- `scheduled` - Scheduled for future
- `sending` - Currently being sent
- `delivered` - Completed successfully
- `suspended` - Paused mid-send
- `cancelled` - Cancelled before/during send

## Get Campaign Details

```bash
cakemail campaigns get <campaign-id>
```

**Example:**
```bash
cakemail campaigns get 12345
```

**Output:**
```json
{
  "id": 12345,
  "name": "June Newsletter",
  "status": "delivered",
  "list_id": 789,
  "sender_id": "abc123",
  "template_id": 456,
  "subject": "June 2024 Newsletter",
  "scheduled_for": "2024-06-15T10:00:00Z",
  "delivered_at": "2024-06-15T10:05:00Z",
  "created_on": "2024-06-10T14:30:00Z"
}
```

## Create Campaign

```bash
cakemail campaigns create \
  -n "Campaign Name" \
  -l <list-id> \
  -s <sender-id> \
  [options]
```

**Required:**
- `-n, --name <name>` - Campaign name
- `-l, --list-id <id>` - List to send to
- `-s, --sender-id <id>` - Verified sender

**Optional:**
- `-t, --template-id <id>` - Template to use
- `--subject <subject>` - Email subject

**Examples:**
```bash
# Basic campaign
cakemail campaigns create \
  -n "June Newsletter" \
  -l 789 \
  -s abc123 \
  -t 456 \
  --subject "What's New in June"

# Simple campaign (auto-detects if only one list/sender)
cakemail campaigns create -n "Weekly Update"
```

**Auto-detection:** If you only have one list or one confirmed sender, the CLI will auto-detect and use it.

## Update Campaign

```bash
cakemail campaigns update <campaign-id> [options]
```

**Options:**
- `-n, --name <name>` - New name
- `-l, --list-id <id>` - Change list
- `-s, --sender-id <id>` - Change sender
- `-t, --template-id <id>` - Change template
- `--subject <subject>` - Change subject

**Examples:**
```bash
# Update name
cakemail campaigns update 12345 -n "July Newsletter"

# Change template
cakemail campaigns update 12345 -t 789

# Update multiple fields
cakemail campaigns update 12345 \
  -n "Summer Newsletter" \
  --subject "Summer Updates 2024"
```

**Note:** Can only update campaigns in `draft` status.

## Delete Campaign

```bash
cakemail campaigns delete <campaign-id> [--force]
```

**Examples:**
```bash
# Interactive confirmation
cakemail campaigns delete 12345

# Skip confirmation
cakemail campaigns delete 12345 --force
```

**Warning:** Cannot undo deletion. Archive instead if you want to keep records.

## Archive Campaign

Move completed campaigns to archive:

```bash
cakemail campaigns archive <campaign-id>
```

**Unarchive if needed:**
```bash
cakemail campaigns unarchive <campaign-id>
```

**Use cases:**
- Clean up campaign list
- Keep historical records
- Organize by year/quarter

## Campaign States

### Draft
Newly created, not yet scheduled.

**Actions available:**
- Update campaign details
- Send test emails
- Schedule for delivery
- Delete

### Scheduled
Set to send at specific time.

**Actions available:**
- Reschedule
- Unschedule (back to draft)
- Send test emails
- Cancel

### Sending
Currently being sent to recipients.

**Actions available:**
- Suspend (pause)
- Monitor progress

### Delivered
Completed successfully.

**Actions available:**
- View analytics
- Archive
- Delete

### Suspended
Paused mid-send.

**Actions available:**
- Resume
- Cancel

### Cancelled
Cancelled before/during send.

**Actions available:**
- View partial analytics
- Delete

## Practical Examples

### Example 1: Create and Schedule

```bash
#!/bin/bash
# create-newsletter.sh

# Create campaign
CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Monthly Newsletter" \
  -l 789 \
  -s abc123 \
  -t 456 \
  --subject "June 2024 Newsletter" \
  | jq -r '.id')

echo "Created campaign: $CAMPAIGN_ID"

# Send test
cakemail campaigns test $CAMPAIGN_ID -e test@example.com
echo "Test sent. Review and approve."

# Schedule (manually run after approving test)
# cakemail campaigns schedule $CAMPAIGN_ID -d "2024-06-15T10:00:00Z"
```

### Example 2: Campaign Status Check

```bash
#!/bin/bash
# check-campaigns.sh

echo "=== Campaign Status ==="
echo ""

echo "Scheduled:"
cakemail -f compact campaigns list -s scheduled

echo ""
echo "Sending:"
cakemail -f compact campaigns list -s sending

echo ""
echo "Recently Delivered:"
cakemail campaigns list \
  --filter "status==delivered" \
  --sort "-delivered_at" \
  --limit 5
```

### Example 3: Bulk Archive

```bash
#!/bin/bash
# archive-old-campaigns.sh

# Get delivered campaigns older than 90 days
CUTOFF=$(date -d "90 days ago" +%Y-%m-%d)

CAMPAIGNS=$(cakemail -f json campaigns list \
  --filter "status==delivered;delivered_at<$CUTOFF" \
  | jq -r '.data[].id')

for ID in $CAMPAIGNS; do
  echo "Archiving campaign $ID..."
  cakemail campaigns archive $ID
done

echo "Archival complete"
```

## Best Practices

### 1. Use Descriptive Names

```bash
# ✅ Good
-n "June Newsletter - Product Updates"

# ❌ Avoid
-n "Campaign 1"
```

### 2. Always Test First

```bash
# Create
ID=$(cakemail campaigns create ... | jq -r '.id')

# Test
cakemail campaigns test $ID -e your@email.com

# Review, then schedule
cakemail campaigns schedule $ID -d "2024-06-15T10:00:00Z"
```

### 3. Monitor Scheduled Campaigns

```bash
# Daily check
cakemail campaigns list -s scheduled
```

### 4. Archive Completed Campaigns

```bash
# Monthly archival
cakemail campaigns list --filter "status==delivered" \
  | jq -r '.data[].id' \
  | xargs -I {} cakemail campaigns archive {}
```

### 5. Keep Drafts Clean

```bash
# List old drafts
cakemail campaigns list \
  --filter "status==draft" \
  --sort "+created_on"

# Delete if not needed
```

## Troubleshooting

### Cannot Create Campaign

**Check requirements:**
```bash
# Verify list exists
cakemail lists get <list-id>

# Verify sender is confirmed
cakemail senders get <sender-id>

# Verify template exists
cakemail templates get <template-id>
```

### Campaign Stuck in "Sending"

**Normal:** Large lists take time

**Check progress:**
```bash
cakemail reports campaign <campaign-id>
```

**If truly stuck:**
- Contact support
- Check account status

### Cannot Update Campaign

**Verify status:**
```bash
cakemail campaigns get <campaign-id>
# Check status field
```

**Solution:** Can only update `draft` campaigns

