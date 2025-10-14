# Campaign Lifecycle

Understand and manage campaigns through every stage from creation to completion.

## Lifecycle Overview

Campaigns move through distinct states:

```
draft → scheduled → sending → sent → archived
  ↓        ↓          ↓
delete   unschedule  suspend/cancel
```

## Campaign States

### Draft

**Description:** Newly created, not yet scheduled

**Available Actions:**
- Edit content, subject, list, sender
- Send test emails
- Schedule for delivery
- Delete

**Commands:**
```bash
# Update draft
$ cakemail campaigns update 790 --subject "New Subject"

# Send test
$ cakemail campaigns test 790 -e test@example.com

# Schedule
$ cakemail campaigns schedule 790

# Delete if not needed
$ cakemail campaigns delete 790 --force
```

### Scheduled

**Description:** Queued for future delivery

**Available Actions:**
- Reschedule to different time
- Unschedule (return to draft)
- Send test emails
- Cancel

**Commands:**
```bash
# Reschedule
$ cakemail campaigns reschedule 790 --when "2024-03-25 10:00:00"

# Unschedule (back to draft)
$ cakemail campaigns unschedule 790

# Cancel
$ cakemail campaigns cancel 790
```

### Sending

**Description:** Currently being sent to recipients

**Available Actions:**
- Suspend (pause sending)
- View progress
- Monitor statistics

**Commands:**
```bash
# Suspend sending
$ cakemail campaigns suspend 790

# Check progress
$ cakemail campaigns get 790 -f json | jq '{status, sent_count, total_recipients}'

# View real-time stats
$ cakemail reports campaign 790
```

### Sent

**Description:** Completed successfully

**Available Actions:**
- View analytics
- Archive
- Delete (removes from list)

**Commands:**
```bash
# View analytics
$ cakemail reports campaign 790

# View link clicks
$ cakemail reports campaign-links 790

# Archive
$ cakemail campaigns archive 790

# Delete
$ cakemail campaigns delete 790 --force
```

### Suspended

**Description:** Paused during sending

**Available Actions:**
- Resume sending
- Cancel (stops permanently)
- View partial statistics

**Commands:**
```bash
# Resume
$ cakemail campaigns resume 790

# Cancel permanently
$ cakemail campaigns cancel 790

# Check stats
$ cakemail reports campaign 790
```

### Cancelled

**Description:** Cancelled before/during send

**Available Actions:**
- View partial analytics
- Archive
- Delete

**Commands:**
```bash
# View what was sent
$ cakemail reports campaign 790

# Archive
$ cakemail campaigns archive 790
```

### Archived

**Description:** Hidden from default views

**Available Actions:**
- Unarchive (restore to view)
- View analytics
- Delete permanently

**Commands:**
```bash
# Unarchive
$ cakemail campaigns unarchive 790

# View
$ cakemail campaigns get 790

# Delete
$ cakemail campaigns delete 790 --force
```

## Managing Active Campaigns

### Suspending a Campaign

Pause campaign mid-send:

```bash
$ cakemail campaigns suspend 790
```

**Output:**
```
✓ Campaign 790 suspended
```

**When to suspend:**
- Content error discovered
- Wrong list selected
- Need to make urgent changes
- Technical issue with website/links

**What happens:**
- Sending stops immediately
- Emails already sent remain sent
- Remaining recipients not contacted
- Can resume or cancel later

### Resuming a Campaign

Continue suspended campaign:

```bash
$ cakemail campaigns resume 790
```

**Output:**
```
✓ Campaign 790 resumed
```

**Considerations:**
- Resumes from where it stopped
- Already-sent contacts not re-contacted
- Check time delay impact on results

### Cancelling a Campaign

Permanently stop campaign:

```bash
$ cakemail campaigns cancel 790
```

**Output:**
```
⚠ Cancel campaign 790?

The following will happen:
  • Campaign will be permanently cancelled
  • Remaining recipients will not receive email
  • Partial analytics available

Type 'yes' to confirm: yes

✓ Campaign 790 cancelled
```

**When to cancel:**
- Major error in content
- Wrong audience targeted
- Business reason (product recall, etc.)
- Regulatory/legal requirement

## Archiving Campaigns

### Archive Completed Campaigns

Remove from active view:

```bash
$ cakemail campaigns archive 790
```

**Output:**
```
✓ Campaign 790 archived
```

**Benefits:**
- Cleaner campaign list
- Organized historical data
- Still accessible for analytics
- Can be unarchived if needed

### Bulk Archive

Archive multiple campaigns:

```bash
#!/bin/bash
# archive-old-campaigns.sh

# Archive all campaigns from Q1 2024
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent;delivered_at>=2024-01-01;delivered_at<2024-04-01" \
  -f json | jq -r '.data[].id')

for ID in $CAMPAIGNS; do
  echo "Archiving campaign $ID..."
  cakemail campaigns archive $ID
done

echo "Archived $(echo "$CAMPAIGNS" | wc -l) campaigns"
```

### Archive by Age

```bash
#!/bin/bash
# archive-by-age.sh

# Archive campaigns older than 90 days
CUTOFF_DATE=$(date -d "90 days ago" +%Y-%m-%d)

CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent;delivered_at<$CUTOFF_DATE" \
  -f json | jq -r '.data[].id')

for ID in $CAMPAIGNS; do
  NAME=$(cakemail campaigns get $ID -f json | jq -r '.name')
  echo "Archiving: $NAME (ID: $ID)"
  cakemail campaigns archive $ID
done
```

### Unarchive Campaigns

Restore archived campaign to active view:

```bash
$ cakemail campaigns unarchive 790
```

**Output:**
```
✓ Campaign 790 unarchived
```

## Monitoring Campaigns

### Real-Time Status Check

```bash
#!/bin/bash
# monitor-campaign.sh

CAMPAIGN_ID=$1
INTERVAL=5  # seconds

while true; do
  clear
  echo "=== Campaign $CAMPAIGN_ID Status ==="
  echo ""

  STATUS=$(cakemail campaigns get $CAMPAIGN_ID -f json)

  echo "Status: $(echo "$STATUS" | jq -r '.status')"
  echo "Name: $(echo "$STATUS" | jq -r '.name')"
  echo ""

  # If sending, show progress
  if [ "$(echo "$STATUS" | jq -r '.status')" == "sending" ]; then
    SENT=$(echo "$STATUS" | jq -r '.sent_count // 0')
    TOTAL=$(echo "$STATUS" | jq -r '.total_recipients // 0')
    PERCENT=$(echo "scale=1; $SENT * 100 / $TOTAL" | bc)

    echo "Progress: $SENT / $TOTAL ($PERCENT%)"
    echo ""

    # Get stats
    STATS=$(cakemail reports campaign $CAMPAIGN_ID -f json)
    echo "Delivered: $(echo "$STATS" | jq -r '.delivered // 0')"
    echo "Opened: $(echo "$STATS" | jq -r '.unique_opens // 0')"
    echo "Clicked: $(echo "$STATS" | jq -r '.unique_clicks // 0')"
  fi

  echo ""
  echo "Press Ctrl+C to stop monitoring"
  sleep $INTERVAL
done
```

### Dashboard View

```bash
#!/bin/bash
# campaign-dashboard.sh

echo "=== Campaign Dashboard ==="
echo ""

# Scheduled
SCHEDULED=$(cakemail campaigns list --filter "status==scheduled" -f json | jq '.count')
echo "Scheduled: $SCHEDULED"

# Sending
SENDING=$(cakemail campaigns list --filter "status==sending" -f json | jq '.count')
echo "Sending: $SENDING"

# Sent today
TODAY=$(date +%Y-%m-%d)
SENT_TODAY=$(cakemail campaigns list \
  --filter "status==sent;delivered_at>=$TODAY" \
  -f json | jq '.count')
echo "Sent Today: $SENT_TODAY"

# Drafts
DRAFTS=$(cakemail campaigns list --filter "status==draft" -f json | jq '.count')
echo "Drafts: $DRAFTS"

echo ""

# Show active campaigns
echo "=== Active Campaigns ==="
cakemail campaigns list --filter "status==sending" -f compact
```

## Lifecycle Workflows

### Workflow 1: Emergency Stop

```bash
#!/bin/bash
# emergency-stop.sh

CAMPAIGN_ID=$1

if [ -z "$CAMPAIGN_ID" ]; then
  echo "Usage: $0 <campaign-id>"
  exit 1
fi

echo "⚠️  EMERGENCY STOP for Campaign $CAMPAIGN_ID"
echo ""

# Check current status
STATUS=$(cakemail campaigns get $CAMPAIGN_ID -f json | jq -r '.status')
echo "Current status: $STATUS"

case $STATUS in
  "scheduled")
    echo "Unscheduling..."
    cakemail campaigns unschedule $CAMPAIGN_ID
    ;;
  "sending")
    echo "Suspending..."
    cakemail campaigns suspend $CAMPAIGN_ID
    ;;
  *)
    echo "Campaign is $STATUS - no action needed"
    ;;
esac

echo ""
echo "✅ Emergency stop complete"
```

### Workflow 2: Scheduled Maintenance

```bash
#!/bin/bash
# scheduled-maintenance.sh

echo "=== Pre-Maintenance: Suspend Active Campaigns ==="

# Get all sending campaigns
SENDING=$(cakemail campaigns list --filter "status==sending" -f json)
SENDING_IDS=$(echo "$SENDING" | jq -r '.data[].id')

# Suspend each
for ID in $SENDING_IDS; do
  echo "Suspending campaign $ID..."
  cakemail campaigns suspend $ID
done

echo ""
echo "Suspended $(echo "$SENDING_IDS" | wc -l) campaigns"
echo "IDs: $SENDING_IDS"
echo ""
echo "Save these IDs to resume after maintenance!"
```

Resume after maintenance:

```bash
#!/bin/bash
# resume-after-maintenance.sh

# IDs from previous script
CAMPAIGN_IDS="790 791 792"

echo "=== Post-Maintenance: Resume Campaigns ==="

for ID in $CAMPAIGN_IDS; do
  echo "Resuming campaign $ID..."
  cakemail campaigns resume $ID
done

echo ""
echo "✅ All campaigns resumed"
```

### Workflow 3: Quarterly Archival

```bash
#!/bin/bash
# quarterly-archive.sh

YEAR=$1
QUARTER=$2

if [ -z "$YEAR" ] || [ -z "$QUARTER" ]; then
  echo "Usage: $0 <year> <quarter>"
  echo "Example: $0 2024 1"
  exit 1
fi

# Calculate date range
case $QUARTER in
  1) START="$YEAR-01-01"; END="$YEAR-03-31" ;;
  2) START="$YEAR-04-01"; END="$YEAR-06-30" ;;
  3) START="$YEAR-07-01"; END="$YEAR-09-30" ;;
  4) START="$YEAR-10-01"; END="$YEAR-12-31" ;;
  *) echo "Invalid quarter"; exit 1 ;;
esac

echo "Archiving Q$QUARTER $YEAR campaigns ($START to $END)..."

# Get campaigns
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent;delivered_at>=$START;delivered_at<=$END" \
  -f json | jq -r '.data[].id')

COUNT=0
for ID in $CAMPAIGNS; do
  cakemail campaigns archive $ID
  ((COUNT++))
done

echo ""
echo "✅ Archived $COUNT campaigns from Q$QUARTER $YEAR"
```

### Workflow 4: Campaign Health Check

```bash
#!/bin/bash
# health-check.sh

echo "=== Campaign Health Check ==="
echo ""

# Check for stuck campaigns
echo "Checking for stuck campaigns..."
SENDING=$(cakemail campaigns list --filter "status==sending" -f json)
SENDING_COUNT=$(echo "$SENDING" | jq '.count')

if [ "$SENDING_COUNT" -gt 0 ]; then
  echo "$SENDING" | jq -r '.data[] | "  ID: \(.id) - Started: \(.sending_started_at // "unknown")"'

  # Flag campaigns sending > 2 hours
  CUTOFF=$(date -d "2 hours ago" --iso-8601=seconds)
  STUCK=$(echo "$SENDING" | jq --arg cutoff "$CUTOFF" '
    .data[] | select(.sending_started_at < $cutoff)
  ')

  if [ -n "$STUCK" ]; then
    echo ""
    echo "⚠️  Warning: Campaigns sending > 2 hours:"
    echo "$STUCK" | jq -r '"  ID: \(.id) - \(.name)"'
  fi
else
  echo "  ✅ No campaigns currently sending"
fi

echo ""

# Check for scheduled campaigns in past
echo "Checking for past-due scheduled campaigns..."
NOW=$(date --iso-8601=seconds)
PAST_DUE=$(cakemail campaigns list --filter "status==scheduled" -f json | \
  jq --arg now "$NOW" '.data[] | select(.scheduled_for < $now)')

if [ -n "$PAST_DUE" ]; then
  echo "⚠️  Warning: Past-due scheduled campaigns:"
  echo "$PAST_DUE" | jq -r '"  ID: \(.id) - Scheduled: \(.scheduled_for)"'
else
  echo "  ✅ No past-due campaigns"
fi

echo ""

# Check for old drafts
echo "Checking for old drafts (> 30 days)..."
OLD_CUTOFF=$(date -d "30 days ago" +%Y-%m-%d)
OLD_DRAFTS=$(cakemail campaigns list \
  --filter "status==draft;created_on<$OLD_CUTOFF" \
  -f json | jq '.count')

echo "  Old drafts: $OLD_DRAFTS"

if [ "$OLD_DRAFTS" -gt 0 ]; then
  echo "  Consider cleaning up old drafts"
fi

echo ""
echo "✅ Health check complete"
```

## Best Practices

### 1. Monitor Active Campaigns

Set up automated monitoring:

```bash
# Add to crontab: every 5 minutes
*/5 * * * * /path/to/monitor-campaigns.sh >> /var/log/campaign-monitor.log 2>&1
```

### 2. Archive Regularly

Monthly archival routine:

```bash
# First day of each month
0 0 1 * * /path/to/monthly-archive.sh
```

### 3. Emergency Procedures

Document emergency contacts and procedures:

```bash
#!/bin/bash
# EMERGENCY.sh

echo "=== EMERGENCY CAMPAIGN PROCEDURES ==="
echo ""
echo "1. Suspend all sending: ./emergency-stop-all.sh"
echo "2. Contact: support@cakemail.com"
echo "3. Escalation: +1-XXX-XXX-XXXX"
echo ""
echo "Campaign ID to stop:"
read CAMPAIGN_ID

./emergency-stop.sh $CAMPAIGN_ID
```

### 4. Document State Changes

Log important actions:

```bash
# Log state changes
log_action() {
  echo "$(date --iso-8601=seconds) | $1 | $2" >> campaign-actions.log
}

# Usage
log_action "SUSPEND" "Campaign 790 suspended due to content error"
```

### 5. Review Before Archiving

Ensure analytics captured:

```bash
#!/bin/bash
# safe-archive.sh

CAMPAIGN_ID=$1

# Get final stats
STATS=$(cakemail reports campaign $CAMPAIGN_ID -f json)

# Save to file
echo "$STATS" > "campaign-$CAMPAIGN_ID-stats.json"

# Now archive
cakemail campaigns archive $CAMPAIGN_ID

echo "Stats saved and campaign archived"
```

## Troubleshooting

### Campaign Stuck in "Sending"

**Problem:** Campaign status "sending" for extended period

**Investigation:**
```bash
# Check how long it's been sending
$ cakemail campaigns get 790 -f json | jq '{status, sending_started_at, sent_count, total_recipients}'
```

**Solutions:**
- Large lists take time (normal for 10k+ contacts)
- Contact support if > 4 hours with no progress
- Check account status for issues

### Cannot Suspend Campaign

**Error:** "Campaign cannot be suspended"

**Possible reasons:**
- Campaign already completed
- Campaign not in "sending" status
- Too close to completion

**Check status:**
```bash
$ cakemail campaigns get 790 -f json | jq '.status'
```

### Suspended Campaign Won't Resume

**Problem:** Resume command fails

**Solutions:**
```bash
# Check if campaign cancelled
$ cakemail campaigns get 790 -f json | jq '.status'

# If cancelled, cannot resume (create new campaign)

# If suspended, try again
$ cakemail campaigns resume 790
```

