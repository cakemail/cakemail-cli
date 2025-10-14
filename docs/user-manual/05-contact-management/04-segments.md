# Contact Segmentation

Create dynamic contact segments that automatically update based on conditions and behaviors.

## Overview

Segmentation allows you to:
- Target specific audience subsets
- Create dynamic, automatically-updating groups
- Filter by engagement, attributes, and behavior
- Personalize campaigns for different audiences
- Improve campaign relevance and performance
- Automate audience selection

Unlike static lists, segments are dynamic filters that automatically include contacts matching specified conditions. Segment membership updates in real-time as contact data changes.

## Quick Start

### Create Your First Segment

```bash
$ cakemail segments create 123 -n "Active Subscribers" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"}
  ]
}'
```

**Output:**
```
✓ Segment created: 456
{
  "id": 456,
  "name": "Active Subscribers",
  "contact_count": 1180
}
```

### View Segment Contacts

```bash
$ cakemail segments contacts 123 456
```

**Output:**
```
┌────────┬──────────────────────┬────────────┬────────────┬──────────────┐
│ ID     │ Email                │ First Name │ Last Name  │ Status       │
├────────┼──────────────────────┼────────────┼────────────┼──────────────┤
│ 501    │ john@example.com     │ John       │ Doe        │ subscribed   │
│ 502    │ jane@example.com     │ Jane       │ Smith      │ subscribed   │
└────────┴──────────────────────┴────────────┴────────────┴──────────────┘
```

## Segment Basics

### Understanding Segments vs Lists

**Lists** are static containers:
- Manually add/remove contacts
- Members don't change automatically
- Good for: Distinct audiences, newsletters

**Segments** are dynamic filters:
- Automatically include/exclude based on rules
- Membership updates as data changes
- Good for: Behavioral targeting, lifecycle stages

**Example:**
```bash
# Static list - manually managed
$ cakemail lists create -n "Newsletter Subscribers"
$ cakemail contacts add 123 -e "user@example.com"

# Dynamic segment - rule-based
$ cakemail segments create 123 -n "Engaged Users" -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
# Automatically includes contacts who opened after March 1
```

### Segment Conditions

Every segment has conditions that define which contacts are included.

**Basic structure:**
```json
{
  "match": "all|any",
  "rules": [
    {
      "field": "field_name",
      "operator": "comparison_type",
      "value": "comparison_value"
    }
  ]
}
```

**Match types:**
- `all` - Contacts must meet ALL rules (AND logic)
- `any` - Contacts must meet AT LEAST ONE rule (OR logic)

## Creating Segments

### By Status

**Active subscribers only:**
```bash
$ cakemail segments create 123 -n "Active Subscribers" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'
```

**Unsubscribed for analysis:**
```bash
$ cakemail segments create 123 -n "Unsubscribed" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "unsubscribed"}
  ]
}'
```

### By Engagement

**Highly engaged:**
```bash
$ cakemail segments create 123 -n "Highly Engaged" -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-01"},
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-02-01"}
  ]
}'
```

**Recently opened:**
```bash
$ cakemail segments create 123 -n "Opened Last 30 Days" -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-15"}
  ]
}'
```

**Never opened:**
```bash
$ cakemail segments create 123 -n "Never Opened" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "is_empty", "value": ""}
  ]
}'
```

**Inactive subscribers:**
```bash
$ cakemail segments create 123 -n "Inactive 90+ Days" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "less_than", "value": "2023-12-15"}
  ]
}'
```

### By Custom Attributes

**Premium plan users:**
```bash
$ cakemail segments create 123 -n "Premium Users" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.plan_type", "operator": "equals", "value": "premium"},
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'
```

**High-value customers:**
```bash
$ cakemail segments create 123 -n "High Value Customers" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.lifetime_value", "operator": "greater_than", "value": "1000"}
  ]
}'
```

**VIP members:**
```bash
$ cakemail segments create 123 -n "VIP Members" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_vip", "operator": "equals", "value": "true"},
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'
```

**Recent signups:**
```bash
$ cakemail segments create 123 -n "New Signups - Last 7 Days" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.signup_date", "operator": "greater_than", "value": "2024-03-08"}
  ]
}'
```

### By Date Ranges

**Trial ending soon:**
```bash
$ cakemail segments create 123 -n "Trial Ending < 7 Days" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.trial_end_date", "operator": "less_than", "value": "2024-03-22"},
    {"field": "custom_attributes.trial_end_date", "operator": "greater_than", "value": "2024-03-15"}
  ]
}'
```

**Birthday month:**
```bash
#!/bin/bash
# Create birthday segment for current month
CURRENT_MONTH=$(date +%m)
YEAR=$(date +%Y)

$ cakemail segments create 123 -n "Birthday This Month" -c "{
  \"match\": \"all\",
  \"rules\": [
    {\"field\": \"custom_attributes.birthday\", \"operator\": \"greater_than\", \"value\": \"$YEAR-$CURRENT_MONTH-01\"},
    {\"field\": \"custom_attributes.birthday\", \"operator\": \"less_than\", \"value\": \"$YEAR-$CURRENT_MONTH-31\"}
  ]
}"
```

### Complex Conditions

**Engaged OR recent (ANY match):**
```bash
$ cakemail segments create 123 -n "Engaged or Recent" -c '{
  "match": "any",
  "rules": [
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-02-01"},
    {"field": "subscribed_on", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

**Premium AND engaged:**
```bash
$ cakemail segments create 123 -n "Premium Engaged Users" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.plan_type", "operator": "equals", "value": "premium"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-01"},
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'
```

## Available Operators

### Equality Operators

**equals:**
```json
{"field": "status", "operator": "equals", "value": "subscribed"}
{"field": "custom_attributes.plan", "operator": "equals", "value": "premium"}
```

**not_equals:**
```json
{"field": "status", "operator": "not_equals", "value": "unsubscribed"}
{"field": "custom_attributes.plan", "operator": "not_equals", "value": "free"}
```

### Comparison Operators

**greater_than:**
```json
{"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
{"field": "custom_attributes.lifetime_value", "operator": "greater_than", "value": "500"}
```

**less_than:**
```json
{"field": "last_open_date", "operator": "less_than", "value": "2024-01-01"}
{"field": "custom_attributes.age", "operator": "less_than", "value": "30"}
```

### String Operators

**contains:**
```json
{"field": "email", "operator": "contains", "value": "@gmail.com"}
{"field": "custom_attributes.company", "operator": "contains", "value": "Corp"}
```

**not_contains:**
```json
{"field": "email", "operator": "not_contains", "value": "@spam.com"}
```

**starts_with:**
```json
{"field": "first_name", "operator": "starts_with", "value": "J"}
{"field": "email", "operator": "starts_with", "value": "admin"}
```

**ends_with:**
```json
{"field": "email", "operator": "ends_with", "value": ".edu"}
{"field": "last_name", "operator": "ends_with", "value": "son"}
```

### Null/Empty Operators

**is_empty:**
```json
{"field": "first_name", "operator": "is_empty", "value": ""}
{"field": "last_open_date", "operator": "is_empty", "value": ""}
```

**is_not_empty:**
```json
{"field": "first_name", "operator": "is_not_empty", "value": ""}
{"field": "custom_attributes.company", "operator": "is_not_empty", "value": ""}
```

## Segment Workflows

### Workflow 1: Customer Lifecycle Segments

```bash
#!/bin/bash
# create-lifecycle-segments.sh

LIST_ID=123

echo "=== Creating Lifecycle Segments ==="
echo ""

# New customers (< 30 days)
cakemail segments create $LIST_ID -n "New Customers" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.signup_date", "operator": "greater_than", "value": "2024-02-15"}
  ]
}'
echo "✓ New Customers segment created"

# Active customers (opened in last 30 days)
cakemail segments create $LIST_ID -n "Active Customers" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-15"}
  ]
}'
echo "✓ Active Customers segment created"

# At-risk (no open in 30-90 days)
cakemail segments create $LIST_ID -n "At Risk" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "less_than", "value": "2024-02-15"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2023-12-15"}
  ]
}'
echo "✓ At Risk segment created"

# Lapsed (no open in 90+ days)
cakemail segments create $LIST_ID -n "Lapsed Customers" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "less_than", "value": "2023-12-15"}
  ]
}'
echo "✓ Lapsed Customers segment created"

echo ""
echo "=== Lifecycle Segments Created ==="
cakemail segments list $LIST_ID
```

### Workflow 2: Engagement Scoring Segments

```bash
#!/bin/bash
# create-engagement-segments.sh

LIST_ID=123

echo "=== Creating Engagement Segments ==="
echo ""

# Highly engaged (opened AND clicked recently)
cakemail segments create $LIST_ID -n "Highly Engaged" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"},
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'

# Moderately engaged (opened but no clicks)
cakemail segments create $LIST_ID -n "Moderately Engaged" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-01"},
    {"field": "last_click_date", "operator": "less_than", "value": "2024-02-01"}
  ]
}'

# Low engagement (no opens in 30+ days)
cakemail segments create $LIST_ID -n "Low Engagement" -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "less_than", "value": "2024-02-15"}
  ]
}'

echo "✓ Engagement segments created"
```

### Workflow 3: E-commerce Segments

```bash
#!/bin/bash
# create-ecommerce-segments.sh

LIST_ID=123

echo "=== Creating E-commerce Segments ==="
echo ""

# Frequent buyers
cakemail segments create $LIST_ID -n "Frequent Buyers" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.purchase_count", "operator": "greater_than", "value": "5"},
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'

# High-value customers
cakemail segments create $LIST_ID -n "High Value" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.lifetime_value", "operator": "greater_than", "value": "1000"}
  ]
}'

# Recent purchasers (last 30 days)
cakemail segments create $LIST_ID -n "Recent Purchasers" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.last_purchase_date", "operator": "greater_than", "value": "2024-02-15"}
  ]
}'

# Cart abandoners
cakemail segments create $LIST_ID -n "Abandoned Cart" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.has_active_cart", "operator": "equals", "value": "true"},
    {"field": "custom_attributes.cart_abandoned_date", "operator": "greater_than", "value": "2024-03-10"}
  ]
}'

echo "✓ E-commerce segments created"
```

### Workflow 4: SaaS/Subscription Segments

```bash
#!/bin/bash
# create-saas-segments.sh

LIST_ID=123

echo "=== Creating SaaS Segments ==="
echo ""

# Trial users
cakemail segments create $LIST_ID -n "Active Trials" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_trial", "operator": "equals", "value": "true"},
    {"field": "custom_attributes.trial_end_date", "operator": "greater_than", "value": "2024-03-15"}
  ]
}'

# Trial ending soon
cakemail segments create $LIST_ID -n "Trial Ending Soon" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_trial", "operator": "equals", "value": "true"},
    {"field": "custom_attributes.trial_end_date", "operator": "less_than", "value": "2024-03-22"},
    {"field": "custom_attributes.trial_end_date", "operator": "greater_than", "value": "2024-03-15"}
  ]
}'

# Paying customers
cakemail segments create $LIST_ID -n "Paying Customers" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_paying", "operator": "equals", "value": "true"}
  ]
}'

# Inactive users (low usage)
cakemail segments create $LIST_ID -n "Inactive Users" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_paying", "operator": "equals", "value": "true"},
    {"field": "custom_attributes.last_login", "operator": "less_than", "value": "2024-02-15"}
  ]
}'

# Churn risk
cakemail segments create $LIST_ID -n "Churn Risk" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.health_score", "operator": "less_than", "value": "40"}
  ]
}'

echo "✓ SaaS segments created"
```

### Workflow 5: Segment Analysis

```bash
#!/bin/bash
# analyze-segments.sh

LIST_ID=123

echo "=== Segment Analysis ==="
echo ""

# Get all segments
SEGMENTS=$(cakemail segments list $LIST_ID -f json | jq -r '.data[].id')

echo "Segment | Name | Count | % of List"
echo "--------|------|-------|----------"

# Get total list size
TOTAL=$(cakemail contacts list $LIST_ID -f json | jq '.count')

for SEG_ID in $SEGMENTS; do
  SEG=$(cakemail segments get $LIST_ID $SEG_ID -f json)

  NAME=$(echo "$SEG" | jq -r '.name' | cut -c1-20)
  COUNT=$(echo "$SEG" | jq -r '.contact_count')

  if [ $TOTAL -gt 0 ]; then
    PERCENT=$(echo "scale=1; $COUNT * 100 / $TOTAL" | bc)
  else
    PERCENT="0"
  fi

  printf "%-7s | %-20s | %5d | %5s%%\n" "$SEG_ID" "$NAME" "$COUNT" "$PERCENT"
done

echo ""
echo "Total list size: $TOTAL"
```

## Using Segments with Campaigns

### Send to Segment

```bash
# Create campaign for segment
$ cakemail campaigns create \
  -n "VIP Exclusive Offer" \
  -l 123 \
  -s 101 \
  --segment 456 \
  --subject "Exclusive Offer for Our VIPs"
```

### Preview Segment Before Sending

```bash
# Check segment size
$ cakemail segments get 123 456 -f json | jq '.contact_count'

# Preview contacts
$ cakemail segments contacts 123 456 -l 10

# Send test to segment sample
$ cakemail campaigns test 790 -e test@example.com
```

### Multiple Segments Campaign

```bash
#!/bin/bash
# send-to-multiple-segments.sh

CAMPAIGN_NAME="March Newsletter"
LIST_ID=123
SENDER_ID=101
SEGMENTS=(456 457 458)

for SEG_ID in "${SEGMENTS[@]}"; do
  SEG_NAME=$(cakemail segments get $LIST_ID $SEG_ID -f json | jq -r '.name')

  echo "Creating campaign for segment: $SEG_NAME"

  CAMPAIGN_ID=$(cakemail campaigns create \
    -n "$CAMPAIGN_NAME - $SEG_NAME" \
    -l $LIST_ID \
    -s $SENDER_ID \
    --segment $SEG_ID \
    --subject "March Newsletter" \
    -f json | jq -r '.id')

  echo "  Campaign created: $CAMPAIGN_ID"

  # Schedule for different times
  # (Example: stagger sends)
  sleep 2
done
```

## Segment Management

### Update Segment Conditions

```bash
# Broaden segment
$ cakemail segments update 123 456 -c '{
  "match": "any",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"},
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-01-01"}
  ]
}'

# Narrow segment
$ cakemail segments update 123 456 -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

### Rename Segment

```bash
$ cakemail segments update 123 456 -n "Highly Engaged Premium Users"
```

### Clone Segment

```bash
#!/bin/bash
# clone-segment.sh

SOURCE_SEG=$1
NEW_NAME="$2"
LIST_ID=123

# Get source segment
SOURCE=$(cakemail segments get $LIST_ID $SOURCE_SEG -f json)
CONDITIONS=$(echo "$SOURCE" | jq -c '.conditions')

# Create new segment with same conditions
cakemail segments create $LIST_ID -n "$NEW_NAME" -c "$CONDITIONS"

echo "✓ Segment cloned"
```

### Delete Unused Segments

```bash
#!/bin/bash
# delete-empty-segments.sh

LIST_ID=123

echo "=== Deleting Empty Segments ==="
echo ""

SEGMENTS=$(cakemail segments list $LIST_ID -f json | jq -r '.data[].id')

for SEG_ID in $SEGMENTS; do
  SEG=$(cakemail segments get $LIST_ID $SEG_ID -f json)
  NAME=$(echo "$SEG" | jq -r '.name')
  COUNT=$(echo "$SEG" | jq -r '.contact_count')

  if [ $COUNT -eq 0 ]; then
    echo "Deleting empty segment: $NAME (ID: $SEG_ID)"
    cakemail segments delete $LIST_ID $SEG_ID --force
  fi
done

echo "✓ Cleanup complete"
```

## Advanced Segmentation

### Time-Based Dynamic Segments

```bash
#!/bin/bash
# update-time-based-segments.sh

LIST_ID=123
SEGMENT_ID=456

# Update to rolling 30-day window
THIRTY_DAYS_AGO=$(date -d "30 days ago" +%Y-%m-%d)

cakemail segments update $LIST_ID $SEGMENT_ID -c "{
  \"match\": \"all\",
  \"rules\": [
    {\"field\": \"last_open_date\", \"operator\": \"greater_than\", \"value\": \"$THIRTY_DAYS_AGO\"}
  ]
}"

echo "✓ Updated to rolling 30-day window"
```

**Schedule with cron:**
```bash
# Update daily at midnight
0 0 * * * /path/to/update-time-based-segments.sh
```

### Combine Segments Logically

```bash
# Segment A OR Segment B (contacts in either)
# Export both, combine, deduplicate

# Segment A AND Segment B (contacts in both)
# Use nested conditions to replicate both segment rules

# Segment A NOT Segment B (in A but not B)
# Export both, find difference
```

### Export Segment for External Processing

```bash
#!/bin/bash
# export-segment.sh

LIST_ID=123
SEGMENT_ID=$1

if [ -z "$SEGMENT_ID" ]; then
  echo "Usage: $0 <segment-id>"
  exit 1
fi

# Get segment contacts
cakemail segments contacts $LIST_ID $SEGMENT_ID -f json | \
  jq -r '.data[] | [.email, .first_name, .last_name] | @csv' > segment-export.csv

echo "✓ Exported to segment-export.csv"
```

## Best Practices

### 1. Name Segments Descriptively

```bash
# Good names
"Highly Engaged - Last 30 Days"
"Premium Plan - Active"
"Trial Ending < 7 Days"
"Cart Abandoned - Last Week"

# Avoid
"Segment 1"
"Test"
"Users"
```

### 2. Start Broad, Then Narrow

```bash
# Start with broad segment
$ cakemail segments create 123 -n "Engaged Users" -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"}
  ]
}'

# Preview size
$ cakemail segments get 123 456 -f json | jq '.contact_count'

# If too large, narrow
$ cakemail segments update 123 456 -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"},
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

### 3. Document Complex Segments

```bash
# Create README for segment definitions
cat > segments-documentation.md << 'EOF'
# Segment Definitions

## High Value Customers (ID: 456)
- **Rules:** LTV > $1000 AND Status = Subscribed
- **Purpose:** Exclusive offers and VIP treatment
- **Expected Size:** ~5% of list
- **Owner:** Marketing Team
- **Created:** 2024-03-15

## At Risk (ID: 457)
- **Rules:** No open 30-90 days AND Status = Subscribed
- **Purpose:** Re-engagement campaigns
- **Expected Size:** ~15-20% of list
- **Owner:** Retention Team
- **Created:** 2024-03-15
EOF
```

### 4. Monitor Segment Health

```bash
#!/bin/bash
# monitor-segments.sh

LIST_ID=123

echo "=== Segment Health Check ==="
echo ""

SEGMENTS=$(cakemail segments list $LIST_ID -f json | jq -r '.data[].id')

for SEG_ID in $SEGMENTS; do
  SEG=$(cakemail segments get $LIST_ID $SEG_ID -f json)
  NAME=$(echo "$SEG" | jq -r '.name')
  COUNT=$(echo "$SEG" | jq -r '.contact_count')

  echo "$NAME (ID: $SEG_ID)"
  echo "  Contacts: $COUNT"

  if [ $COUNT -eq 0 ]; then
    echo "  ⚠️  Empty segment - review conditions"
  elif [ $COUNT -lt 10 ]; then
    echo "  ⚠️  Very small segment - may need adjustment"
  else
    echo "  ✅ Healthy"
  fi

  echo ""
done
```

### 5. Test Before Large Sends

```bash
# Create test segment (small sample)
$ cakemail segments create 123 -n "Test - Premium Users" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"},
    {"field": "email", "operator": "contains", "value": "@yourcompany.com"}
  ]
}'

# Send to test segment first
$ cakemail campaigns create -n "Test Campaign" -l 123 -s 101 --segment 456

# Review results
# Then send to full segment
```

## Troubleshooting

### Segment Has Zero Contacts

**Problem:** Created segment but contact_count is 0

**Solutions:**
```bash
# 1. Check segment conditions
$ cakemail segments get 123 456 -f json | jq '.conditions'

# 2. Test individual rules
# Try with just one rule to see if any contacts match
$ cakemail segments update 123 456 -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}'

# 3. Check if contacts have required attributes
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes'

# 4. Verify date format
# Use YYYY-MM-DD format
$ cakemail segments update 123 456 -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

### Segment Larger Than Expected

**Problem:** Segment includes more contacts than anticipated

**Solutions:**
```bash
# Preview contacts
$ cakemail segments contacts 123 456 -l 50

# Export for analysis
$ cakemail segments contacts 123 456 -f json > review.json

# Check specific contacts
$ jq '.data[] | {email, status, last_open_date, custom_attributes}' review.json

# Adjust conditions to be more restrictive
$ cakemail segments update 123 456 -c '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"},
    {"field": "last_click_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

### Custom Attribute Rule Not Working

**Problem:** Rule on custom attribute not matching contacts

**Solutions:**
```bash
# 1. Verify attribute exists
$ cakemail attributes list 123

# 2. Check exact attribute name
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes | keys'

# 3. Use correct dot notation
# Correct:
{"field": "custom_attributes.plan_type", "operator": "equals", "value": "premium"}

# Wrong:
{"field": "plan_type", "operator": "equals", "value": "premium"}

# 4. Check value type (string vs number vs boolean)
# For numbers (no quotes):
{"field": "custom_attributes.age", "operator": "greater_than", "value": "25"}

# For booleans:
{"field": "custom_attributes.is_vip", "operator": "equals", "value": "true"}
```

### Date Comparison Not Working

**Problem:** Date-based rules not matching correctly

**Solutions:**
```bash
# Use ISO format (YYYY-MM-DD)
{"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}

# Not: "03/01/2024" or "March 1, 2024"

# For rolling dates, use script:
THIRTY_DAYS_AGO=$(date -d "30 days ago" +%Y-%m-%d)

$ cakemail segments update 123 456 -c "{
  \"match\": \"all\",
  \"rules\": [
    {\"field\": \"last_open_date\", \"operator\": \"greater_than\", \"value\": \"$THIRTY_DAYS_AGO\"}
  ]
}"
```

## Best Practices Summary

1. **Name descriptively** - Clear, specific segment names
2. **Start broad** - Begin with simple rules, narrow as needed
3. **Preview first** - Check contacts before sending campaigns
4. **Document segments** - Keep record of purpose and conditions
5. **Monitor size** - Track segment growth/shrinkage
6. **Test conditions** - Verify rules match expected contacts
7. **Use date-based rules** - Leverage dynamic date filtering
8. **Combine wisely** - Use "any" vs "all" appropriately
9. **Regular audits** - Review and clean unused segments
10. **Update dynamically** - Leverage automated condition updates

