# Email Tracking

Track opens, clicks, and engagement metrics for transactional emails and campaigns.

## Overview

Email tracking provides insights into recipient behavior:
- **Open tracking** - When recipients open emails
- **Click tracking** - Which links recipients click
- **Engagement metrics** - Overall performance data

## How Tracking Works

### Open Tracking

**Mechanism:**
- Invisible 1x1 pixel image embedded in email
- When email is opened, pixel loads from server
- Server logs the open event with timestamp

**Limitations:**
- Requires HTML email (doesn't work with plain text)
- Some email clients block images by default
- Privacy-focused clients may prevent tracking

### Click Tracking

**Mechanism:**
- Original links replaced with tracking URLs
- When recipient clicks, they're redirected through tracking server
- Server logs click event, then redirects to original URL
- Happens seamlessly (recipient doesn't notice)

**Example:**
```
Original:    https://example.com/product
Tracked:     https://track.cakemail.com/c/abc123/xyz789
             → Logs click → Redirects to original URL
```

## Enabling Tracking

### For Transactional Emails

Add `--tracking` flag:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Newsletter" \
  --html-file newsletter.html \
  --tracking
```

### For Campaigns

Tracking is typically enabled by default for campaigns. Check campaign settings or enable during creation.

## Viewing Tracking Data

### Get Email Details

```bash
cakemail emails get <email-id>
```

**Output with tracking data:**
```json
{
  "id": "email_abc123",
  "to": "recipient@example.com",
  "subject": "Newsletter",
  "status": "delivered",
  "tracking": {
    "opened": true,
    "opened_at": "2024-06-15T10:30:00Z",
    "opens_count": 3,
    "clicked": true,
    "clicks_count": 2,
    "last_click_at": "2024-06-15T10:35:00Z"
  },
  "delivered_at": "2024-06-15T10:00:00Z"
}
```

### Filter Email Logs

```bash
# Emails that were opened
cakemail emails logs --status delivered | jq '.data[] | select(.tracking.opened==true)'

# Emails with clicks
cakemail emails logs --status delivered | jq '.data[] | select(.tracking.clicked==true)'
```

### Campaign Analytics

For campaign-level tracking:

```bash
cakemail reports campaign <campaign-id>
```

**Output:**
```json
{
  "campaign_id": 12345,
  "delivered": 1000,
  "opened": 350,
  "clicked": 120,
  "bounced": 10,
  "open_rate": 0.35,
  "click_rate": 0.12,
  "click_to_open_rate": 0.34
}
```

### Link-Level Tracking

See which specific links were clicked:

```bash
cakemail reports campaign-links <campaign-id>
```

**Output:**
```json
{
  "links": [
    {
      "url": "https://example.com/product-1",
      "clicks": 45,
      "unique_clicks": 38
    },
    {
      "url": "https://example.com/product-2",
      "clicks": 30,
      "unique_clicks": 28
    }
  ]
}
```

## Tracking Metrics Explained

### Opens

**Unique Opens:**
- Number of recipients who opened at least once
- Multiple opens from same recipient counted once

**Total Opens:**
- Total number of times email was opened
- Includes multiple opens from same recipient

**Open Rate:**
```
Open Rate = (Unique Opens / Delivered) × 100
```

### Clicks

**Unique Clicks:**
- Number of recipients who clicked at least once
- Multiple clicks from same recipient counted once

**Total Clicks:**
- Total number of clicks across all links
- Includes multiple clicks from same recipient

**Click Rate:**
```
Click Rate = (Unique Clicks / Delivered) × 100
```

**Click-to-Open Rate (CTOR):**
```
CTOR = (Unique Clicks / Unique Opens) × 100
```

## Best Practices

### 1. Always Enable Tracking

```bash
# ✅ Track everything
cakemail emails send ... --tracking

# ❌ Missing insights
cakemail emails send ...
```

### 2. Provide Plain Text Alternative

```bash
# ✅ HTML + text (tracking works on HTML)
cakemail emails send \
  --html-file email.html \
  --text-file email.txt \
  --tracking
```

### 3. Use Descriptive Link Text

```html
<!-- ✅ Clear call-to-action -->
<a href="https://example.com/signup">Sign Up Now</a>

<!-- ❌ Generic -->
<a href="https://example.com/signup">Click here</a>
```

### 4. Test Email Rendering

```bash
# Render email to verify tracking pixel
cakemail emails render <email-id> --tracking > test.html
```

### 5. Monitor Engagement

```bash
#!/bin/bash
# Check engagement daily

YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)

STATS=$(cakemail -f json emails logs --from $YESTERDAY --to $TODAY)
SENT=$(echo "$STATS" | jq '.total')
OPENED=$(echo "$STATS" | jq '[.data[] | select(.tracking.opened==true)] | length')
CLICKED=$(echo "$STATS" | jq '[.data[] | select(.tracking.clicked==true)] | length')

echo "Daily Email Stats:"
echo "  Sent: $SENT"
echo "  Opened: $OPENED"
echo "  Clicked: $CLICKED"
```

## Privacy Considerations

### Respecting Privacy

**Best practices:**
1. **Inform recipients** - Include tracking disclosure in privacy policy
2. **Provide opt-out** - Allow users to disable tracking
3. **Secure data** - Tracking data is encrypted and secure
4. **Comply with regulations** - Follow GDPR, CAN-SPAM, CASL

### GDPR Compliance

If sending to EU recipients:
- Disclose tracking in privacy policy
- Obtain consent where required
- Provide easy opt-out mechanism
- Honor data deletion requests

## Troubleshooting

### Opens Not Being Tracked

**Possible causes:**
1. **Images blocked** - Email client blocks images
2. **Plain text only** - Recipient viewing plain text version
3. **Preview pane** - Some clients don't count preview as open
4. **Privacy protection** - Client using privacy features

**Not always a problem:**
- Some opens won't be tracked (that's normal)
- Focus on trends, not individual opens

### Clicks Not Being Tracked

**Check:**
1. **Tracking enabled** - Verify `--tracking` flag used
2. **HTML email** - Tracking requires HTML
3. **Valid links** - Ensure links in email are correct

**Debug:**
```bash
# Render email with tracking
cakemail emails render <email-id> --tracking > debug.html

# Inspect links (should be tracking URLs)
grep -o 'href="[^"]*"' debug.html
```

### Tracking Data Missing

**Verify tracking was enabled:**
```bash
# Check email details
cakemail emails get <email-id>

# Look for tracking object in response
```

**If missing:**
- Email was sent without `--tracking` flag
- Resend with tracking enabled

## Analytics Best Practices

### 1. Segment Analysis

```bash
# Compare performance by tag
cakemail emails logs --tag "welcome" --from 2024-06-01
cakemail emails logs --tag "newsletter" --from 2024-06-01
```

### 2. Time-Based Analysis

```bash
# Weekly comparison
cakemail emails logs --from 2024-06-01 --to 2024-06-07
cakemail emails logs --from 2024-06-08 --to 2024-06-14
```

### 3. A/B Testing

```bash
# Send variant A
cakemail emails send ... --tags "test-a,subject-variant-1" --tracking

# Send variant B
cakemail emails send ... --tags "test-b,subject-variant-2" --tracking

# Compare results
cakemail emails logs --tag "test-a"
cakemail emails logs --tag "test-b"
```

### 4. Track Campaign Performance

```bash
# Campaign overview
cakemail reports campaign <campaign-id>

# Link performance
cakemail reports campaign-links <campaign-id>

# Export for analysis
cakemail reports campaign <campaign-id> > campaign-stats.json
```

## Practical Examples

### Example 1: Daily Engagement Report

```bash
#!/bin/bash
# daily-report.sh

DATE=$(date +%Y-%m-%d)
REPORT="report-$DATE.txt"

echo "Email Engagement Report - $DATE" > $REPORT
echo "=================================" >> $REPORT
echo "" >> $REPORT

# Get stats
STATS=$(cakemail -f json emails logs --from $DATE --to $DATE)

# Parse data
TOTAL=$(echo "$STATS" | jq '.total')
DELIVERED=$(echo "$STATS" | jq '[.data[] | select(.status=="delivered")] | length')
OPENED=$(echo "$STATS" | jq '[.data[] | select(.tracking.opened==true)] | length')
CLICKED=$(echo "$STATS" | jq '[.data[] | select(.tracking.clicked==true)] | length')

# Calculate rates
OPEN_RATE=$(echo "scale=2; $OPENED * 100 / $DELIVERED" | bc)
CLICK_RATE=$(echo "scale=2; $CLICKED * 100 / $DELIVERED" | bc)

# Write report
echo "Total Sent: $TOTAL" >> $REPORT
echo "Delivered: $DELIVERED" >> $REPORT
echo "Opened: $OPENED ($OPEN_RATE%)" >> $REPORT
echo "Clicked: $CLICKED ($CLICK_RATE%)" >> $REPORT

cat $REPORT
```

### Example 2: Link Performance Analysis

```bash
#!/bin/bash
# analyze-links.sh

CAMPAIGN_ID=$1

if [ -z "$CAMPAIGN_ID" ]; then
  echo "Usage: ./analyze-links.sh <campaign-id>"
  exit 1
fi

echo "Analyzing campaign $CAMPAIGN_ID..."
echo ""

# Get link data
LINKS=$(cakemail -f json reports campaign-links $CAMPAIGN_ID)

# Display top links
echo "Top 5 Links by Clicks:"
echo "$LINKS" | jq -r '.links | sort_by(-.clicks) | .[:5][] | "\(.clicks) clicks - \(.url)"'
```

## Next Steps

- [Transactional Emails](./transactional-emails.md) - Send tracked emails
- [Campaign Analytics](../06-analytics-reporting/campaign-analytics.md) - Detailed campaign metrics
- [Email API Stats](../06-analytics-reporting/email-api-stats.md) - Transactional email statistics
