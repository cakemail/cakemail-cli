# Cakemail API Coverage Report

**CLI Version:** 1.2.0
**Package Name:** @cakemail-org/cakemail-cli
**SDK Version:** @cakemail-org/cakemail-sdk v2.0.0
**SDK API Coverage:** 100% (232 operations)
**CLI Commands Implemented:** 56 / 232 (24%)
**Coverage Focus:** High-value, commonly-used operations with strategic expansion plan

---

## Overview

The Cakemail CLI is built on top of the official [@cakemail-org/cakemail-sdk](https://www.npmjs.com/package/@cakemail-org/cakemail-sdk) v2.0, which provides **100% coverage** of the Cakemail API (232 operations across 28 services).

The CLI focuses on implementing **high-value, commonly-used commands** that developers and marketers need in their daily workflows, while the full SDK is available for advanced use cases.

**Design Philosophy:**
- **CLI**: Intuitive commands for daily operations
- **SDK**: Complete API access for advanced automation
- **Best of both**: Use CLI commands in terminal, SDK in custom scripts

---

## Command Coverage by Category

| Category | CLI Commands | API Endpoints | Gaps | Priority | Target Version |
|----------|--------------|---------------|------|----------|----------------|
| **Campaigns** | 15 / 18 | 18 total | Revisions(1), Render(1), Blueprint(3) | Medium | v1.3 |
| **Lists** | 4 / 11 | 11 total | Archive(1), Stats(1), Update(1), Policy(1), Forms(7) | High | v1.3 |
| **Contacts** | 6 / 17 | 17 total | Import(1), Export(5), Bulk-Tag(4), Interests(2) | **CRITICAL** | v1.3 |
| **Senders** | 7 / 7 | 7 total | - | ✅ Complete | - |
| **Templates** | 6 / 6 | 6 total | - | ✅ Complete | - |
| **Webhooks** | 6 / 6 | 6 total | - | ✅ Complete | - |
| **Email API v2** | 3 / 8 | 8 total | Logs(2), Stats(1), Tags(1), Templates(1) | High | v1.3 |
| **Reports** | 0 / 18 | 18 total | All reporting features | **CRITICAL** | v1.3 |
| **Segments** | 0 / 5 | 5 total | All segment operations | **CRITICAL** | v1.3 |
| **Custom Attributes** | 0 / 3 | 3 total | All attribute management | High | v1.3 |
| **Tags** | 0 / 5 | 5 total | All tag operations | High | v1.4 |
| **Interests** | 0 / 5 | 5 total | All interest management | Medium | v1.4 |
| **Suppression List** | 0 / 6 | 6 total | All suppression operations | High | v1.3 |
| **Logs** | 0 / 10 | 10 total | Campaign/List/Workflow logs | Medium | v1.4 |
| **Account** | 0 / 13 | 13 total | Self/Sub-account management | Low | v1.5 |
| **Users** | 0 / 13 | 13 total | User management, MFA | Low | v1.5 |
| **Domains & DKIM** | 0 / 7 | 7 total | Domain verification, DKIM | Medium | v1.5 |
| **Workflows** | 0 / 18 | 18 total | Automation workflows | Medium | v1.5 |
| **Forms** | 0 / 5 | 5 total | Subscription forms | Low | v1.5 |
| **Transactional Templates** | 0 / 9 | 9 total | Transactional email mgmt | Medium | v1.4 |
| **Tasks** | 0 / 3 | 3 total | Async task monitoring | Low | v1.5 |
| **System Emails** | 0 / 3 | 3 total | System email config | Low | v1.5 |
| **Links** | 0 / 1 | 1 total | Link information | Low | - |
| **Logos** | 0 / 2 | 2 total | Brand logo upload | Low | - |
| **Token** | 0 / 3 | 3 total | Token management | Low | - |

**Total Coverage:** 56 / 232 operations (24.1%)
**Target v1.3:** 106 / 232 operations (45.7%)
**Target v1.4:** 140 / 232 operations (60.3%)
**Target v1.5:** 180+ / 232 operations (77.6%+)

---

## Installation

The CLI is distributed via three channels:

```bash
# npm
npm install -g @cakemail-org/cakemail-cli

# Homebrew
brew tap cakemail/cakemail
brew install cakemail-cli

# npx (no installation)
npx @cakemail-org/cakemail-cli campaigns list
```

---

## Implemented CLI Commands

### ✅ Campaigns (15 commands) - COMPLETE

**Full campaign lifecycle management:**

```bash
# List and filter
cakemail campaigns list
cakemail campaigns list --status active --sort "-created_on"
cakemail campaigns list -l 50 -p 2  # Pagination

# CRUD operations
cakemail campaigns get <id>
cakemail campaigns create -n "Newsletter" -s "Subject" --list-id 123
cakemail campaigns update <id> -n "New Name"
cakemail campaigns delete <id>

# Lifecycle operations
cakemail campaigns schedule <id> --date "2025-12-01T10:00:00Z"
cakemail campaigns reschedule <id> --date "2025-12-02T10:00:00Z"
cakemail campaigns unschedule <id>
cakemail campaigns test <id> -e test@example.com
cakemail campaigns cancel <id>
cakemail campaigns suspend <id>
cakemail campaigns resume <id>

# Management
cakemail campaigns archive <id>
cakemail campaigns unarchive <id>
cakemail campaigns links <id>
```

**SDK Access:**
```typescript
client.sdk.campaigns.list({ status: 'active' })
client.sdk.campaignService.getCampaign({ campaignId: 123 })
```

---

### ✅ Lists (4 commands) - CORE COMPLETE

**Essential list management:**

```bash
# List operations
cakemail lists list
cakemail lists list --sort "+name" -l 100

# CRUD operations
cakemail lists get <id>
cakemail lists create -n "VIP Customers" -l "en_US"
cakemail lists delete <id>
```

**SDK Access:**
```typescript
client.sdk.lists.create({ name: 'Newsletter', language: 'en_US' })
client.sdk.listService.getList({ listId: 123 })
```

**Available via SDK (not yet in CLI):**
- List updates and archiving
- List statistics (subscriber counts, growth metrics)
- Subscription forms management
- List-level settings and policies

---

### ✅ Contacts (6 commands) - CORE COMPLETE

**Essential contact operations:**

```bash
# List contacts
cakemail contacts list <list-id>
cakemail contacts list <list-id> --status subscribed --sort "+email"

# CRUD operations
cakemail contacts get <list-id> <contact-id>
cakemail contacts add <list-id> -e user@example.com --first-name "John" --last-name "Doe"
cakemail contacts update <list-id> <contact-id> --first-name "Jane"
cakemail contacts delete <list-id> <contact-id>

# Subscription management
cakemail contacts unsubscribe <list-id> <contact-id>
```

**SDK Access:**
```typescript
client.sdk.contacts.create({
  email: 'user@example.com',
  list_ids: [123],
  first_name: 'John',
  custom_attributes: { company: 'Acme' }
})
client.sdk.contactService.getContact({ contactId: 456 })
```

**Available via SDK (not yet in CLI):**
- Bulk contact imports/exports
- Contact tagging (single and bulk)
- Interest management
- Segment-based operations
- Contact merge operations

---

### ✅ Senders (7 commands) - COMPLETE

**Full sender management with email verification:**

```bash
# List senders
cakemail senders list
cakemail senders list --sort "+email"

# CRUD operations
cakemail senders get <id>
cakemail senders create -n "John Doe" -e "john@example.com"
cakemail senders update <id> -n "Jane Doe"
cakemail senders delete <id>

# Email verification
cakemail senders confirm <confirmation-id>  # From verification email
cakemail senders resend-confirmation <id>
```

**SDK Access:**
```typescript
client.sdk.senderService.createSender({
  requestBody: { name: 'John Doe', email: 'john@example.com' }
})
client.sdk.senderService.confirmSender({
  requestBody: { confirmation_id: 'abc123' }
})
```

**Note:** Sender IDs are strings in SDK 2.0 (not integers).

---

### ✅ Templates (6 commands) - COMPLETE

**Full template management with file uploads:**

```bash
# List templates
cakemail templates list
cakemail templates list --filter "name==Newsletter"

# CRUD operations
cakemail templates get <id>
cakemail templates create -n "Welcome Email" --html-file template.html
cakemail templates update <id> -n "Updated Template" --text-file body.txt
cakemail templates delete <id>

# Rendering
cakemail templates render <id>  # Preview template HTML
```

**SDK Access:**
```typescript
client.sdk.templateService.createTemplate({
  requestBody: {
    name: 'Welcome',
    html: '<h1>Hello {{name}}</h1>',
    text: 'Hello {{name}}'
  }
})
client.sdk.templateService.renderTemplate({ templateId: 123 })
```

**File Upload Support:**
- `--html-file <path>`: Load HTML from file
- `--text-file <path>`: Load text from file

---

### ✅ Webhooks (6 commands) - COMPLETE

**Full webhook management:**

```bash
# List webhooks
cakemail webhooks list
cakemail webhooks list -l 100

# CRUD operations
cakemail webhooks get <id>
cakemail webhooks create -u "https://api.example.com/webhook" -e "campaign.sent,campaign.opened"
cakemail webhooks update <id> -u "https://new-url.com/webhook"

# Archive management
cakemail webhooks archive <id>
cakemail webhooks unarchive <id>
```

**SDK Access:**
```typescript
client.sdk.webhooks.create({
  url: 'https://api.example.com/webhook',
  events: ['campaign.sent', 'campaign.opened'],
  secret: 'webhook_secret_key'
})
client.sdk.webhookService.getWebhook({ webhookId: 123 })
```

**Webhook Security:**
- Use `--secret` option for signature verification
- Webhooks receive HMAC signatures for validation

---

### ✅ Email API v2 (3 commands) - CORE COMPLETE

**Transactional email operations:**

```bash
# Send email
cakemail emails send \
  -t user@example.com \
  -s "Welcome!" \
  --from-email "sender@example.com" \
  --html-file email.html \
  --tracking

# Or use template
cakemail emails send \
  -t user@example.com \
  -s "Welcome!" \
  --template-id 123 \
  --params '{"name":"John","code":"ABC123"}'

# Retrieve sent email
cakemail emails get <email-id>

# Render email HTML
cakemail emails render <email-id>
```

**SDK Access:**
```typescript
client.sdk.email.submit({
  to: 'user@example.com',
  subject: 'Welcome!',
  template_id: 123,
  params: { name: 'John' },
  tracking: true,
  tags: ['onboarding', 'welcome']
})
client.sdk.email.retrieve('email-id')
```

**Available via SDK (not yet in CLI):**
- Email API logs and delivery status
- Tag-based email queries
- Batch email operations

---

## SDK Services Available (Not Yet in CLI)

The following SDK services provide 100% API access but don't have dedicated CLI commands yet. Use them directly via the SDK in your custom scripts.

### 📊 High-Value Services (Planned v1.3-1.4)

#### ReportService
Campaign, list, and account analytics:
```typescript
const report = await client.sdk.reportService.getCampaignReport({
  campaignId: 123
});
const listStats = await client.sdk.reportService.getListStatistics({
  listId: 456
});
```

#### SegmentService
Contact segmentation and targeting:
```typescript
const segments = await client.sdk.segmentService.listSegments({
  listId: 123
});
const segment = await client.sdk.segmentService.createSegment({
  requestBody: {
    name: 'Active Users',
    conditions: [...]
  }
});
```

#### CustomAttributeService
Custom field management:
```typescript
const attributes = await client.sdk.customAttributeService.listAttributes();
const attr = await client.sdk.customAttributeService.createAttribute({
  requestBody: {
    name: 'company',
    type: 'text'
  }
});
```

#### TagsService
Contact tagging system:
```typescript
const tags = await client.sdk.tagsService.listTags({ listId: 123 });
await client.sdk.tagsService.tagContact({
  contactId: 456,
  requestBody: { tags: ['vip', 'enterprise'] }
});
```

#### InterestService
Contact interest management:
```typescript
const interests = await client.sdk.interestService.listInterests({
  listId: 123
});
```

---

### 🔧 Advanced Services (Planned v1.5+)

#### WorkflowService & ActionService
Automation workflows:
```typescript
const workflows = await client.sdk.workflowService.listWorkflows({});
const actions = await client.sdk.actionService.listActions({
  workflowId: 123
});
```

#### FormService
Subscription forms:
```typescript
const forms = await client.sdk.formService.listForms({ listId: 123 });
```

#### SubAccountService
Multi-tenant operations:
```typescript
const subAccounts = await client.sdk.subAccountService.listSubAccounts({});
```

#### UserService
User management:
```typescript
const users = await client.sdk.userService.listUsers({});
```

#### DomainService & DkimService
Email authentication:
```typescript
const domains = await client.sdk.domainService.listDomains({});
const dkim = await client.sdk.dkimService.getDkim({ domainId: 123 });
```

---

### 🛠️ Supporting Services

Additional services available via SDK:

- **AccountService** - Account management and settings
- **SuppressedEmailService** - Suppression list management
- **SystemEmailService** - System email configuration
- **LinksService** - Link tracking and analytics
- **LogoService** - Brand logo management
- **TokenService** - Authentication token management
- **TransactionalEmailService** - Transactional template management
- **LogService** - Activity logs and audit trails
- **TaskService** - Async task monitoring
- **CampaignBlueprintService** - Campaign templates
- **WorkflowBlueprintService** - Workflow templates

---

## Using the SDK Directly

For operations not yet available as CLI commands, use the SDK directly in Node.js scripts:

```typescript
import { CakemailClient } from '@cakemail-org/cakemail-sdk';

const client = new CakemailClient({
  email: process.env.CAKEMAIL_EMAIL,
  password: process.env.CAKEMAIL_PASSWORD
});

// Access any of the 28 SDK services
const report = await client.reportService.getCampaignReport({
  campaignId: 123
});

const segments = await client.segmentService.listSegments({
  listId: 456
});

const attributes = await client.customAttributeService.listAttributes();
```

**Hybrid Approach:**
Use CLI for daily operations, SDK for advanced automation:
```bash
#!/bin/bash
# Create campaign via CLI
CAMPAIGN_ID=$(cakemail campaigns create -n "Newsletter" -s "Weekly Update" --list-id 123 | jq -r '.id')

# Get analytics via SDK (custom script)
node get-analytics.js $CAMPAIGN_ID
```

---

## Output Formats

All CLI commands support three output formats:

### JSON (Default)
Full structured data, pipeable to other tools:
```bash
cakemail campaigns list | jq '.data[] | select(.status=="active")'
```

### Table
Human-readable formatted table:
```bash
cakemail -f table campaigns list
# ┌──────┬──────────────┬────────┬────────────┐
# │ ID   │ Name         │ Status │ Created    │
# ├──────┼──────────────┼────────┼────────────┤
# │ 123  │ Newsletter   │ active │ 2025-10-01 │
# └──────┴──────────────┴────────┴────────────┘
```

### Compact
One-line summaries for quick scanning:
```bash
cakemail -f compact senders list
# 123 │ John Doe (verified)
# 456 │ Jane Smith (pending)
```

**Configuration:**
```bash
# Set default format
export CAKEMAIL_OUTPUT_FORMAT=compact

# Or in .env file
CAKEMAIL_OUTPUT_FORMAT=table

# Override per command
cakemail -f json campaigns list
```

---

## Advanced Filtering and Sorting

All list commands support powerful filtering and sorting:

### Sorting
```bash
# Ascending
cakemail campaigns list --sort "+name"
cakemail lists list --sort "+created_on"

# Descending
cakemail campaigns list --sort "-created_on"
cakemail contacts list 123 --sort "-email"
```

### Filtering
```bash
# Single condition
cakemail campaigns list --filter "status==active"

# Multiple conditions (semicolon-separated)
cakemail campaigns list --filter "status==active;name==Newsletter"

# Operators: ==, !=, >, <, >=, <=
cakemail campaigns list --filter "created_on>=2025-01-01"
```

### Pagination
```bash
# Limit per page
cakemail campaigns list -l 50

# Specific page
cakemail campaigns list -l 50 -p 2

# Combine with filters
cakemail campaigns list --status active -l 100 --sort "-created_on"
```

---

## Coverage Expansion Plan

### 🔴 CRITICAL Priority (v1.3) - Q4 2025
**Target: +50 commands (56 → 106 commands, 24% → 46% coverage)**

These features are essential for daily operations and analytics:

#### Reports (18 new commands)
```bash
# Campaign analytics
cakemail reports campaign <id>              # Full campaign stats
cakemail reports campaign <id> --links      # Link click analytics
cakemail reports campaign <id> --export     # Export campaign report

# List analytics
cakemail reports list <id>                  # List growth and engagement stats

# Account analytics
cakemail reports account                    # Account-wide statistics

# Email API analytics
cakemail reports emails                     # Email API statistics
cakemail reports emails-summary             # Daily/weekly summary

# Export operations
cakemail reports export-campaigns           # Bulk campaign reports
cakemail reports export-suppressed          # Suppression list export
```

**Business Impact:** Critical for measuring campaign effectiveness, ROI calculation, and decision-making.

#### Contact Import/Export (6 new commands)
```bash
# Import contacts
cakemail contacts import <list-id> --file contacts.csv
cakemail contacts import <list-id> --file contacts.json --update-existing

# Export contacts
cakemail contacts export <list-id>
cakemail contacts export <list-id> --status subscribed --format csv
cakemail contacts export <list-id> --download export-123

# List and manage exports
cakemail contacts exports <list-id>
cakemail contacts export-delete <list-id> <export-id>
```

**Business Impact:** Essential for data migration, backups, and list hygiene.

#### Segments (5 new commands)
```bash
# Segment management
cakemail segments list <list-id>
cakemail segments get <list-id> <segment-id>
cakemail segments create <list-id> --name "Active Users" --conditions '...'
cakemail segments update <list-id> <segment-id>
cakemail segments delete <list-id> <segment-id>
cakemail segments contacts <list-id> <segment-id>  # View segment members
```

**Business Impact:** Enables targeted campaigns and advanced audience segmentation.

#### Custom Attributes (3 new commands)
```bash
# Custom field management
cakemail attributes list <list-id>
cakemail attributes create <list-id> --name company --type text
cakemail attributes delete <list-id> <attribute-name>
```

**Business Impact:** Customization and personalization capabilities.

#### Suppression List (6 new commands)
```bash
# Suppression management
cakemail suppressed list
cakemail suppressed add user@example.com
cakemail suppressed delete user@example.com
cakemail suppressed export
cakemail suppressed download <export-id>
```

**Business Impact:** Compliance (GDPR, CAN-SPAM) and deliverability management.

#### Extended List Operations (7 new commands)
```bash
# List lifecycle
cakemail lists update <id> --name "New Name"
cakemail lists archive <id>
cakemail lists accept-policy <id>
cakemail lists stats <id>

# Subscription forms
cakemail lists forms <id>
cakemail lists form-create <id> --url "/subscribe"
cakemail lists form-delete <id> <form-id>
```

**Business Impact:** Complete list management capabilities.

#### Email API Extended (5 new commands)
```bash
# Email API logs and analytics
cakemail emails logs
cakemail emails logs --tag newsletter --status delivered
cakemail emails stats
cakemail emails tags list
cakemail emails summary
```

**Business Impact:** Transactional email monitoring and troubleshooting.

---

### 🟡 HIGH Priority (v1.4) - Q1 2026
**Target: +34 commands (106 → 140 commands, 46% → 60% coverage)**

Efficiency and scale features:

#### Tags (5 new commands)
```bash
cakemail tags list
cakemail tags create --name vip
cakemail tags delete <tag>
cakemail contacts tag <list-id> <contact-id> --tags "vip,premium"
cakemail contacts untag <list-id> <contact-id> --tags "trial"
cakemail contacts tag-bulk <list-id> --contacts "1,2,3" --tags "segment-a"
```

#### Interests (5 new commands)
```bash
cakemail interests list <list-id>
cakemail interests create <list-id> --name "Product Updates"
cakemail interests delete <list-id> <interest-name>
cakemail contacts add-interests <list-id> <contact-id> --interests "updates,news"
cakemail contacts remove-interests <list-id> <contact-id> --interests "promotions"
```

#### Transactional Email Templates (9 new commands)
```bash
cakemail transactional-templates list <list-id>
cakemail transactional-templates create <list-id> --name "Order Confirmation"
cakemail transactional-templates update <list-id> <template-id>
cakemail transactional-templates delete <list-id> <template-id>
cakemail transactional-templates send <list-id> <template-id> --contact <id>
cakemail transactional-templates test <list-id> <template-id> --email test@ex.com
cakemail transactional-templates render <list-id> <template-id>
```

#### Campaign Logs (5 new commands)
```bash
cakemail logs campaign <id>
cakemail logs campaign <id> --export
cakemail logs campaign <id> --download <export-id>
cakemail logs list <id>
cakemail logs list <id> --export
```

#### Campaign Enhancements (3 new commands)
```bash
cakemail campaigns render <id>              # Preview campaign HTML
cakemail campaigns revisions <id>           # View campaign history
cakemail campaigns blueprint <id>           # Use campaign blueprint
```

---

### 🟢 MEDIUM Priority (v1.5+) - Q2-Q3 2026
**Target: +40 commands (140 → 180+ commands, 60% → 78%+ coverage)**

Advanced and enterprise features:

#### Workflows (18 commands)
```bash
# Workflow management
cakemail workflows list
cakemail workflows create --name "Welcome Series"
cakemail workflows update <id>
cakemail workflows delete <id>
cakemail workflows activate <id>
cakemail workflows deactivate <id>
cakemail workflows lock <id>
cakemail workflows unlock <id>

# Workflow actions
cakemail workflows actions <workflow-id>
cakemail workflows action-create <workflow-id>
cakemail workflows action-update <workflow-id> <action-id>
cakemail workflows action-delete <workflow-id> <action-id>
cakemail workflows action-test <workflow-id> <action-id>

# Workflow analytics
cakemail workflows report <workflow-id> <action-id>
cakemail workflows logs <workflow-id> <action-id>
```

#### Account & User Management (13 commands)
```bash
# Account management
cakemail account show
cakemail account update
cakemail account convert-to-org

# Sub-accounts
cakemail sub-accounts list
cakemail sub-accounts create
cakemail sub-accounts suspend <id>

# Users
cakemail users list
cakemail users create
cakemail users update <id>
cakemail users delete <id>
```

#### Domain & DKIM (7 commands)
```bash
cakemail domains show
cakemail domains update
cakemail domains validate
cakemail dkim list
cakemail dkim create --domain example.com
cakemail dkim delete <id>
```

---

## Roadmap

### ✅ Phase 1: Foundation (v0.1-v1.0) - COMPLETE
- Core CRUD operations for campaigns, lists, contacts
- Multiple output formats
- Authentication and configuration
- Error handling and help system

### ✅ Phase 2: SDK Migration (v1.0-v1.2) - COMPLETE
- Full migration to @cakemail-org/cakemail-sdk
- 100% SDK coverage available
- All commands using SDK services
- Package rename to @cakemail-org/cakemail-cli
- Homebrew distribution

### 🎯 Phase 3: Analytics & Data Operations (v1.3) - Q4 2025
**+50 commands: 56 → 106 (24% → 46% coverage)**
- ✅ **Reports** (18 commands) - Campaign/list/email analytics
- ✅ **Contact Import/Export** (6 commands) - Bulk data operations
- ✅ **Segments** (5 commands) - Audience segmentation
- ✅ **Custom Attributes** (3 commands) - Custom fields
- ✅ **Suppression List** (6 commands) - Compliance management
- ✅ **Extended Lists** (7 commands) - Complete list lifecycle
- ✅ **Extended Email API** (5 commands) - Transactional monitoring

### 🎯 Phase 4: Scale & Efficiency (v1.4) - Q1 2026
**+34 commands: 106 → 140 (46% → 60% coverage)**
- ✅ **Tags** (5 commands) - Contact organization
- ✅ **Interests** (5 commands) - Preference management
- ✅ **Transactional Templates** (9 commands) - Template management
- ✅ **Campaign Logs** (5 commands) - Activity tracking
- ✅ **Campaign Enhancements** (3 commands) - Advanced features
- ✅ **Bulk Operations** - Tag/interest bulk updates
- ✅ **Advanced Filtering** - Complex queries

### 🎯 Phase 5: Enterprise & Automation (v1.5+) - Q2-Q3 2026
**+40+ commands: 140 → 180+ (60% → 78%+ coverage)**
- ✅ **Workflows** (18 commands) - Marketing automation
- ✅ **Account Management** (13 commands) - Multi-tenant operations
- ✅ **Domain & DKIM** (7 commands) - Email authentication
- ✅ **Forms** (5 commands) - Subscription forms
- ✅ **Tasks** (3 commands) - Async operations
- ✅ **Advanced Security** - MFA, permissions

---

## Priority Matrix for Development

Feature prioritization is based on **Impact × Frequency** scoring:

| Feature Category | Impact | Frequency | Score | Priority | Version |
|-----------------|--------|-----------|-------|----------|---------|
| **Reports - Campaign Analytics** | 10 | 9 | 90 | 🔴 CRITICAL | v1.3 |
| **Contact Import/Export** | 9 | 8 | 72 | 🔴 CRITICAL | v1.3 |
| **Segments** | 9 | 7 | 63 | 🔴 CRITICAL | v1.3 |
| **Suppression List** | 8 | 7 | 56 | 🟡 HIGH | v1.3 |
| **Reports - Email API** | 7 | 8 | 56 | 🟡 HIGH | v1.3 |
| **Custom Attributes** | 7 | 7 | 49 | 🟡 HIGH | v1.3 |
| **Extended Lists** | 6 | 8 | 48 | 🟡 HIGH | v1.3 |
| **Tags** | 7 | 6 | 42 | 🟡 HIGH | v1.4 |
| **Transactional Templates** | 7 | 6 | 42 | 🟡 HIGH | v1.4 |
| **Interests** | 6 | 6 | 36 | 🟢 MEDIUM | v1.4 |
| **Campaign Logs** | 6 | 5 | 30 | 🟢 MEDIUM | v1.4 |
| **Workflows** | 8 | 3 | 24 | 🟢 MEDIUM | v1.5 |
| **Domain & DKIM** | 7 | 3 | 21 | 🟢 MEDIUM | v1.5 |
| **Account Management** | 5 | 4 | 20 | ⚪ LOW | v1.5 |
| **User Management** | 4 | 3 | 12 | ⚪ LOW | v1.5 |
| **Forms** | 3 | 3 | 9 | ⚪ LOW | v1.5+ |

**Scoring Criteria:**
- **Impact**: 1-10 (how much time/value does this provide?)
- **Frequency**: 1-10 (how often is this operation performed?)
- **Score**: Impact × Frequency
- **CRITICAL** (>60): Essential for daily operations
- **HIGH** (40-60): Important for efficiency
- **MEDIUM** (20-39): Valuable for advanced users
- **LOW** (<20): Nice-to-have or specialized

---

## Design Philosophy

The CLI prioritizes:

1. **Developer Experience**: Simple, intuitive commands with excellent error messages
2. **High-Value Operations**: Features used daily by developers and marketers
3. **SDK Foundation**: Built on official SDK for reliability and maintainability
4. **Progressive Enhancement**: Core features via CLI, advanced features via SDK
5. **Composability**: Commands designed to work with pipes, scripts, and other tools
6. **Data-Driven Decisions**: Priority based on impact × frequency analysis

**80/20 Rule**: The CLI implements 20% of operations that satisfy 80% of use cases. The SDK provides the remaining 80% for specialized needs.

**Coverage Strategy**:
- v1.3 targets 46% coverage (106/232) by adding the highest-impact analytics and data operations
- v1.4 targets 60% coverage (140/232) by adding efficiency and scale features
- v1.5+ targets 78%+ coverage (180+/232) by adding enterprise and automation features

---

## Command Prioritization Criteria

New CLI commands are prioritized based on:

1. **Frequency**: How often is this operation performed?
2. **Impact**: How much time does this save vs web interface?
3. **Automation**: Is this operation needed in CI/CD pipelines?
4. **Complexity**: How much does the CLI simplify the operation?
5. **Demand**: How many customers have requested this?

**Request a Feature**: Open an issue at [github.com/cakemail/cakemail-cli](https://github.com/cakemail/cakemail-cli)

---

## Authentication

The CLI supports two authentication methods:

```bash
# Method 1: Email/Password (OAuth2)
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password

# Method 2: Access Token (for CI/CD)
export CAKEMAIL_ACCESS_TOKEN=your_token

# Or use .env file
echo "CAKEMAIL_EMAIL=your@email.com" > .env
echo "CAKEMAIL_PASSWORD=your_password" >> .env
```

The SDK handles OAuth2 token management, refresh, and expiration automatically.

---

## CI/CD Integration

The CLI is designed for automation:

**GitHub Actions Example:**
```yaml
- name: Deploy Campaign
  env:
    CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
    CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
  run: |
    npm install -g @cakemail-org/cakemail-cli
    CAMPAIGN_ID=$(cakemail campaigns create -n "Release ${{ github.ref }}" | jq -r '.id')
    cakemail campaigns schedule $CAMPAIGN_ID --date "2025-12-01T10:00:00Z"
```

**Features for Automation:**
- JSON output for parsing
- Correct exit codes (0=success, 1=error)
- Environment variable authentication
- Deterministic, scriptable commands

---

---

## Summary & Next Steps

### Current State (v1.2.0)
- ✅ **56 commands implemented** (24% coverage)
- ✅ **Core workflows complete**: Campaigns, templates, contacts, senders, webhooks, email sending
- ✅ **Solid foundation**: SDK-based, 3 output formats, Homebrew distribution
- ❌ **Missing critical features**: Analytics, reporting, bulk operations, segmentation

### Gap Analysis
**Coverage by Criticality:**
- 🔴 **CRITICAL gaps** (3 features): Reports, Import/Export, Segments → **50 missing commands**
- 🟡 **HIGH gaps** (4 features): Suppression, Custom Attributes, Extended Lists, Email API logs → **21 missing commands**
- 🟢 **MEDIUM gaps** (8 features): Tags, Interests, Workflows, etc. → **74 missing commands**
- ⚪ **LOW gaps** (10 features): Account, Users, Forms, etc. → **31 missing commands**

**Total opportunity:** 176 additional commands to reach 78%+ coverage

### Immediate Actions for v1.3 (Q4 2025)

**Phase 1: Reports (Weeks 1-2)**
1. Implement campaign analytics commands (6 commands)
2. Implement list analytics commands (3 commands)
3. Implement email API analytics (4 commands)
4. Add report export capabilities (5 commands)

**Phase 2: Contact Operations (Weeks 3-4)**
1. Implement contact import with CSV/JSON support (2 commands)
2. Implement contact export with filtering (4 commands)
3. Add bulk tag operations (4 commands)

**Phase 3: Segmentation (Weeks 5-6)**
1. Implement segment CRUD operations (5 commands)
2. Add segment contact listing (1 command)
3. Integrate segments with campaign creation

**Phase 4: Supporting Features (Weeks 7-8)**
1. Custom attributes management (3 commands)
2. Suppression list operations (6 commands)
3. Extended list operations (7 commands)
4. Extended email API (5 commands)

**Total:** 50 new commands over 8 weeks

### Success Metrics for v1.3
- **Coverage**: 24% → 46% (double current coverage)
- **User satisfaction**: Enable analytics workflows (most-requested feature)
- **Data portability**: Enable import/export workflows
- **Compliance**: Full suppression list management
- **Targeting**: Enable segment-based campaigns

### Developer Effort Estimate

**v1.3 Complexity Analysis:**
- **Low complexity** (30 commands): CRUD operations leveraging existing patterns
- **Medium complexity** (15 commands): File uploads, CSV parsing, export downloads
- **High complexity** (5 commands): Complex filtering, bulk operations, async tasks

**Estimated effort:** 6-8 weeks full-time development
- Week 1-2: Reports (leverage existing formatters)
- Week 3-4: Import/Export (CSV parsing, file handling)
- Week 5-6: Segments (new entity, similar to lists)
- Week 7-8: Supporting features (straightforward CRUD)

### Risk Mitigation
- **API Changes**: All commands use official SDK (stable interface)
- **Breaking Changes**: New commands only, no modifications to existing
- **Testing**: Each command group tested independently
- **Rollback**: Commands can be feature-flagged if needed

---

*Last Updated: 2025-10-10*
*CLI Version: 1.2.0*
*Package: @cakemail-org/cakemail-cli*
*SDK Version: @cakemail-org/cakemail-sdk v2.0.0 (232 operations, 28 services)*
*Coverage Analysis: 56/232 commands (24%) with strategic expansion to 180+/232 (78%+) over 3 releases*
