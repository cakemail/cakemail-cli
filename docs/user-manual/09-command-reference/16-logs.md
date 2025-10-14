# Logs Commands

View and export activity logs for campaigns and lists.

## Overview

Activity logs track all events related to your campaigns and lists, including opens, clicks, bounces, unsubscribes, and more. Use these commands to analyze engagement, troubleshoot issues, and export data for external analysis.

**Available Commands:**
- [`logs campaign`](#logs-campaign) - View campaign activity logs
- [`logs list`](#logs-list) - View list activity logs
- [`logs campaign-export`](#logs-campaign-export) - Create campaign log export
- [`logs campaign-export-download`](#logs-campaign-export-download) - Download campaign log export
- [`logs list-export`](#logs-list-export) - Create list log export
- [`logs list-export-download`](#logs-list-export-download) - Download list log export

**Key Features:**
- Real-time activity tracking
- Filtering by event type, time, contact
- Sorting and pagination
- CSV export for external analysis
- Auto-detection for list logs

**Log Event Types:**
- **Campaign**: open, click, bounce, complaint, delivered, failed
- **List**: subscribe, unsubscribe, update, import

---

## logs campaign

View activity logs for a specific campaign.

### Usage

```bash
cakemail logs campaign <campaign-id> [options]
```

### Arguments

- `<campaign-id>` - Campaign ID (required)

### Options

- `--filter <filter>` - Filter logs (e.g., `type==open`, `contact_id==123`)
- `--sort <sort>` - Sort order (e.g., `+time`, `-contact_id`)
- `-p, --page <number>` - Page number
- `--per-page <number>` - Results per page
- `--start-time <timestamp>` - Start time (Unix timestamp)
- `--end-time <timestamp>` - End time (Unix timestamp)

### Examples

**View all campaign logs:**
```bash
$ cakemail logs campaign 789
```

**Output:**
```
Campaign: Weekly Newsletter (789)

┌──────────────────────┬────────────┬────────────┬─────────────────────┐
│ Contact Email        │ Event Type │ Details    │ Time                │
├──────────────────────┼────────────┼────────────┼─────────────────────┤
│ john@example.com     │ delivered  │ -          │ 2025-10-11 08:00:12 │
│ john@example.com     │ open       │ -          │ 2025-10-11 08:15:33 │
│ john@example.com     │ click      │ Link #1    │ 2025-10-11 08:16:45 │
│ jane@example.com     │ delivered  │ -          │ 2025-10-11 08:00:15 │
│ jane@example.com     │ open       │ -          │ 2025-10-11 09:22:18 │
│ bob@example.com      │ bounce     │ Hard       │ 2025-10-11 08:01:05 │
└──────────────────────┴────────────┴────────────┴─────────────────────┘

Showing 1-6 of 1,234 logs
```

**Filter by event type:**
```bash
$ cakemail logs campaign 789 --filter "type==open"
```

**Filter by contact:**
```bash
$ cakemail logs campaign 789 --filter "contact_id==456"
```

**Multiple filters:**
```bash
$ cakemail logs campaign 789 --filter "type==click;contact_id==456"
```

**Sort by time (newest first):**
```bash
$ cakemail logs campaign 789 --sort "-time"
```

**Time range (Unix timestamps):**
```bash
$ cakemail logs campaign 789 --start-time 1696118400 --end-time 1696204800
```

**JSON output (Developer profile):**
```bash
$ cakemail --profile developer logs campaign 789 --filter "type==open"
```

**Output:**
```json
{
  "data": [
    {
      "contact_id": 456,
      "contact_email": "john@example.com",
      "event_type": "open",
      "timestamp": 1697025333,
      "user_agent": "Mozilla/5.0...",
      "ip_address": "192.168.1.1"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 342
  }
}
```

### Event Types

**Delivery Events:**
- `delivered` - Email successfully delivered
- `bounce` - Email bounced (hard or soft)
- `failed` - Delivery failed

**Engagement Events:**
- `open` - Email opened
- `click` - Link clicked
- `complaint` - Spam complaint

**Unsubscribe Events:**
- `unsubscribe` - Contact unsubscribed

---

## logs list

View activity logs for a specific list.

### Usage

```bash
cakemail logs list [list-id] [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `--filter <filter>` - Filter logs (e.g., `type==subscribe`, `contact_id==123`)
- `--sort <sort>` - Sort order (e.g., `+time`, `-contact_id`)
- `-p, --page <number>` - Page number
- `--per-page <number>` - Results per page
- `--start-time <timestamp>` - Start time (Unix timestamp)
- `--end-time <timestamp>` - End time (Unix timestamp)

### Examples

**View list logs (auto-detect):**
```bash
$ cakemail logs list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)

┌──────────────────────┬──────────────┬─────────────────────┐
│ Contact Email        │ Event Type   │ Time                │
├──────────────────────┼──────────────┼─────────────────────┤
│ new@example.com      │ subscribe    │ 2025-10-11 14:23:11 │
│ old@example.com      │ unsubscribe  │ 2025-10-11 13:05:42 │
│ user@example.com     │ update       │ 2025-10-11 12:15:33 │
└──────────────────────┴──────────────┴─────────────────────┘
```

**Filter by subscribe events:**
```bash
$ cakemail logs list --filter "type==subscribe" --sort "-time"
```

**View specific list:**
```bash
$ cakemail logs list 123 --filter "type==unsubscribe"
```

**Time range:**
```bash
$ cakemail logs list --start-time 1696118400
```

### Event Types

**List Events:**
- `subscribe` - Contact subscribed
- `unsubscribe` - Contact unsubscribed
- `update` - Contact information updated
- `import` - Contact imported from file
- `delete` - Contact deleted
- `bounce` - Contact bounced

---

## logs campaign-export

Create a CSV export of campaign activity logs.

### Usage

```bash
cakemail logs campaign-export <campaign-id> [options]
```

### Arguments

- `<campaign-id>` - Campaign ID (required)

### Options

- `--description <text>` - Export description (optional)
- `--filter <filter>` - Filter logs to export
- `--start-time <timestamp>` - Start time
- `--end-time <timestamp>` - End time

### Examples

**Create export:**
```bash
$ cakemail logs campaign-export 789 --description "Q4 Analytics"
```

**Output:**
```
✓ Export created successfully

Export ID: abc-123-def
Status: processing
Description: Q4 Analytics

To download:
  cakemail logs campaign-export-download 789 abc-123-def
```

**Export with filters:**
```bash
$ cakemail logs campaign-export 789 \
  --filter "type==open" \
  --description "Opens Only"
```

**Export time range:**
```bash
$ cakemail logs campaign-export 789 \
  --start-time 1696118400 \
  --end-time 1696204800 \
  --description "Week of Oct 1"
```

**JSON output:**
```bash
$ cakemail -f json logs campaign-export 789
```

**Output:**
```json
{
  "export_id": "abc-123-def",
  "campaign_id": 789,
  "status": "processing",
  "description": "Q4 Analytics",
  "created_on": "2025-10-11T15:30:00Z"
}
```

### Export Status

Exports are processed asynchronously:
- `processing` - Export is being generated
- `completed` - Export ready for download
- `failed` - Export failed (check error message)

Check status with `logs campaign-export-download` command.

---

## logs campaign-export-download

Get download URL for a campaign log export.

### Usage

```bash
cakemail logs campaign-export-download <campaign-id> <export-id>
```

### Arguments

- `<campaign-id>` - Campaign ID (required)
- `<export-id>` - Export ID from campaign-export command (required)

### Examples

**Get download URL:**
```bash
$ cakemail logs campaign-export-download 789 abc-123-def
```

**Output (if completed):**
```
✓ Export ready for download

Export: Q4 Analytics
Status: completed
Created: 2025-10-11 15:30:00
Size: 2.4 MB
Rows: 12,345

Download URL:
https://exports.cakemail.com/logs/789/abc-123-def.csv?expires=1697040000

💡 URL expires in 24 hours
```

**Output (if still processing):**
```
⏳ Export still processing

Export: Q4 Analytics
Status: processing
Progress: 67%
Estimated time: 2 minutes

Try again in a few minutes.
```

**JSON output:**
```bash
$ cakemail -f json logs campaign-export-download 789 abc-123-def
```

**Output:**
```json
{
  "export_id": "abc-123-def",
  "status": "completed",
  "download_url": "https://exports.cakemail.com/logs/789/abc-123-def.csv?expires=1697040000",
  "size_bytes": 2516582,
  "row_count": 12345,
  "expires_at": "2025-10-12T15:30:00Z"
}
```

### Downloading the File

**Using curl:**
```bash
# Get URL first
URL=$(cakemail -f json logs campaign-export-download 789 abc-123-def | jq -r '.download_url')

# Download
curl -o campaign-789-logs.csv "$URL"
```

**Using wget:**
```bash
wget -O campaign-789-logs.csv "https://exports.cakemail.com/..."
```

---

## logs list-export

Create a CSV export of list activity logs.

### Usage

```bash
cakemail logs list-export [list-id] [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `--description <text>` - Export description (optional)
- `--filter <filter>` - Filter logs to export
- `--start-time <timestamp>` - Start time
- `--end-time <timestamp>` - End time

### Examples

**Create export (auto-detect list):**
```bash
$ cakemail logs list-export --description "Monthly Activity Report"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Export created successfully

Export ID: xyz-456-abc
Status: processing
Description: Monthly Activity Report

To download:
  cakemail logs list-export-download xyz-456-abc
```

**Export with filters:**
```bash
$ cakemail logs list-export 123 \
  --filter "type==subscribe" \
  --description "New Subscribers"
```

**Export time range:**
```bash
$ cakemail logs list-export \
  --start-time 1696118400 \
  --description "October Subscriptions"
```

---

## logs list-export-download

Get download URL for a list log export.

### Usage

```bash
cakemail logs list-export-download [list-id] <export-id>
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<export-id>` - Export ID from list-export command (required)

### Examples

**Get download URL (auto-detect list):**
```bash
$ cakemail logs list-export-download xyz-456-abc
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Export ready for download

Export: Monthly Activity Report
Status: completed
Rows: 5,678

Download URL:
https://exports.cakemail.com/logs/lists/123/xyz-456-abc.csv?expires=1697040000
```

**Specific list:**
```bash
$ cakemail logs list-export-download 123 xyz-456-abc
```

---

## Common Workflows

### Workflow 1: Campaign Performance Analysis

```bash
# View opens
cakemail logs campaign 789 --filter "type==open" --sort "-time"

# View clicks
cakemail logs campaign 789 --filter "type==click"

# Export for detailed analysis
cakemail logs campaign-export 789 --description "Campaign Performance"

# Download when ready
cakemail logs campaign-export-download 789 export-id
```

---

### Workflow 2: Identify Inactive Contacts

```bash
# Export campaign logs
cakemail logs campaign-export 789 --filter "type==open"

# Compare with contact list to find non-openers
# (Process CSV externally)
```

---

### Workflow 3: List Growth Tracking

```bash
# View recent subscriptions
cakemail logs list --filter "type==subscribe" --sort "-time"

# View unsubscribes
cakemail logs list --filter "type==unsubscribe" --sort "-time"

# Export monthly report
cakemail logs list-export \
  --start-time 1696118400 \
  --end-time 1698796800 \
  --description "October List Activity"
```

---

### Workflow 4: Bounce Analysis

```bash
# View all bounces for campaign
cakemail logs campaign 789 --filter "type==bounce"

# Export bounces for cleanup
cakemail logs campaign-export 789 \
  --filter "type==bounce" \
  --description "Bounced Emails"

# Download and process
cakemail logs campaign-export-download 789 export-id
```

---

## Best Practices

### 1. Use Filters for Large Datasets

```bash
# Good - filter first
cakemail logs campaign 789 --filter "type==open" --per-page 100

# Avoid - fetching all logs
cakemail logs campaign 789  # May be too large
```

### 2. Export for Complex Analysis

Don't try to analyze large datasets through the CLI - export to CSV:

```bash
# Create export
cakemail logs campaign-export 789 --description "Full Analysis"

# Download
cakemail logs campaign-export-download 789 export-id

# Analyze in Excel, Python, R, etc.
```

### 3. Set Reasonable Time Ranges

```bash
# Last 7 days
START=$(date -u -d '7 days ago' +%s)
cakemail logs list --start-time $START
```

### 4. Use JSON for Automation

```bash
# Get opens count
cakemail -f json logs campaign 789 --filter "type==open" \
  | jq '.pagination.total'

# Check export status
cakemail -f json logs campaign-export-download 789 abc-123 \
  | jq '.status'
```

---

## CSV Export Format

### Campaign Logs CSV

```csv
contact_id,contact_email,event_type,timestamp,details,ip_address,user_agent
456,john@example.com,open,1697025333,,192.168.1.1,Mozilla/5.0...
456,john@example.com,click,1697025398,Link #1,192.168.1.1,Mozilla/5.0...
789,jane@example.com,delivered,1697025120,,,,
```

### List Logs CSV

```csv
contact_id,contact_email,event_type,timestamp,details
123,new@example.com,subscribe,1697025333,Web form
456,old@example.com,unsubscribe,1697025120,Email link
789,user@example.com,update,1697025090,Changed email
```

---

## Troubleshooting

### Export Takes Too Long

**Problem:** Export stuck in "processing"

**Solutions:**
1. Large campaigns take time (10k+ logs = several minutes)
2. Check status periodically: `logs campaign-export-download ...`
3. Use filters to reduce export size
4. Contact support if >30 minutes

---

### Export Failed

**Problem:** Export status is "failed"

**Solutions:**
1. Check error message in output
2. Try smaller time range
3. Reduce filters complexity
4. Retry export creation

---

### No Logs Returned

**Problem:** Empty result set

**Solutions:**
1. Check campaign has been sent: `cakemail campaigns get 789`
2. Verify time range includes activity
3. Remove filters to see all logs
4. Check you're using correct campaign/list ID

---

