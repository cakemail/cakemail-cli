# Report Commands

Access analytics, statistics, and export reports for campaigns, lists, and email activity.

## Overview

Report commands allow you to:
- View campaign performance analytics (opens, clicks, bounces)
- Analyze link click statistics for campaigns
- Get list growth and engagement metrics
- Access account-wide statistics
- View Email API delivery and engagement stats
- Export campaign and transactional email data
- Monitor transactional email performance

Reports provide insights into email performance, audience engagement, and delivery metrics to help optimize your email marketing and transactional email strategies.

## Commands

- [reports campaign](#reports-campaign) - Get campaign analytics
- [reports campaign-links](#reports-campaign-links) - Get campaign link analytics
- [reports list](#reports-list) - Get list statistics
- [reports account](#reports-account) - Get account-wide analytics
- [reports emails](#reports-emails) - Get Email API statistics
- [reports emails-summary](#reports-emails-summary) - Get Email API summary
- [reports transactional-emails](#reports-transactional-emails) - Get transactional email stats
- [reports campaigns-exports](#reports-campaigns-exports) - List campaign report exports
- [reports export-campaigns](#reports-export-campaigns) - Create campaign export
- [reports campaigns-export](#reports-campaigns-export) - Get export status
- [reports download-campaigns-export](#reports-download-campaigns-export) - Download export
- [reports delete-campaigns-export](#reports-delete-campaigns-export) - Delete export

---

## reports campaign

Get comprehensive analytics and statistics for a specific campaign.

### Usage

```bash
cakemail reports campaign <id>
```

### Arguments

- `id` - Campaign ID (required)

### Examples

**Get campaign report:**

```bash
$ cakemail reports campaign 790
```

**Output:**
```
{
  "campaign_id": 790,
  "campaign_name": "Weekly Newsletter - March 15",
  "sent_date": "2024-03-15T10:00:00Z",
  "recipients": 1234,
  "delivered": 1200,
  "bounced": 34,
  "opens": 456,
  "unique_opens": 389,
  "clicks": 123,
  "unique_clicks": 98,
  "unsubscribes": 5,
  "complaints": 1,
  "open_rate": 0.324,
  "click_rate": 0.082,
  "click_to_open_rate": 0.252,
  "bounce_rate": 0.028
}
```

**Extract key metrics:**

```bash
$ cakemail reports campaign 790 -f json | jq '{open_rate, click_rate, bounce_rate}'
```

**Output:**
```json
{
  "open_rate": 0.324,
  "click_rate": 0.082,
  "bounce_rate": 0.028
}
```

**Compare multiple campaigns:**

```bash
for id in 790 791 792; do
  echo "Campaign $id:"
  cakemail reports campaign $id -f json | jq '{opens: .unique_opens, clicks: .unique_clicks, rate: .open_rate}'
done
```

**Output:**
```
Campaign 790:
{"opens": 389, "clicks": 98, "rate": 0.324}
Campaign 791:
{"opens": 412, "clicks": 105, "rate": 0.338}
Campaign 792:
{"opens": 395, "clicks": 91, "rate": 0.315}
```

### Metrics Explained

- **Recipients**: Total contacts campaign was sent to
- **Delivered**: Successfully delivered emails
- **Bounced**: Failed deliveries (hard + soft bounces)
- **Opens**: Total open events (includes multiple opens per contact)
- **Unique Opens**: Number of contacts who opened at least once
- **Clicks**: Total click events
- **Unique Clicks**: Number of contacts who clicked at least once
- **Open Rate**: Unique opens / delivered
- **Click Rate**: Unique clicks / delivered
- **Click-to-Open Rate**: Unique clicks / unique opens
- **Bounce Rate**: Bounced / recipients

### Notes

- Data updates in real-time as recipients engage
- Opens tracked via pixel (requires HTML content and images enabled)
- Clicks tracked via link rewrites
- Historical data available for all sent campaigns
- Rates are decimal values (0.324 = 32.4%)

### Related Commands

- [reports campaign-links](#reports-campaign-links) - Detailed link analytics
- [campaigns get](/en/cli/command-reference/campaigns#campaigns-get) - Campaign details
- [campaigns list](/en/cli/command-reference/campaigns#campaigns-list) - Find campaign IDs

---

## reports campaign-links

Get detailed link click analytics for a specific campaign.

### Usage

```bash
cakemail reports campaign-links <id>
```

### Arguments

- `id` - Campaign ID (required)

### Examples

**Get link analytics:**

```bash
$ cakemail reports campaign-links 790
```

**Output:**
```
{
  "campaign_id": 790,
  "links": [
    {
      "url": "https://example.com/products",
      "clicks": 78,
      "unique_clicks": 65,
      "percentage": 0.663
    },
    {
      "url": "https://example.com/blog",
      "clicks": 45,
      "unique_clicks": 33,
      "percentage": 0.337
    }
  ],
  "total_clicks": 123,
  "total_unique_clicks": 98
}
```

**Find most clicked link:**

```bash
$ cakemail reports campaign-links 790 -f json | jq '.links | sort_by(.unique_clicks) | reverse | .[0]'
```

**Output:**
```json
{
  "url": "https://example.com/products",
  "clicks": 78,
  "unique_clicks": 65,
  "percentage": 0.663
}
```

**Export link data:**

```bash
$ cakemail reports campaign-links 790 -f json | jq -r '.links[] | "\(.url),\(.unique_clicks)"' > link-performance.csv
```

**Output (link-performance.csv):**
```
https://example.com/products,65
https://example.com/blog,33
```

### Notes

- Only includes trackable links (HTTP/HTTPS)
- Unsubscribe links not included in click counts
- Percentage shows portion of total unique clicks
- Links sorted by unique clicks (descending)
- Multiple clicks per contact counted in "clicks" field

### Related Commands

- [reports campaign](#reports-campaign) - Overall campaign analytics
- [campaigns links](/en/cli/command-reference/campaigns#campaigns-links) - View campaign links

---

## reports list

Get analytics and statistics for a specific contact list.

### Usage

```bash
cakemail reports list <id>
```

### Arguments

- `id` - List ID (required)

### Examples

**Get list report:**

```bash
$ cakemail reports list 123
```

**Output:**
```
{
  "list_id": 123,
  "list_name": "Newsletter Subscribers",
  "total_contacts": 1234,
  "subscribed": 1180,
  "unsubscribed": 54,
  "bounced": 0,
  "complained": 0,
  "growth_rate": 0.156,
  "churn_rate": 0.044,
  "engagement_rate": 0.312,
  "campaigns_sent": 12,
  "last_campaign_date": "2024-03-15T10:00:00Z"
}
```

**Track list growth over time:**

```bash
$ cakemail reports list 123 -f json | jq '{total: .total_contacts, active: .subscribed, growth: .growth_rate}'
```

**Output:**
```json
{
  "total": 1234,
  "active": 1180,
  "growth": 0.156
}
```

**Compare multiple lists:**

```bash
for id in 123 124 125; do
  echo "List $id:"
  cakemail reports list $id -f json | jq '{contacts: .subscribed, engagement: .engagement_rate}'
done
```

### Metrics Explained

- **Total Contacts**: All contacts in list (all statuses)
- **Subscribed**: Active subscribed contacts
- **Unsubscribed**: Contacts who unsubscribed
- **Bounced**: Contacts with bounced status
- **Complained**: Contacts who marked email as spam
- **Growth Rate**: New subscribers / total contacts (30-day period)
- **Churn Rate**: Unsubscribes / total contacts (30-day period)
- **Engagement Rate**: (Opens + clicks) / delivered (30-day avg)

### Notes

- Growth and churn calculated over trailing 30 days
- Engagement based on recent campaign performance
- Historical data shows list health trends
- Use to identify declining list quality

### Related Commands

- [lists get](/en/cli/command-reference/lists#lists-get) - List details
- [contacts list](/en/cli/command-reference/contacts#contacts-list) - View list contacts
- [reports account](#reports-account) - Account-wide stats

---

## reports account

Get account-wide analytics and statistics across all lists and campaigns.

### Usage

```bash
cakemail reports account
```

### Examples

**Get account report:**

```bash
$ cakemail reports account
```

**Output:**
```
{
  "account_id": 456,
  "total_lists": 5,
  "total_contacts": 6789,
  "active_contacts": 6234,
  "total_campaigns": 48,
  "campaigns_this_month": 12,
  "emails_sent_this_month": 67890,
  "average_open_rate": 0.298,
  "average_click_rate": 0.074,
  "average_bounce_rate": 0.023,
  "email_api_sent_this_month": 1234,
  "account_usage": {
    "contacts_limit": 10000,
    "contacts_used": 6789,
    "emails_limit": 100000,
    "emails_used": 69124
  }
}
```

**Check account usage:**

```bash
$ cakemail reports account -f json | jq '.account_usage'
```

**Output:**
```json
{
  "contacts_limit": 10000,
  "contacts_used": 6789,
  "emails_limit": 100000,
  "emails_used": 69124
}
```

**Monitor monthly activity:**

```bash
$ cakemail reports account -f json | jq '{campaigns: .campaigns_this_month, emails: .emails_sent_this_month}'
```

**Output:**
```json
{
  "campaigns": 12,
  "emails": 67890
}
```

### Notes

- Includes all lists and campaigns in account
- Monthly metrics reset on the 1st of each month
- Average rates calculated across all campaigns
- Usage limits based on account tier
- Use to monitor account health and limits

### Related Commands

- [reports list](#reports-list) - Individual list analytics
- [reports campaign](#reports-campaign) - Individual campaign analytics
- [account show](/en/cli/command-reference/account#account-show) - Account details

---

## reports emails

Get Email API statistics for transactional emails.

### Usage

```bash
cakemail reports emails [options]
```

### Options

- `--from <date>` - Start date (YYYY-MM-DD format)
- `--to <date>` - End date (YYYY-MM-DD format)

### Examples

**Get recent email stats:**

```bash
$ cakemail reports emails
```

**Output:**
```
{
  "total_sent": 1234,
  "delivered": 1198,
  "bounced": 36,
  "opens": 456,
  "unique_opens": 389,
  "clicks": 123,
  "unique_clicks": 98,
  "complaints": 2,
  "delivery_rate": 0.971,
  "open_rate": 0.325,
  "click_rate": 0.082
}
```

**Get stats for specific date range:**

```bash
$ cakemail reports emails --from 2024-03-01 --to 2024-03-15
```

**Output:**
```
{
  "period": {
    "from": "2024-03-01",
    "to": "2024-03-15"
  },
  "total_sent": 567,
  "delivered": 551,
  "bounced": 16,
  "opens": 189,
  "clicks": 45
}
```

**Track daily performance:**

```bash
$ cakemail reports emails --from 2024-03-15 --to 2024-03-15 -f json | jq '{sent: .total_sent, delivered: .delivered, rate: .delivery_rate}'
```

### Notes

- Defaults to last 30 days if no date range specified
- Includes all Email API v2 transactional emails
- Does not include campaign emails
- Real-time statistics (updates continuously)
- Useful for monitoring transactional email health

### Related Commands

- [reports emails-summary](#reports-emails-summary) - Detailed daily breakdown
- [reports transactional-emails](#reports-transactional-emails) - Template-based email stats
- [emails logs](/en/cli/command-reference/emails#emails-logs) - Individual email logs

---

## reports emails-summary

Get detailed Email API activity summary with daily breakdown.

### Usage

```bash
cakemail reports emails-summary [options]
```

### Options

- `--from <date>` - Start date (YYYY-MM-DD format)
- `--to <date>` - End date (YYYY-MM-DD format)

### Examples

**Get activity summary:**

```bash
$ cakemail reports emails-summary --from 2024-03-01 --to 2024-03-07
```

**Output:**
```
{
  "period": {
    "from": "2024-03-01",
    "to": "2024-03-07"
  },
  "daily_stats": [
    {
      "date": "2024-03-01",
      "sent": 89,
      "delivered": 87,
      "bounced": 2,
      "opens": 34,
      "clicks": 12
    },
    {
      "date": "2024-03-02",
      "sent": 112,
      "delivered": 109,
      "bounced": 3,
      "opens": 45,
      "clicks": 15
    }
  ],
  "totals": {
    "sent": 678,
    "delivered": 660,
    "bounced": 18
  }
}
```

**Find peak send day:**

```bash
$ cakemail reports emails-summary --from 2024-03-01 --to 2024-03-31 -f json | jq '.daily_stats | sort_by(.sent) | reverse | .[0]'
```

**Output:**
```json
{
  "date": "2024-03-15",
  "sent": 156,
  "delivered": 152,
  "bounced": 4,
  "opens": 67,
  "clicks": 23
}
```

### Notes

- Provides day-by-day breakdown
- Useful for identifying trends and patterns
- Date range required (max 90 days)
- Includes totals across full period

### Related Commands

- [reports emails](#reports-emails) - Aggregate email stats
- [emails logs](/en/cli/command-reference/emails#emails-logs) - Detailed email logs

---

## reports transactional-emails

Get statistics for transactional emails sent via templates.

### Usage

```bash
cakemail reports transactional-emails [options]
```

### Options

- `--from <date>` - Start date (YYYY-MM-DD format)
- `--to <date>` - End date (YYYY-MM-DD format)

### Examples

**Get transactional email stats:**

```bash
$ cakemail reports transactional-emails
```

**Output:**
```
{
  "total_sent": 456,
  "delivered": 445,
  "bounced": 11,
  "opens": 234,
  "unique_opens": 198,
  "clicks": 67,
  "unique_clicks": 54,
  "templates": [
    {
      "template_id": 789,
      "template_name": "Password Reset",
      "sent": 234,
      "opens": 198,
      "clicks": 45
    },
    {
      "template_id": 790,
      "template_name": "Welcome Email",
      "sent": 156,
      "opens": 123,
      "clicks": 18
    }
  ]
}
```

**Get stats for date range:**

```bash
$ cakemail reports transactional-emails --from 2024-03-01 --to 2024-03-15
```

**Find best performing template:**

```bash
$ cakemail reports transactional-emails -f json | jq '.templates | sort_by(.clicks) | reverse | .[0]'
```

**Output:**
```json
{
  "template_id": 789,
  "template_name": "Password Reset",
  "sent": 234,
  "opens": 198,
  "clicks": 45
}
```

### Notes

- Only includes emails sent via templates
- Template breakdown helps identify performance
- Defaults to last 30 days if no dates specified
- Does not include non-template Email API emails

### Related Commands

- [transactional-templates list](/en/cli/command-reference/transactional-templates#transactional-templates-list) - View templates
- [reports emails](#reports-emails) - All Email API stats

---

## reports campaigns-exports

List all campaign report exports.

### Usage

```bash
cakemail reports campaigns-exports [options]
```

### Options

- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number

### Examples

**List all exports:**

```bash
$ cakemail reports campaigns-exports
```

**Output:**
```
┌──────────────┬──────────┬─────────────────────┬────────────┐
│ ID           │ Status   │ Created             │ Records    │
├──────────────┼──────────┼─────────────────────┼────────────┤
│ export_abc123│ ready    │ 2024-03-15 10:30:00 │ 12         │
│ export_def456│ processing│ 2024-03-15 10:35:00│ -          │
│ export_ghi789│ ready    │ 2024-03-14 14:20:00 │ 8          │
└──────────────┴──────────┴─────────────────────┴────────────┘
```

**List recent exports:**

```bash
$ cakemail reports campaigns-exports -l 5
```

### Notes

- Shows all export jobs regardless of status
- Exports expire after 30 days
- Use to find previous exports before creating new ones

### Related Commands

- [reports export-campaigns](#reports-export-campaigns) - Create new export
- [reports campaigns-export](#reports-campaigns-export) - Get export details

---

## reports export-campaigns

Create and download a campaign report export.

### Usage

```bash
cakemail reports export-campaigns [options]
```

### Options

- `--from <date>` - Start date (YYYY-MM-DD format)
- `--to <date>` - End date (YYYY-MM-DD format)
- `--status <status>` - Filter by campaign status
- `--no-wait` - Create export without waiting for completion

### Examples

**Export all campaigns:**

```bash
$ cakemail reports export-campaigns
```

**Output:**
```
✓ Export job created
⠋ Waiting for export to complete...
✓ Export ready
ℹ Export completed. Download with: cakemail reports download-campaigns-export export_abc123
{
  "id": "export_abc123",
  "status": "ready",
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Export campaigns for date range:**

```bash
$ cakemail reports export-campaigns --from 2024-03-01 --to 2024-03-15
```

**Export without waiting:**

```bash
$ cakemail reports export-campaigns --no-wait
```

**Output:**
```
✓ Export job created
ℹ Export ID: export_def456
ℹ Check status with: cakemail reports campaigns-export export_def456
```

**Export by status:**

```bash
$ cakemail reports export-campaigns --status sent
```

### Notes

- Default behavior waits for export completion (polls every 2 seconds)
- Use `--no-wait` for large exports to avoid timeout
- Export includes all campaign metrics
- CSV format suitable for analysis in Excel/Google Sheets
- Download URL expires after 24 hours

### Related Commands

- [reports download-campaigns-export](#reports-download-campaigns-export) - Download export
- [reports campaigns-export](#reports-campaigns-export) - Check export status
- [reports campaigns-exports](#reports-campaigns-exports) - List all exports

---

## reports campaigns-export

Get the status and details of a campaign report export.

### Usage

```bash
cakemail reports campaigns-export <id>
```

### Arguments

- `id` - Export ID (required)

### Examples

**Check export status:**

```bash
$ cakemail reports campaigns-export export_abc123
```

**Output:**
```
{
  "id": "export_abc123",
  "status": "ready",
  "created_at": "2024-03-15T10:30:00Z",
  "completed_at": "2024-03-15T10:31:30Z",
  "download_url": "https://api.cakemail.com/exports/...",
  "expires_at": "2024-04-14T10:31:30Z",
  "records": 12
}
```

**Monitor processing export:**

```bash
$ cakemail reports campaigns-export export_def456
```

**Output:**
```
{
  "id": "export_def456",
  "status": "processing",
  "created_at": "2024-03-15T10:35:00Z",
  "progress": 65
}
```

### Status Values

- `processing` - Export is being generated
- `ready` - Export is ready for download
- `error` - Export failed

### Notes

- Use to poll export status when using `--no-wait`
- Download URL only available when status is `ready`
- Progress percentage shown for processing exports

### Related Commands

- [reports export-campaigns](#reports-export-campaigns) - Create export
- [reports download-campaigns-export](#reports-download-campaigns-export) - Download ready export

---

## reports download-campaigns-export

Download a completed campaign report export file.

### Usage

```bash
cakemail reports download-campaigns-export <id>
```

### Arguments

- `id` - Export ID (required)

### Examples

**Download export:**

```bash
$ cakemail reports download-campaigns-export export_abc123
```

**Output:**
```
✓ Export downloaded
{
  "filename": "campaigns_export_abc123.csv",
  "size": 12456,
  "download_url": "https://..."
}
```

**Save to specific file:**

```bash
$ cakemail reports download-campaigns-export export_abc123 -f json | jq -r '.content' > campaigns.csv
```

### Notes

- Export must have status `ready` before download
- File format is CSV
- Download URL expires after 24 hours
- Large files may take time to download

### Related Commands

- [reports export-campaigns](#reports-export-campaigns) - Create export
- [reports campaigns-export](#reports-campaigns-export) - Check if ready

---

## reports delete-campaigns-export

Delete a campaign report export file.

### Usage

```bash
cakemail reports delete-campaigns-export <id> [options]
```

### Arguments

- `id` - Export ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete export with confirmation:**

```bash
$ cakemail reports delete-campaigns-export export_abc123
```

**Output:**
```
⚠ Delete campaigns report export export_abc123?

The following will happen:
  • Export file will be permanently deleted

Type 'yes' to confirm: yes

✓ Export export_abc123 deleted
```

**Force delete:**

```bash
$ cakemail reports delete-campaigns-export export_abc123 --force
```

**Output:**
```
✓ Export export_abc123 deleted
```

### Notes

- Deletion is permanent
- Export data cannot be recovered
- Exports auto-delete after 30 days

### Related Commands

- [reports campaigns-exports](#reports-campaigns-exports) - List exports before deletion

---

## Common Workflows

### Workflow 1: Campaign Performance Analysis

```bash
# Get overall campaign stats
$ cakemail reports campaign 790

# Analyze link performance
$ cakemail reports campaign-links 790

# Compare with previous campaign
$ cakemail reports campaign 789 -f json | jq '{open_rate, click_rate}'
$ cakemail reports campaign 790 -f json | jq '{open_rate, click_rate}'
```

### Workflow 2: Monthly Report Generation

```bash
# Export all campaigns from last month
$ cakemail reports export-campaigns --from 2024-02-01 --to 2024-02-29

# Wait for completion and download
$ cakemail reports download-campaigns-export export_abc123

# Get account summary
$ cakemail reports account > monthly-account-report.json

# Get Email API stats
$ cakemail reports emails --from 2024-02-01 --to 2024-02-29 > monthly-email-stats.json
```

### Workflow 3: List Health Check

```bash
# Check all lists
for id in $(cakemail lists list -f json | jq -r '.data[].id'); do
  echo "List $id:"
  cakemail reports list $id -f json | jq '{subscribed, engagement_rate, churn_rate}'
done

# Identify declining lists
$ cakemail reports list 123 -f json | jq 'select(.churn_rate > 0.05)'
```

### Workflow 4: Email API Monitoring

```bash
# Daily email stats check
$ cakemail reports emails --from $(date +%Y-%m-%d) --to $(date +%Y-%m-%d)

# Check delivery rate
$ cakemail reports emails -f json | jq '.delivery_rate'

# Alert if delivery rate drops
RATE=$(cakemail reports emails -f json | jq -r '.delivery_rate')
if (( $(echo "$RATE < 0.95" | bc -l) )); then
  echo "⚠ Warning: Delivery rate below 95%: $RATE"
fi
```

## Best Practices

1. **Regular Monitoring**: Check campaign reports after each send
2. **Track Trends**: Export monthly data for trend analysis
3. **Link Analysis**: Use link reports to optimize CTAs
4. **List Health**: Monitor list engagement and churn rates
5. **Email API**: Track transactional email delivery rates daily
6. **Export Archives**: Keep monthly exports for historical records
7. **Benchmark**: Compare performance against industry standards
8. **Segment Analysis**: Analyze performance by list/segment

## Troubleshooting

### Error: "Campaign ID not found"

Campaign doesn't exist or was deleted.

**Solution:**
```bash
# List campaigns to verify ID
$ cakemail campaigns list

# Use correct campaign ID
$ cakemail reports campaign 790
```

### No Data in Reports

Campaign may not have been sent yet.

**Solution:**
```bash
# Check campaign status
$ cakemail campaigns get 790 -f json | jq '.status'

# Only sent campaigns have report data
```

### Export Taking Too Long

Large data sets may timeout.

**Solution:**
```bash
# Use --no-wait for large exports
$ cakemail reports export-campaigns --from 2024-01-01 --to 2024-12-31 --no-wait

# Check status separately
$ cakemail reports campaigns-export export_abc123

# Download when ready
$ cakemail reports download-campaigns-export export_abc123
```

### Low Open Rates

Multiple possible causes.

**Solution:**
```bash
# Check subject line effectiveness
# Review send times
# Verify list quality with list report
$ cakemail reports list 123

# Check for high bounce rates
$ cakemail reports campaign 790 -f json | jq '.bounce_rate'
```

### High Bounce Rate

List quality issue or delivery problems.

**Solution:**
```bash
# Identify bounced emails
$ cakemail emails logs --status bounced

# Clean list
$ cakemail contacts list 123 --filter "status==bounced"

# Add to suppression list
$ cakemail suppressed add -e "bounced@example.com" -r "hard-bounce"
```

---

**Related Documentation:**
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Manage campaigns
- [Lists Commands](/en/cli/command-reference/lists/) - Manage lists
- [Emails Commands](/en/cli/command-reference/emails/) - Transactional emails
- [Transactional Templates Commands](/en/cli/command-reference/transactional-templates/) - Email templates
