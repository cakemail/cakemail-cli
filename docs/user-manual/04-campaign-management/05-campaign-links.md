# Campaign Links & Tracking

Master link management, click tracking, and link analytics for campaigns.

## Overview

Campaign links allow you to:
- Track which links recipients click
- Analyze click-through rates
- Identify popular content
- Measure campaign engagement
- Optimize future campaigns
- Add UTM tracking parameters

Link tracking provides valuable insights into what content resonates with your audience.

## Quick Start

### View Campaign Links

```bash
$ cakemail reports campaign-links 790
```

**Output:**
```
┌────────────────────────────────────────┬────────┬─────────┬─────────┐
│ URL                                    │ Clicks │ Unique  │ CTR     │
├────────────────────────────────────────┼────────┼─────────┼─────────┤
│ https://example.com/product           │ 450    │ 320     │ 15.2%   │
│ https://example.com/blog/article      │ 230    │ 180     │ 8.5%    │
│ https://example.com/special-offer     │ 180    │ 150     │ 7.1%    │
│ https://example.com/contact           │ 90     │ 75      │ 3.6%    │
└────────────────────────────────────────┴────────┴─────────┴─────────┘

Total clicks: 950 (725 unique)
Overall CTR: 34.4%
```

## Understanding Link Tracking

### How Link Tracking Works

When tracking enabled:

**Original link:**
```html
<a href="https://example.com/product">View Product</a>
```

**Tracked link (in email):**
```html
<a href="https://tracking.cakemail.com/click/abc123def456...">View Product</a>
```

**Process:**
1. Recipient clicks tracked link
2. Cakemail records click
3. Recipient redirected to actual destination
4. Click attributed to specific recipient

### Enable/Disable Tracking

**Enable click tracking:**
```bash
$ cakemail campaigns update 790 --track-clicks
```

**Disable click tracking:**
```bash
$ cakemail campaigns update 790 --no-track-clicks
```

**Check tracking status:**
```bash
$ cakemail campaigns get 790 -f json | jq '.settings.track_clicks'
```

**Output:**
```
true
```

## Link Analytics

### View All Campaign Links

```bash
$ cakemail reports campaign-links 790
```

Shows all links in campaign with click stats.

### Export Link Data

```bash
$ cakemail reports campaign-links 790 -f json > links-790.json
```

**Output:**
```json
{
  "campaign_id": 790,
  "links": [
    {
      "url": "https://example.com/product",
      "total_clicks": 450,
      "unique_clicks": 320,
      "ctr": 15.2
    },
    {
      "url": "https://example.com/blog/article",
      "total_clicks": 230,
      "unique_clicks": 180,
      "ctr": 8.5
    }
  ],
  "total_clicks": 950,
  "unique_clicks": 725,
  "overall_ctr": 34.4
}
```

### Analyze Link Performance

```bash
#!/bin/bash
# analyze-links.sh

CAMPAIGN_ID=$1

echo "=== Link Performance Analysis ==="
echo ""

# Get link data
LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json)

# Top performing link
TOP_LINK=$(echo "$LINKS" | jq -r '.links | sort_by(-.unique_clicks) | .[0]')
echo "Top Performing Link:"
echo "  URL: $(echo "$TOP_LINK" | jq -r '.url')"
echo "  Unique Clicks: $(echo "$TOP_LINK" | jq -r '.unique_clicks')"
echo "  CTR: $(echo "$TOP_LINK" | jq -r '.ctr')%"
echo ""

# Lowest performing link
LOW_LINK=$(echo "$LINKS" | jq -r '.links | sort_by(.unique_clicks) | .[0]')
echo "Lowest Performing Link:"
echo "  URL: $(echo "$LOW_LINK" | jq -r '.url')"
echo "  Unique Clicks: $(echo "$LOW_LINK" | jq -r '.unique_clicks')"
echo "  CTR: $(echo "$LOW_LINK" | jq -r '.ctr')%"
echo ""

# Overall stats
echo "Overall Performance:"
echo "  Total Clicks: $(echo "$LINKS" | jq -r '.total_clicks')"
echo "  Unique Clicks: $(echo "$LINKS" | jq -r '.unique_clicks')"
echo "  CTR: $(echo "$LINKS" | jq -r '.overall_ctr')%"
```

## Link Best Practices

### 1. Clear Call-to-Action

```html
<!-- Good: Clear CTA -->
<a href="https://example.com/product">Shop Now</a>
<a href="https://example.com/download">Download Guide</a>
<a href="https://example.com/signup">Start Free Trial</a>

<!-- Avoid: Generic text -->
<a href="https://example.com">Click here</a>
<a href="https://example.com">Read more</a>
```

### 2. Button vs Text Links

```html
<!-- Button (higher visibility) -->
<a href="https://example.com/buy" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
  Buy Now
</a>

<!-- Text link (lower visibility) -->
<a href="https://example.com/learn-more">Learn more about our products</a>
```

**Performance:**
- Buttons typically get 2-3x more clicks
- Use buttons for primary CTAs
- Use text links for secondary content

### 3. Link Placement

```html
<!-- Above the fold (higher CTR) -->
<h1>Special Offer</h1>
<p>Save 20% today!</p>
<a href="https://example.com/offer">Get Discount</a>

<!-- Multiple CTAs -->
<a href="https://example.com/offer">Top CTA</a>
<!-- Content -->
<a href="https://example.com/offer">Middle CTA</a>
<!-- More content -->
<a href="https://example.com/offer">Bottom CTA</a>
```

**Best practices:**
- Primary CTA above the fold
- Repeat CTA 2-3 times for longer emails
- Most important link first

### 4. Link Density

```html
<!-- Good: Focused (2-3 main links) -->
<a href="https://example.com/product1">Product 1</a>
<a href="https://example.com/product2">Product 2</a>
<a href="https://example.com/shop">Shop All</a>

<!-- Avoid: Too many links (confuses readers) -->
<a href="...">Link 1</a> <a href="...">Link 2</a> <a href="...">Link 3</a>
<a href="...">Link 4</a> <a href="...">Link 5</a> <a href="...">Link 6</a>
<a href="...">Link 7</a> <a href="...">Link 8</a> <a href="...">Link 9</a>
```

**Recommendations:**
- 2-3 primary links ideal
- Maximum 5-7 total links
- Each link should have clear purpose

## UTM Parameters

### Adding UTM Tracking

UTM parameters track campaign performance in Google Analytics:

```bash
# Base URL
https://example.com/product

# With UTM parameters
https://example.com/product?utm_source=cakemail&utm_medium=email&utm_campaign=march_newsletter
```

### UTM Parameter Reference

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_source` | Traffic source | `cakemail` |
| `utm_medium` | Marketing medium | `email` |
| `utm_campaign` | Campaign name | `march_newsletter` |
| `utm_content` | Content variant | `header_cta` |
| `utm_term` | Keyword (paid search) | `running_shoes` |

### Build UTM Links

```bash
#!/bin/bash
# build-utm-link.sh

BASE_URL="https://example.com/product"
SOURCE="cakemail"
MEDIUM="email"
CAMPAIGN="march_newsletter"
CONTENT="$1"  # Pass as argument

# Build UTM link
UTM_LINK="${BASE_URL}?utm_source=${SOURCE}&utm_medium=${MEDIUM}&utm_campaign=${CAMPAIGN}&utm_content=${CONTENT}"

echo "UTM Link: $UTM_LINK"
```

**Usage:**
```bash
$ ./build-utm-link.sh header_cta
UTM Link: https://example.com/product?utm_source=cakemail&utm_medium=email&utm_campaign=march_newsletter&utm_content=header_cta

$ ./build-utm-link.sh footer_cta
UTM Link: https://example.com/product?utm_source=cakemail&utm_medium=email&utm_campaign=march_newsletter&utm_content=footer_cta
```

### UTM Campaign Template

```html
<!-- Header CTA -->
<a href="https://example.com/offer?utm_source=cakemail&utm_medium=email&utm_campaign=spring_sale&utm_content=header_cta">
  Shop Spring Sale
</a>

<!-- Product 1 -->
<a href="https://example.com/product1?utm_source=cakemail&utm_medium=email&utm_campaign=spring_sale&utm_content=product1">
  View Product 1
</a>

<!-- Product 2 -->
<a href="https://example.com/product2?utm_source=cakemail&utm_medium=email&utm_campaign=spring_sale&utm_content=product2">
  View Product 2
</a>

<!-- Footer CTA -->
<a href="https://example.com/offer?utm_source=cakemail&utm_medium=email&utm_campaign=spring_sale&utm_content=footer_cta">
  Shop Now
</a>
```

### Bulk Add UTM Parameters

```bash
#!/bin/bash
# add-utm-to-links.sh

CAMPAIGN="march_newsletter"
SOURCE="cakemail"
MEDIUM="email"

# Original links
LINKS=(
  "https://example.com/product1"
  "https://example.com/product2"
  "https://example.com/blog"
)

echo "Links with UTM parameters:"
echo ""

for LINK in "${LINKS[@]}"; do
  # Check if URL already has parameters
  if [[ $LINK == *"?"* ]]; then
    SEPARATOR="&"
  else
    SEPARATOR="?"
  fi

  UTM="${LINK}${SEPARATOR}utm_source=${SOURCE}&utm_medium=${MEDIUM}&utm_campaign=${CAMPAIGN}"
  echo "$UTM"
done
```

## Link Comparison

### Compare Link Performance Across Campaigns

```bash
#!/bin/bash
# compare-links.sh

CAMPAIGN_1=$1
CAMPAIGN_2=$2

echo "=== Link Performance Comparison ==="
echo ""

# Campaign 1 links
echo "Campaign $CAMPAIGN_1:"
LINKS_1=$(cakemail reports campaign-links $CAMPAIGN_1 -f json)
echo "  Total Clicks: $(echo "$LINKS_1" | jq -r '.total_clicks')"
echo "  CTR: $(echo "$LINKS_1" | jq -r '.overall_ctr')%"
echo "  Top Link: $(echo "$LINKS_1" | jq -r '.links | sort_by(-.unique_clicks) | .[0].url')"
echo ""

# Campaign 2 links
echo "Campaign $CAMPAIGN_2:"
LINKS_2=$(cakemail reports campaign-links $CAMPAIGN_2 -f json)
echo "  Total Clicks: $(echo "$LINKS_2" | jq -r '.total_clicks')"
echo "  CTR: $(echo "$LINKS_2" | jq -r '.overall_ctr')%"
echo "  Top Link: $(echo "$LINKS_2" | jq -r '.links | sort_by(-.unique_clicks) | .[0].url')"
echo ""

# Comparison
CLICKS_1=$(echo "$LINKS_1" | jq -r '.total_clicks')
CLICKS_2=$(echo "$LINKS_2" | jq -r '.total_clicks')

if [ $CLICKS_1 -gt $CLICKS_2 ]; then
  PERCENT=$(echo "scale=1; ($CLICKS_1 - $CLICKS_2) * 100 / $CLICKS_2" | bc)
  echo "Campaign $CAMPAIGN_1 had $PERCENT% more clicks"
else
  PERCENT=$(echo "scale=1; ($CLICKS_2 - $CLICKS_1) * 100 / $CLICKS_1" | bc)
  echo "Campaign $CAMPAIGN_2 had $PERCENT% more clicks"
fi
```

### Track Link Evolution

```bash
#!/bin/bash
# track-link-evolution.sh

URL="https://example.com/product"

echo "=== Link Evolution: $URL ==="
echo ""

# Get all campaigns
CAMPAIGNS=$(cakemail campaigns list --filter "status==sent" -f json | jq -r '.data[].id')

echo "Campaign | Total Clicks | Unique Clicks | CTR"
echo "---------|--------------|---------------|-----"

for CAMPAIGN_ID in $CAMPAIGNS; do
  LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json 2>/dev/null)

  # Find specific URL in campaign
  LINK_DATA=$(echo "$LINKS" | jq --arg url "$URL" '.links[] | select(.url == $url)')

  if [ -n "$LINK_DATA" ]; then
    TOTAL=$(echo "$LINK_DATA" | jq -r '.total_clicks')
    UNIQUE=$(echo "$LINK_DATA" | jq -r '.unique_clicks')
    CTR=$(echo "$LINK_DATA" | jq -r '.ctr')

    printf "%-8s | %-12s | %-13s | %s%%\n" "$CAMPAIGN_ID" "$TOTAL" "$UNIQUE" "$CTR"
  fi
done
```

## Link Testing

### Test Link Before Sending

```bash
#!/bin/bash
# test-links.sh

CAMPAIGN_ID=$1

echo "=== Testing Campaign Links ==="
echo ""

# Send test email
echo "Sending test email..."
cakemail campaigns test $CAMPAIGN_ID -e link-tester@company.com

echo "✓ Test sent to link-tester@company.com"
echo ""
echo "Manual Link Testing Checklist:"
echo "  ☐ All links clickable"
echo "  ☐ Links go to correct destinations"
echo "  ☐ UTM parameters present"
echo "  ☐ Tracking parameters work"
echo "  ☐ Landing pages load correctly"
echo "  ☐ Mobile links work on phone"
echo "  ☐ No broken links (404 errors)"
echo ""
```

### Validate Link Destinations

```bash
#!/bin/bash
# validate-links.sh

# Extract links from campaign HTML
CAMPAIGN_ID=$1
HTML=$(cakemail campaigns get $CAMPAIGN_ID -f json | jq -r '.html')

# Extract all URLs (basic regex)
URLS=$(echo "$HTML" | grep -oE 'href="[^"]+"' | sed 's/href="//g' | sed 's/"//g')

echo "=== Validating Campaign Links ==="
echo ""

for URL in $URLS; do
  # Skip special links
  if [[ $URL == "mailto:"* ]] || [[ $URL == "#"* ]] || [[ $URL == "{{"* ]]; then
    continue
  fi

  # Check URL
  STATUS=$(curl -o /dev/null -s -w "%{http_code}" -L "$URL")

  if [ "$STATUS" == "200" ]; then
    echo "✓ $URL"
  else
    echo "✗ $URL (HTTP $STATUS)"
  fi
done

echo ""
echo "Validation complete"
```

## Link Optimization

### A/B Test Link Text

```bash
#!/bin/bash
# ab-test-link-text.sh

LIST_ID=123
SENDER_ID=101

# Version A: "Shop Now"
HTML_A='<h1>Special Offer</h1><p>Save 20%</p><a href="https://example.com/sale?v=a">Shop Now</a>'

ID_A=$(cakemail campaigns create \
  -n "A/B Test - Shop Now" \
  -l $LIST_ID \
  -s $SENDER_ID \
  --html "$HTML_A" \
  --subject "Special Offer Inside" \
  -f json | jq -r '.id')

# Version B: "Get 20% Off"
HTML_B='<h1>Special Offer</h1><p>Save 20%</p><a href="https://example.com/sale?v=b">Get 20% Off</a>'

ID_B=$(cakemail campaigns create \
  -n "A/B Test - Get 20% Off" \
  -l $LIST_ID \
  -s $SENDER_ID \
  --html "$HTML_B" \
  --subject "Special Offer Inside" \
  -f json | jq -r '.id')

echo "A/B Test created:"
echo "Version A (Shop Now): $ID_A"
echo "Version B (Get 20% Off): $ID_B"
echo ""
echo "After sending, compare with:"
echo "cakemail reports campaign-links $ID_A"
echo "cakemail reports campaign-links $ID_B"
```

### Optimize Link Position

```bash
#!/bin/bash
# test-link-position.sh

# Test: CTA above vs below content

# Version 1: CTA above content
HTML_ABOVE='
<a href="https://example.com/offer?pos=above">Shop Now</a>
<h1>Product Details</h1>
<p>Long description...</p>
'

# Version 2: CTA below content
HTML_BELOW='
<h1>Product Details</h1>
<p>Long description...</p>
<a href="https://example.com/offer?pos=below">Shop Now</a>
'

# Create campaigns and compare CTR
echo "Test campaign link positions"
echo "Compare CTR after sending both versions"
```

## Link Reports

### Generate Link Report

```bash
#!/bin/bash
# link-report.sh

CAMPAIGN_ID=$1
OUTPUT="link-report-${CAMPAIGN_ID}.txt"

echo "=== Campaign Link Report ===" > $OUTPUT
echo "Campaign ID: $CAMPAIGN_ID" >> $OUTPUT
echo "Generated: $(date)" >> $OUTPUT
echo "" >> $OUTPUT

# Get campaign info
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)
echo "Campaign: $(echo "$CAMPAIGN" | jq -r '.name')" >> $OUTPUT
echo "Subject: $(echo "$CAMPAIGN" | jq -r '.subject')" >> $OUTPUT
echo "" >> $OUTPUT

# Get link data
LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json)

echo "=== Link Performance ===" >> $OUTPUT
echo "" >> $OUTPUT

# Each link
echo "$LINKS" | jq -r '.links[] | "URL: \(.url)\n  Total Clicks: \(.total_clicks)\n  Unique Clicks: \(.unique_clicks)\n  CTR: \(.ctr)%\n"' >> $OUTPUT

echo "=== Overall Stats ===" >> $OUTPUT
echo "Total Clicks: $(echo "$LINKS" | jq -r '.total_clicks')" >> $OUTPUT
echo "Unique Clicks: $(echo "$LINKS" | jq -r '.unique_clicks')" >> $OUTPUT
echo "Overall CTR: $(echo "$LINKS" | jq -r '.overall_ctr')%" >> $OUTPUT

cat $OUTPUT
echo ""
echo "Report saved to: $OUTPUT"
```

### Compare Multiple Campaigns

```bash
#!/bin/bash
# compare-campaign-links.sh

echo "Campaign,Total Clicks,Unique Clicks,CTR,Top Link" > campaign-comparison.csv

# Get all sent campaigns
CAMPAIGNS=$(cakemail campaigns list --filter "status==sent" -f json | jq -r '.data[].id')

for ID in $CAMPAIGNS; do
  LINKS=$(cakemail reports campaign-links $ID -f json 2>/dev/null)

  if [ -n "$LINKS" ]; then
    TOTAL=$(echo "$LINKS" | jq -r '.total_clicks')
    UNIQUE=$(echo "$LINKS" | jq -r '.unique_clicks')
    CTR=$(echo "$LINKS" | jq -r '.overall_ctr')
    TOP=$(echo "$LINKS" | jq -r '.links | sort_by(-.unique_clicks) | .[0].url')

    echo "$ID,$TOTAL,$UNIQUE,$CTR,$TOP" >> campaign-comparison.csv
  fi
done

echo "Comparison saved to: campaign-comparison.csv"
```

## Special Link Types

### Unsubscribe Links

Required in every campaign:

```html
<!-- Automatic unsubscribe (Cakemail handles) -->
<a href="{{unsubscribe_url}}">Unsubscribe</a>

<!-- Custom unsubscribe page -->
<a href="https://example.com/unsubscribe?email={{email}}">Manage Preferences</a>
```

**Best practices:**
- Place in footer
- Make visible but not prominent
- Use clear language: "Unsubscribe" not "Click here"
- Include preference center option

### Social Media Links

```html
<!-- Social media links -->
<a href="https://facebook.com/yourcompany">Facebook</a>
<a href="https://twitter.com/yourcompany">Twitter</a>
<a href="https://linkedin.com/company/yourcompany">LinkedIn</a>

<!-- With UTM tracking -->
<a href="https://facebook.com/yourcompany?utm_source=cakemail&utm_medium=email&utm_campaign=march_newsletter&utm_content=social_facebook">
  Facebook
</a>
```

### View in Browser Link

```html
<!-- View email in web browser -->
<a href="{{view_in_browser_url}}">View in Browser</a>
```

**Use cases:**
- Email client rendering issues
- Images blocked
- Accessibility needs
- Sharing email content

## Link Click Workflows

### Workflow 1: Top Links Dashboard

```bash
#!/bin/bash
# top-links-dashboard.sh

echo "=== Top Performing Links (Last 30 Days) ==="
echo ""

# Get recent campaigns
CUTOFF=$(date -d "30 days ago" +%Y-%m-%d)
CAMPAIGNS=$(cakemail campaigns list \
  --filter "status==sent;delivered_at>=$CUTOFF" \
  -f json | jq -r '.data[].id')

# Collect all link data
declare -A LINK_CLICKS
declare -A LINK_UNIQUE

for CAMPAIGN_ID in $CAMPAIGNS; do
  LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json 2>/dev/null)

  if [ -n "$LINKS" ]; then
    # Process each link
    echo "$LINKS" | jq -r '.links[] | "\(.url)|\(.total_clicks)|\(.unique_clicks)"' | while IFS='|' read URL CLICKS UNIQUE; do
      # Aggregate by URL
      LINK_CLICKS[$URL]=$((${LINK_CLICKS[$URL]:-0} + $CLICKS))
      LINK_UNIQUE[$URL]=$((${LINK_UNIQUE[$URL]:-0} + $UNIQUE))
    done
  fi
done

# Display top 10
echo "Rank | URL | Total Clicks | Unique Clicks"
echo "-----|-----|--------------|---------------"

# (Note: This is simplified - actual implementation would need sorting)
for URL in "${!LINK_CLICKS[@]}"; do
  printf "%s | %d | %d\n" "$URL" "${LINK_CLICKS[$URL]}" "${LINK_UNIQUE[$URL]}"
done | sort -t'|' -k2 -rn | head -10 | nl
```

### Workflow 2: Link Health Check

```bash
#!/bin/bash
# link-health-check.sh

CAMPAIGN_ID=$1

echo "=== Link Health Check ==="
echo ""

# Get all links
LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json)
TOTAL_LINKS=$(echo "$LINKS" | jq '.links | length')

echo "Total Links: $TOTAL_LINKS"
echo ""

# Check for issues
ZERO_CLICKS=$(echo "$LINKS" | jq '[.links[] | select(.total_clicks == 0)] | length')

if [ $ZERO_CLICKS -gt 0 ]; then
  echo "⚠️  Warning: $ZERO_CLICKS links with zero clicks"
  echo ""
  echo "Links with no clicks:"
  echo "$LINKS" | jq -r '.links[] | select(.total_clicks == 0) | "  • \(.url)"'
  echo ""
  echo "Consider:"
  echo "  • Are these links visible?"
  echo "  • Is link text clear?"
  echo "  • Is destination valuable?"
else
  echo "✅ All links received clicks"
fi

echo ""

# Check CTR
OVERALL_CTR=$(echo "$LINKS" | jq -r '.overall_ctr')
CTR_INT=$(echo "$OVERALL_CTR" | cut -d'.' -f1)

if [ $CTR_INT -lt 5 ]; then
  echo "⚠️  Low overall CTR: $OVERALL_CTR%"
  echo "   Consider improving link visibility or CTA text"
elif [ $CTR_INT -lt 15 ]; then
  echo "✓ Moderate CTR: $OVERALL_CTR%"
else
  echo "✅ Excellent CTR: $OVERALL_CTR%"
fi
```

### Workflow 3: Link Segment Analysis

```bash
#!/bin/bash
# link-segment-analysis.sh

CAMPAIGN_ID=$1

echo "=== Link Click Segmentation ==="
echo ""

# Get campaign stats
CAMPAIGN=$(cakemail campaigns get $CAMPAIGN_ID -f json)
RECIPIENTS=$(echo "$CAMPAIGN" | jq -r '.recipients_count')

# Get link data
LINKS=$(cakemail reports campaign-links $CAMPAIGN_ID -f json)
UNIQUE_CLICKERS=$(echo "$LINKS" | jq -r '.unique_clicks')

# Calculate segments
CLICKERS=$UNIQUE_CLICKERS
NON_CLICKERS=$((RECIPIENTS - UNIQUE_CLICKERS))
CLICK_RATE=$(echo "scale=1; $CLICKERS * 100 / $RECIPIENTS" | bc)

echo "Recipients: $RECIPIENTS"
echo ""
echo "Clicked Links: $CLICKERS ($CLICK_RATE%)"
echo "Did Not Click: $NON_CLICKERS"
echo ""

# Create segment for future targeting
echo "Create segment for re-engagement:"
echo "  • Target non-clickers with different content"
echo "  • Reward clickers with special offers"
echo ""

# Suggestions
if [ $CLICK_RATE -lt 10 ]; then
  echo "💡 Low engagement - Consider:"
  echo "  • More compelling CTAs"
  echo "  • Better link visibility"
  echo "  • More relevant content"
elif [ $CLICK_RATE -gt 25 ]; then
  echo "✅ High engagement - Replicate success:"
  echo "  • Use similar link strategies"
  echo "  • Maintain content quality"
fi
```

## Troubleshooting

### Links Not Tracked

**Problem:** Links not appearing in reports

**Solutions:**

```bash
# Check tracking enabled
$ cakemail campaigns get 790 -f json | jq '.settings.track_clicks'

# Enable tracking
$ cakemail campaigns update 790 --track-clicks

# Resend test
$ cakemail campaigns test 790 -e test@example.com

# Verify tracked links in test email
# Links should use tracking.cakemail.com domain
```

### No Click Data

**Problem:** Link reports show zero clicks

**Possible causes:**

```bash
# 1. Campaign not sent yet
$ cakemail campaigns get 790 -f json | jq '.status'
# Status must be "sent"

# 2. Just sent - data not available yet
# Wait 1-2 hours after send

# 3. Links not clickable in email
# Check HTML formatting

# 4. Campaign went to spam
# Check deliverability
```

### Broken Links in Email

**Problem:** Links don't work or go to wrong destination

**Solutions:**

```bash
# Check original HTML
$ cakemail campaigns get 790 -f json | jq -r '.html' | grep 'href='

# Common issues:
# - Missing protocol: href="example.com" ❌
# - Should be: href="https://example.com" ✅

# - Relative URLs: href="/page" ❌
# - Should be: href="https://example.com/page" ✅

# - Broken merge tags: href="https://example.com/{{broken}}" ❌
# - Fix merge tag syntax ✅

# Update HTML
$ cakemail campaigns update 790 --html-file fixed.html

# Test again
$ cakemail campaigns test 790 -e test@example.com
```

### UTM Parameters Missing

**Problem:** Google Analytics not tracking email traffic

**Solutions:**

```bash
# Check if UTM parameters in links
$ cakemail campaigns get 790 -f json | jq -r '.html' | grep 'utm_'

# If missing, add UTM parameters to all links
# Use script or manual update

# Verify in test email
$ cakemail campaigns test 790 -e test@example.com

# Click link and check browser URL
# Should see: ?utm_source=cakemail&utm_medium=email&...

# Verify in Google Analytics
# Acquisition > Campaigns > All Campaigns
# Look for campaign name
```

### Click Tracking Interfering

**Problem:** Tracked links flagged by spam filters

**Solutions:**

```bash
# Disable tracking for specific campaign
$ cakemail campaigns update 790 --no-track-clicks

# Use custom tracking domain (if available)
# Contact Cakemail support to set up

# Use only UTM parameters without Cakemail tracking
# Manual URL tracking through Google Analytics
```

## Best Practices Summary

1. **Enable click tracking** - Track all campaign links for insights
2. **Use clear CTAs** - "Buy Now" not "Click Here"
3. **Limit link count** - 2-3 primary links ideal
4. **Add UTM parameters** - Track in Google Analytics
5. **Test all links** - Verify before sending
6. **Place primary CTA early** - Above the fold
7. **Use buttons for main CTAs** - Higher visibility than text
8. **Monitor zero-click links** - Remove or improve underperforming links
9. **Include required links** - Unsubscribe, view in browser
10. **Validate destinations** - Ensure all URLs work

