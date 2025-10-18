# Frequently Asked Questions (FAQ)

Common questions and answers about using the Cakemail CLI.

## General Questions

### What is Cakemail CLI?

Cakemail CLI is a command-line interface for managing email marketing campaigns through the Cakemail platform. It provides programmatic access to all Cakemail features including contacts, campaigns, reports, and more.

### Do I need a Cakemail account?

Yes, you need an active Cakemail account. Sign up at [cakemail.com](https://www.cakemail.com).

### Is the CLI free?

The CLI tool itself is free and open-source. You pay only for your Cakemail account based on your plan.

### What platforms are supported?

- macOS
- Linux
- Windows (via WSL or native)

### How do I get help?

```bash
# CLI help (no authentication required)
$ cakemail --help
$ cakemail campaigns --help

# Check version (no authentication required)
$ cakemail --version

# Documentation
https://docs.cakemail.com

# Support
support@cakemail.com
```

**Note:** The `--help` and `--version` commands work without authentication.

## Installation & Setup

### How do I install the CLI?

```bash
# npm (recommended)
$ npm install -g @cakemail-org/cakemail-cli

# Homebrew (macOS)
$ brew install cakemail-cli

# Verify installation
$ cakemail --version
```

### How do I configure the CLI?

```bash
# Interactive setup
$ cakemail config init

# Manual setup
$ echo "CAKEMAIL_EMAIL=your@email.com" > .env
$ echo "CAKEMAIL_PASSWORD=your_password" >> .env
```

### Where are credentials stored?

Credentials are stored in a `.env` file in your current directory or home directory (`~/.cakemail/.env`).

### Can I use API keys instead of passwords?

Currently, the CLI uses email/password authentication. API key support is planned for future releases.

## Authentication

### How do I authenticate?

```bash
$ cakemail config init
# Follow prompts to enter email and password
```

### My credentials aren't working. What should I do?

```bash
# Test credentials
$ cakemail account test

# Re-initialize if needed
$ cakemail config init

# Check .env file
$ cat .env
```

### Can I switch between multiple accounts?

Yes, use the account commands:

```bash
# List accessible accounts
$ cakemail account list

# Switch accounts
$ cakemail account use 457

# Verify current account
$ cakemail account show
```

## Contacts & Lists

### How do I add a single contact?

```bash
$ cakemail contacts add 123 \
  -e "user@example.com" \
  -f "John" \
  -l "Doe"
```

### How do I import many contacts?

```bash
# Prepare CSV file
email,first_name,last_name
user1@example.com,John,Doe
user2@example.com,Jane,Smith

# Import
$ cakemail contacts import 123 --file contacts.csv
```

### Can contacts be in multiple lists?

Yes, the same email address can exist in multiple lists. Each list maintains separate subscription status.

### How do I export my contacts?

```bash
$ cakemail contacts export 123
$ cakemail contacts export-download EXPORT_ID > contacts.csv
```

### What's the difference between lists and segments?

- **Lists**: Static containers you manually manage
- **Segments**: Dynamic filters that automatically update based on conditions

## Campaigns

### How do I create a campaign?

```bash
$ cakemail campaigns create \
  -n "My Campaign" \
  -l 123 \
  -s 101 \
  --html-file campaign.html \
  --subject "Hello World"
```

### Can I schedule campaigns for later?

Yes:

```bash
$ cakemail campaigns schedule 790 --when "2024-03-20 10:00:00"
```

### How do I send a test email?

```bash
$ cakemail campaigns test 790 -e test@example.com
```

### Can I cancel a scheduled campaign?

Yes:

```bash
$ cakemail campaigns unschedule 790
```

### How do I view campaign results?

```bash
$ cakemail reports campaign 790
```

## Custom Attributes

### What are custom attributes?

Custom attributes are additional fields you can add to contacts beyond the standard email, name fields. Examples: plan_type, signup_date, purchase_count.

### How do I create a custom attribute?

```bash
$ cakemail attributes create 123 -n "plan_type" -t "text"
```

### What attribute types are available?

- `text`: Strings (e.g., "premium", "basic")
- `number`: Numeric values (e.g., 42, 99.99)
- `date`: Dates in ISO format (YYYY-MM-DD)
- `boolean`: True/false values

### Can I change an attribute's type?

No, attribute types cannot be changed after creation. You must create a new attribute with the correct type.

## Segments

### What are segments?

Segments are dynamic groups of contacts that automatically update based on conditions. Unlike static lists, segment membership changes as contact data changes.

### How do I create a segment?

```bash
$ cakemail segments create 123 -n "Engaged Users" -c '{
  "match": "all",
  "rules": [
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"}
  ]
}'
```

### Can I send campaigns to segments?

Yes:

```bash
$ cakemail campaigns create \
  -n "Segment Campaign" \
  -l 123 \
  -s 101 \
  --segment 456
```

### How often do segments update?

Segments update in real-time as contact data changes.

## Analytics & Reporting

### How do I view campaign analytics?

```bash
$ cakemail reports campaign 790
```

### Can I export reports?

Yes:

```bash
$ cakemail reports campaign 790 -f json > report.json
$ cakemail reports campaign 790 -f csv > report.csv
```

### What metrics are tracked?

- Delivery rate
- Open rate (unique and total)
- Click rate (unique and total)
- Bounce rate (hard and soft)
- Unsubscribe rate
- Spam complaints

### How do I view link-specific analytics?

```bash
$ cakemail reports campaign-links 790
```

## Automation

### Can I automate campaigns?

Yes, using cron or CI/CD:

```bash
# Cron example (daily at 8 AM)
0 8 * * * /path/to/send-newsletter.sh
```

### Can I integrate with other tools?

Yes, via:
- Shell scripts
- Webhooks for real-time events
- CI/CD pipelines (GitHub Actions, GitLab CI)
- Direct API integration

### Does the CLI support webhooks?

Yes:

```bash
$ cakemail webhooks create \
  -u "https://your-api.com/webhook" \
  -e "email.opened,email.clicked"
```

## Best Practices

### How often should I clean my lists?

- Review monthly
- Remove hard bounces immediately
- Remove inactive subscribers (90+ days) quarterly

### What's a good open rate?

Industry average: 15-25%. Varies by:
- Industry
- List quality
- Send frequency
- Content relevance

### What's a good click rate?

Industry average: 2-5%. Higher is better.

### How do I improve my open rates?

1. Write compelling subject lines
2. Optimize send times
3. Clean your list regularly
4. Segment for relevance
5. Test from multiple senders

### How do I reduce unsubscribes?

1. Send relevant content
2. Respect frequency preferences
3. Segment your audience
4. Provide value in every email
5. Make content scannable

## Troubleshooting

### Error: "No credentials found"

```bash
$ cakemail config init
```

### Error: "List not found"

```bash
# Check available lists
$ cakemail lists list
```

### Import fails with "Invalid CSV"

Ensure CSV format:
```csv
email,first_name,last_name
user@example.com,John,Doe
```

### Campaign won't schedule

Check:
- Campaign is in "draft" status
- Sender is verified
- List has contacts
- HTML content exists

### CLI is slow

Try:
- Use JSON format for parsing: `-f json`
- Use filters to limit results
- Check internet connection
- Update CLI to latest version

## Advanced Topics

### Can I use environment variables?

Yes:

```bash
export CAKEMAIL_EMAIL="your@email.com"
export CAKEMAIL_PASSWORD="your_password"
$ cakemail account show
```

### Can I use the CLI in scripts?

Yes, it's designed for automation:

```bash
#!/bin/bash
CAMPAIGN_ID=$(cakemail campaigns create \
  -n "Automated" -l 123 -s 101 -f json | jq -r '.id')
cakemail campaigns schedule $CAMPAIGN_ID
```

### Does the CLI support piping?

Yes:

```bash
$ cakemail campaigns list -f json | jq '.data[].id'
$ cakemail contacts list 123 -f json | jq -r '.data[].email' > emails.txt
```

### Can I use the CLI in Docker?

Yes:

```dockerfile
FROM node:18
RUN npm install -g @cakemail-org/cakemail-cli
ENV CAKEMAIL_EMAIL=your@email.com
ENV CAKEMAIL_PASSWORD=your_password
```

## Getting More Help

### Where can I find more examples?

- [User Manual](/en/cli/)
- [Command Reference](../09-command-reference/)
- [GitHub Repository](https://github.com/cakemail-org/cakemail-cli)

### How do I report bugs?

Create an issue at:
https://github.com/cakemail-org/cakemail-cli/issues

Include:
- CLI version (`cakemail --version`)
- Error message
- Steps to reproduce

### How do I request features?

Create a feature request at:
https://github.com/cakemail-org/cakemail-cli/issues

### Where can I get support?

- Email: support@cakemail.com
- Documentation: https://docs.cakemail.com
- Community: https://community.cakemail.com

## Version-Specific Questions

### What version should I use?

Always use the latest stable version:

```bash
$ npm update -g @cakemail-org/cakemail-cli
```

### How do I check my version?

```bash
$ cakemail --version
```

## Still Have Questions?

If your question isn't answered here:

1. Check the [User Manual](/en/cli/)
2. Search [Command Reference](../09-command-reference/)
3. Review [Troubleshooting](../10-troubleshooting/)
4. Contact support@cakemail.com

We're here to help!
