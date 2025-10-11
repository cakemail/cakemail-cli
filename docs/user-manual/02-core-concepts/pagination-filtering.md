# Pagination & Filtering

Master list operations with pagination, filtering, sorting, and search to efficiently work with large datasets.

## Overview

Most Cakemail CLI list commands support:

- **Pagination** - Retrieve results in manageable chunks
- **Filtering** - Narrow results based on criteria
- **Sorting** - Order results by specific fields
- **Search** - Find specific items by keyword

These features help you work efficiently with large lists of campaigns, contacts, templates, and other resources.

---

## Pagination

### What is Pagination?

Pagination splits large result sets into smaller "pages" of results. Instead of retrieving 10,000 campaigns at once, you retrieve 50 at a time.

### Why Use Pagination?

- **Performance**: Faster response times
- **Memory**: Lower memory usage
- **Usability**: Easier to read and process results
- **API limits**: Respects rate limits

### Pagination Options

#### `--limit` (or `-l`)

Specify how many results per page (default varies by resource, typically 50-100).

```bash
# Get 10 campaigns
cakemail campaigns list --limit 10

# Get 100 contacts
cakemail contacts list 123 --limit 100

# Get 25 templates
cakemail templates list --limit 25
```

#### `--page` (or `-p`)

Specify which page of results to retrieve (1-indexed).

```bash
# Get first page (default)
cakemail campaigns list --page 1

# Get second page
cakemail campaigns list --page 2

# Get third page with custom limit
cakemail campaigns list --limit 25 --page 3
```

### Pagination Metadata

List responses include pagination information:

```json
{
  "data": [...],
  "count": 25,        // Number of items in this response
  "total": 247,       // Total items available
  "page": 1,          // Current page
  "per_page": 25      // Items per page
}
```

**Calculate total pages:**
```bash
# total_pages = ceiling(total / per_page)
# 247 total / 25 per_page = 10 pages
```

### Pagination Examples

**Example 1: Browse Pages Interactively**

```bash
# Page 1
cakemail -f table campaigns list --limit 20 --page 1

# Page 2
cakemail -f table campaigns list --limit 20 --page 2

# Page 3
cakemail -f table campaigns list --limit 20 --page 3
```

**Example 2: Retrieve All Results (Scripting)**

```bash
#!/bin/bash
# Get all campaigns across all pages

PAGE=1
LIMIT=100

while true; do
  RESPONSE=$(cakemail -f json campaigns list --limit $LIMIT --page $PAGE)

  # Extract data
  DATA=$(echo "$RESPONSE" | jq '.data')

  # Break if no more data
  if [ "$(echo "$DATA" | jq 'length')" -eq 0 ]; then
    break
  fi

  # Process data
  echo "$DATA" | jq -r '.[] | "\(.id) - \(.name)"'

  # Next page
  PAGE=$((PAGE + 1))
done
```

**Example 3: Get Total Count**

```bash
# Just get the count without retrieving all data
cakemail -f json campaigns list --limit 1 | jq '.total'
```

---

## Filtering

### What is Filtering?

Filtering allows you to retrieve only items that match specific criteria, like campaigns with status "delivered" or contacts subscribed after a certain date.

### Filter Syntax

Filters use a simple query language:

```
field==value           # Equals
field!=value           # Not equals
field>value            # Greater than
field<value            # Less than
field>=value           # Greater than or equal
field<=value           # Less than or equal
```

**Multiple filters** are separated by `;` (AND logic):

```
field1==value1;field2==value2
```

### Filter Examples

**Example 1: Filter Campaigns by Status**

```bash
# Only delivered campaigns
cakemail campaigns list --filter "status==delivered"

# Only scheduled campaigns
cakemail campaigns list --filter "status==scheduled"

# Only draft campaigns
cakemail campaigns list --filter "status==draft"
```

**Example 2: Filter Contacts by Status**

```bash
# Only active contacts
cakemail contacts list 123 --filter "status==active"

# Only unsubscribed contacts
cakemail contacts list 123 --filter "status==unsubscribed"
```

**Example 3: Filter by Name**

```bash
# Campaigns with "Newsletter" in name
cakemail campaigns list --filter "name==Newsletter"

# Lists with specific name
cakemail lists list --filter "name==Subscribers"
```

**Example 4: Multiple Filters (AND)**

```bash
# Delivered campaigns named "Newsletter"
cakemail campaigns list --filter "status==delivered;name==Newsletter"

# Active confirmed senders
cakemail senders list --filter "confirmed==true"
```

**Example 5: Filter by Date**

```bash
# Campaigns created after a date
cakemail campaigns list --filter "created_on>=2024-01-01"

# Contacts subscribed before a date
cakemail contacts list 123 --filter "subscribed_on<2024-06-01"
```

### Filterable Fields by Resource

**Campaigns:**
- `status` - draft, scheduled, sending, delivered, suspended, cancelled
- `name` - Campaign name
- `created_on` - Creation date
- `scheduled_for` - Scheduled date

**Contacts:**
- `status` - active, unsubscribed, bounced
- `email` - Email address
- `subscribed_on` - Subscription date

**Lists:**
- `status` - active, archived
- `name` - List name
- `created_on` - Creation date

**Templates:**
- `name` - Template name
- `created_on` - Creation date

**Senders:**
- `confirmed` - true/false
- `email` - Email address
- `name` - Sender name

---

## Sorting

### What is Sorting?

Sorting allows you to order results by a specific field in ascending or descending order.

### Sort Syntax

```
+field    # Ascending order
-field    # Descending order
```

### Sort Examples

**Example 1: Sort Campaigns**

```bash
# Sort by name (A-Z)
cakemail campaigns list --sort "+name"

# Sort by name (Z-A)
cakemail campaigns list --sort "-name"

# Sort by creation date (oldest first)
cakemail campaigns list --sort "+created_on"

# Sort by creation date (newest first)
cakemail campaigns list --sort "-created_on"

# Sort by scheduled date (soonest first)
cakemail campaigns list --sort "+scheduled_for"
```

**Example 2: Sort Contacts**

```bash
# Sort by email (A-Z)
cakemail contacts list 123 --sort "+email"

# Sort by subscription date (newest first)
cakemail contacts list 123 --sort "-subscribed_on"

# Sort by status
cakemail contacts list 123 --sort "+status"
```

**Example 3: Sort Lists**

```bash
# Sort by name (A-Z)
cakemail lists list --sort "+name"

# Sort by creation date (newest first)
cakemail lists list --sort "-created_on"
```

**Example 4: Sort Senders**

```bash
# Sort by email (A-Z)
cakemail senders list --sort "+email"

# Sort by name
cakemail senders list --sort "+name"

# Sort by confirmation status
cakemail senders list --sort "-confirmed"
```

### Sortable Fields by Resource

**Campaigns:**
- `name` - Campaign name
- `created_on` - Creation date
- `scheduled_for` - Scheduled date
- `status` - Status

**Contacts:**
- `email` - Email address
- `subscribed_on` - Subscription date
- `status` - Status

**Lists:**
- `name` - List name
- `created_on` - Creation date

**Templates:**
- `name` - Template name
- `created_on` - Creation date

**Senders:**
- `name` - Sender name
- `email` - Email address
- `confirmed` - Confirmation status

---

## Search

### What is Search?

Some list commands support keyword search using the `--query` (or `-q`) option. This searches across multiple fields.

### Search Examples

**Example 1: Search Contacts**

```bash
# Search contacts by email or name
cakemail contacts list 123 --query "john"

# Will match:
# - john@example.com
# - John Doe
# - johnny@example.com
```

**Example 2: Paginated Search**

```bash
# Search with pagination
cakemail contacts list 123 --query "example.com" --limit 50 --page 1
```

### Searchable Resources

Currently, these resources support `--query`:

- **Contacts** - Searches email, first name, last name

**Note**: Most other resources use `--filter` for specific field matching instead of full-text search.

---

## Combining Options

### Pagination + Filtering

```bash
# First 20 delivered campaigns
cakemail campaigns list --filter "status==delivered" --limit 20 --page 1

# Next 20 delivered campaigns
cakemail campaigns list --filter "status==delivered" --limit 20 --page 2
```

### Pagination + Sorting

```bash
# 50 newest campaigns
cakemail campaigns list --sort "-created_on" --limit 50

# Next 50
cakemail campaigns list --sort "-created_on" --limit 50 --page 2
```

### Filtering + Sorting

```bash
# Delivered campaigns, newest first
cakemail campaigns list --filter "status==delivered" --sort "-created_on"

# Active contacts, sorted by email
cakemail contacts list 123 --filter "status==active" --sort "+email"
```

### All Together

```bash
# 25 delivered campaigns named "Newsletter", newest first
cakemail campaigns list \
  --filter "status==delivered;name==Newsletter" \
  --sort "-created_on" \
  --limit 25 \
  --page 1
```

---

## Practical Examples

### Example 1: Find Recent Campaigns

```bash
# Last 10 campaigns
cakemail -f table campaigns list --sort "-created_on" --limit 10
```

### Example 2: Count Active Contacts

```bash
# Get total active contacts
cakemail -f json contacts list 123 --filter "status==active" --limit 1 | jq '.total'
```

### Example 3: Export Delivered Campaigns

```bash
#!/bin/bash
# Export all delivered campaign IDs

OUTPUT_FILE="delivered_campaigns.txt"

cakemail -f json campaigns list --filter "status==delivered" --limit 1000 \
  | jq -r '.data[].id' > "$OUTPUT_FILE"

echo "Exported to $OUTPUT_FILE"
```

### Example 4: List Unconfirmed Senders

```bash
# Show senders needing confirmation
cakemail -f table senders list --filter "confirmed==false"
```

### Example 5: Find Contacts by Domain

```bash
# All contacts from example.com
cakemail contacts list 123 --query "@example.com"
```

### Example 6: Monthly Campaign Review

```bash
# Campaigns created this month, sorted by date
cakemail campaigns list \
  --filter "created_on>=2024-06-01;created_on<2024-07-01" \
  --sort "+created_on"
```

---

## Output Format Recommendations

### For Browsing

Use **table** or **compact** format:

```bash
cakemail -f table campaigns list --limit 20
cakemail -f compact campaigns list --limit 50
```

### For Scripting

Use **JSON** format:

```bash
cakemail -f json campaigns list --filter "status==delivered" | jq '.data'
```

### For Quick Counts

Use **JSON** with limit 1:

```bash
cakemail -f json campaigns list --limit 1 | jq '.total'
```

---

## Performance Tips

### 1. Use Appropriate Limits

```bash
# ✅ Good: Reasonable page size
cakemail campaigns list --limit 50

# ❌ Avoid: Very large limits
cakemail campaigns list --limit 10000
```

### 2. Filter Before Sorting

```bash
# ✅ Efficient: Filter narrows results first
cakemail campaigns list --filter "status==delivered" --sort "-created_on"
```

### 3. Use Pagination for Large Sets

```bash
# ✅ Process in chunks
for PAGE in {1..10}; do
  cakemail campaigns list --limit 100 --page $PAGE
done

# ❌ Avoid: Retrieving everything at once
cakemail campaigns list --limit 100000
```

### 4. Minimize Data Transfer

```bash
# ✅ Get only what you need with filtering
cakemail campaigns list --filter "status==delivered"

# ❌ Retrieve all and filter locally
cakemail campaigns list | grep delivered
```

---

## Troubleshooting

### No Results Returned

**Check:**
1. Filter criteria might be too restrictive
2. Try removing filters one by one
3. Verify field names are correct

```bash
# Debug: Remove filters to see all results
cakemail campaigns list

# Then add filters back one at a time
cakemail campaigns list --filter "status==delivered"
```

### "Invalid filter" Error

**Cause:** Filter syntax is incorrect

**Solutions:**
1. Check for typos in field names
2. Ensure proper operators (`==`, `!=`, `>`, etc.)
3. Use semicolons for multiple filters: `field1==value1;field2==value2`

```bash
# ❌ Wrong
cakemail campaigns list --filter "status=delivered"

# ✅ Correct
cakemail campaigns list --filter "status==delivered"
```

### Pagination Shows Wrong Total

**Cause:** Filters affect the total count

**Explanation:** `total` reflects the filtered result count, not the overall total.

```bash
# Total of all campaigns
cakemail -f json campaigns list | jq '.total'

# Total of delivered campaigns only
cakemail -f json campaigns list --filter "status==delivered" | jq '.total'
```

---

## Next Steps

- [Error Handling](./error-handling.md) - Understanding API errors
- [Command Reference](../09-command-reference/README.md) - Complete command documentation
- [Advanced Usage: JSON Piping](../08-advanced-usage/json-piping.md) - Process results with jq
