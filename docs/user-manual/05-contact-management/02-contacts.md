# Managing Contacts

Master individual contact management including adding, updating, searching, and tracking contact data.

## Overview

Contact management allows you to:
- Add individual contacts to lists
- Update contact information
- Track custom attributes and preferences
- Search and filter contacts
- View contact engagement history
- Manage subscription status
- Delete contacts when needed

Every contact belongs to at least one list and can have standard fields (email, name) plus custom attributes for your specific data needs.

## Quick Start

### Add Your First Contact

```bash
$ cakemail contacts add 123 -e "john@example.com" -f "John" -l "Doe"
```

**Output:**
```
✓ Contact added successfully

ID: 501
Email: john@example.com
Name: John Doe
Status: subscribed
List: 123
```

### View Contact Details

```bash
$ cakemail contacts get 123 501
```

**Output:**
```json
{
  "id": 501,
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "status": "subscribed",
  "subscribed_on": "2024-03-15T10:30:00Z",
  "last_bounce": null,
  "bounces_count": 0,
  "custom_attributes": {}
}
```

## Contact Management Basics

### Add Contact

**Simple contact:**
```bash
$ cakemail contacts add 123 -e "jane@example.com"
```

**With name:**
```bash
$ cakemail contacts add 123 \
  -e "jane@example.com" \
  -f "Jane" \
  -l "Smith"
```

**With custom attributes:**
```bash
$ cakemail contacts add 123 \
  -e "jane@example.com" \
  -f "Jane" \
  -l "Smith" \
  -d '{"plan":"premium","signup_date":"2024-03-15","is_vip":true}'
```

**Auto-detect list:**
```bash
# If you have only one list, list ID is optional
$ cakemail contacts add -e "new@example.com" -f "New" -l "User"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Contact added successfully
```

### View Contact

```bash
$ cakemail contacts get 123 501
```

**Extract specific fields:**
```bash
$ cakemail contacts get 123 501 -f json | jq '{email, status, custom_attributes}'
```

**Output:**
```json
{
  "email": "john@example.com",
  "status": "subscribed",
  "custom_attributes": {
    "plan": "premium",
    "signup_date": "2024-03-15",
    "is_vip": true
  }
}
```

### Update Contact

**Update name:**
```bash
$ cakemail contacts update 123 501 -f "Jonathan" -l "Doe"
```

**Update email:**
```bash
$ cakemail contacts update 123 501 -e "newemail@example.com"
```

**Update custom attributes:**
```bash
$ cakemail contacts update 123 501 -d '{"plan":"enterprise","is_vip":true}'
```

**Update multiple fields:**
```bash
$ cakemail contacts update 123 501 \
  -f "Jonathan" \
  -l "Doe" \
  -e "j.doe@example.com" \
  -d '{"plan":"enterprise","lifetime_value":599.99}'
```

### Delete Contact

```bash
$ cakemail contacts delete 123 501
```

**Output:**
```
⚠ Delete contact 501?

The following will happen:
  • Contact will be permanently deleted
  • All engagement history lost
  • Cannot be recovered

Type 'yes' to confirm: yes

✓ Contact 501 deleted
```

**Force delete (skip confirmation):**
```bash
$ cakemail contacts delete 123 501 --force
```

## Searching Contacts

### List All Contacts

```bash
$ cakemail contacts list 123
```

**Output:**
```
┌──────┬────────────────────────┬───────────────┬────────────┬─────────────────────┐
│ ID   │ Email                  │ Name          │ Status     │ Subscribed          │
├──────┼────────────────────────┼───────────────┼────────────┼─────────────────────┤
│ 501  │ john@example.com       │ John Doe      │ subscribed │ 2024-01-15 10:30:00 │
│ 502  │ jane@example.com       │ Jane Smith    │ subscribed │ 2024-01-16 14:20:00 │
│ 503  │ bob@example.com        │ Bob Johnson   │ subscribed │ 2024-01-17 09:15:00 │
└──────┴────────────────────────┴───────────────┴────────────┴─────────────────────┘

Total: 3 contacts
```

### Search by Email

```bash
$ cakemail contacts list 123 --filter "email==john@example.com"
```

### Search by Status

```bash
# Only subscribed
$ cakemail contacts list 123 --filter "status==subscribed"

# Unsubscribed contacts
$ cakemail contacts list 123 --filter "status==unsubscribed"

# Bounced contacts
$ cakemail contacts list 123 --filter "status==bounced"
```

### Search by Name

```bash
$ cakemail contacts list 123 --filter "first_name==John"
$ cakemail contacts list 123 --filter "last_name==Doe"
```

### Search by Custom Attributes

```bash
# Premium plan users
$ cakemail contacts list 123 --filter "custom_attributes.plan==premium"

# VIP contacts
$ cakemail contacts list 123 --filter "custom_attributes.is_vip==true"

# Recent signups
$ cakemail contacts list 123 --filter "custom_attributes.signup_date>=2024-03-01"
```

### Combine Filters

```bash
# Premium VIP subscribers
$ cakemail contacts list 123 --filter "status==subscribed;custom_attributes.plan==premium;custom_attributes.is_vip==true"
```

### Pagination

```bash
# First 100 contacts
$ cakemail contacts list 123 --limit 100

# Next 100 (page 2)
$ cakemail contacts list 123 --limit 100 --page 2

# Large list pagination
$ cakemail contacts list 123 --limit 500 --page 5
```

### Sort Results

```bash
# Sort by email
$ cakemail contacts list 123 --sort "+email"

# Sort by subscription date (newest first)
$ cakemail contacts list 123 --sort "-subscribed_on"

# Sort by name
$ cakemail contacts list 123 --sort "+first_name,+last_name"
```

## Working with Custom Attributes

### View Contact Attributes

```bash
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes'
```

**Output:**
```json
{
  "plan": "premium",
  "signup_date": "2024-03-15",
  "lifetime_value": 299.99,
  "is_vip": true,
  "purchase_count": 5
}
```

### Add Attributes to Existing Contact

```bash
$ cakemail contacts update 123 501 -d '{"company":"Acme Corp","industry":"Technology"}'
```

### Update Single Attribute

```bash
# Upgrade plan
$ cakemail contacts update 123 501 -d '{"plan":"enterprise"}'

# Increment purchase count (requires fetching first)
CURRENT=$(cakemail contacts get 123 501 -f json | jq -r '.custom_attributes.purchase_count')
NEW=$((CURRENT + 1))
cakemail contacts update 123 501 -d "{\"purchase_count\":$NEW}"
```

### Remove Attribute

```bash
# Set to null to remove
$ cakemail contacts update 123 501 -d '{"old_field":null}'
```

## Contact Workflows

### Workflow 1: Add Contact with Complete Data

```bash
#!/bin/bash
# add-complete-contact.sh

LIST_ID=123
EMAIL="$1"
FIRST_NAME="$2"
LAST_NAME="$3"
PLAN="$4"

if [ -z "$EMAIL" ] || [ -z "$FIRST_NAME" ] || [ -z "$LAST_NAME" ]; then
  echo "Usage: $0 <email> <first-name> <last-name> [plan]"
  exit 1
fi

PLAN=${PLAN:-basic}
SIGNUP_DATE=$(date +%Y-%m-%d)

echo "Adding contact: $FIRST_NAME $LAST_NAME ($EMAIL)"

CONTACT=$(cakemail contacts add $LIST_ID \
  -e "$EMAIL" \
  -f "$FIRST_NAME" \
  -l "$LAST_NAME" \
  -d "{
    \"plan\": \"$PLAN\",
    \"signup_date\": \"$SIGNUP_DATE\",
    \"source\": \"manual_import\",
    \"is_vip\": false,
    \"purchase_count\": 0
  }" \
  -f json)

CONTACT_ID=$(echo "$CONTACT" | jq -r '.id')

echo "✓ Contact added: ID $CONTACT_ID"
echo "  Email: $EMAIL"
echo "  Name: $FIRST_NAME $LAST_NAME"
echo "  Plan: $PLAN"
echo "  Signup: $SIGNUP_DATE"
```

**Usage:**
```bash
$ ./add-complete-contact.sh john@example.com John Doe premium
```

### Workflow 2: Update Contact from Form Data

```bash
#!/bin/bash
# update-from-form.sh

LIST_ID=123
EMAIL="$1"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

# Find contact by email
CONTACTS=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json)
CONTACT_ID=$(echo "$CONTACTS" | jq -r '.data[0].id')

if [ "$CONTACT_ID" == "null" ]; then
  echo "Contact not found: $EMAIL"
  exit 1
fi

echo "Found contact: $CONTACT_ID"
echo ""

# Prompt for updates
read -p "First Name (Enter to skip): " FIRST_NAME
read -p "Last Name (Enter to skip): " LAST_NAME
read -p "Company (Enter to skip): " COMPANY
read -p "Plan (basic/premium/enterprise, Enter to skip): " PLAN

# Build update command
CMD="cakemail contacts update $LIST_ID $CONTACT_ID"

if [ -n "$FIRST_NAME" ]; then
  CMD="$CMD -f \"$FIRST_NAME\""
fi

if [ -n "$LAST_NAME" ]; then
  CMD="$CMD -l \"$LAST_NAME\""
fi

# Build custom attributes JSON
ATTRS="{"
if [ -n "$COMPANY" ]; then
  ATTRS="$ATTRS\"company\":\"$COMPANY\","
fi
if [ -n "$PLAN" ]; then
  ATTRS="$ATTRS\"plan\":\"$PLAN\","
fi
ATTRS="${ATTRS%,}}"

if [ "$ATTRS" != "{}" ]; then
  CMD="$CMD -d '$ATTRS'"
fi

# Execute update
eval $CMD

echo ""
echo "✓ Contact updated"
```

### Workflow 3: Find and Update Multiple Contacts

```bash
#!/bin/bash
# bulk-update-plan.sh

LIST_ID=123
OLD_PLAN="$1"
NEW_PLAN="$2"

if [ -z "$OLD_PLAN" ] || [ -z "$NEW_PLAN" ]; then
  echo "Usage: $0 <old-plan> <new-plan>"
  echo "Example: $0 basic premium"
  exit 1
fi

echo "=== Bulk Plan Update ==="
echo "Updating contacts from $OLD_PLAN to $NEW_PLAN"
echo ""

# Find contacts with old plan
CONTACTS=$(cakemail contacts list $LIST_ID \
  --filter "custom_attributes.plan==$OLD_PLAN" \
  -f json | jq -r '.data[].id')

COUNT=$(echo "$CONTACTS" | wc -l)

if [ -z "$CONTACTS" ]; then
  echo "No contacts found with plan: $OLD_PLAN"
  exit 0
fi

echo "Found $COUNT contacts to update"
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Cancelled"
  exit 0
fi

echo ""

# Update each contact
for CONTACT_ID in $CONTACTS; do
  echo "Updating contact $CONTACT_ID..."
  cakemail contacts update $LIST_ID $CONTACT_ID \
    -d "{\"plan\":\"$NEW_PLAN\"}"
done

echo ""
echo "✓ Updated $COUNT contacts"
```

### Workflow 4: Contact Activity Report

```bash
#!/bin/bash
# contact-activity.sh

LIST_ID=123
CONTACT_ID=$1

if [ -z "$CONTACT_ID" ]; then
  echo "Usage: $0 <contact-id>"
  exit 1
fi

echo "=== Contact Activity Report ==="
echo ""

# Get contact details
CONTACT=$(cakemail contacts get $LIST_ID $CONTACT_ID -f json)

echo "Contact: $(echo "$CONTACT" | jq -r '.first_name') $(echo "$CONTACT" | jq -r '.last_name')"
echo "Email: $(echo "$CONTACT" | jq -r '.email')"
echo "Status: $(echo "$CONTACT" | jq -r '.status')"
echo ""

# Subscription info
echo "=== Subscription ==="
echo "Subscribed: $(echo "$CONTACT" | jq -r '.subscribed_on')"
echo "Last Modified: $(echo "$CONTACT" | jq -r '.last_modified')"
echo ""

# Engagement
echo "=== Engagement ==="
echo "Last Open: $(echo "$CONTACT" | jq -r '.last_open_date // "Never"')"
echo "Last Click: $(echo "$CONTACT" | jq -r '.last_click_date // "Never"')"
echo "Total Opens: $(echo "$CONTACT" | jq -r '.total_opens // 0')"
echo "Total Clicks: $(echo "$CONTACT" | jq -r '.total_clicks // 0')"
echo ""

# Bounces
BOUNCES=$(echo "$CONTACT" | jq -r '.bounces_count')
echo "=== Deliverability ==="
echo "Bounce Count: $BOUNCES"
if [ $BOUNCES -gt 0 ]; then
  echo "Last Bounce: $(echo "$CONTACT" | jq -r '.last_bounce')"
fi
echo ""

# Custom attributes
echo "=== Custom Attributes ==="
echo "$CONTACT" | jq '.custom_attributes'
```

### Workflow 5: Contact Enrichment

```bash
#!/bin/bash
# enrich-contact.sh

LIST_ID=123
EMAIL="$1"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

echo "=== Contact Enrichment ==="
echo ""

# Find contact
CONTACTS=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json)
CONTACT_ID=$(echo "$CONTACTS" | jq -r '.data[0].id')

if [ "$CONTACT_ID" == "null" ]; then
  echo "Contact not found: $EMAIL"
  exit 1
fi

echo "Found contact: $CONTACT_ID"
echo ""

# Get current data
CONTACT=$(cakemail contacts get $LIST_ID $CONTACT_ID -f json)

echo "Current data:"
echo "$CONTACT" | jq '{email, first_name, last_name, custom_attributes}'
echo ""

# Enrich from external source (example: your CRM)
echo "Fetching enrichment data..."

# Example: Call your API or database
# ENRICHMENT=$(curl -s "https://api.yourcrm.com/contact?email=$EMAIL")

# Mock enrichment data
ENRICHMENT='{
  "company": "Acme Corp",
  "title": "Marketing Manager",
  "industry": "Technology",
  "company_size": "50-100",
  "linkedin_url": "https://linkedin.com/in/johndoe"
}'

echo "Enrichment data:"
echo "$ENRICHMENT" | jq '.'
echo ""

read -p "Apply enrichment? (yes/no): " APPLY

if [ "$APPLY" == "yes" ]; then
  # Merge with existing custom attributes
  EXISTING=$(echo "$CONTACT" | jq '.custom_attributes')
  MERGED=$(echo "$EXISTING $ENRICHMENT" | jq -s '.[0] + .[1]')

  # Update contact
  cakemail contacts update $LIST_ID $CONTACT_ID -d "$MERGED"

  echo ""
  echo "✓ Contact enriched"
fi
```

## Contact Status Management

### Understanding Contact Status

**Status values:**
- `subscribed` - Active, can receive emails
- `unsubscribed` - Opted out, cannot send
- `bounced` - Email bounced, delivery failed
- `pending` - Awaiting confirmation (double opt-in)

### Resubscribe Contact

```bash
# Change unsubscribed back to subscribed
$ cakemail contacts update 123 501 --status subscribed
```

**Note:** Only do this with explicit consent!

### Handle Bounced Contacts

```bash
# Find bounced contacts
$ cakemail contacts list 123 --filter "status==bounced"

# If email corrected, mark as subscribed
$ cakemail contacts update 123 501 --status subscribed

# Or delete if permanently invalid
$ cakemail contacts delete 123 501 --force
```

### Find Pending Confirmations

```bash
# Double opt-in pending
$ cakemail contacts list 123 --filter "status==pending"

# Resend confirmation (if supported)
# Or manually approve
$ cakemail contacts update 123 501 --status subscribed
```

## Contact Validation

### Validate Email Format

```bash
#!/bin/bash
# validate-email.sh

EMAIL="$1"

if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo "❌ Invalid email format: $EMAIL"
  exit 1
fi

echo "✅ Valid email format: $EMAIL"
```

### Validate Before Adding

```bash
#!/bin/bash
# safe-add-contact.sh

LIST_ID=123
EMAIL="$1"
FIRST_NAME="$2"
LAST_NAME="$3"

# Validate email
if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo "❌ Invalid email: $EMAIL"
  exit 1
fi

# Check if already exists
EXISTING=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json | jq '.count')

if [ $EXISTING -gt 0 ]; then
  echo "⚠️  Contact already exists: $EMAIL"
  read -p "Update instead? (yes/no): " UPDATE

  if [ "$UPDATE" == "yes" ]; then
    CONTACT_ID=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json | jq -r '.data[0].id')
    cakemail contacts update $LIST_ID $CONTACT_ID -f "$FIRST_NAME" -l "$LAST_NAME"
    echo "✓ Contact updated"
  fi
  exit 0
fi

# Add contact
cakemail contacts add $LIST_ID -e "$EMAIL" -f "$FIRST_NAME" -l "$LAST_NAME"
echo "✓ Contact added"
```

## Contact Deduplication

### Find Duplicate Emails

```bash
#!/bin/bash
# find-duplicates.sh

LIST_ID=123

echo "=== Finding Duplicate Contacts ==="
echo ""

# Export all contacts
cakemail contacts export $LIST_ID
EXPORT_ID=$(cakemail contacts export-list -f json | jq -r '.data[0].id')

# Wait for export
sleep 10

# Download and analyze
cakemail contacts export-download $EXPORT_ID > contacts.csv

# Find duplicates
echo "Duplicate emails:"
cut -d',' -f1 contacts.csv | sort | uniq -d

echo ""
echo "Run manual review to keep best version of each"

rm contacts.csv
```

### Remove Duplicates (Keep First)

```bash
#!/bin/bash
# remove-duplicates.sh

LIST_ID=123
EMAIL="$1"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <duplicate-email>"
  exit 1
fi

# Find all instances
CONTACTS=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json)
COUNT=$(echo "$CONTACTS" | jq '.count')

if [ $COUNT -le 1 ]; then
  echo "No duplicates found for: $EMAIL"
  exit 0
fi

echo "Found $COUNT instances of $EMAIL"
echo ""

# Show all instances
echo "$CONTACTS" | jq -r '.data[] | "ID: \(.id) - Subscribed: \(.subscribed_on)"'
echo ""

# Keep first, delete rest
KEEP=$(echo "$CONTACTS" | jq -r '.data[0].id')
TO_DELETE=$(echo "$CONTACTS" | jq -r '.data[1:][].id')

echo "Keeping contact: $KEEP"
echo "Deleting: $TO_DELETE"
echo ""

read -p "Proceed? (yes/no): " CONFIRM

if [ "$CONFIRM" == "yes" ]; then
  for ID in $TO_DELETE; do
    cakemail contacts delete $LIST_ID $ID --force
    echo "  Deleted: $ID"
  done
  echo "✓ Deduplication complete"
fi
```

## Contact Segmentation

### Create Targeted Lists from Filters

```bash
#!/bin/bash
# extract-segment.sh

SOURCE_LIST=123
TARGET_LIST=124
FILTER="custom_attributes.plan==premium"

echo "=== Extracting Segment ==="
echo "Source: $SOURCE_LIST"
echo "Target: $TARGET_LIST"
echo "Filter: $FILTER"
echo ""

# Get filtered contacts
CONTACTS=$(cakemail contacts list $SOURCE_LIST --filter "$FILTER" -f json | jq -r '.data[].email')

COUNT=$(echo "$CONTACTS" | wc -l)
echo "Found $COUNT contacts matching filter"
echo ""

read -p "Copy to target list? (yes/no): " CONFIRM

if [ "$CONFIRM" == "yes" ]; then
  for EMAIL in $CONTACTS; do
    # Get full contact data
    CONTACT=$(cakemail contacts list $SOURCE_LIST --filter "email==$EMAIL" -f json | jq '.data[0]')

    FIRST_NAME=$(echo "$CONTACT" | jq -r '.first_name')
    LAST_NAME=$(echo "$CONTACT" | jq -r '.last_name')
    CUSTOM_ATTRS=$(echo "$CONTACT" | jq -c '.custom_attributes')

    # Add to target list
    cakemail contacts add $TARGET_LIST \
      -e "$EMAIL" \
      -f "$FIRST_NAME" \
      -l "$LAST_NAME" \
      -d "$CUSTOM_ATTRS" 2>/dev/null

    echo "  Copied: $EMAIL"
  done

  echo ""
  echo "✓ Segment extracted"
fi
```

## Contact Analytics

### Engagement Scoring

```bash
#!/bin/bash
# engagement-score.sh

LIST_ID=123
CONTACT_ID=$1

if [ -z "$CONTACT_ID" ]; then
  echo "Usage: $0 <contact-id>"
  exit 1
fi

CONTACT=$(cakemail contacts get $LIST_ID $CONTACT_ID -f json)

# Get metrics
TOTAL_OPENS=$(echo "$CONTACT" | jq -r '.total_opens // 0')
TOTAL_CLICKS=$(echo "$CONTACT" | jq -r '.total_clicks // 0')
LAST_OPEN=$(echo "$CONTACT" | jq -r '.last_open_date // "null"')

# Calculate score (0-100)
SCORE=0

# Opens contribute 30 points max
if [ $TOTAL_OPENS -gt 0 ]; then
  OPEN_SCORE=$((TOTAL_OPENS > 30 ? 30 : TOTAL_OPENS))
  SCORE=$((SCORE + OPEN_SCORE))
fi

# Clicks contribute 40 points max
if [ $TOTAL_CLICKS -gt 0 ]; then
  CLICK_SCORE=$((TOTAL_CLICKS * 4))
  CLICK_SCORE=$((CLICK_SCORE > 40 ? 40 : CLICK_SCORE))
  SCORE=$((SCORE + CLICK_SCORE))
fi

# Recent activity contributes 30 points
if [ "$LAST_OPEN" != "null" ]; then
  DAYS_AGO=$(( ($(date +%s) - $(date -d "$LAST_OPEN" +%s)) / 86400 ))

  if [ $DAYS_AGO -lt 7 ]; then
    SCORE=$((SCORE + 30))
  elif [ $DAYS_AGO -lt 30 ]; then
    SCORE=$((SCORE + 20))
  elif [ $DAYS_AGO -lt 90 ]; then
    SCORE=$((SCORE + 10))
  fi
fi

echo "=== Engagement Score ==="
echo "Contact: $(echo "$CONTACT" | jq -r '.email')"
echo "Total Opens: $TOTAL_OPENS"
echo "Total Clicks: $TOTAL_CLICKS"
echo "Last Open: ${LAST_OPEN:-Never}"
echo ""
echo "Engagement Score: $SCORE/100"
echo ""

if [ $SCORE -ge 70 ]; then
  echo "🟢 Highly Engaged"
elif [ $SCORE -ge 40 ]; then
  echo "🟡 Moderately Engaged"
elif [ $SCORE -ge 20 ]; then
  echo "🟠 Low Engagement"
else
  echo "🔴 At Risk - Very Low Engagement"
fi
```

### Contact Lifetime Value

```bash
#!/bin/bash
# calculate-ltv.sh

LIST_ID=123

echo "=== Contact Lifetime Value Analysis ==="
echo ""

# Get all contacts with LTV data
CONTACTS=$(cakemail contacts list $LIST_ID \
  --filter "status==subscribed" \
  -f json | jq -r '.data[] | "\(.id),\(.email),\(.custom_attributes.lifetime_value // 0)"')

TOTAL_LTV=0
COUNT=0

echo "Contact ID | Email | LTV"
echo "-----------|-------|-----"

while IFS=',' read ID EMAIL LTV; do
  printf "%-10s | %-25s | $%7.2f\n" "$ID" "$EMAIL" "$LTV"
  TOTAL_LTV=$(echo "$TOTAL_LTV + $LTV" | bc)
  COUNT=$((COUNT + 1))
done <<< "$CONTACTS"

echo ""
echo "Total Contacts: $COUNT"
echo "Total LTV: \$$(echo "scale=2; $TOTAL_LTV" | bc)"
echo "Average LTV: \$$(echo "scale=2; $TOTAL_LTV / $COUNT" | bc)"
```

## Troubleshooting

### Cannot Add Contact - Email Already Exists

**Error:** "Contact with this email already exists"

**Solution:**
```bash
# Find existing contact
$ cakemail contacts list 123 --filter "email==john@example.com" -f json

# Update instead of add
CONTACT_ID=$(cakemail contacts list 123 --filter "email==john@example.com" -f json | jq -r '.data[0].id')
$ cakemail contacts update 123 $CONTACT_ID -f "John" -l "Doe"
```

### Contact Not Found

**Error:** "Contact ID not found"

**Solution:**
```bash
# Verify contact ID
$ cakemail contacts list 123 --filter "email==john@example.com"

# Ensure correct list ID
$ cakemail lists list

# Contact may have been deleted
# Search across all lists if needed
```

### Custom Attribute Not Saving

**Problem:** Custom attributes not appearing

**Solution:**
```bash
# Ensure attribute exists
$ cakemail attributes list 123

# Create attribute first
$ cakemail attributes create 123 -n "plan" -t "text"

# Then add contact with attribute
$ cakemail contacts add 123 -e "user@example.com" -d '{"plan":"premium"}'

# Verify
$ cakemail contacts get 123 <contact-id> -f json | jq '.custom_attributes'
```

### Invalid Data Format

**Error:** "Invalid JSON format for custom attributes"

**Solution:**
```bash
# ❌ Wrong: Single quotes for JSON
$ cakemail contacts add 123 -e "user@example.com" -d '{plan:premium}'

# ✅ Correct: Proper JSON with double quotes
$ cakemail contacts add 123 -e "user@example.com" -d '{"plan":"premium"}'

# ✅ Correct: Escaped in shell
$ cakemail contacts add 123 -e "user@example.com" -d "{\"plan\":\"premium\"}"
```

### Bulk Operations Too Slow

**Problem:** Adding many contacts individually is slow

**Solution:**
```bash
# Use import instead of individual adds
# See contact-import-export.md guide

# Create CSV file
echo "email,first_name,last_name,plan" > contacts.csv
echo "user1@example.com,John,Doe,premium" >> contacts.csv
echo "user2@example.com,Jane,Smith,basic" >> contacts.csv

# Import in bulk
$ cakemail contacts import 123 --file contacts.csv

# Much faster than individual adds
```

## Best Practices Summary

1. **Validate before adding** - Check email format and duplicates
2. **Use custom attributes** - Store business-specific data
3. **Keep data current** - Update contacts regularly
4. **Track consent** - Document subscription source and date
5. **Monitor engagement** - Identify and re-engage inactive contacts
6. **Clean regularly** - Remove bounced and invalid contacts
7. **Bulk operations** - Use import for adding many contacts
8. **Segment intelligently** - Use attributes for targeting
9. **Document schema** - Keep track of custom attribute meanings
10. **Respect unsubscribes** - Never resubscribe without explicit consent

