# Contact Import & Export

Master bulk contact operations including CSV imports, exports, and data migration.

## Overview

Import and export operations allow you to:
- Import hundreds or thousands of contacts at once
- Export contact data for backup or analysis
- Migrate contacts between lists
- Integrate with external systems
- Backup contact data regularly
- Clean and transform contact data in bulk

Bulk operations are essential for managing large contact databases efficiently.

## Quick Start

### Import Contacts from CSV

```bash
$ cakemail contacts import 123 --file contacts.csv
```

**Output:**
```
✓ Import started

Import ID: imp_abc123
Status: processing
File: contacts.csv
Contacts to import: 1,247

Check status with:
  cakemail contacts import-status imp_abc123
```

### Export Contacts to CSV

```bash
$ cakemail contacts export 123
```

**Output:**
```
✓ Export started

Export ID: exp_xyz789
Status: processing
Estimated contacts: 1,247

Check status with:
  cakemail contacts export-status exp_xyz789

Download when ready:
  cakemail contacts export-download exp_xyz789 > contacts.csv
```

## CSV File Format

### Basic CSV Structure

```csv
email,first_name,last_name
john@example.com,John,Doe
jane@example.com,Jane,Smith
bob@example.com,Bob,Johnson
```

### With Custom Attributes

```csv
email,first_name,last_name,plan,signup_date,is_vip
john@example.com,John,Doe,premium,2024-03-15,true
jane@example.com,Jane,Smith,basic,2024-03-16,false
bob@example.com,Bob,Johnson,enterprise,2024-03-17,true
```

### CSV Requirements

**Required:**
- `email` column (must be present)
- Valid email addresses
- UTF-8 encoding

**Optional:**
- `first_name` - Contact first name
- `last_name` - Contact last name
- Custom attribute columns (must exist in list)

**Format rules:**
- First row must be header with column names
- Email addresses must be unique
- Custom attribute names must match existing attributes
- Boolean values: `true`/`false` or `1`/`0`
- Dates: ISO format `YYYY-MM-DD`
- Numbers: Plain numbers, no currency symbols

### Creating CSV Files

**Using spreadsheet software:**
1. Create spreadsheet with proper columns
2. Export as CSV (UTF-8)
3. Save with `.csv` extension

**Using command line:**
```bash
# Create from scratch
cat > contacts.csv << 'EOF'
email,first_name,last_name,plan
john@example.com,John,Doe,premium
jane@example.com,Jane,Smith,basic
EOF

# From database export
mysql -u user -p database -e "SELECT email, first_name, last_name FROM contacts" \
  --batch --silent | sed 's/\t/,/g' > contacts.csv
```

**Using scripts:**
```bash
#!/bin/bash
# generate-csv.sh

echo "email,first_name,last_name,plan" > contacts.csv

# Add contacts from your source
while IFS=, read email fname lname plan; do
  echo "$email,$fname,$lname,$plan" >> contacts.csv
done < source_data.txt
```

## Import Process

### Basic Import

```bash
$ cakemail contacts import 123 --file contacts.csv
```

### Check Import Status

```bash
$ cakemail contacts import-status imp_abc123
```

**Output:**
```json
{
  "id": "imp_abc123",
  "status": "completed",
  "file": "contacts.csv",
  "total_rows": 1247,
  "imported": 1189,
  "skipped": 45,
  "failed": 13,
  "errors": [
    {"row": 5, "email": "invalid-email", "error": "Invalid email format"},
    {"row": 23, "email": "duplicate@example.com", "error": "Duplicate email"}
  ],
  "started_at": "2024-03-15T10:30:00Z",
  "completed_at": "2024-03-15T10:32:15Z"
}
```

### View Import History

```bash
$ cakemail contacts import-list 123
```

**Output:**
```
┌──────────────┬─────────────────────┬──────────┬──────────┬─────────┬──────┐
│ Import ID    │ Started             │ Status   │ Total    │ Success │ Failed│
├──────────────┼─────────────────────┼──────────┼──────────┼─────────┼──────┤
│ imp_abc123   │ 2024-03-15 10:30:00 │ complete │ 1,247    │ 1,189   │ 13   │
│ imp_def456   │ 2024-03-10 14:20:00 │ complete │ 856      │ 850     │ 6    │
│ imp_ghi789   │ 2024-03-05 09:15:00 │ complete │ 2,341    │ 2,300   │ 41   │
└──────────────┴─────────────────────┴──────────┴──────────┴─────────┴──────┘
```

### Monitor Import Progress

```bash
#!/bin/bash
# monitor-import.sh

IMPORT_ID=$1

if [ -z "$IMPORT_ID" ]; then
  echo "Usage: $0 <import-id>"
  exit 1
fi

echo "=== Monitoring Import: $IMPORT_ID ==="
echo ""

while true; do
  STATUS=$(cakemail contacts import-status $IMPORT_ID -f json)

  STATE=$(echo "$STATUS" | jq -r '.status')
  TOTAL=$(echo "$STATUS" | jq -r '.total_rows')
  IMPORTED=$(echo "$STATUS" | jq -r '.imported')
  FAILED=$(echo "$STATUS" | jq -r '.failed')

  if [ "$IMPORTED" != "null" ] && [ $TOTAL -gt 0 ]; then
    PERCENT=$(echo "scale=1; $IMPORTED * 100 / $TOTAL" | bc)
  else
    PERCENT="0"
  fi

  clear
  echo "=== Import Status ==="
  echo ""
  echo "Status: $STATE"
  echo "Progress: $IMPORTED / $TOTAL ($PERCENT%)"
  echo "Failed: $FAILED"
  echo ""

  if [ "$STATE" == "completed" ] || [ "$STATE" == "failed" ]; then
    echo "Import $STATE"
    break
  fi

  sleep 5
done
```

## Export Process

### Basic Export

```bash
$ cakemail contacts export 123
```

### Export with Filters

```bash
# Export only subscribed
$ cakemail contacts export 123 --filter "status==subscribed"

# Export premium users
$ cakemail contacts export 123 --filter "custom_attributes.plan==premium"

# Export recent signups
$ cakemail contacts export 123 --filter "custom_attributes.signup_date>=2024-03-01"
```

### Check Export Status

```bash
$ cakemail contacts export-status exp_xyz789
```

**Output:**
```json
{
  "id": "exp_xyz789",
  "status": "completed",
  "total_contacts": 1247,
  "file_size": "125 KB",
  "started_at": "2024-03-15T10:35:00Z",
  "completed_at": "2024-03-15T10:35:45Z",
  "expires_at": "2024-03-22T10:35:45Z"
}
```

### Download Export

```bash
$ cakemail contacts export-download exp_xyz789 > contacts.csv
```

**Output:**
```
✓ Downloaded 1,247 contacts to contacts.csv
```

### View Export History

```bash
$ cakemail contacts export-list 123
```

**Output:**
```
┌──────────────┬─────────────────────┬──────────┬──────────┬───────────┐
│ Export ID    │ Created             │ Status   │ Contacts │ File Size │
├──────────────┼─────────────────────┼──────────┼──────────┼───────────┤
│ exp_xyz789   │ 2024-03-15 10:35:00 │ complete │ 1,247    │ 125 KB    │
│ exp_abc123   │ 2024-03-10 14:45:00 │ complete │ 856      │ 89 KB     │
│ exp_def456   │ 2024-03-05 09:30:00 │ expired  │ 2,341    │ -         │
└──────────────┴─────────────────────┴──────────┴──────────┴───────────┘
```

### Automated Export

```bash
#!/bin/bash
# export-and-download.sh

LIST_ID=$1

if [ -z "$LIST_ID" ]; then
  echo "Usage: $0 <list-id>"
  exit 1
fi

echo "=== Exporting List $LIST_ID ==="
echo ""

# Start export
EXPORT=$(cakemail contacts export $LIST_ID -f json)
EXPORT_ID=$(echo "$EXPORT" | jq -r '.id')

echo "Export started: $EXPORT_ID"
echo "Waiting for completion..."
echo ""

# Wait for completion
while true; do
  STATUS=$(cakemail contacts export-status $EXPORT_ID -f json)
  STATE=$(echo "$STATUS" | jq -r '.status')

  if [ "$STATE" == "completed" ]; then
    break
  elif [ "$STATE" == "failed" ]; then
    echo "❌ Export failed"
    exit 1
  fi

  sleep 2
done

# Download
FILENAME="contacts-$LIST_ID-$(date +%Y%m%d).csv"
cakemail contacts export-download $EXPORT_ID > "$FILENAME"

echo "✓ Downloaded to: $FILENAME"

# Show stats
ROWS=$(wc -l < "$FILENAME")
ROWS=$((ROWS - 1))  # Exclude header
echo "  Total contacts: $ROWS"
```

## Import/Export Workflows

### Workflow 1: Regular Backup

```bash
#!/bin/bash
# backup-contacts.sh

BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

echo "=== Contact Backup ==="
echo ""

# Get all lists
LISTS=$(cakemail lists list -f json | jq -r '.data[] | "\(.id):\(.name)"')

for LIST in $LISTS; do
  LIST_ID=$(echo "$LIST" | cut -d: -f1)
  LIST_NAME=$(echo "$LIST" | cut -d: -f2-)

  echo "Backing up: $LIST_NAME (ID: $LIST_ID)"

  # Start export
  EXPORT_ID=$(cakemail contacts export $LIST_ID -f json | jq -r '.id')

  # Wait for completion
  while true; do
    STATUS=$(cakemail contacts export-status $EXPORT_ID -f json | jq -r '.status')
    if [ "$STATUS" == "completed" ]; then
      break
    fi
    sleep 2
  done

  # Download
  FILENAME="$BACKUP_DIR/list-$LIST_ID-$(date +%Y%m%d-%H%M%S).csv"
  cakemail contacts export-download $EXPORT_ID > "$FILENAME"

  echo "  ✓ Saved to: $FILENAME"
done

echo ""
echo "✓ Backup complete"

# Compress backups older than 7 days
find "$BACKUP_DIR" -name "*.csv" -mtime +7 -exec gzip {} \;
```

**Schedule with cron:**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-contacts.sh >> /var/log/contact-backup.log 2>&1
```

### Workflow 2: Data Migration Between Lists

```bash
#!/bin/bash
# migrate-contacts.sh

SOURCE_LIST=$1
TARGET_LIST=$2

if [ -z "$SOURCE_LIST" ] || [ -z "$TARGET_LIST" ]; then
  echo "Usage: $0 <source-list-id> <target-list-id>"
  exit 1
fi

echo "=== Migrating Contacts ==="
echo "From: List $SOURCE_LIST"
echo "To: List $TARGET_LIST"
echo ""

# Export from source
echo "Exporting from source list..."
EXPORT_ID=$(cakemail contacts export $SOURCE_LIST -f json | jq -r '.id')

# Wait for export
while true; do
  STATUS=$(cakemail contacts export-status $EXPORT_ID -f json | jq -r '.status')
  [ "$STATUS" == "completed" ] && break
  sleep 2
done

# Download
TEMP_FILE="temp-migration-$(date +%s).csv"
cakemail contacts export-download $EXPORT_ID > "$TEMP_FILE"

CONTACT_COUNT=$(wc -l < "$TEMP_FILE")
CONTACT_COUNT=$((CONTACT_COUNT - 1))

echo "✓ Exported $CONTACT_COUNT contacts"
echo ""

# Import to target
echo "Importing to target list..."
IMPORT_ID=$(cakemail contacts import $TARGET_LIST --file "$TEMP_FILE" -f json | jq -r '.id')

# Monitor import
while true; do
  STATUS=$(cakemail contacts import-status $IMPORT_ID -f json)
  STATE=$(echo "$STATUS" | jq -r '.status')

  if [ "$STATE" == "completed" ]; then
    IMPORTED=$(echo "$STATUS" | jq -r '.imported')
    FAILED=$(echo "$STATUS" | jq -r '.failed')

    echo "✓ Import complete"
    echo "  Imported: $IMPORTED"
    echo "  Failed: $FAILED"
    break
  elif [ "$STATE" == "failed" ]; then
    echo "❌ Import failed"
    break
  fi

  sleep 2
done

# Cleanup
rm "$TEMP_FILE"

echo ""
echo "✓ Migration complete"
```

### Workflow 3: Data Transformation

```bash
#!/bin/bash
# transform-and-import.sh

SOURCE_FILE=$1
LIST_ID=$2

if [ -z "$SOURCE_FILE" ] || [ -z "$LIST_ID" ]; then
  echo "Usage: $0 <source-file> <list-id>"
  exit 1
fi

echo "=== Transforming Data ==="
echo ""

TRANSFORMED_FILE="transformed-$(date +%s).csv"

# Write header
echo "email,first_name,last_name,plan,signup_date" > "$TRANSFORMED_FILE"

# Transform data (example: clean and normalize)
tail -n +2 "$SOURCE_FILE" | while IFS=, read email fname lname plan date; do
  # Clean email (lowercase, trim)
  email=$(echo "$email" | tr '[:upper:]' '[:lower:]' | xargs)

  # Capitalize names
  fname=$(echo "$fname" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
  lname=$(echo "$lname" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

  # Validate email format
  if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "$email,$fname,$lname,$plan,$date" >> "$TRANSFORMED_FILE"
  else
    echo "⚠️  Skipped invalid email: $email" >&2
  fi
done

echo "✓ Transformation complete"
echo ""

# Import transformed data
echo "Importing transformed data..."
cakemail contacts import $LIST_ID --file "$TRANSFORMED_FILE"

echo ""
echo "✓ Import started"
echo "  Transformed file: $TRANSFORMED_FILE"
```

### Workflow 4: Deduplicate During Import

```bash
#!/bin/bash
# deduplicate-import.sh

SOURCE_FILE=$1
LIST_ID=$2

if [ -z "$SOURCE_FILE" ] || [ -z "$LIST_ID" ]; then
  echo "Usage: $0 <csv-file> <list-id>"
  exit 1
fi

echo "=== Deduplicating Import ==="
echo ""

# Get existing emails from list
echo "Fetching existing contacts..."
EXPORT_ID=$(cakemail contacts export $LIST_ID -f json | jq -r '.id')

while true; do
  STATUS=$(cakemail contacts export-status $EXPORT_ID -f json | jq -r '.status')
  [ "$STATUS" == "completed" ] && break
  sleep 2
done

EXISTING_FILE="existing-$(date +%s).csv"
cakemail contacts export-download $EXPORT_ID > "$EXISTING_FILE"

# Extract existing emails
cut -d',' -f1 "$EXISTING_FILE" | tail -n +2 | sort > existing_emails.txt

EXISTING_COUNT=$(wc -l < existing_emails.txt)
echo "  Found $EXISTING_COUNT existing contacts"
echo ""

# Filter new contacts
DEDUPED_FILE="deduped-$(date +%s).csv"
head -1 "$SOURCE_FILE" > "$DEDUPED_FILE"

IMPORTED=0
SKIPPED=0

tail -n +2 "$SOURCE_FILE" | while IFS=, read email rest; do
  # Check if email exists
  if ! grep -qx "$email" existing_emails.txt; then
    echo "$email,$rest" >> "$DEDUPED_FILE"
    IMPORTED=$((IMPORTED + 1))
  else
    SKIPPED=$((SKIPPED + 1))
  fi
done

echo "Deduplication results:"
echo "  New contacts: $IMPORTED"
echo "  Duplicates skipped: $SKIPPED"
echo ""

# Import deduplicated file
if [ $IMPORTED -gt 0 ]; then
  echo "Importing new contacts..."
  cakemail contacts import $LIST_ID --file "$DEDUPED_FILE"
  echo "✓ Import started"
else
  echo "No new contacts to import"
fi

# Cleanup
rm existing_emails.txt "$EXISTING_FILE"
```

### Workflow 5: Split Import for Large Files

```bash
#!/bin/bash
# split-import.sh

LARGE_FILE=$1
LIST_ID=$2
CHUNK_SIZE=5000

if [ -z "$LARGE_FILE" ] || [ -z "$LIST_ID" ]; then
  echo "Usage: $0 <large-csv-file> <list-id>"
  exit 1
fi

echo "=== Split Import ==="
echo "File: $LARGE_FILE"
echo "Chunk size: $CHUNK_SIZE"
echo ""

# Count total rows
TOTAL_ROWS=$(wc -l < "$LARGE_FILE")
TOTAL_ROWS=$((TOTAL_ROWS - 1))  # Exclude header

echo "Total contacts: $TOTAL_ROWS"
echo ""

# Get header
HEADER=$(head -1 "$LARGE_FILE")

# Split file
CHUNKS=$((TOTAL_ROWS / CHUNK_SIZE + 1))
echo "Splitting into $CHUNKS chunks..."

tail -n +2 "$LARGE_FILE" | split -l $CHUNK_SIZE - chunk_

# Add header to each chunk
for chunk in chunk_*; do
  echo "$HEADER" | cat - "$chunk" > temp
  mv temp "$chunk.csv"
  rm "$chunk"
done

echo "✓ File split complete"
echo ""

# Import each chunk
CHUNK_NUM=1
for chunk in chunk_*.csv; do
  echo "Importing chunk $CHUNK_NUM/$CHUNKS..."

  IMPORT_ID=$(cakemail contacts import $LIST_ID --file "$chunk" -f json | jq -r '.id')

  # Wait for completion
  while true; do
    STATUS=$(cakemail contacts import-status $IMPORT_ID -f json | jq -r '.status')
    [ "$STATUS" == "completed" ] && break
    sleep 5
  done

  echo "  ✓ Chunk $CHUNK_NUM complete"
  rm "$chunk"

  CHUNK_NUM=$((CHUNK_NUM + 1))
done

echo ""
echo "✓ All chunks imported"
```

## Data Quality

### Validate CSV Before Import

```bash
#!/bin/bash
# validate-csv.sh

CSV_FILE=$1

if [ -z "$CSV_FILE" ]; then
  echo "Usage: $0 <csv-file>"
  exit 1
fi

echo "=== CSV Validation ==="
echo "File: $CSV_FILE"
echo ""

# Check file exists
if [ ! -f "$CSV_FILE" ]; then
  echo "❌ File not found"
  exit 1
fi

# Check encoding
ENCODING=$(file -b --mime-encoding "$CSV_FILE")
echo "Encoding: $ENCODING"
if [ "$ENCODING" != "utf-8" ] && [ "$ENCODING" != "us-ascii" ]; then
  echo "⚠️  Warning: File should be UTF-8 encoded"
fi

# Check header
HEADER=$(head -1 "$CSV_FILE")
echo "Header: $HEADER"

if [[ ! "$HEADER" =~ "email" ]]; then
  echo "❌ Missing required 'email' column"
  exit 1
fi

# Count rows
TOTAL_ROWS=$(wc -l < "$CSV_FILE")
DATA_ROWS=$((TOTAL_ROWS - 1))
echo "Data rows: $DATA_ROWS"

# Check for empty emails
EMPTY_EMAILS=$(awk -F',' 'NR>1 && $1==""' "$CSV_FILE" | wc -l)
if [ $EMPTY_EMAILS -gt 0 ]; then
  echo "⚠️  Warning: $EMPTY_EMAILS rows with empty email"
fi

# Validate email format (sample)
echo ""
echo "Validating email format (first 10)..."
awk -F',' 'NR>1 && NR<=11 {print $1}' "$CSV_FILE" | while read email; do
  if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "  ❌ Invalid: $email"
  else
    echo "  ✓ Valid: $email"
  fi
done

echo ""
echo "✓ Validation complete"
```

### Clean CSV Data

```bash
#!/bin/bash
# clean-csv.sh

INPUT_FILE=$1
OUTPUT_FILE="cleaned-$(basename $INPUT_FILE)"

if [ -z "$INPUT_FILE" ]; then
  echo "Usage: $0 <input-csv>"
  exit 1
fi

echo "=== Cleaning CSV ==="
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"
echo ""

# Get header
HEADER=$(head -1 "$INPUT_FILE")
echo "$HEADER" > "$OUTPUT_FILE"

CLEANED=0
INVALID=0

# Process each row
tail -n +2 "$INPUT_FILE" | while IFS=, read email fname lname rest; do
  # Trim whitespace
  email=$(echo "$email" | xargs)
  fname=$(echo "$fname" | xargs)
  lname=$(echo "$lname" | xargs)

  # Lowercase email
  email=$(echo "$email" | tr '[:upper:]' '[:lower:]')

  # Validate email
  if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "$email,$fname,$lname,$rest" >> "$OUTPUT_FILE"
    CLEANED=$((CLEANED + 1))
  else
    INVALID=$((INVALID + 1))
    echo "Invalid: $email" >> "invalid-emails.txt"
  fi
done

echo "✓ Cleaning complete"
echo "  Cleaned: $CLEANED"
echo "  Invalid: $INVALID"
echo ""
echo "Output: $OUTPUT_FILE"
[ $INVALID -gt 0 ] && echo "Invalid emails: invalid-emails.txt"
```

## Error Handling

### Handle Import Errors

```bash
#!/bin/bash
# handle-import-errors.sh

IMPORT_ID=$1

if [ -z "$IMPORT_ID" ]; then
  echo "Usage: $0 <import-id>"
  exit 1
fi

echo "=== Import Error Analysis ==="
echo ""

# Get import status
STATUS=$(cakemail contacts import-status $IMPORT_ID -f json)

TOTAL=$(echo "$STATUS" | jq -r '.total_rows')
IMPORTED=$(echo "$STATUS" | jq -r '.imported')
FAILED=$(echo "$STATUS" | jq -r '.failed')

echo "Total: $TOTAL"
echo "Imported: $IMPORTED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
  echo "=== Errors ==="
  echo "$STATUS" | jq -r '.errors[] | "Row \(.row): \(.email) - \(.error)"'

  echo ""
  echo "Common fixes:"
  echo "  • Invalid email: Check email format"
  echo "  • Duplicate email: Contact already exists"
  echo "  • Invalid custom attribute: Ensure attribute exists"
  echo "  • Missing required field: Add email column"
fi
```

### Retry Failed Imports

```bash
#!/bin/bash
# retry-failed.sh

LIST_ID=$1
IMPORT_ID=$2

if [ -z "$LIST_ID" ] || [ -z "$IMPORT_ID" ]; then
  echo "Usage: $0 <list-id> <failed-import-id>"
  exit 1
fi

echo "=== Retrying Failed Import ==="
echo ""

# Get failed rows
STATUS=$(cakemail contacts import-status $IMPORT_ID -f json)
ERRORS=$(echo "$STATUS" | jq -r '.errors[] | "\(.row),\(.email)"')

if [ -z "$ERRORS" ]; then
  echo "No errors found"
  exit 0
fi

echo "Found $(echo "$ERRORS" | wc -l) failed rows"
echo "Manual review required for each"
echo ""

# Process each failed row
echo "$ERRORS" | while IFS=, read row email; do
  echo "Failed: Row $row, Email $email"
  read -p "Fix and retry? (yes/skip): " ACTION

  if [ "$ACTION" == "yes" ]; then
    read -p "Corrected email: " CORRECTED_EMAIL
    read -p "First name: " FIRST_NAME
    read -p "Last name: " LAST_NAME

    # Try adding corrected contact
    cakemail contacts add $LIST_ID \
      -e "$CORRECTED_EMAIL" \
      -f "$FIRST_NAME" \
      -l "$LAST_NAME"

    echo "✓ Retried"
  fi

  echo ""
done

echo "✓ Retry complete"
```

## Best Practices

### 1. Validate Before Importing

```bash
# Always validate CSV first
$ ./validate-csv.sh contacts.csv

# Fix issues
$ ./clean-csv.sh contacts.csv

# Then import
$ cakemail contacts import 123 --file cleaned-contacts.csv
```

### 2. Test with Small Sample

```bash
# Create test file with first 10 rows
$ head -11 large-file.csv > test-sample.csv

# Test import
$ cakemail contacts import 123 --file test-sample.csv

# Check for errors
$ cakemail contacts import-status <import-id>

# If successful, import full file
$ cakemail contacts import 123 --file large-file.csv
```

### 3. Regular Backups

```bash
# Weekly backup
0 0 * * 0 /path/to/backup-contacts.sh

# Keep 4 weeks of backups
find /backups -name "*.csv.gz" -mtime +28 -delete
```

### 4. Monitor Long Imports

```bash
# Large imports can take time
# Use monitoring script
$ ./monitor-import.sh imp_abc123

# Or schedule notification
$ cakemail contacts import 123 --file large.csv && \
  echo "Import complete" | mail -s "Import Done" admin@company.com
```

### 5. Handle Duplicates Proactively

```bash
# Use deduplication workflow
$ ./deduplicate-import.sh new-contacts.csv 123

# Or merge with existing
# Export, merge externally, then import to new list
```

## Troubleshooting

### Import Stuck in "Processing"

**Problem:** Import status stays "processing" for long time

**Solutions:**
```bash
# Large files take time (allow 1 minute per 1000 contacts)

# Check status periodically
$ cakemail contacts import-status imp_abc123

# If truly stuck (> 30 mins for < 10k contacts):
# - Contact support
# - Try splitting file into smaller chunks
```

### Export Download Fails

**Problem:** Cannot download export

**Solutions:**
```bash
# Check export status first
$ cakemail contacts export-status exp_xyz789

# Ensure export completed
# Wait if status is "processing"

# Check if expired
# Exports expire after 7 days
# Create new export if expired

$ cakemail contacts export 123
```

### CSV Encoding Issues

**Problem:** Special characters appear incorrectly

**Solutions:**
```bash
# Convert to UTF-8
$ iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv

# Or use spreadsheet software:
# - Open CSV
# - Save As > Format: CSV UTF-8

# Then import
$ cakemail contacts import 123 --file output.csv
```

### Large File Import Fails

**Problem:** Import fails for very large files

**Solutions:**
```bash
# Split into smaller chunks
$ ./split-import.sh huge-file.csv 123

# Or compress and optimize
# Remove unnecessary columns
# Deduplicate before importing
```

## Best Practices Summary

1. **Validate first** - Check CSV format before importing
2. **Test with samples** - Import small batch first
3. **Clean data** - Remove duplicates and invalid emails
4. **Use UTF-8** - Ensure proper encoding
5. **Monitor progress** - Watch long-running imports
6. **Handle errors** - Review and fix failed rows
7. **Backup regularly** - Export contacts periodically
8. **Split large files** - Break into manageable chunks
9. **Document transformations** - Keep scripts for repeatable processes
10. **Schedule backups** - Automate with cron

