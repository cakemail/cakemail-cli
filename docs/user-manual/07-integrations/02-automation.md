# Automation & Scripting

Automate email marketing workflows with shell scripts and CI/CD integration.

## Overview

Automation enables:
- Scheduled campaign sending
- Automated list management
- Batch contact imports
- Regular reporting
- Integration with existing workflows

## Quick Start Automation

### Daily Newsletter Script

```bash
#!/bin/bash
# daily-newsletter.sh

DATE=$(date +%Y-%m-%d)
LIST_ID=123
SENDER_ID=101

# Create campaign
CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Daily News - $DATE" \
  -l $LIST_ID \
  -s $SENDER_ID \
  --template 201 \
  --subject "Today's Top Stories" \
  -f json | jq -r '.id')

# Send test
cakemail campaigns test $CAMPAIGN_ID -e editor@company.com

# Schedule for 8 AM
cakemail campaigns schedule $CAMPAIGN_ID --when "$(date +%Y-%m-%d) 08:00:00"

echo "Newsletter scheduled: $CAMPAIGN_ID"
```

**Schedule with cron:**
```bash
# Run daily at 6 AM
0 6 * * * /path/to/daily-newsletter.sh >> /var/log/newsletter.log 2>&1
```

## Cron Integration

### Common Cron Patterns

```bash
# Daily at 2 AM
0 2 * * * /path/to/backup-contacts.sh

# Every Monday at 9 AM
0 9 * * 1 /path/to/weekly-report.sh

# First day of month at midnight
0 0 1 * * /path/to/monthly-cleanup.sh

# Every 6 hours
0 */6 * * * /path/to/sync-contacts.sh

# Weekdays at 8 AM
0 8 * * 1-5 /path/to/workday-newsletter.sh
```

### Automated Contact Sync

```bash
#!/bin/bash
# sync-contacts-from-crm.sh

LIST_ID=123

# Fetch from your CRM API
curl -s "https://api.yourcrm.com/contacts" | \
  jq -r '.[] | [.email, .first_name, .last_name] | @csv' > contacts-temp.csv

# Import to Cakemail
cakemail contacts import $LIST_ID --file contacts-temp.csv

# Cleanup
rm contacts-temp.csv

echo "Contact sync complete: $(date)"
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/email-campaign.yml
name: Deploy Email Campaign

on:
  push:
    branches: [main]
    paths:
      - 'campaigns/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Install Cakemail CLI
        run: npm install -g @cakemail-org/cakemail-cli

      - name: Configure Cakemail
        env:
          CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
          CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
        run: |
          echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
          echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - name: Create Campaign
        run: |
          cakemail campaigns create \
            -n "Automated Campaign" \
            -l 123 \
            -s 101 \
            --html-file campaigns/latest.html \
            --subject "$(cat campaigns/subject.txt)"

      - name: Send Test
        run: cakemail campaigns test $CAMPAIGN_ID -e test@company.com
```

### GitLab CI

```yaml
# .gitlab-ci.yml
deploy_campaign:
  stage: deploy
  only:
    - main
  script:
    - npm install -g @cakemail-org/cakemail-cli
    - echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
    - echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env
    - |
      cakemail campaigns create \
        -n "Production Campaign" \
        -l 123 \
        -s 101 \
        --html-file campaign.html
```

## Advanced Automation

### Conditional Campaign Sending

```bash
#!/bin/bash
# conditional-send.sh

# Only send if segment has enough contacts
SEGMENT_ID=456
MIN_CONTACTS=100

COUNT=$(cakemail segments get 123 $SEGMENT_ID -f json | jq -r '.contact_count')

if [ $COUNT -ge $MIN_CONTACTS ]; then
  echo "Segment has $COUNT contacts - proceeding"

  CAMPAIGN_ID=$(cakemail campaigns create \
    -n "Targeted Campaign" \
    -l 123 \
    -s 101 \
    --segment $SEGMENT_ID \
    -f json | jq -r '.id')

  cakemail campaigns schedule $CAMPAIGN_ID
else
  echo "Segment too small ($COUNT contacts) - skipping"
fi
```

### Error Handling

```bash
#!/bin/bash
# robust-automation.sh

set -e  # Exit on error

LOG_FILE="/var/log/cakemail-automation.log"
ERROR_EMAIL="admin@company.com"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
  log "ERROR: $1"
  echo "Automation failed: $1" | mail -s "Cakemail Error" "$ERROR_EMAIL"
  exit 1
}

log "Starting campaign creation..."

CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Daily Update" \
  -l 123 \
  -s 101 \
  -f json | jq -r '.id') || error_exit "Campaign creation failed"

log "Campaign created: $CAMPAIGN_ID"

cakemail campaigns test $CAMPAIGN_ID -e test@company.com || \
  error_exit "Test email failed"

log "Test sent successfully"

cakemail campaigns schedule $CAMPAIGN_ID || \
  error_exit "Scheduling failed"

log "Campaign scheduled successfully"
```

## Makefile Integration

```makefile
# Makefile for email campaigns

.PHONY: test send-newsletter backup-contacts

test:
	@echo "Sending test campaign..."
	@cakemail campaigns test 790 -e test@company.com

send-newsletter:
	@echo "Creating newsletter..."
	@./scripts/create-newsletter.sh
	@echo "Done!"

backup-contacts:
	@echo "Backing up contacts..."
	@./scripts/backup-contacts.sh
	@echo "Backup complete"

deploy: test
	@echo "Deploying campaign..."
	@cakemail campaigns schedule 790
	@echo "Campaign scheduled"
```

## Monitoring & Alerting

### Slack Notifications

```bash
#!/bin/bash
# notify-slack.sh

SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
MESSAGE="$1"

curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d "{\"text\": \"$MESSAGE\"}"
```

```bash
# In automation script
./notify-slack.sh "✅ Campaign 790 sent successfully"
```

### Email Alerts

```bash
#!/bin/bash
# Send email alert on failure

if ! cakemail campaigns schedule 790; then
  echo "Campaign scheduling failed" | \
    mail -s "Cakemail Alert" admin@company.com
fi
```

## Best Practices

1. **Use Environment Variables**
   ```bash
   export CAKEMAIL_EMAIL="your@email.com"
   export CAKEMAIL_PASSWORD="password"
   ```

2. **Log Everything**
   ```bash
   exec 1> >(tee -a script.log)
   exec 2>&1
   ```

3. **Implement Retries**
   ```bash
   retry() {
     local n=1
     local max=3
     while true; do
       "$@" && break || {
         if [[ $n -lt $max ]]; then
           ((n++))
           sleep 5
         else
           return 1
         fi
       }
     done
   }

   retry cakemail campaigns create -n "Test"
   ```

4. **Test in Staging First**
5. **Monitor Execution**
6. **Handle Failures Gracefully**

