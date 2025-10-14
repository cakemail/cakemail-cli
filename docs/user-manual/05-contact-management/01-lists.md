# Managing Contact Lists

Master contact list management for organizing and segmenting your email subscribers.

## Overview

Contact lists allow you to:
- Organize subscribers by audience type
- Separate marketing campaigns
- Manage different product lines or brands
- Maintain compliance with consent requirements
- Control who receives which campaigns
- Track list-specific metrics

Lists are the foundation of contact management in Cakemail - every contact must belong to at least one list.

## Quick Start

### Create Your First List

```bash
$ cakemail lists create -n "Newsletter Subscribers" -l "en"
```

**Output:**
```
✓ List created successfully

ID: 123
Name: Newsletter Subscribers
Language: en
Status: active
Contacts: 0
```

### View All Lists

```bash
$ cakemail lists list
```

**Output:**
```
┌─────┬────────────────────────┬──────────┬───────────┬─────────────────────┐
│ ID  │ Name                   │ Language │ Contacts  │ Created             │
├─────┼────────────────────────┼──────────┼───────────┼─────────────────────┤
│ 123 │ Newsletter Subscribers │ en       │ 1,247     │ 2024-01-15 10:30:00 │
│ 124 │ Product Updates        │ en       │ 856       │ 2024-02-01 14:20:00 │
│ 125 │ VIP Customers          │ en       │ 342       │ 2024-03-10 09:00:00 │
└─────┴────────────────────────┴──────────┴───────────┴─────────────────────┘
```

## List Management Basics

### Create a List

```bash
$ cakemail lists create -n "Monthly Newsletter" -l "en"
```

**With optional description:**
```bash
$ cakemail lists create \
  -n "Product Announcements" \
  -l "en" \
  -d "Subscribers interested in product updates"
```

**French language list:**
```bash
$ cakemail lists create -n "Infolettre" -l "fr"
```

### View List Details

```bash
$ cakemail lists get 123
```

**Output:**
```
{
  "id": 123,
  "name": "Newsletter Subscribers",
  "language": "en",
  "description": "Monthly newsletter subscribers",
  "status": "active",
  "contacts_count": 1247,
  "active_contacts": 1189,
  "unsubscribed": 45,
  "bounced": 13,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-03-15T14:22:00Z"
}
```

### Update List

```bash
# Update name
$ cakemail lists update 123 -n "Weekly Newsletter"

# Update description
$ cakemail lists update 123 -d "Weekly updates for subscribers"

# Update both
$ cakemail lists update 123 \
  -n "Newsletter - Weekly Edition" \
  -d "Our weekly newsletter with industry insights"
```

### Delete List

```bash
$ cakemail lists delete 123
```

**Output:**
```
⚠ Delete list 123?

The following will happen:
  • List and all contacts will be deleted
  • This action cannot be undone
  • Associated campaigns remain but will show "List Deleted"

Type 'yes' to confirm: yes

✓ List 123 deleted
```

**Force delete (skip confirmation):**
```bash
$ cakemail lists delete 123 --force
```

## List Organization Strategies

### Strategy 1: By Audience Type

```bash
# Create lists for different audiences
$ cakemail lists create -n "B2B Subscribers" -l "en"
$ cakemail lists create -n "B2C Customers" -l "en"
$ cakemail lists create -n "Partners & Affiliates" -l "en"
$ cakemail lists create -n "Internal Team" -l "en"
```

**Use cases:**
- Different content for each audience
- Separate sender addresses
- Varied sending frequency
- Audience-specific compliance needs

### Strategy 2: By Product/Brand

```bash
# Multi-product company
$ cakemail lists create -n "Product A Users" -l "en"
$ cakemail lists create -n "Product B Users" -l "en"
$ cakemail lists create -n "Product C Users" -l "en"

# Multi-brand
$ cakemail lists create -n "Brand X Subscribers" -l "en"
$ cakemail lists create -n "Brand Y Subscribers" -l "en"
```

**Use cases:**
- Separate branding per product
- Product-specific campaigns
- Cross-sell opportunities
- Brand-specific metrics

### Strategy 3: By Engagement Level

```bash
# Segment by engagement
$ cakemail lists create -n "Highly Engaged" -l "en"
$ cakemail lists create -n "Moderately Engaged" -l "en"
$ cakemail lists create -n "At Risk - Low Engagement" -l "en"
$ cakemail lists create -n "Re-engagement Candidates" -l "en"
```

**Use cases:**
- Engagement-based sending frequency
- Re-engagement campaigns
- VIP/loyalty programs
- List health maintenance

### Strategy 4: By Content Type

```bash
# Content-based lists
$ cakemail lists create -n "Blog Subscribers" -l "en"
$ cakemail lists create -n "Product News" -l "en"
$ cakemail lists create -n "Event Announcements" -l "en"
$ cakemail lists create -n "Sales & Promotions" -l "en"
```

**Use cases:**
- Content preference management
- Targeted content delivery
- Reduced unsubscribes
- Better engagement rates

### Strategy 5: By Lifecycle Stage

```bash
# Customer lifecycle
$ cakemail lists create -n "Leads - Not Converted" -l "en"
$ cakemail lists create -n "Trial Users" -l "en"
$ cakemail lists create -n "New Customers (< 30 days)" -l "en"
$ cakemail lists create -n "Active Customers" -l "en"
$ cakemail lists create -n "Lapsed Customers" -l "en"
```

**Use cases:**
- Lifecycle-specific messaging
- Onboarding sequences
- Retention campaigns
- Win-back campaigns

## List Workflows

### Workflow 1: New Business Setup

```bash
#!/bin/bash
# setup-lists.sh

echo "=== Setting Up Marketing Lists ==="
echo ""

# Main newsletter
NEWSLETTER=$(cakemail lists create \
  -n "Newsletter Subscribers" \
  -l "en" \
  -d "Our monthly newsletter" \
  -f json | jq -r '.id')

echo "✓ Newsletter list created: $NEWSLETTER"

# Product updates
PRODUCT=$(cakemail lists create \
  -n "Product Updates" \
  -l "en" \
  -d "Product announcements and feature releases" \
  -f json | jq -r '.id')

echo "✓ Product updates list created: $PRODUCT"

# Promotions
PROMO=$(cakemail lists create \
  -n "Sales & Promotions" \
  -l "en" \
  -d "Special offers and discounts" \
  -f json | jq -r '.id')

echo "✓ Promotions list created: $PROMO"

echo ""
echo "=== Setup Complete ===="
echo ""
echo "List IDs:"
echo "  Newsletter: $NEWSLETTER"
echo "  Product Updates: $PRODUCT"
echo "  Promotions: $PROMO"
echo ""
echo "Next steps:"
echo "  1. Import contacts: cakemail contacts import $NEWSLETTER --file contacts.csv"
echo "  2. Create custom attributes: cakemail attributes create $NEWSLETTER -n \"preference\" -t \"text\""
echo "  3. Create segments: cakemail segments create $NEWSLETTER -n \"Active Users\""
```

### Workflow 2: Multi-Language Support

```bash
#!/bin/bash
# multilang-lists.sh

echo "=== Creating Multi-Language Lists ==="
echo ""

# English
EN=$(cakemail lists create \
  -n "Newsletter - English" \
  -l "en" \
  -d "English language newsletter" \
  -f json | jq -r '.id')

echo "✓ English list created: $EN"

# French
FR=$(cakemail lists create \
  -n "Newsletter - Français" \
  -l "fr" \
  -d "Infolettre en français" \
  -f json | jq -r '.id')

echo "✓ French list created: $FR"

# Spanish
ES=$(cakemail lists create \
  -n "Newsletter - Español" \
  -l "es" \
  -d "Boletín en español" \
  -f json | jq -r '.id')

echo "✓ Spanish list created: $ES"

echo ""
echo "Language-specific lists ready"
echo "  English (en): $EN"
echo "  French (fr): $FR"
echo "  Spanish (es): $ES"
```

### Workflow 3: List Health Audit

```bash
#!/bin/bash
# list-health-audit.sh

echo "=== List Health Audit ==="
echo ""

# Get all lists
LISTS=$(cakemail lists list -f json | jq -r '.data[].id')

echo "List ID | Name | Total | Active | Unsub | Bounce | Health"
echo "--------|------|-------|--------|-------|--------|-------"

for LIST_ID in $LISTS; do
  LIST=$(cakemail lists get $LIST_ID -f json)

  NAME=$(echo "$LIST" | jq -r '.name' | cut -c1-15)
  TOTAL=$(echo "$LIST" | jq -r '.contacts_count')
  ACTIVE=$(echo "$LIST" | jq -r '.active_contacts')
  UNSUB=$(echo "$LIST" | jq -r '.unsubscribed')
  BOUNCE=$(echo "$LIST" | jq -r '.bounced')

  # Calculate health score
  if [ $TOTAL -gt 0 ]; then
    HEALTH=$(echo "scale=1; $ACTIVE * 100 / $TOTAL" | bc)
  else
    HEALTH="N/A"
  fi

  printf "%-7s | %-15s | %5d | %6d | %5d | %6d | %s%%\n" \
    "$LIST_ID" "$NAME" "$TOTAL" "$ACTIVE" "$UNSUB" "$BOUNCE" "$HEALTH"
done

echo ""
echo "Health Score: % of contacts that are active (not unsubscribed or bounced)"
echo "  > 90%: Excellent"
echo "  80-90%: Good"
echo "  70-80%: Fair - Consider list cleaning"
echo "  < 70%: Poor - Clean list immediately"
```

### Workflow 4: List Consolidation

```bash
#!/bin/bash
# consolidate-lists.sh

SOURCE_LIST_1=123
SOURCE_LIST_2=124
TARGET_LIST=125

echo "=== Consolidating Lists ==="
echo ""
echo "Merging lists $SOURCE_LIST_1 and $SOURCE_LIST_2 into $TARGET_LIST"
echo ""

# Export contacts from source lists
echo "Exporting from list $SOURCE_LIST_1..."
cakemail contacts export $SOURCE_LIST_1
EXPORT_1=$(cakemail contacts export-list -f json | jq -r '.data[0].id')

echo "Exporting from list $SOURCE_LIST_2..."
cakemail contacts export $SOURCE_LIST_2
EXPORT_2=$(cakemail contacts export-list -f json | jq -r '.data[0].id')

# Wait for exports
echo "Waiting for exports to complete..."
sleep 10

# Download exports
cakemail contacts export-download $EXPORT_1 > list1.csv
cakemail contacts export-download $EXPORT_2 > list2.csv

# Combine and deduplicate
echo "Combining and deduplicating..."
cat list1.csv list2.csv | sort -u -t',' -k1,1 > combined.csv

# Import to target list
echo "Importing to target list $TARGET_LIST..."
cakemail contacts import $TARGET_LIST --file combined.csv

echo ""
echo "✓ Lists consolidated"
echo ""
read -p "Delete source lists? (yes/no): " DELETE

if [ "$DELETE" == "yes" ]; then
  cakemail lists delete $SOURCE_LIST_1 --force
  cakemail lists delete $SOURCE_LIST_2 --force
  echo "✓ Source lists deleted"
fi

# Cleanup
rm list1.csv list2.csv combined.csv
```

### Workflow 5: List Cleanup

```bash
#!/bin/bash
# cleanup-list.sh

LIST_ID=$1

if [ -z "$LIST_ID" ]; then
  echo "Usage: $0 <list-id>"
  exit 1
fi

echo "=== List Cleanup: $LIST_ID ==="
echo ""

# Get list stats
LIST=$(cakemail lists get $LIST_ID -f json)
TOTAL=$(echo "$LIST" | jq -r '.contacts_count')
BOUNCED=$(echo "$LIST" | jq -r '.bounced')
UNSUB=$(echo "$LIST" | jq -r '.unsubscribed')

echo "Current Stats:"
echo "  Total Contacts: $TOTAL"
echo "  Bounced: $BOUNCED"
echo "  Unsubscribed: $UNSUB"
echo ""

# Calculate to remove
TO_REMOVE=$((BOUNCED + UNSUB))
echo "Contacts to remove: $TO_REMOVE"
echo ""

read -p "Remove bounced and unsubscribed contacts? (yes/no): " CONFIRM

if [ "$CONFIRM" == "yes" ]; then
  echo ""
  echo "Removing bounced contacts..."
  # Export active only, then re-import (effective cleanup)
  cakemail contacts export $LIST_ID --filter "status==subscribed"

  EXPORT_ID=$(cakemail contacts export-list -f json | jq -r '.data[0].id')

  echo "Waiting for export..."
  sleep 10

  # Download clean list
  cakemail contacts export-download $EXPORT_ID > clean.csv

  # Create new list
  NEW_LIST=$(cakemail lists create \
    -n "$(echo "$LIST" | jq -r '.name') (Cleaned)" \
    -l "$(echo "$LIST" | jq -r '.language')" \
    -f json | jq -r '.id')

  # Import clean contacts
  echo "Importing clean contacts to new list $NEW_LIST..."
  cakemail contacts import $NEW_LIST --file clean.csv

  echo ""
  echo "✓ Cleanup complete"
  echo "  New list: $NEW_LIST"
  echo "  Review new list before deleting old list"

  rm clean.csv
else
  echo "Cleanup cancelled"
fi
```

## List Metrics & Analysis

### View List Statistics

```bash
$ cakemail lists get 123 -f json | jq '{
  name: .name,
  total: .contacts_count,
  active: .active_contacts,
  unsubscribed: .unsubscribed,
  bounced: .bounced,
  health: (.active_contacts / .contacts_count * 100 | round)
}'
```

**Output:**
```json
{
  "name": "Newsletter Subscribers",
  "total": 1247,
  "active": 1189,
  "unsubscribed": 45,
  "bounced": 13,
  "health": 95
}
```

### Compare List Performance

```bash
#!/bin/bash
# compare-lists.sh

echo "=== List Comparison ==="
echo ""

# Get all lists
cakemail lists list -f json | jq -r '.data[] |
  "List: \(.name)\n  ID: \(.id)\n  Contacts: \(.contacts_count)\n  Active: \(.active_contacts)\n  Growth: +\(.contacts_count - .active_contacts) inactive\n"'
```

### Track List Growth

```bash
#!/bin/bash
# track-growth.sh

LIST_ID=$1
LOG_FILE="list-growth-$LIST_ID.log"

# Get current count
CURRENT=$(cakemail lists get $LIST_ID -f json | jq -r '.contacts_count')
DATE=$(date +%Y-%m-%d)

# Log to file
echo "$DATE,$CURRENT" >> $LOG_FILE

# Show recent growth
echo "=== List Growth: $LIST_ID ==="
echo ""
echo "Date       | Count | Change"
echo "-----------|-------|-------"

# Calculate changes
tail -30 $LOG_FILE | awk -F',' '
  NR > 1 {
    change = $2 - prev
    printf "%s | %5d | %+6d\n", $1, $2, change
  }
  {prev = $2}
'

echo ""
echo "Run this script daily via cron to track growth"
```

## List Best Practices

### 1. Keep Lists Focused

```bash
# Good: Focused lists
Newsletter Subscribers     # General updates
Product A Users           # Specific product
VIP Customers             # High-value segment

# Avoid: Catch-all lists
All Contacts              # Too broad
Everyone                  # No segmentation
Main List                 # Unclear purpose
```

### 2. Name Lists Clearly

```bash
# Good naming
$ cakemail lists create -n "Newsletter - Weekly Tech Tips" -l "en"
$ cakemail lists create -n "Product Updates - Enterprise" -l "en"
$ cakemail lists create -n "Event Invites - NYC Region" -l "en"

# Avoid vague names
$ cakemail lists create -n "List 1" -l "en"  # ❌
$ cakemail lists create -n "Emails" -l "en"  # ❌
$ cakemail lists create -n "Test" -l "en"     # ❌
```

### 3. Regular List Maintenance

```bash
#!/bin/bash
# monthly-maintenance.sh

echo "=== Monthly List Maintenance ==="
echo ""

# Get all lists
LISTS=$(cakemail lists list -f json | jq -r '.data[].id')

for LIST_ID in $LISTS; do
  echo "Checking list $LIST_ID..."

  # Get stats
  LIST=$(cakemail lists get $LIST_ID -f json)
  BOUNCED=$(echo "$LIST" | jq -r '.bounced')

  # Alert if high bounce rate
  if [ $BOUNCED -gt 100 ]; then
    echo "  ⚠️  High bounce count: $BOUNCED"
    echo "     Consider list cleanup"
  fi
done

echo ""
echo "Maintenance check complete"
```

### 4. Document List Purpose

```bash
# Create with descriptive description
$ cakemail lists create \
  -n "Q1 Webinar Attendees" \
  -l "en" \
  -d "Contacts who attended any Q1 2024 webinar. Used for post-event nurture campaigns and future event invites."
```

### 5. Archive Inactive Lists

```bash
#!/bin/bash
# archive-inactive-lists.sh

echo "=== Archiving Inactive Lists ==="
echo ""

CUTOFF_DATE=$(date -d "90 days ago" +%Y-%m-%d)

# Find lists not used recently
LISTS=$(cakemail lists list -f json | jq -r '.data[].id')

for LIST_ID in $LISTS; do
  # Get latest campaign using this list
  LATEST=$(cakemail campaigns list \
    --filter "list_id==$LIST_ID" \
    --sort "-delivered_at" \
    --limit 1 \
    -f json | jq -r '.data[0].delivered_at // "null"')

  if [ "$LATEST" == "null" ] || [ "$LATEST" < "$CUTOFF_DATE" ]; then
    NAME=$(cakemail lists get $LIST_ID -f json | jq -r '.name')
    echo "⚠️  Inactive list: $NAME (ID: $LIST_ID)"
    echo "   Last used: ${LATEST:-Never}"

    read -p "   Archive this list? (yes/no): " ARCHIVE

    if [ "$ARCHIVE" == "yes" ]; then
      # Rename to indicate archived
      cakemail lists update $LIST_ID -n "[ARCHIVED] $NAME"
      echo "   ✓ List archived"
    fi
  fi
done
```

## List Compliance

### GDPR Considerations

```bash
# Create consent-tracking attributes
$ cakemail attributes create 123 -n "consent_date" -t "date"
$ cakemail attributes create 123 -n "consent_method" -t "text"
$ cakemail attributes create 123 -n "consent_ip" -t "text"

# Add contact with consent tracking
$ cakemail contacts add 123 \
  -e "user@example.com" \
  -d '{
    "consent_date": "2024-03-15",
    "consent_method": "website_signup",
    "consent_ip": "192.168.1.1"
  }'
```

### CAN-SPAM Compliance

```bash
# Every list must have:
# 1. Clear unsubscribe mechanism (automatic in Cakemail)
# 2. Physical address in footer
# 3. Honest subject lines
# 4. No deceptive headers

# Verify sender address configured
$ cakemail senders list -f json | jq '.data[] | {email, confirmed, address}'
```

### CASL Compliance (Canada)

```bash
# Canadian Anti-Spam Law requirements
$ cakemail attributes create 123 -n "casl_consent" -t "boolean"
$ cakemail attributes create 123 -n "casl_consent_date" -t "date"
$ cakemail attributes create 123 -n "relationship_type" -t "text"

# Track implied vs express consent
$ cakemail contacts add 123 \
  -e "canadian@example.com" \
  -d '{
    "casl_consent": true,
    "casl_consent_date": "2024-03-15",
    "relationship_type": "express"
  }'
```

## Troubleshooting

### Cannot Delete List

**Error:** "List has active campaigns"

**Solution:**
```bash
# Find campaigns using list
$ cakemail campaigns list --filter "list_id==123" -f json

# Cancel or complete campaigns
$ cakemail campaigns cancel 790

# Or update campaigns to use different list
$ cakemail campaigns update 790 --list-id 124

# Then delete list
$ cakemail lists delete 123 --force
```

### List Growth Stagnant

**Problem:** List not growing

**Solutions:**
```bash
# Check recent imports
$ cakemail contacts import-list 123

# Verify signup forms active
# Check website forms, landing pages

# Review unsubscribe rate
$ cakemail lists get 123 -f json | jq '{unsub: .unsubscribed, total: .contacts_count}'

# If high unsubscribe rate (> 2%):
# - Review content relevance
# - Check send frequency
# - Improve targeting
```

### High Bounce Rate

**Problem:** Many bounced contacts

**Solutions:**
```bash
# Check bounce count
$ cakemail lists get 123 -f json | jq '.bounced'

# If > 5% of list:
# 1. Verify email collection process
# 2. Use double opt-in
# 3. Clean list regularly
# 4. Check for spam traps

# Remove hard bounces
# (Use list cleanup workflow above)
```

### Duplicate Contacts Across Lists

**Problem:** Same contact in multiple lists

**Not an error** - this is intentional:
```bash
# Contacts can be in multiple lists
$ cakemail contacts add 123 -e "user@example.com"  # Newsletter
$ cakemail contacts add 124 -e "user@example.com"  # Product Updates

# Different lists = different campaign types
# Contact can unsubscribe from one but stay on others
```

**If duplicate is unintended:**
```bash
# Remove from one list
$ cakemail contacts delete 124 <contact-id> --force
```

### List Language Setting Issues

**Problem:** List created with wrong language

**Solution:**
```bash
# Cannot change list language after creation
# Must create new list and migrate:

# 1. Create new list with correct language
$ cakemail lists create -n "Newsletter - Français" -l "fr"

# 2. Export contacts from old list
$ cakemail contacts export 123

# 3. Import to new list
# (See List Consolidation workflow)

# 4. Delete old list
$ cakemail lists delete 123 --force
```

## Best Practices Summary

1. **Focus each list** - One clear purpose per list
2. **Name descriptively** - Clear, self-explanatory names
3. **Add descriptions** - Document list purpose and use
4. **Monitor health** - Track active vs inactive contacts
5. **Clean regularly** - Remove bounces and unsubscribes
6. **Track consent** - Document subscription source and date
7. **Segment appropriately** - Use lists for major segments, segments for minor
8. **Archive inactive** - Don't delete, archive old lists
9. **Document strategy** - Keep list strategy documentation
10. **Review quarterly** - Assess list performance and cleanup

