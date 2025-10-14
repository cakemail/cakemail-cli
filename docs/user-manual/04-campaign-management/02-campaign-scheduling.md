# Campaign Scheduling

Master campaign scheduling to send emails at optimal times and manage scheduled campaigns.

## Overview

Scheduling allows you to:
- Send campaigns immediately
- Schedule campaigns for future delivery
- Reschedule pending campaigns
- Unschedule campaigns to return to draft
- Control exact send time for optimal engagement

## Scheduling Basics

### Immediate Send

Send campaign right away:

```bash
$ cakemail campaigns schedule 790
```

**Output:**
```
✓ Campaign 790 scheduled for immediate delivery
```

Campaign status changes: `draft` → `scheduled` → `sending` → `sent`

### Schedule for Future

Specify exact date and time:

```bash
$ cakemail campaigns schedule 790 --when "2024-03-20 10:00:00"
```

**Output:**
```
✓ Campaign 790 scheduled for 2024-03-20 10:00:00 UTC
```

### Timezone Considerations

By default, times are in UTC. Use your local timezone:

```bash
# Schedule for 10 AM Eastern Time
$ cakemail campaigns schedule 790 --when "2024-03-20 10:00:00 -0400"

# Schedule for 10 AM Pacific Time
$ cakemail campaigns schedule 790 --when "2024-03-20 10:00:00 -0700"
```

## Checking Scheduled Campaigns

### List All Scheduled Campaigns

```bash
$ cakemail campaigns list --filter "status==scheduled"
```

**Output:**
```
┌────────┬────────────────────┬─────────────────────┬─────────────────────┐
│ ID     │ Name               │ Scheduled For       │ List                │
├────────┼────────────────────┼─────────────────────┼─────────────────────┤
│ 790    │ March Newsletter   │ 2024-03-20 10:00:00 │ Newsletter (123)    │
│ 791    │ Product Update     │ 2024-03-21 14:00:00 │ Customers (124)     │
└────────┴────────────────────┴─────────────────────┴─────────────────────┘
```

### View Scheduled Time

```bash
$ cakemail campaigns get 790 -f json | jq '{id, name, status, scheduled_for}'
```

**Output:**
```json
{
  "id": 790,
  "name": "March Newsletter",
  "status": "scheduled",
  "scheduled_for": "2024-03-20T10:00:00Z"
}
```

## Rescheduling Campaigns

### Change Scheduled Time

```bash
$ cakemail campaigns reschedule 790 --when "2024-03-21 10:00:00"
```

**Output:**
```
✓ Campaign 790 rescheduled for 2024-03-21 10:00:00 UTC
```

### Move to Earlier Time

```bash
# Originally scheduled for March 20
$ cakemail campaigns reschedule 790 --when "2024-03-19 10:00:00"
```

**Output:**
```
✓ Campaign 790 rescheduled for 2024-03-19 10:00:00 UTC
```

### Reschedule to Immediate

```bash
$ cakemail campaigns reschedule 790 --now
```

**Output:**
```
✓ Campaign 790 rescheduled for immediate delivery
```

## Unscheduling Campaigns

### Return to Draft Status

Cancel scheduled send and return campaign to draft:

```bash
$ cakemail campaigns unschedule 790
```

**Output:**
```
✓ Campaign 790 unscheduled (returned to draft)
```

Campaign status changes: `scheduled` → `draft`

**Use cases:**
- Need to make changes to content
- Wrong list or sender selected
- Scheduling mistake
- Market conditions changed

### Make Changes After Unscheduling

```bash
# Unschedule
$ cakemail campaigns unschedule 790

# Make changes
$ cakemail campaigns update 790 --subject "Updated Subject"

# Reschedule
$ cakemail campaigns schedule 790 --when "2024-03-21 10:00:00"
```

## Best Send Times

### Industry Standards

**B2B (Business):**
- Tuesday-Thursday: 10 AM - 11 AM
- Avoid: Monday mornings, Friday afternoons

**B2C (Consumer):**
- Tuesday-Thursday: 8 AM - 10 AM
- Saturday: 10 AM - 12 PM
- Avoid: Late night, early morning

**E-commerce:**
- Tuesday-Thursday: 8 PM - 10 PM
- Sunday: 6 PM - 9 PM
- Friday: 12 PM - 2 PM (payday effect)

### Testing Your Audience

Find your optimal send time:

```bash
#!/bin/bash
# Test different send times

# Week 1: Tuesday 10 AM
cakemail campaigns create -n "Test - Tue 10AM" -l 123 -s 101
cakemail campaigns schedule 792 --when "2024-03-19 10:00:00"

# Week 2: Thursday 2 PM
cakemail campaigns create -n "Test - Thu 2PM" -l 123 -s 101
cakemail campaigns schedule 793 --when "2024-03-21 14:00:00"

# Week 3: Saturday 10 AM
cakemail campaigns create -n "Test - Sat 10AM" -l 123 -s 101
cakemail campaigns schedule 794 --when "2024-03-23 10:00:00"

# Compare open rates
cakemail reports campaign 792 -f json | jq '.open_rate'
cakemail reports campaign 793 -f json | jq '.open_rate'
cakemail reports campaign 794 -f json | jq '.open_rate'
```

## Scheduling Workflows

### Workflow 1: Weekly Newsletter

```bash
#!/bin/bash
# schedule-weekly-newsletter.sh

# Create campaign
CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Weekly Newsletter $(date +%Y-%m-%d)" \
  -l 123 \
  -s 101 \
  --template 201 \
  --subject "This Week's Updates" \
  -f json | jq -r '.id')

echo "Created campaign: $CAMPAIGN_ID"

# Send test
cakemail campaigns test $CAMPAIGN_ID -e editor@company.com
echo "Test sent. Review and approve."

# Schedule for next Tuesday at 10 AM
NEXT_TUESDAY=$(date -d "next tuesday" +%Y-%m-%d)
cakemail campaigns schedule $CAMPAIGN_ID --when "$NEXT_TUESDAY 10:00:00"

echo "Scheduled for $NEXT_TUESDAY at 10:00 AM"
```

### Workflow 2: Content Calendar

```bash
#!/bin/bash
# schedule-content-calendar.sh

# March content calendar
declare -A CAMPAIGNS=(
  ["2024-03-05"]="Product Launch Announcement"
  ["2024-03-12"]="Customer Success Stories"
  ["2024-03-19"]="Spring Sale Preview"
  ["2024-03-26"]="Tips & Best Practices"
)

for date in "${!CAMPAIGNS[@]}"; do
  name="${CAMPAIGNS[$date]}"

  # Create campaign
  ID=$(cakemail campaigns create \
    -n "$name" \
    -l 123 \
    -s 101 \
    -f json | jq -r '.id')

  # Schedule for 10 AM on date
  cakemail campaigns schedule $ID --when "$date 10:00:00"

  echo "Scheduled: $name for $date"
done

# List all scheduled
cakemail campaigns list --filter "status==scheduled" --sort "+scheduled_for"
```

### Workflow 3: A/B Send Time Testing

```bash
#!/bin/bash
# ab-test-send-times.sh

# Same content, different times
TEMPLATE=201
LIST=123
SENDER=101
SUBJECT="March Newsletter"

# Version A: Tuesday 10 AM
ID_A=$(cakemail campaigns create \
  -n "A/B Test - Version A" \
  -l $LIST \
  -s $SENDER \
  --template $TEMPLATE \
  --subject "$SUBJECT" \
  -f json | jq -r '.id')

cakemail campaigns schedule $ID_A --when "2024-03-19 10:00:00"

# Version B: Thursday 2 PM
ID_B=$(cakemail campaigns create \
  -n "A/B Test - Version B" \
  -l $LIST \
  -s $SENDER \
  --template $TEMPLATE \
  --subject "$SUBJECT" \
  -f json | jq -r '.id')

cakemail campaigns schedule $ID_B --when "2024-03-21 14:00:00"

echo "A/B test scheduled:"
echo "Version A (Tue 10AM): $ID_A"
echo "Version B (Thu 2PM): $ID_B"

# Compare results after both send
echo ""
echo "Run after both campaigns send:"
echo "cakemail reports campaign $ID_A"
echo "cakemail reports campaign $ID_B"
```

### Workflow 4: Automated Daily Digest

```bash
#!/bin/bash
# schedule-daily-digest.sh
# Run this script daily via cron

TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -d "tomorrow" +%Y-%m-%d)

# Create digest
ID=$(cakemail campaigns create \
  -n "Daily Digest - $TOMORROW" \
  -l 123 \
  -s 101 \
  --subject "Your Daily Digest - $TOMORROW" \
  -f json | jq -r '.id')

# Add dynamic content (your script)
# ... generate digest content ...

# Schedule for tomorrow 7 AM
cakemail campaigns schedule $ID --when "$TOMORROW 07:00:00"

echo "Tomorrow's digest scheduled: $ID"
```

## Scheduling Calendar View

Create a scheduling calendar:

```bash
#!/bin/bash
# show-scheduling-calendar.sh

echo "=== Scheduling Calendar ==="
echo ""

# Get all scheduled campaigns
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==scheduled" \
  --sort "+scheduled_for" \
  -f json)

# Group by date
echo "$CAMPAIGNS" | jq -r '
  .data[] |
  "\(.scheduled_for | split("T")[0]) \(.scheduled_for | split("T")[1] | split(".")[0]) - \(.name) (ID: \(.id))"
' | while read line; do
  echo "  $line"
done

echo ""
echo "Total scheduled: $(echo "$CAMPAIGNS" | jq '.count')"
```

**Output:**
```
=== Scheduling Calendar ===

  2024-03-19 10:00:00 - March Newsletter (ID: 790)
  2024-03-20 14:00:00 - Product Update (ID: 791)
  2024-03-21 10:00:00 - Weekly Digest (ID: 792)
  2024-03-23 09:00:00 - Weekend Special (ID: 793)

Total scheduled: 4
```

## Pre-Flight Checklist

Before scheduling, verify:

```bash
#!/bin/bash
# pre-flight-check.sh

CAMPAIGN_ID=$1

if [ -z "$CAMPAIGN_ID" ]; then
  echo "Usage: $0 <campaign-id>"
  exit 1
fi

echo "=== Pre-Flight Check for Campaign $CAMPAIGN_ID ==="
echo ""

# Get campaign details
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)

# Check 1: Has content
HAS_HTML=$(echo "$CAMPAIGN" | jq -r '.html' | grep -v "null")
if [ -z "$HAS_HTML" ]; then
  echo "❌ Missing HTML content"
  exit 1
else
  echo "✅ HTML content present"
fi

# Check 2: Has subject
SUBJECT=$(echo "$CAMPAIGN" | jq -r '.subject')
if [ "$SUBJECT" == "null" ] || [ -z "$SUBJECT" ]; then
  echo "❌ Missing subject line"
  exit 1
else
  echo "✅ Subject: $SUBJECT"
fi

# Check 3: Valid sender
SENDER_ID=$(echo "$CAMPAIGN" | jq -r '.sender_id')
SENDER_CONFIRMED=$(cakemail senders get $SENDER_ID -f json | jq -r '.confirmed')
if [ "$SENDER_CONFIRMED" != "true" ]; then
  echo "❌ Sender not confirmed"
  exit 1
else
  echo "✅ Sender confirmed"
fi

# Check 4: List has contacts
LIST_ID=$(echo "$CAMPAIGN" | jq -r '.list_id')
CONTACT_COUNT=$(cakemail contacts list $LIST_ID -f json | jq '.count')
if [ "$CONTACT_COUNT" -eq 0 ]; then
  echo "⚠️  Warning: List has 0 contacts"
else
  echo "✅ List has $CONTACT_COUNT contacts"
fi

echo ""
echo "✅ All checks passed! Ready to schedule."
```

## Common Scheduling Patterns

### Pattern 1: Schedule Series

Schedule multiple campaigns in sequence:

```bash
#!/bin/bash
# schedule-series.sh

DATES=("2024-03-19" "2024-03-26" "2024-04-02" "2024-04-09")
TEMPLATE=201
LIST=123
SENDER=101

for i in "${!DATES[@]}"; do
  week=$((i + 1))
  date="${DATES[$i]}"

  ID=$(cakemail campaigns create \
    -n "Week $week Newsletter" \
    -l $LIST \
    -s $SENDER \
    --template $TEMPLATE \
    --subject "Week $week Updates" \
    -f json | jq -r '.id')

  cakemail campaigns schedule $ID --when "$date 10:00:00"
  echo "Week $week scheduled for $date"
done
```

### Pattern 2: Batch Scheduling

Schedule multiple campaigns at once:

```bash
#!/bin/bash
# batch-schedule.sh

# Array of campaign IDs ready to schedule
CAMPAIGNS=(790 791 792 793)

# Schedule all for next Monday 10 AM
NEXT_MONDAY=$(date -d "next monday" +%Y-%m-%d)

for ID in "${CAMPAIGNS[@]}"; do
  cakemail campaigns schedule $ID --when "$NEXT_MONDAY 10:00:00"
  echo "Campaign $ID scheduled for $NEXT_MONDAY"
done
```

### Pattern 3: Smart Rescheduling

Reschedule if within threshold:

```bash
#!/bin/bash
# smart-reschedule.sh

CAMPAIGN_ID=$1
NEW_TIME=$2

# Get current scheduled time
CURRENT=$(cakemail campaigns get $CAMPAIGN_ID -f json | jq -r '.scheduled_for')

# Calculate time until send
CURRENT_TS=$(date -d "$CURRENT" +%s)
NOW_TS=$(date +%s)
HOURS_UNTIL=$((($CURRENT_TS - $NOW_TS) / 3600))

# Only reschedule if more than 2 hours away
if [ $HOURS_UNTIL -gt 2 ]; then
  cakemail campaigns reschedule $CAMPAIGN_ID --when "$NEW_TIME"
  echo "Campaign rescheduled"
else
  echo "Too close to send time ($HOURS_UNTIL hours). Unschedule first if needed."
  exit 1
fi
```

## Troubleshooting

### Cannot Schedule Campaign

**Error:** "Campaign not in draft status"

**Solution:**
```bash
# Check current status
$ cakemail campaigns get 790 -f json | jq '.status'

# If "scheduled", unschedule first
$ cakemail campaigns unschedule 790

# Then schedule again
$ cakemail campaigns schedule 790 --when "2024-03-21 10:00:00"
```

### Invalid Date Format

**Error:** "Invalid date format"

**Solution:**
```bash
# ✅ Correct formats:
--when "2024-03-20 10:00:00"
--when "2024-03-20T10:00:00Z"
--when "2024-03-20 10:00:00 -0400"

# ❌ Incorrect formats:
--when "03/20/2024 10:00 AM"
--when "March 20, 2024 10:00"
--when "20-03-2024 10:00"
```

### Campaign Sent at Wrong Time

**Problem:** Campaign sent at unexpected time

**Possible causes:**
1. **Timezone confusion** - UTC vs local time
2. **Daylight saving** - Time shift during DST change
3. **Incorrect date** - Typo in date/time

**Prevention:**
```bash
# Always verify scheduled time
$ cakemail campaigns get 790 -f json | jq '.scheduled_for'

# Use timezone-aware scheduling
$ cakemail campaigns schedule 790 --when "2024-03-20 10:00:00 -0400"
```

### Cannot Reschedule

**Error:** "Campaign too close to send time"

**Solution:**
```bash
# Unschedule first
$ cakemail campaigns unschedule 790

# Make changes
$ cakemail campaigns update 790 --subject "Updated"

# Reschedule
$ cakemail campaigns schedule 790 --when "2024-03-25 10:00:00"
```

## Best Practices

1. **Test Before Scheduling**
   ```bash
   cakemail campaigns test 790 -e test@company.com
   # Review test, then schedule
   cakemail campaigns schedule 790 --when "..."
   ```

2. **Avoid Last-Minute Scheduling**
   - Schedule at least 2 hours in advance
   - Allows time for final reviews
   - Buffer for technical issues

3. **Use Consistent Times**
   - Train audience to expect emails
   - Example: Every Tuesday 10 AM
   - Improves open rates

4. **Document Your Calendar**
   ```bash
   # Keep scheduling log
   echo "$(date): Scheduled campaign 790 for 2024-03-20" >> campaign-log.txt
   ```

5. **Monitor Scheduled Campaigns**
   ```bash
   # Daily check
   cakemail campaigns list --filter "status==scheduled"
   ```

6. **Set Reminders**
   - Remind to review 24h before send
   - Final check 2h before send
   - Post-send analytics review

