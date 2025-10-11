# Output Formats

The Cakemail CLI supports three output formats: JSON, Table, and Compact. Choose the format that best suits your needs.

## Overview

Different output formats are useful for different scenarios:

- **JSON**: Machine-readable, full data, perfect for scripting
- **Table**: Human-readable, structured, great for interactive use
- **Compact**: Concise summaries, quick scanning, best for lists

## Choosing a Format

You can set the output format in three ways:

1. **Per-command flag** (highest priority)
   ```bash
   cakemail -f table campaigns list
   ```

2. **Environment variable**
   ```bash
   export CAKEMAIL_OUTPUT_FORMAT=compact
   ```

3. **`.env` file**
   ```bash
   # .env
   CAKEMAIL_OUTPUT_FORMAT=compact
   ```

**Priority**: Command flag > Environment variable > `.env` file > Default (JSON)

---

## JSON Format

### Overview

JSON is the default output format. It provides complete, structured data that's easy to parse programmatically.

### When to Use

- Scripting and automation
- Processing output with `jq` or other tools
- Saving output to files for later processing
- CI/CD pipelines
- Need full data structure

### Example

```bash
cakemail -f json campaigns list --limit 2
```

**Output:**
```json
{
  "data": [
    {
      "id": 12345,
      "name": "Summer Sale Newsletter",
      "status": "delivered",
      "list_id": 789,
      "sender_id": 456,
      "template_id": 123,
      "subject": "Summer Sale - Up to 50% Off!",
      "scheduled_for": "2024-06-15T10:00:00Z",
      "created_on": "2024-06-10T14:30:00Z",
      "updated_on": "2024-06-15T10:05:00Z"
    },
    {
      "id": 12346,
      "name": "Product Update",
      "status": "scheduled",
      "list_id": 789,
      "sender_id": 456,
      "template_id": 124,
      "subject": "New Features Released",
      "scheduled_for": "2024-06-20T15:00:00Z",
      "created_on": "2024-06-18T09:00:00Z",
      "updated_on": "2024-06-18T09:15:00Z"
    }
  ],
  "count": 2,
  "total": 47,
  "page": 1,
  "per_page": 2
}
```

### Processing JSON Output

Use `jq` to extract specific fields:

```bash
# Get just campaign names
cakemail -f json campaigns list | jq -r '.data[].name'

# Filter by status
cakemail -f json campaigns list | jq '.data[] | select(.status=="delivered")'

# Count total campaigns
cakemail -f json campaigns list | jq '.total'

# Get IDs and names as CSV
cakemail -f json campaigns list | jq -r '.data[] | "\(.id),\(.name)"'
```

---

## Table Format

### Overview

Table format displays data in a structured, human-readable table with columns and rows.

### When to Use

- Interactive terminal use
- Reading detailed information
- Comparing multiple items side-by-side
- Presenting data to humans
- Visual clarity is important

### Example

```bash
cakemail -f table campaigns list --limit 3
```

**Output:**
```
┌─────────┬──────────────────────────┬───────────┬──────────────────────────────┬────────────────────┐
│ ID      │ Name                     │ Status    │ Subject                      │ Scheduled For      │
├─────────┼──────────────────────────┼───────────┼──────────────────────────────┼────────────────────┤
│ 12345   │ Summer Sale Newsletter   │ delivered │ Summer Sale - Up to 50% Off! │ 2024-06-15 10:00   │
│ 12346   │ Product Update           │ scheduled │ New Features Released        │ 2024-06-20 15:00   │
│ 12347   │ Monthly Newsletter       │ draft     │ June 2024 Newsletter         │ -                  │
└─────────┴──────────────────────────┴───────────┴──────────────────────────────┴────────────────────┘

Total: 47 campaigns
```

### Table Format Features

- **Headers**: Column names clearly labeled
- **Alignment**: Proper column alignment for readability
- **Unicode borders**: Clean, professional appearance
- **Pagination info**: Shows total count below table
- **Truncation**: Long values are truncated with `...` to fit

### Customizing Display

Tables automatically select the most relevant columns for each resource:

```bash
# Campaigns: ID, Name, Status, Subject, Scheduled
cakemail -f table campaigns list

# Lists: ID, Name, Language, Active Contacts, Created
cakemail -f table lists list

# Contacts: ID, Email, Status, Name, Subscribed On
cakemail -f table contacts list 123

# Templates: ID, Name, Subject, Tags, Created
cakemail -f table templates list
```

---

## Compact Format

### Overview

Compact format displays each item as a single line with key information, perfect for quick scanning.

### When to Use

- Quick overview of many items
- Terminal with limited space
- Need to see item count at a glance
- Focused on specific fields
- Log-like output

### Example

```bash
cakemail -f compact campaigns list --limit 5
```

**Output:**
```
[12345] Summer Sale Newsletter (delivered) - Summer Sale - Up to 50% Off!
[12346] Product Update (scheduled) - New Features Released
[12347] Monthly Newsletter (draft) - June 2024 Newsletter
[12348] Welcome Series (delivered) - Welcome to Our Community
[12349] Abandoned Cart (suspended) - Complete Your Purchase

Total: 47 campaigns
```

### Compact Format Patterns

Each resource type has a specific compact format:

**Campaigns:**
```
[ID] Name (status) - Subject
```

**Lists:**
```
[ID] Name - 1,234 contacts (language)
```

**Contacts:**
```
[ID] email@example.com (status) - First Last
```

**Templates:**
```
[ID] Name - Subject
```

**Senders:**
```
[ID] name <email> (confirmed/unconfirmed)
```

### Benefits

- **Fast scanning**: Quickly find items by ID or name
- **Space efficient**: Many items visible at once
- **Key info only**: No extraneous details
- **Grep-friendly**: Easy to filter with standard tools

```bash
# Find campaigns with "newsletter" in the name
cakemail -f compact campaigns list | grep -i newsletter

# Count delivered campaigns
cakemail -f compact campaigns list | grep delivered | wc -l
```

---

## Format Comparison

### Visual Comparison

**JSON:**
```json
{"id": 12345, "name": "Summer Sale", "status": "delivered", "subject": "Big Sale!"}
```

**Table:**
```
┌───────┬─────────────┬───────────┬───────────┐
│ ID    │ Name        │ Status    │ Subject   │
├───────┼─────────────┼───────────┼───────────┤
│ 12345 │ Summer Sale │ delivered │ Big Sale! │
└───────┴─────────────┴───────────┴───────────┘
```

**Compact:**
```
[12345] Summer Sale (delivered) - Big Sale!
```

### Decision Matrix

| Scenario | Recommended Format | Why |
|----------|-------------------|-----|
| Scripting/automation | JSON | Machine-readable, complete data |
| Interactive browsing | Table | Visual clarity, structured |
| Quick scanning | Compact | Concise, space-efficient |
| Piping to `jq` | JSON | JSON processing |
| Piping to `grep` | Compact | Line-based filtering |
| CI/CD logs | JSON | Parseable, complete |
| Terminal exploration | Table or Compact | Human-readable |
| Saving to file | JSON | Structured data storage |
| Presenting to users | Table | Professional appearance |

---

## Setting Default Format

### Project-Level Default

Create a `.env` file in your project:

```bash
# .env
CAKEMAIL_OUTPUT_FORMAT=compact
```

Now all commands use compact format:
```bash
cakemail campaigns list         # Uses compact
cakemail lists list             # Uses compact
```

### Global Default

Set a user-wide default:

```bash
# ~/.cakemail/.env
CAKEMAIL_OUTPUT_FORMAT=table
```

### Shell Environment

Add to your shell profile:

```bash
echo 'export CAKEMAIL_OUTPUT_FORMAT=compact' >> ~/.zshrc
source ~/.zshrc
```

---

## Per-Command Override

Override the default for a single command:

```bash
# Default is compact, but use JSON for this command
export CAKEMAIL_OUTPUT_FORMAT=compact
cakemail -f json campaigns list

# Default is JSON, but use table for this command
cakemail -f table campaigns get 12345
```

---

## Format-Specific Tips

### JSON Tips

1. **Pretty print with jq:**
   ```bash
   cakemail -f json campaigns list | jq .
   ```

2. **Save to file:**
   ```bash
   cakemail -f json campaigns list > campaigns.json
   ```

3. **Extract specific fields:**
   ```bash
   cakemail -f json campaigns list | jq '.data[].name'
   ```

4. **Filter results:**
   ```bash
   cakemail -f json campaigns list | jq '.data[] | select(.status=="delivered")'
   ```

### Table Tips

1. **Best with pagination:**
   ```bash
   cakemail -f table campaigns list --limit 20
   ```

2. **Redirect to file (preserves formatting):**
   ```bash
   cakemail -f table campaigns list > campaigns.txt
   ```

3. **Combine with less for scrolling:**
   ```bash
   cakemail -f table campaigns list | less
   ```

### Compact Tips

1. **Grep for specific items:**
   ```bash
   cakemail -f compact campaigns list | grep "Newsletter"
   ```

2. **Count items:**
   ```bash
   cakemail -f compact campaigns list | grep delivered | wc -l
   ```

3. **Extract IDs:**
   ```bash
   cakemail -f compact campaigns list | grep -oE '\[([0-9]+)\]' | tr -d '[]'
   ```

---

## Examples by Use Case

### Daily Interactive Use

```bash
# Set default to table or compact
export CAKEMAIL_OUTPUT_FORMAT=table

# Browse campaigns
cakemail campaigns list

# Check specific campaign
cakemail campaigns get 12345
```

### Automation Script

```bash
#!/bin/bash
# Always use JSON in scripts
export CAKEMAIL_OUTPUT_FORMAT=json

# Get campaign count
total=$(cakemail campaigns list | jq '.total')

# Process each campaign
cakemail campaigns list | jq -r '.data[].id' | while read id; do
  echo "Processing campaign $id"
done
```

### Quick Terminal Checks

```bash
# Use compact for quick scans
export CAKEMAIL_OUTPUT_FORMAT=compact

# Quick list
cakemail campaigns list

# Find specific campaign
cakemail campaigns list | grep "Summer"
```

---

## Next Steps

- [Quick Start](./quick-start.md) - Try different formats in practice
- [Advanced Usage: JSON Piping](../08-advanced-usage/json-piping.md) - Advanced JSON processing techniques
- [Command Reference](../09-command-reference/README.md) - See all available commands
