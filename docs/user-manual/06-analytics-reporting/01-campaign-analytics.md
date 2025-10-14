# Campaign Analytics

Analyze campaign performance with comprehensive metrics and insights to optimize your email marketing.

## Overview

Campaign analytics allow you to:
- Track email delivery and engagement
- Measure open and click-through rates
- Identify top-performing content and links
- Compare campaign performance over time
- Export data for deeper analysis
- Make data-driven decisions

Understanding your campaign metrics is essential for improving email marketing effectiveness.

## Quick Start

### View Campaign Report

```bash
$ cakemail reports campaign 790
```

**Output:**
```
Campaign: March Newsletter (ID: 790)
Status: sent
Sent: 2024-03-15 10:00:00

=== Delivery Metrics ===
Total Recipients:   1,247
Delivered:          1,189 (95.3%)
Bounced:            58 (4.7%)
  Hard Bounces:     45
  Soft Bounces:     13

=== Engagement Metrics ===
Opens:              723 (60.8%)
Unique Opens:       567 (47.7%)
Clicks:             234 (19.7%)
Unique Clicks:      189 (15.9%)
Unsubscribes:       12 (1.0%)

=== Performance ===
Open Rate:          47.7%
Click Rate:         15.9%
Click-to-Open:      33.3%
Bounce Rate:        4.7%
Unsubscribe Rate:   1.0%
```

## Core Metrics

### Delivery Metrics

**Total Recipients:**
- Number of contacts campaign was sent to
- Includes all contacts in target list/segment

**Delivered:**
- Successfully delivered emails
- Excludes hard and soft bounces
- Formula: Total Recipients - Bounces

**Bounced:**
- Emails that couldn't be delivered
- **Hard Bounce**: Permanent failure (invalid email)
- **Soft Bounce**: Temporary failure (inbox full, server down)

```bash
# View detailed bounce information
$ cakemail reports campaign 790 -f json | jq '{
  total: .total_recipients,
  delivered: .delivered,
  bounced: .bounced,
  hard_bounces: .hard_bounces,
  soft_bounces: .soft_bounces,
  delivery_rate: (.delivered / .total_recipients * 100 | round)
}'
```

**Output:**
```json
{
  "total": 1247,
  "delivered": 1189,
  "bounced": 58,
  "hard_bounces": 45,
  "soft_bounces": 13,
  "delivery_rate": 95
}
```

### Engagement Metrics

**Opens:**
- Total times campaign was opened
- Includes multiple opens by same contact
- Tracked via invisible pixel

**Unique Opens:**
- Number of unique contacts who opened
- Each contact counted only once
- More accurate engagement indicator

**Open Rate:**
- Percentage of delivered emails that were opened
- Formula: (Unique Opens / Delivered) × 100
- Industry average: 15-25%

```bash
# Calculate open rate
$ cakemail reports campaign 790 -f json | jq '{
  delivered: .delivered,
  unique_opens: .unique_opens,
  open_rate: (.unique_opens / .delivered * 100 | round)
}'
```

**Clicks:**
- Total link clicks in campaign
- Includes multiple clicks by same contact

**Unique Clicks:**
- Number of unique contacts who clicked
- Each contact counted only once

**Click Rate (CTR):**
- Percentage of delivered emails with clicks
- Formula: (Unique Clicks / Delivered) × 100
- Industry average: 2-5%

**Click-to-Open Rate (CTOR):**
- Percentage of openers who clicked
- Formula: (Unique Clicks / Unique Opens) × 100
- Measures content effectiveness
- Industry average: 10-20%

```bash
# View click metrics
$ cakemail reports campaign 790 -f json | jq '{
  unique_opens: .unique_opens,
  unique_clicks: .unique_clicks,
  click_rate: (.unique_clicks / .delivered * 100 | round),
  ctor: (.unique_clicks / .unique_opens * 100 | round)
}'
```

### Action Metrics

**Unsubscribes:**
- Contacts who unsubscribed after this campaign
- Important metric for content relevance

**Unsubscribe Rate:**
- Percentage of delivered emails that unsubscribed
- Formula: (Unsubscribes / Delivered) × 100
- Healthy rate: < 0.5%
- Concerning rate: > 1%

**Spam Complaints:**
- Contacts who marked email as spam
- Critical metric for sender reputation
- Target: < 0.1%

```bash
# View action metrics
$ cakemail reports campaign 790 -f json | jq '{
  unsubscribes: .unsubscribes,
  unsubscribe_rate: (.unsubscribes / .delivered * 100 | round),
  spam_complaints: .spam_complaints,
  spam_rate: (.spam_complaints / .delivered * 100 | round)
}'
```

## Viewing Campaign Analytics

### Basic Campaign Report

```bash
$ cakemail reports campaign 790
```

### JSON Format for Processing

```bash
$ cakemail reports campaign 790 -f json > campaign-790.json
```

### Extract Specific Metrics

```bash
# Open rate only
$ cakemail reports campaign 790 -f json | jq '.open_rate'

# Top metrics summary
$ cakemail reports campaign 790 -f json | jq '{
  name: .campaign_name,
  delivered: .delivered,
  open_rate: .open_rate,
  click_rate: .click_rate,
  unsubscribe_rate: .unsubscribe_rate
}'
```

### Multiple Campaign Reports

```bash
#!/bin/bash
# report-multiple-campaigns.sh

CAMPAIGNS=(790 791 792)

echo "Campaign | Delivered | Open Rate | Click Rate"
echo "---------|-----------|-----------|------------"

for ID in "${CAMPAIGNS[@]}"; do
  REPORT=$(cakemail reports campaign $ID -f json)

  NAME=$(echo "$REPORT" | jq -r '.campaign_name' | cut -c1-15)
  DELIVERED=$(echo "$REPORT" | jq -r '.delivered')
  OPEN=$(echo "$REPORT" | jq -r '.open_rate')
  CLICK=$(echo "$REPORT" | jq -r '.click_rate')

  printf "%-15s | %9d | %8.1f%% | %9.1f%%\n" "$NAME" $DELIVERED $OPEN $CLICK
done
```

## Link Analytics

### View Campaign Links

```bash
$ cakemail reports campaign-links 790
```

**Output:**
```
┌────────────────────────────────────────┬────────┬─────────┬─────────┐
│ URL                                    │ Clicks │ Unique  │ CTR     │
├────────────────────────────────────────┼────────┼─────────┼─────────┤
│ https://example.com/product           │ 450    │ 320     │ 26.9%   │
│ https://example.com/blog/article      │ 230    │ 180     │ 15.1%   │
│ https://example.com/special-offer     │ 180    │ 150     │ 12.6%   │
└────────────────────────────────────────┴────────┴─────────┴─────────┘

Total clicks: 860 (650 unique)
Overall CTR: 54.7%
```

### Top Performing Links

```bash
#!/bin/bash
# top-links.sh

CAMPAIGN_ID=$1

cakemail reports campaign-links $CAMPAIGN_ID -f json | \
  jq -r '.links | sort_by(-.unique_clicks) | .[0:5][] |
    "\(.unique_clicks)\t\(.url)"' | \
  column -t -s $'\t'
```

### Export Link Data

```bash
$ cakemail reports campaign-links 790 -f json > links-790.json
```

## Time-Based Analytics

### Opens Over Time

```bash
#!/bin/bash
# opens-over-time.sh

CAMPAIGN_ID=$1

echo "=== Opens Timeline ==="
echo ""

# Get campaign details
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)
SENT_DATE=$(echo "$CAMPAIGN" | jq -r '.delivered_at')

echo "Campaign sent: $SENT_DATE"
echo ""

# Get current stats
STATS=$(cakemail reports campaign $CAMPAIGN_ID -f json)

echo "Current stats:"
echo "  Unique Opens: $(echo "$STATS" | jq -r '.unique_opens')"
echo "  Open Rate: $(echo "$STATS" | jq -r '.open_rate')%"
echo ""

echo "Typical open timeline:"
echo "  First 24 hours: 50-70% of total opens"
echo "  First 48 hours: 70-85% of total opens"
echo "  First 7 days: 90-95% of total opens"
```

### Daily Performance Tracking

```bash
#!/bin/bash
# track-daily-performance.sh

CAMPAIGN_ID=$1
LOG_FILE="campaign-${CAMPAIGN_ID}-tracking.log"

# Log current metrics
DATE=$(date +%Y-%m-%d-%H:%M:%S)
STATS=$(cakemail reports campaign $CAMPAIGN_ID -f json)

OPENS=$(echo "$STATS" | jq -r '.unique_opens')
CLICKS=$(echo "$STATS" | jq -r '.unique_clicks')
OPEN_RATE=$(echo "$STATS" | jq -r '.open_rate')
CLICK_RATE=$(echo "$STATS" | jq -r '.click_rate')

echo "$DATE,$OPENS,$CLICKS,$OPEN_RATE,$CLICK_RATE" >> $LOG_FILE

echo "Logged: $OPENS opens, $CLICKS clicks"
```

**Schedule with cron:**
```bash
# Track every 6 hours for first week
0 */6 * * * /path/to/track-daily-performance.sh 790
```

## Comparative Analysis

### Compare Two Campaigns

```bash
#!/bin/bash
# compare-campaigns.sh

CAMPAIGN_A=$1
CAMPAIGN_B=$2

echo "=== Campaign Comparison ==="
echo ""

# Get reports
REPORT_A=$(cakemail reports campaign $CAMPAIGN_A -f json)
REPORT_B=$(cakemail reports campaign $CAMPAIGN_B -f json)

# Campaign names
NAME_A=$(echo "$REPORT_A" | jq -r '.campaign_name')
NAME_B=$(echo "$REPORT_B" | jq -r '.campaign_name')

echo "Campaign A: $NAME_A (ID: $CAMPAIGN_A)"
echo "Campaign B: $NAME_B (ID: $CAMPAIGN_B)"
echo ""

# Compare metrics
echo "Metric              | Campaign A | Campaign B | Difference"
echo "--------------------|------------|------------|------------"

# Open Rate
OPEN_A=$(echo "$REPORT_A" | jq -r '.open_rate')
OPEN_B=$(echo "$REPORT_B" | jq -r '.open_rate')
OPEN_DIFF=$(echo "$OPEN_B - $OPEN_A" | bc)
printf "Open Rate           | %9.1f%% | %9.1f%% | %+9.1f%%\n" $OPEN_A $OPEN_B $OPEN_DIFF

# Click Rate
CLICK_A=$(echo "$REPORT_A" | jq -r '.click_rate')
CLICK_B=$(echo "$REPORT_B" | jq -r '.click_rate')
CLICK_DIFF=$(echo "$CLICK_B - $CLICK_A" | bc)
printf "Click Rate          | %9.1f%% | %9.1f%% | %+9.1f%%\n" $CLICK_A $CLICK_B $CLICK_DIFF

# Unsubscribe Rate
UNSUB_A=$(echo "$REPORT_A" | jq -r '.unsubscribe_rate')
UNSUB_B=$(echo "$REPORT_B" | jq -r '.unsubscribe_rate')
UNSUB_DIFF=$(echo "$UNSUB_B - $UNSUB_A" | bc)
printf "Unsubscribe Rate    | %9.1f%% | %9.1f%% | %+9.1f%%\n" $UNSUB_A $UNSUB_B $UNSUB_DIFF

echo ""

# Winner
if (( $(echo "$OPEN_B > $OPEN_A" | bc -l) )); then
  echo "🏆 Campaign B performed better"
else
  echo "🏆 Campaign A performed better"
fi
```

### Historical Performance

```bash
#!/bin/bash
# historical-performance.sh

LIST_ID=123

echo "=== Historical Campaign Performance ==="
echo ""

# Get all sent campaigns
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent" \
  --sort "-delivered_at" \
  --limit 10 \
  -f json | jq -r '.data[].id')

echo "Campaign | Date       | Recipients | Open Rate | Click Rate"
echo "---------|------------|------------|-----------|------------"

for ID in $CAMPAIGNS; do
  CAMPAIGN=$(cakemail campaigns get $ID -f json)
  REPORT=$(cakemail reports campaign $ID -f json)

  NAME=$(echo "$CAMPAIGN" | jq -r '.name' | cut -c1-15)
  DATE=$(echo "$CAMPAIGN" | jq -r '.delivered_at' | cut -d'T' -f1)
  RECIPIENTS=$(echo "$REPORT" | jq -r '.total_recipients')
  OPEN=$(echo "$REPORT" | jq -r '.open_rate')
  CLICK=$(echo "$REPORT" | jq -r '.click_rate')

  printf "%-15s | %10s | %10d | %8.1f%% | %9.1f%%\n" \
    "$NAME" "$DATE" $RECIPIENTS $OPEN $CLICK
done

echo ""

# Calculate averages
echo "Calculating averages across all campaigns..."
```

### Month-over-Month Trends

```bash
#!/bin/bash
# monthly-trends.sh

YEAR=2024

echo "=== Monthly Campaign Trends - $YEAR ==="
echo ""
echo "Month | Campaigns | Avg Open Rate | Avg Click Rate"
echo "------|-----------|---------------|----------------"

for MONTH in {01..12}; do
  START_DATE="$YEAR-$MONTH-01"

  # Calculate end date
  if [ $MONTH -eq 12 ]; then
    END_DATE="$((YEAR + 1))-01-01"
  else
    END_DATE="$YEAR-$(printf "%02d" $((10#$MONTH + 1)))-01"
  fi

  # Get campaigns for month
  CAMPAIGNS=$(cakemail campaigns list \
    --filter "status==sent;delivered_at>=$START_DATE;delivered_at<$END_DATE" \
    -f json | jq -r '.data[].id')

  if [ -z "$CAMPAIGNS" ]; then
    continue
  fi

  COUNT=$(echo "$CAMPAIGNS" | wc -l)
  TOTAL_OPEN=0
  TOTAL_CLICK=0

  for ID in $CAMPAIGNS; do
    REPORT=$(cakemail reports campaign $ID -f json 2>/dev/null)
    if [ -n "$REPORT" ]; then
      OPEN=$(echo "$REPORT" | jq -r '.open_rate')
      CLICK=$(echo "$REPORT" | jq -r '.click_rate')
      TOTAL_OPEN=$(echo "$TOTAL_OPEN + $OPEN" | bc)
      TOTAL_CLICK=$(echo "$TOTAL_CLICK + $CLICK" | bc)
    fi
  done

  if [ $COUNT -gt 0 ]; then
    AVG_OPEN=$(echo "scale=1; $TOTAL_OPEN / $COUNT" | bc)
    AVG_CLICK=$(echo "scale=1; $TOTAL_CLICK / $COUNT" | bc)
    printf "%5s | %9d | %12.1f%% | %13.1f%%\n" \
      "$MONTH" $COUNT $AVG_OPEN $AVG_CLICK
  fi
done
```

## Segmentation Analysis

### Performance by Segment

```bash
#!/bin/bash
# segment-performance.sh

LIST_ID=123

echo "=== Campaign Performance by Segment ==="
echo ""

# Get all segments
SEGMENTS=$(cakemail segments list $LIST_ID -f json | jq -r '.data[] | "\(.id):\(.name)"')

echo "Segment          | Campaigns | Avg Open | Avg Click"
echo "-----------------|-----------|----------|----------"

for SEG in $SEGMENTS; do
  SEG_ID=$(echo "$SEG" | cut -d: -f1)
  SEG_NAME=$(echo "$SEG" | cut -d: -f2- | cut -c1-15)

  # Find campaigns sent to this segment
  CAMPAIGNS=$(cakemail campaigns list \
    --filter "status==sent;segment_id==$SEG_ID" \
    -f json | jq -r '.data[].id')

  if [ -z "$CAMPAIGNS" ]; then
    continue
  fi

  COUNT=$(echo "$CAMPAIGNS" | wc -l)
  TOTAL_OPEN=0
  TOTAL_CLICK=0

  for ID in $CAMPAIGNS; do
    REPORT=$(cakemail reports campaign $ID -f json 2>/dev/null)
    if [ -n "$REPORT" ]; then
      OPEN=$(echo "$REPORT" | jq -r '.open_rate')
      CLICK=$(echo "$REPORT" | jq -r '.click_rate')
      TOTAL_OPEN=$(echo "$TOTAL_OPEN + $OPEN" | bc)
      TOTAL_CLICK=$(echo "$TOTAL_CLICK + $CLICK" | bc)
    fi
  done

  AVG_OPEN=$(echo "scale=1; $TOTAL_OPEN / $COUNT" | bc)
  AVG_CLICK=$(echo "scale=1; $TOTAL_CLICK / $COUNT" | bc)

  printf "%-15s | %9d | %7.1f%% | %8.1f%%\n" \
    "$SEG_NAME" $COUNT $AVG_OPEN $AVG_CLICK
done
```

### Best Performing Segment

```bash
#!/bin/bash
# best-segment.sh

# Find segment with highest average open rate
# (Implementation from segment-performance.sh with sorting)

# Output best segment recommendation
echo "🏆 Best Performing Segment: Premium Users"
echo "   Average Open Rate: 62.3%"
echo "   Average Click Rate: 28.7%"
echo ""
echo "💡 Recommendation: Prioritize campaigns to this segment"
```

## Key Performance Indicators (KPIs)

### Email Deliverability KPIs

```bash
#!/bin/bash
# deliverability-kpis.sh

CAMPAIGN_ID=$1

REPORT=$(cakemail reports campaign $CAMPAIGN_ID -f json)

echo "=== Deliverability KPIs ==="
echo ""

# Delivery Rate
TOTAL=$(echo "$REPORT" | jq -r '.total_recipients')
DELIVERED=$(echo "$REPORT" | jq -r '.delivered')
DELIVERY_RATE=$(echo "scale=1; $DELIVERED * 100 / $TOTAL" | bc)

echo "Delivery Rate: $DELIVERY_RATE%"
if (( $(echo "$DELIVERY_RATE >= 95" | bc -l) )); then
  echo "  ✅ Excellent (target: ≥95%)"
elif (( $(echo "$DELIVERY_RATE >= 90" | bc -l) )); then
  echo "  ⚠️  Good (target: ≥95%)"
else
  echo "  ❌ Poor - Clean your list"
fi
echo ""

# Bounce Rate
BOUNCED=$(echo "$REPORT" | jq -r '.bounced')
BOUNCE_RATE=$(echo "scale=1; $BOUNCED * 100 / $TOTAL" | bc)

echo "Bounce Rate: $BOUNCE_RATE%"
if (( $(echo "$BOUNCE_RATE <= 2" | bc -l) )); then
  echo "  ✅ Excellent (target: ≤2%)"
elif (( $(echo "$BOUNCE_RATE <= 5" | bc -l) )); then
  echo "  ⚠️  Acceptable (target: ≤2%)"
else
  echo "  ❌ High - Review list quality"
fi
```

### Engagement KPIs

```bash
#!/bin/bash
# engagement-kpis.sh

CAMPAIGN_ID=$1

REPORT=$(cakemail reports campaign $CAMPAIGN_ID -f json)

echo "=== Engagement KPIs ==="
echo ""

# Open Rate
OPEN_RATE=$(echo "$REPORT" | jq -r '.open_rate')
echo "Open Rate: $OPEN_RATE%"
if (( $(echo "$OPEN_RATE >= 20" | bc -l) )); then
  echo "  ✅ Excellent (industry avg: 15-25%)"
elif (( $(echo "$OPEN_RATE >= 15" | bc -l) )); then
  echo "  ✓ Good"
else
  echo "  ⚠️  Below average - Improve subject lines"
fi
echo ""

# Click Rate
CLICK_RATE=$(echo "$REPORT" | jq -r '.click_rate')
echo "Click Rate: $CLICK_RATE%"
if (( $(echo "$CLICK_RATE >= 3" | bc -l) )); then
  echo "  ✅ Excellent (industry avg: 2-5%)"
elif (( $(echo "$CLICK_RATE >= 2" | bc -l) )); then
  echo "  ✓ Good"
else
  echo "  ⚠️  Below average - Improve CTAs"
fi
echo ""

# CTOR
UNIQUE_OPENS=$(echo "$REPORT" | jq -r '.unique_opens')
UNIQUE_CLICKS=$(echo "$REPORT" | jq -r '.unique_clicks')
CTOR=$(echo "scale=1; $UNIQUE_CLICKS * 100 / $UNIQUE_OPENS" | bc)

echo "Click-to-Open Rate: $CTOR%"
if (( $(echo "$CTOR >= 15" | bc -l) )); then
  echo "  ✅ Excellent (industry avg: 10-20%)"
elif (( $(echo "$CTOR >= 10" | bc -l) )); then
  echo "  ✓ Good"
else
  echo "  ⚠️  Below average - Improve content relevance"
fi
```

### List Health KPIs

```bash
#!/bin/bash
# list-health-kpis.sh

CAMPAIGN_ID=$1

REPORT=$(cakemail reports campaign $CAMPAIGN_ID -f json)

echo "=== List Health KPIs ==="
echo ""

# Unsubscribe Rate
DELIVERED=$(echo "$REPORT" | jq -r '.delivered')
UNSUBSCRIBES=$(echo "$REPORT" | jq -r '.unsubscribes')
UNSUB_RATE=$(echo "scale=2; $UNSUBSCRIBES * 100 / $DELIVERED" | bc)

echo "Unsubscribe Rate: $UNSUB_RATE%"
if (( $(echo "$UNSUB_RATE <= 0.2" | bc -l) )); then
  echo "  ✅ Excellent (target: ≤0.5%)"
elif (( $(echo "$UNSUB_RATE <= 0.5" | bc -l) )); then
  echo "  ✓ Good"
elif (( $(echo "$UNSUB_RATE <= 1.0" | bc -l) )); then
  echo "  ⚠️  Elevated - Review content relevance"
else
  echo "  ❌ High - Major content/targeting issues"
fi
echo ""

# Spam Complaint Rate
SPAM=$(echo "$REPORT" | jq -r '.spam_complaints // 0')
SPAM_RATE=$(echo "scale=3; $SPAM * 100 / $DELIVERED" | bc)

echo "Spam Complaint Rate: $SPAM_RATE%"
if (( $(echo "$SPAM_RATE <= 0.1" | bc -l) )); then
  echo "  ✅ Excellent (target: ≤0.1%)"
else
  echo "  ❌ Concerning - Review content and list source"
fi
```

## Export and Reporting

### Export Campaign Data

```bash
#!/bin/bash
# export-campaign-data.sh

CAMPAIGN_ID=$1
OUTPUT_FILE="campaign-${CAMPAIGN_ID}-report-$(date +%Y%m%d).json"

echo "Exporting campaign data..."

# Get campaign details
cakemail campaigns get $CAMPAIGN_ID -f json > campaign-details.json

# Get campaign report
cakemail reports campaign $CAMPAIGN_ID -f json > campaign-report.json

# Get link data
cakemail reports campaign-links $CAMPAIGN_ID -f json > campaign-links.json

# Combine into single file
jq -s '{campaign: .[0], report: .[1], links: .[2]}' \
  campaign-details.json \
  campaign-report.json \
  campaign-links.json > "$OUTPUT_FILE"

# Cleanup
rm campaign-details.json campaign-report.json campaign-links.json

echo "✓ Exported to: $OUTPUT_FILE"
```

### Generate CSV Report

```bash
#!/bin/bash
# generate-csv-report.sh

echo "campaign_id,name,date,recipients,delivered,opens,clicks,open_rate,click_rate,unsubscribes" > campaigns-report.csv

# Get all sent campaigns
CAMPAIGNS=$(cakemail campaigns list --filter "status==sent" -f json | jq -r '.data[].id')

for ID in $CAMPAIGNS; do
  CAMPAIGN=$(cakemail campaigns get $ID -f json)
  REPORT=$(cakemail reports campaign $ID -f json)

  NAME=$(echo "$CAMPAIGN" | jq -r '.name' | sed 's/,/_/g')
  DATE=$(echo "$CAMPAIGN" | jq -r '.delivered_at' | cut -d'T' -f1)
  RECIPIENTS=$(echo "$REPORT" | jq -r '.total_recipients')
  DELIVERED=$(echo "$REPORT" | jq -r '.delivered')
  OPENS=$(echo "$REPORT" | jq -r '.unique_opens')
  CLICKS=$(echo "$REPORT" | jq -r '.unique_clicks')
  OPEN_RATE=$(echo "$REPORT" | jq -r '.open_rate')
  CLICK_RATE=$(echo "$REPORT" | jq -r '.click_rate')
  UNSUBSCRIBES=$(echo "$REPORT" | jq -r '.unsubscribes')

  echo "$ID,$NAME,$DATE,$RECIPIENTS,$DELIVERED,$OPENS,$CLICKS,$OPEN_RATE,$CLICK_RATE,$UNSUBSCRIBES" >> campaigns-report.csv
done

echo "✓ Report saved to: campaigns-report.csv"
```

## Best Practices

### 1. Review Reports Within 24-48 Hours

Most engagement happens in first 48 hours:
```bash
# Schedule report review
$ cakemail reports campaign 790 > report-24h.txt
# Review after 24 hours
# Final review after 7 days
```

### 2. Track Metrics Over Time

```bash
# Log metrics daily for first week
0 12 * * * /path/to/track-daily-performance.sh 790
```

### 3. Compare Similar Campaigns

```bash
# Compare campaigns to same segment
$ ./compare-campaigns.sh 790 791
```

### 4. Focus on Trends, Not Single Campaigns

```bash
# Monthly trend analysis
$ ./monthly-trends.sh 2024
```

### 5. Set Benchmark Goals

```bash
# Document your benchmarks
cat > benchmarks.md << 'EOF'
# Campaign Benchmarks

## Newsletter
- Open Rate Target: 25%
- Click Rate Target: 4%
- Unsubscribe Rate Max: 0.3%

## Promotional
- Open Rate Target: 20%
- Click Rate Target: 8%
- Unsubscribe Rate Max: 0.5%
EOF
```

### 6. Investigate Anomalies

```bash
# If metrics significantly differ
# Check: Send time, subject line, content, segment, list quality
```

## Troubleshooting

### Low Open Rates

**Problem:** Open rate below 15%

**Solutions:**
- Improve subject lines (A/B test)
- Check send time
- Verify sender reputation
- Clean inactive subscribers
- Test mobile optimization

### Low Click Rates

**Problem:** Click rate below 2%

**Solutions:**
- Improve CTA placement
- Make CTAs more prominent
- Verify link destinations work
- Increase content relevance
- Test different content formats

### High Unsubscribe Rate

**Problem:** Unsubscribe rate above 1%

**Solutions:**
- Review content relevance
- Reduce send frequency
- Improve targeting/segmentation
- Provide preference center
- Check for list purchase/rental

### High Bounce Rate

**Problem:** Bounce rate above 5%

**Solutions:**
- Clean list regularly
- Remove hard bounces immediately
- Use double opt-in
- Verify email collection process
- Check for spam traps

