# Account Reports & Overview

View account-level analytics, usage metrics, and aggregate performance across all campaigns.

## Overview

Account reports provide:
- Overall account performance metrics
- Usage and quota tracking
- Historical trends across all campaigns
- List health and growth metrics
- Sender reputation indicators

## Quick Start

### View Account Report

```bash
$ cakemail reports account
```

**Output:**
```
=== Account Overview ===
Account ID: 456
Account Name: My Company
Plan: Professional

=== Usage ===
Contacts: 6,789 / 10,000 (67.9%)
Emails Sent This Month: 45,678 / 100,000 (45.7%)

=== Campaign Performance (Last 30 Days) ===
Campaigns Sent: 12
Total Recipients: 142,567
Average Open Rate: 24.3%
Average Click Rate: 3.8%

=== List Health ===
Total Lists: 5
Total Contacts: 6,789
Active Subscribers: 6,234 (91.8%)
Unsubscribed: 412 (6.1%)
Bounced: 143 (2.1%)
```

## Account Metrics

### Usage Metrics

```bash
# Check quota usage
$ cakemail reports account -f json | jq '{
  contact_limit: .contact_limit,
  contacts_used: .contacts_used,
  contact_usage_pct: (.contacts_used / .contact_limit * 100 | round),
  email_limit: .email_limit,
  emails_sent: .emails_sent_this_month,
  email_usage_pct: (.emails_sent_this_month / .email_limit * 100 | round)
}'
```

### Campaign Aggregate Metrics

```bash
# Get overall performance
$ cakemail reports account -f json | jq '{
  total_campaigns: .campaigns_sent_30d,
  avg_open_rate: .avg_open_rate_30d,
  avg_click_rate: .avg_click_rate_30d,
  avg_delivery_rate: .avg_delivery_rate_30d
}'
```

## List Health Dashboard

```bash
#!/bin/bash
# list-health-dashboard.sh

echo "=== List Health Dashboard ==="
echo ""

# Get all lists
LISTS=$(cakemail lists list -f json | jq -r '.data[].id')

TOTAL_CONTACTS=0
TOTAL_ACTIVE=0
TOTAL_UNSUB=0
TOTAL_BOUNCED=0

echo "List ID | Name            | Total | Active | Unsub | Bounce"
echo "--------|-----------------|-------|--------|-------|--------"

for LIST_ID in $LISTS; do
  LIST=$(cakemail lists get $LIST_ID -f json)

  NAME=$(echo "$LIST" | jq -r '.name' | cut -c1-15)
  TOTAL=$(echo "$LIST" | jq -r '.contacts_count')
  ACTIVE=$(echo "$LIST" | jq -r '.active_contacts')
  UNSUB=$(echo "$LIST" | jq -r '.unsubscribed')
  BOUNCE=$(echo "$LIST" | jq -r '.bounced')

  printf "%-7s | %-15s | %5d | %6d | %5d | %6d\n" \
    "$LIST_ID" "$NAME" $TOTAL $ACTIVE $UNSUB $BOUNCE

  TOTAL_CONTACTS=$((TOTAL_CONTACTS + TOTAL))
  TOTAL_ACTIVE=$((TOTAL_ACTIVE + ACTIVE))
  TOTAL_UNSUB=$((TOTAL_UNSUB + UNSUB))
  TOTAL_BOUNCED=$((TOTAL_BOUNCED + BOUNCE))
done

echo "--------|-----------------|-------|--------|-------|--------"
printf "%-7s | %-15s | %5d | %6d | %5d | %6d\n" \
  "TOTAL" "All Lists" $TOTAL_CONTACTS $TOTAL_ACTIVE $TOTAL_UNSUB $TOTAL_BOUNCED

echo ""

# Calculate health percentage
HEALTH=$((TOTAL_ACTIVE * 100 / TOTAL_CONTACTS))
echo "Overall List Health: $HEALTH%"

if [ $HEALTH -ge 90 ]; then
  echo "  ✅ Excellent"
elif [ $HEALTH -ge 80 ]; then
  echo "  ✓ Good"
elif [ $HEALTH -ge 70 ]; then
  echo "  ⚠️  Fair - Consider cleanup"
else
  echo "  ❌ Poor - Clean lists immediately"
fi
```

## Performance Trends

### 30-Day Campaign Summary

```bash
#!/bin/bash
# 30day-summary.sh

THIRTY_DAYS_AGO=$(date -d "30 days ago" +%Y-%m-%d)

echo "=== 30-Day Campaign Summary ==="
echo ""

# Get campaigns from last 30 days
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent;delivered_at>=$THIRTY_DAYS_AGO" \
  -f json | jq -r '.data[].id')

COUNT=0
TOTAL_RECIPIENTS=0
TOTAL_OPENS=0
TOTAL_CLICKS=0

for ID in $CAMPAIGNS; do
  REPORT=$(cakemail reports campaign $ID -f json 2>/dev/null)

  if [ -n "$REPORT" ]; then
    RECIPIENTS=$(echo "$REPORT" | jq -r '.total_recipients')
    OPENS=$(echo "$REPORT" | jq -r '.unique_opens')
    CLICKS=$(echo "$REPORT" | jq -r '.unique_clicks')

    COUNT=$((COUNT + 1))
    TOTAL_RECIPIENTS=$((TOTAL_RECIPIENTS + RECIPIENTS))
    TOTAL_OPENS=$((TOTAL_OPENS + OPENS))
    TOTAL_CLICKS=$((TOTAL_CLICKS + CLICKS))
  fi
done

if [ $COUNT -gt 0 ]; then
  AVG_OPEN=$((TOTAL_OPENS * 100 / TOTAL_RECIPIENTS))
  AVG_CLICK=$((TOTAL_CLICKS * 100 / TOTAL_RECIPIENTS))

  echo "Campaigns Sent: $COUNT"
  echo "Total Recipients: $TOTAL_RECIPIENTS"
  echo "Total Opens: $TOTAL_OPENS"
  echo "Total Clicks: $TOTAL_CLICKS"
  echo ""
  echo "Average Open Rate: $AVG_OPEN%"
  echo "Average Click Rate: $AVG_CLICK%"
else
  echo "No campaigns sent in last 30 days"
fi
```

### Growth Tracking

```bash
#!/bin/bash
# track-growth.sh

LOG_FILE="account-growth.log"

# Log current state
DATE=$(date +%Y-%m-%d)
ACCOUNT=$(cakemail reports account -f json)

CONTACTS=$(echo "$ACCOUNT" | jq -r '.contacts_used')
CAMPAIGNS=$(echo "$ACCOUNT" | jq -r '.campaigns_sent_30d')

echo "$DATE,$CONTACTS,$CAMPAIGNS" >> $LOG_FILE

# Show recent growth
echo "=== Recent Growth ==="
tail -7 $LOG_FILE | column -t -s','
```

## Best Practices

1. **Monitor Usage Regularly**
   - Check quota usage weekly
   - Plan upgrades before limits

2. **Track List Health**
   - Review monthly
   - Clean inactive subscribers

3. **Benchmark Performance**
   - Compare to industry standards
   - Track improvements over time

4. **Schedule Reports**
   - Weekly dashboards
   - Monthly executive summaries

