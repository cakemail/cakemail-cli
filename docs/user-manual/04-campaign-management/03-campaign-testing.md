# Campaign Testing

Test campaigns thoroughly before sending to ensure perfect delivery and presentation.

## Overview

Campaign testing allows you to:
- Send test emails to verify appearance
- Check content, links, and formatting
- Test merge tags and personalization
- Preview in multiple email clients
- Validate before scheduling
- Catch errors early

Testing is critical to ensure campaigns look professional and function correctly across different email clients and devices.

## Quick Start

### Send a Test Email

```bash
$ cakemail campaigns test 790 -e test@example.com
```

**Output:**
```
✓ Test email sent to test@example.com
```

Check your inbox to review the campaign.

## Test Email Basics

### Send to Single Recipient

```bash
$ cakemail campaigns test 790 -e john@company.com
```

**Output:**
```
✓ Test email sent to john@company.com
```

### Send to Multiple Recipients

```bash
$ cakemail campaigns test 790 -e john@company.com,mary@company.com,team@company.com
```

**Output:**
```
✓ Test email sent to 3 recipients:
  • john@company.com
  • mary@company.com
  • team@company.com
```

### Send to Team Distribution List

```bash
# Set up team emails in environment
$ export TEST_TEAM="editor@company.com,designer@company.com,manager@company.com"

$ cakemail campaigns test 790 -e $TEST_TEAM
```

## Testing Workflow

### Pre-Send Testing Checklist

```bash
#!/bin/bash
# pre-send-test.sh

CAMPAIGN_ID=$1

if [ -z "$CAMPAIGN_ID" ]; then
  echo "Usage: $0 <campaign-id>"
  exit 1
fi

echo "=== Pre-Send Testing for Campaign $CAMPAIGN_ID ==="
echo ""

# Step 1: Get campaign details
echo "1. Reviewing campaign details..."
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)
SUBJECT=$(echo "$CAMPAIGN" | jq -r '.subject')
SENDER=$(echo "$CAMPAIGN" | jq -r '.sender_name')
FROM=$(echo "$CAMPAIGN" | jq -r '.sender_email')

echo "   Subject: $SUBJECT"
echo "   From: $SENDER <$FROM>"
echo ""

# Step 2: Send test to review team
echo "2. Sending test email to review team..."
cakemail campaigns test $CAMPAIGN_ID -e "editor@company.com,designer@company.com"
echo ""

# Step 3: Wait for review
echo "3. Review test email for:"
echo "   ☐ Subject line clear and compelling"
echo "   ☐ Sender name correct"
echo "   ☐ Header/footer present"
echo "   ☐ All images load"
echo "   ☐ All links work"
echo "   ☐ Merge tags display correctly"
echo "   ☐ Mobile responsive"
echo "   ☐ Unsubscribe link present"
echo ""

# Step 4: Get approval
read -p "Tests passed? (yes/no): " APPROVAL

if [ "$APPROVAL" == "yes" ]; then
  echo ""
  echo "✅ Campaign ready for scheduling"
  echo "   Run: cakemail campaigns schedule $CAMPAIGN_ID"
else
  echo ""
  echo "⚠️  Review feedback and make changes"
  echo "   Run: cakemail campaigns update $CAMPAIGN_ID --subject \"New Subject\""
fi
```

### Make this executable:

```bash
$ chmod +x pre-send-test.sh
$ ./pre-send-test.sh 790
```

## Testing Merge Tags

### Test Personalization

Campaign with merge tags:

```html
<p>Hi {{first_name}},</p>
<p>Your account status: {{custom_attributes.plan_type}}</p>
<p>Signed up: {{custom_attributes.signup_date}}</p>
```

**Test with sample data:**

```bash
# Create test contact with sample data
$ cakemail contacts add \
  -e "testuser@example.com" \
  --first-name "John" \
  --last-name "Doe" \
  -d '{"plan_type":"premium","signup_date":"2024-01-15"}'

# Send test
$ cakemail campaigns test 790 -e testuser@example.com
```

**Test email will show:**
```
Hi John,
Your account status: premium
Signed up: 2024-01-15
```

### Test with Missing Data

```bash
# Create contact without custom attributes
$ cakemail contacts add -e "incomplete@example.com" --first-name "Jane"

# Send test
$ cakemail campaigns test 790 -e incomplete@example.com
```

**Verify fallbacks:**
- Missing first_name → Check fallback text
- Missing custom_attributes → Ensure no broken tags

### Test Multiple Scenarios

```bash
#!/bin/bash
# test-personalization.sh

CAMPAIGN_ID=790

# Test Scenario 1: Complete data
echo "Testing with complete data..."
cakemail campaigns test $CAMPAIGN_ID -e john.complete@test.com

# Test Scenario 2: Missing first name
echo "Testing with missing first name..."
cakemail campaigns test $CAMPAIGN_ID -e nofirstname@test.com

# Test Scenario 3: Missing custom attributes
echo "Testing with missing attributes..."
cakemail campaigns test $CAMPAIGN_ID -e noattrs@test.com

echo ""
echo "✅ All test scenarios sent"
echo "Review each test email to verify merge tag behavior"
```

## Testing Links

### Verify All Links Work

After sending test:

```bash
#!/bin/bash
# check-links.sh

TEST_EMAIL="test@example.com"

echo "=== Link Testing Checklist ==="
echo ""
echo "Test email sent to: $TEST_EMAIL"
echo ""
echo "Manual checks required:"
echo ""
echo "☐ Header logo links to website"
echo "☐ CTA button links correctly"
echo "☐ Product links include tracking parameters"
echo "☐ Social media icons link to profiles"
echo "☐ Unsubscribe link works"
echo "☐ View in browser link works"
echo "☐ Footer address/contact links work"
echo ""
echo "Verify tracking:"
echo "☐ Links include click tracking"
echo "☐ UTM parameters present"
echo "☐ Custom tracking parameters correct"
echo ""
```

### Test Link Tracking

```bash
# Get campaign with tracking enabled
$ cakemail campaigns get 790 -f json | jq '{id, name, tracking_enabled: .settings.track_clicks}'
```

**Output:**
```json
{
  "id": 790,
  "name": "March Newsletter",
  "tracking_enabled": true
}
```

**In test email:**
- Links should be wrapped with tracking domain
- Example: `https://tracking.cakemail.com/click/abc123...`
- Clicking link redirects to actual destination

## Cross-Client Testing

### Test in Multiple Email Clients

```bash
#!/bin/bash
# multi-client-test.sh

CAMPAIGN_ID=790

echo "=== Multi-Client Testing ==="
echo ""
echo "Sending test emails to various clients..."
echo ""

# Gmail
cakemail campaigns test $CAMPAIGN_ID -e your.gmail@gmail.com
echo "✓ Gmail test sent"

# Outlook
cakemail campaigns test $CAMPAIGN_ID -e your.outlook@outlook.com
echo "✓ Outlook test sent"

# Apple Mail
cakemail campaigns test $CAMPAIGN_ID -e your.apple@icloud.com
echo "✓ Apple Mail test sent"

# Yahoo
cakemail campaigns test $CAMPAIGN_ID -e your.yahoo@yahoo.com
echo "✓ Yahoo test sent"

echo ""
echo "Check each client for:"
echo "  • Layout/formatting"
echo "  • Image display"
echo "  • Font rendering"
echo "  • Button styling"
echo "  • Responsive behavior"
```

### Device Testing

Test on different devices:

1. **Desktop** - Send to desktop email client
2. **Mobile** - Check on phone
3. **Tablet** - Verify tablet layout
4. **Webmail** - Test in browser

```bash
# Send test for mobile review
$ cakemail campaigns test 790 -e your.phone@gmail.com

# Check on mobile device:
# - Text readable without zooming
# - Buttons large enough to tap
# - Images scale properly
# - Single-column layout
# - CTA buttons prominent
```

## Testing Templates

### Test Template with Content

```bash
# Create campaign from template
$ CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Template Test" \
  -l 123 \
  -s 101 \
  --template 201 \
  -f json | jq -r '.id')

# Send test
$ cakemail campaigns test $CAMPAIGN_ID -e test@example.com

# Review:
# - Template structure correct
# - Content areas filled properly
# - Template merge tags work
# - Styling consistent
```

### Test Template Changes

```bash
#!/bin/bash
# test-template-changes.sh

TEMPLATE_ID=201

echo "Testing template changes..."

# Create test campaign
CAMPAIGN=$(cakemail campaigns create \
  -n "Template Test $(date +%s)" \
  -l 123 \
  -s 101 \
  --template $TEMPLATE_ID \
  -f json)

CAMPAIGN_ID=$(echo "$CAMPAIGN" | jq -r '.id')

echo "Created test campaign: $CAMPAIGN_ID"

# Send test
cakemail campaigns test $CAMPAIGN_ID -e template-review@company.com

echo ""
echo "✓ Test sent to template-review@company.com"
echo ""
echo "Verify:"
echo "  • Template changes applied correctly"
echo "  • No broken layouts"
echo "  • All sections render properly"
echo ""

# Clean up
read -p "Delete test campaign? (yes/no): " DELETE
if [ "$DELETE" == "yes" ]; then
  cakemail campaigns delete $CAMPAIGN_ID --force
  echo "✓ Test campaign deleted"
fi
```

## A/B Testing

### Test Subject Lines

Create variations to test:

```bash
#!/bin/bash
# ab-test-subjects.sh

LIST_ID=123
SENDER_ID=101
TEMPLATE=201

# Version A
ID_A=$(cakemail campaigns create \
  -n "A/B Test - Subject A" \
  -l $LIST_ID \
  -s $SENDER_ID \
  --template $TEMPLATE \
  --subject "Save 20% This Week" \
  -f json | jq -r '.id')

# Version B
ID_B=$(cakemail campaigns create \
  -n "A/B Test - Subject B" \
  -l $LIST_ID \
  -s $SENDER_ID \
  --template $TEMPLATE \
  --subject "Your Exclusive 20% Discount" \
  -f json | jq -r '.id')

echo "Created A/B test campaigns:"
echo "Version A (ID: $ID_A): Save 20% This Week"
echo "Version B (ID: $ID_B): Your Exclusive 20% Discount"
echo ""

# Send tests
echo "Sending tests for review..."
cakemail campaigns test $ID_A -e team@company.com
cakemail campaigns test $ID_B -e team@company.com

echo ""
echo "✓ Both versions sent to team@company.com"
echo ""
echo "Compare and decide which to use"
```

### Test Content Variations

```bash
#!/bin/bash
# ab-test-content.sh

# Version A: Short form
ID_A=$(cakemail campaigns create \
  -n "A/B Test - Short Content" \
  -l 123 \
  -s 101 \
  --html "<h1>Quick Update</h1><p>Brief message...</p>" \
  --subject "Quick Update" \
  -f json | jq -r '.id')

# Version B: Long form
ID_B=$(cakemail campaigns create \
  -n "A/B Test - Long Content" \
  -l 123 \
  -s 101 \
  --html "<h1>Detailed Update</h1><p>Long detailed message...</p>" \
  --subject "Detailed Update" \
  -f json | jq -r '.id')

# Send tests
cakemail campaigns test $ID_A -e review@company.com
cakemail campaigns test $ID_B -e review@company.com

echo "A/B content test sent"
echo "Choose version with better engagement"
```

## Testing Best Practices

### 1. Always Test Before Scheduling

```bash
# Bad: Schedule without testing
$ cakemail campaigns schedule 790  # ❌

# Good: Test first, then schedule
$ cakemail campaigns test 790 -e team@company.com  # ✅
# Review email
$ cakemail campaigns schedule 790
```

### 2. Test with Real Data

```bash
# Create realistic test contact
$ cakemail contacts add \
  -e "realistic.test@example.com" \
  --first-name "John" \
  --last-name "Smith" \
  -d '{
    "plan_type": "premium",
    "signup_date": "2024-01-15",
    "purchase_count": 5,
    "is_vip": true
  }'

# Test shows how real subscribers will see it
$ cakemail campaigns test 790 -e realistic.test@example.com
```

### 3. Test Multiple Times

```bash
#!/bin/bash
# iterative-testing.sh

CAMPAIGN_ID=790

# Round 1: Initial test
echo "Round 1: Initial review..."
cakemail campaigns test $CAMPAIGN_ID -e editor@company.com
read -p "Issues found? (yes/no): " HAS_ISSUES

while [ "$HAS_ISSUES" == "yes" ]; do
  echo "Make changes to campaign..."
  read -p "Press Enter when changes made..."

  # Send new test
  cakemail campaigns test $CAMPAIGN_ID -e editor@company.com
  read -p "Issues found? (yes/no): " HAS_ISSUES
done

echo "✅ Campaign approved"
```

### 4. Document Test Results

```bash
#!/bin/bash
# log-test-results.sh

CAMPAIGN_ID=$1
LOG_FILE="campaign-tests.log"

echo "=== Test Log ===" >> $LOG_FILE
echo "Date: $(date)" >> $LOG_FILE
echo "Campaign: $CAMPAIGN_ID" >> $LOG_FILE
echo "Tester: $USER" >> $LOG_FILE
echo "" >> $LOG_FILE

read -p "Test passed? (yes/no): " RESULT
echo "Result: $RESULT" >> $LOG_FILE

if [ "$RESULT" != "yes" ]; then
  read -p "Issues found: " ISSUES
  echo "Issues: $ISSUES" >> $LOG_FILE
fi

echo "---" >> $LOG_FILE
echo "" >> $LOG_FILE

cat $LOG_FILE
```

### 5. Use Test Distribution Lists

Create reusable test groups:

```bash
# Set in environment or script
export TEST_EDITORS="editor1@company.com,editor2@company.com"
export TEST_DESIGNERS="designer1@company.com,designer2@company.com"
export TEST_ALL="editor1@company.com,editor2@company.com,designer1@company.com,designer2@company.com,manager@company.com"

# Use in tests
$ cakemail campaigns test 790 -e $TEST_EDITORS  # Content review
$ cakemail campaigns test 790 -e $TEST_DESIGNERS  # Visual review
$ cakemail campaigns test 790 -e $TEST_ALL  # Final review
```

## Advanced Testing Workflows

### Workflow 1: Comprehensive Testing

```bash
#!/bin/bash
# comprehensive-test.sh

CAMPAIGN_ID=$1

echo "=== Comprehensive Campaign Testing ==="
echo ""

# 1. Campaign details
echo "1. Campaign Details:"
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)
echo "   Name: $(echo "$CAMPAIGN" | jq -r '.name')"
echo "   Subject: $(echo "$CAMPAIGN" | jq -r '.subject')"
echo "   List: $(echo "$CAMPAIGN" | jq -r '.list_id')"
echo ""

# 2. Content test
echo "2. Sending content review test..."
cakemail campaigns test $CAMPAIGN_ID -e editor@company.com
echo "   ✓ Sent to editor@company.com"
echo ""

# 3. Design test
echo "3. Sending design review test..."
cakemail campaigns test $CAMPAIGN_ID -e designer@company.com
echo "   ✓ Sent to designer@company.com"
echo ""

# 4. Multi-client test
echo "4. Sending multi-client tests..."
cakemail campaigns test $CAMPAIGN_ID -e gmail.test@gmail.com
cakemail campaigns test $CAMPAIGN_ID -e outlook.test@outlook.com
echo "   ✓ Sent to multiple clients"
echo ""

# 5. Mobile test
echo "5. Sending mobile test..."
cakemail campaigns test $CAMPAIGN_ID -e mobile.test@gmail.com
echo "   ✓ Sent for mobile review"
echo ""

# 6. Link verification
echo "6. Link Verification:"
echo "   Manual check required:"
echo "   • Click all links in test email"
echo "   • Verify tracking parameters"
echo "   • Test unsubscribe flow"
echo ""

# 7. Approval
read -p "All tests passed? (yes/no): " APPROVED

if [ "$APPROVED" == "yes" ]; then
  echo ""
  echo "✅ Campaign ready for scheduling"
  read -p "Schedule now? (yes/no): " SCHEDULE

  if [ "$SCHEDULE" == "yes" ]; then
    cakemail campaigns schedule $CAMPAIGN_ID
  fi
else
  echo ""
  echo "⚠️  Address issues before scheduling"
fi
```

### Workflow 2: Regression Testing

Test existing campaigns after template changes:

```bash
#!/bin/bash
# regression-test.sh

TEMPLATE_ID=201

echo "=== Template Regression Testing ==="
echo ""

# Find all campaigns using this template
CAMPAIGNS=$(cakemail campaigns list \
  --filter "template_id==$TEMPLATE_ID;status==draft" \
  -f json | jq -r '.data[].id')

if [ -z "$CAMPAIGNS" ]; then
  echo "No draft campaigns using template $TEMPLATE_ID"
  exit 0
fi

echo "Found campaigns using template $TEMPLATE_ID:"
for ID in $CAMPAIGNS; do
  NAME=$(cakemail campaigns get $ID -f json | jq -r '.name')
  echo "  • $NAME (ID: $ID)"
done

echo ""
echo "Sending regression tests..."

for ID in $CAMPAIGNS; do
  cakemail campaigns test $ID -e regression@company.com
  echo "  ✓ Test sent for campaign $ID"
done

echo ""
echo "✅ All regression tests sent to regression@company.com"
echo "Verify template changes don't break existing campaigns"
```

### Workflow 3: Stakeholder Review

```bash
#!/bin/bash
# stakeholder-review.sh

CAMPAIGN_ID=$1

echo "=== Stakeholder Review Process ==="
echo ""

# Define stakeholders
STAKEHOLDERS=(
  "editor@company.com:Content Editor"
  "designer@company.com:Designer"
  "manager@company.com:Marketing Manager"
  "legal@company.com:Legal Compliance"
)

# Send to each stakeholder
for STAKEHOLDER in "${STAKEHOLDERS[@]}"; do
  EMAIL=$(echo $STAKEHOLDER | cut -d: -f1)
  ROLE=$(echo $STAKEHOLDER | cut -d: -f2)

  echo "Sending to $ROLE ($EMAIL)..."
  cakemail campaigns test $CAMPAIGN_ID -e $EMAIL
  echo "  ✓ Sent"
done

echo ""
echo "✅ Review requests sent to all stakeholders"
echo ""
echo "Stakeholder Approval Checklist:"
for STAKEHOLDER in "${STAKEHOLDERS[@]}"; do
  ROLE=$(echo $STAKEHOLDER | cut -d: -f2)
  echo "  ☐ $ROLE approval"
done

echo ""
read -p "All approvals received? (yes/no): " ALL_APPROVED

if [ "$ALL_APPROVED" == "yes" ]; then
  echo "✅ Campaign approved for scheduling"
else
  echo "⚠️  Waiting for approvals..."
fi
```

### Workflow 4: Automated Quality Checks

```bash
#!/bin/bash
# quality-checks.sh

CAMPAIGN_ID=$1

echo "=== Automated Quality Checks ==="
echo ""

CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)

# Check 1: Subject line
SUBJECT=$(echo "$CAMPAIGN" | jq -r '.subject')
SUBJECT_LEN=${#SUBJECT}

echo "Check 1: Subject Line"
if [ $SUBJECT_LEN -gt 60 ]; then
  echo "  ⚠️  Subject too long ($SUBJECT_LEN chars, recommended < 60)"
else
  echo "  ✅ Subject length OK ($SUBJECT_LEN chars)"
fi

# Check 2: Has HTML content
HAS_HTML=$(echo "$CAMPAIGN" | jq -r '.html' | grep -v "null")
echo "Check 2: HTML Content"
if [ -z "$HAS_HTML" ]; then
  echo "  ❌ No HTML content"
else
  echo "  ✅ HTML content present"
fi

# Check 3: Has plain text
HAS_TEXT=$(echo "$CAMPAIGN" | jq -r '.text' | grep -v "null")
echo "Check 3: Plain Text Version"
if [ -z "$HAS_TEXT" ]; then
  echo "  ⚠️  No plain text version (recommended)"
else
  echo "  ✅ Plain text present"
fi

# Check 4: Sender verified
SENDER_ID=$(echo "$CAMPAIGN" | jq -r '.sender_id')
SENDER_CONFIRMED=$(cakemail senders get $SENDER_ID -f json | jq -r '.confirmed')
echo "Check 4: Sender Verification"
if [ "$SENDER_CONFIRMED" != "true" ]; then
  echo "  ❌ Sender not verified"
else
  echo "  ✅ Sender verified"
fi

# Check 5: List has contacts
LIST_ID=$(echo "$CAMPAIGN" | jq -r '.list_id')
CONTACT_COUNT=$(cakemail contacts list $LIST_ID -f json | jq '.count')
echo "Check 5: Recipient List"
if [ "$CONTACT_COUNT" -eq 0 ]; then
  echo "  ⚠️  List has 0 contacts"
else
  echo "  ✅ List has $CONTACT_COUNT contacts"
fi

echo ""

# Send test if checks pass
if [ "$SENDER_CONFIRMED" == "true" ] && [ -n "$HAS_HTML" ]; then
  echo "Quality checks passed. Sending test..."
  cakemail campaigns test $CAMPAIGN_ID -e quality@company.com
  echo "✅ Test sent to quality@company.com"
else
  echo "❌ Quality checks failed. Fix issues before testing."
fi
```

## Testing Checklist

### Before Sending Test

```
☐ Campaign created and saved
☐ HTML content added
☐ Plain text version added (optional but recommended)
☐ Subject line written
☐ Sender verified
☐ List selected
☐ Merge tags tested
☐ Links include tracking parameters
```

### After Receiving Test

```
☐ Subject line displays correctly
☐ Sender name and email correct
☐ Header loads properly
☐ Body content formatted correctly
☐ Images all load
☐ Buttons display and are clickable
☐ All links work
☐ Merge tags filled correctly
☐ Footer present with required info
☐ Unsubscribe link works
☐ Mobile responsive
```

### Cross-Client Checks

```
☐ Gmail (web and app)
☐ Outlook (desktop and web)
☐ Apple Mail
☐ iPhone Mail app
☐ Android Gmail app
☐ Dark mode (if supported)
```

## Troubleshooting

### Test Email Not Received

**Problem:** Test email not arriving

**Solutions:**

```bash
# Check campaign status
$ cakemail campaigns get 790 -f json | jq '{status, subject}'

# Verify sender is confirmed
$ cakemail senders list -f json | jq '.data[] | select(.confirmed == true)'

# Check spam folder
# - Test emails sometimes flagged as spam
# - Add Cakemail to safe senders list

# Verify email address
$ echo "test@example.com" | grep -E '^[^@]+@[^@]+\.[^@]+$'

# Try different email address
$ cakemail campaigns test 790 -e alternate@example.com
```

### Merge Tags Not Replacing

**Problem:** Merge tags show as {{field_name}} instead of values

**Solutions:**

```bash
# Ensure test contact has data
$ cakemail contacts get 123 501 -f json | jq '{first_name, custom_attributes}'

# If empty, add data
$ cakemail contacts update 123 501 \
  --first-name "John" \
  -d '{"plan_type":"premium"}'

# Send test again
$ cakemail campaigns test 790 -e test@example.com

# Check merge tag syntax
# Correct: {{first_name}}
# Correct: {{custom_attributes.plan_type}}
# Wrong: {{firstName}} or {{plan_type}} (missing custom_attributes)
```

### Links Not Working

**Problem:** Links broken or not clickable

**Solutions:**

```bash
# Check HTML for proper link format
# Correct: <a href="https://example.com">Link</a>
# Wrong: <a href="example.com">Link</a> (missing protocol)

# Verify tracking enabled if needed
$ cakemail campaigns get 790 -f json | jq '.settings.track_clicks'

# Test without tracking
$ cakemail campaigns update 790 --no-track-clicks
$ cakemail campaigns test 790 -e test@example.com

# Re-enable tracking if it was issue
$ cakemail campaigns update 790 --track-clicks
```

### Images Not Loading

**Problem:** Images missing in test email

**Solutions:**

```bash
# Verify image URLs are absolute
# Correct: <img src="https://example.com/image.jpg">
# Wrong: <img src="/images/image.jpg"> (relative path)

# Check image URLs accessible
$ curl -I https://example.com/image.jpg
# Should return 200 OK

# Test in different clients
# - Some clients block images by default
# - Include "display images" instructions

# Verify image file size
# - Large images may fail to load
# - Recommended: < 100KB per image
```

### Mobile Layout Issues

**Problem:** Email doesn't display well on mobile

**Solutions:**

```bash
# Use responsive template
$ cakemail templates list -f json | jq '.data[] | select(.mobile_optimized == true)'

# Test mobile-specific version
$ cakemail campaigns test 790 -e your.phone@gmail.com
# Check on actual mobile device

# Verify viewport meta tag in HTML
# Required: <meta name="viewport" content="width=device-width, initial-scale=1">

# Use single-column layout
# Avoid multi-column designs for mobile
```

### Test Email Goes to Spam

**Problem:** Test emails landing in spam folder

**Solutions:**

```bash
# Verify sender authenticated
$ cakemail senders get 101 -f json | jq '{email, confirmed, dkim_enabled, spf_enabled}'

# Check subject line
# Avoid: ALL CAPS, excessive !!!, "FREE", "ACT NOW"

# Add company domain to safe senders
# In email client settings

# Test from different sender
$ cakemail campaigns update 790 --sender-id 102
$ cakemail campaigns test 790 -e test@example.com
```

## Best Practices Summary

1. **Always test before scheduling** - Never schedule without reviewing test email
2. **Test with real data** - Use realistic contact data for accurate previews
3. **Test multiple clients** - Verify appearance in Gmail, Outlook, Apple Mail
4. **Test on mobile** - Ensure responsive design works on phones
5. **Test all links** - Click every link to verify functionality
6. **Test merge tags** - Verify personalization with actual contact data
7. **Get stakeholder approval** - Send tests to editors, designers, managers
8. **Document test results** - Keep log of tests and issues found
9. **Iterate and retest** - Test after every significant change
10. **Use test distribution lists** - Create reusable test email groups

