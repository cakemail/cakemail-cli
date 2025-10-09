# Cakemail API Coverage Report

**CLI Version:** 0.4.0
**Total API Endpoints:** 149
**Implemented Commands:** 39
**Coverage:** 26.2%

---

## Summary by Category

| Category | Total Endpoints | Implemented | Coverage | Priority |
|----------|----------------|-------------|----------|----------|
| **Campaign** | 15 | 6 | 40.0% | ✅ High |
| **Contact** | 16 | 6 | 37.5% | ✅ High |
| **List** | 11 | 4 | 36.4% | ✅ High |
| **Webhook** | 6 | 6 | 100% | ✅ Complete |
| **Sender** | 7 | 4 | 57.1% | ✅ High |
| **Transactional Email** | 12 | 0 | 0% | ⚪ Out of Scope |
| **Template** | 6 | 0 | 0% | 🔶 Medium |
| **Workflow** | 14 | 0 | 0% | 🔶 Medium |
| **Report** | 11 | 0 | 0% | 🔶 Medium |
| **Sub-Account** | 10 | 0 | 0% | 🔵 Low |
| **User** | 13 | 0 | 0% | 🔵 Low |
| **Segment** | 5 | 0 | 0% | 🔶 Medium |
| **Interest** | 5 | 0 | 0% | 🔶 Medium |
| **Custom Attribute** | 4 | 0 | 0% | 🔶 Medium |
| **Form** | 5 | 0 | 0% | 🔵 Low |
| **Tags** | 5 | 0 | 0% | 🔶 Medium |
| **Suppressed Email** | 5 | 0 | 0% | 🔵 Low |
| **Log** | 10 | 0 | 0% | 🔶 Medium |
| **Task** | 3 | 0 | 0% | 🔵 Low |
| **Email API** | 4 | 0 | 0% | ✅ High |
| **Other** | 10 | 1 | 10% | 🔵 Low |

---

## Detailed Coverage

### ✅ Campaign (100% - 15/15) - COMPLETE

**Implemented:**
- ✅ `campaigns list` → GET /campaigns
- ✅ `campaigns get <id>` → GET /campaigns/{campaign_id}
- ✅ `campaigns create` → POST /campaigns
- ✅ `campaigns update <id>` → PATCH /campaigns/{campaign_id}
- ✅ `campaigns delete <id>` → DELETE /campaigns/{campaign_id}
- ✅ `campaigns schedule <id>` → POST /campaigns/{campaign_id}/schedule
- ✅ `campaigns reschedule <id>` → POST /campaigns/{campaign_id}/reschedule
- ✅ `campaigns unschedule <id>` → POST /campaigns/{campaign_id}/unschedule
- ✅ `campaigns test <id>` → POST /campaigns/{campaign_id}/send-test
- ✅ `campaigns archive <id>` → POST /campaigns/{campaign_id}/archive
- ✅ `campaigns unarchive <id>` → POST /campaigns/{campaign_id}/unarchive
- ✅ `campaigns cancel <id>` → POST /campaigns/{campaign_id}/cancel
- ✅ `campaigns suspend <id>` → POST /campaigns/{campaign_id}/suspend
- ✅ `campaigns resume <id>` → POST /campaigns/{campaign_id}/resume
- ✅ `campaigns links <id>` → GET /campaigns/{campaign_id}/links

**Not Needed:**
- ⚪ GET /campaigns/{campaign_id}/render - Render campaign (use template rendering instead)
- ⚪ GET /campaigns/{campaign_id}/revisions - List campaign revisions (not in current API spec)

### ✅ Contact (37.5% - 6/16)

**Implemented:**
- ✅ `contacts list <list-id>` → GET /lists/{list_id}/contacts
- ✅ `contacts get <list-id> <contact-id>` → GET /lists/{list_id}/contacts/{contact_id}
- ✅ `contacts add <list-id>` → POST /lists/{list_id}/contacts
- ✅ `contacts update <list-id> <contact-id>` → PATCH /lists/{list_id}/contacts/{contact_id}
- ✅ `contacts delete <list-id> <contact-id>` → DELETE /lists/{list_id}/contacts/{contact_id}
- ✅ `contacts unsubscribe <list-id> <contact-id>` → POST /lists/{list_id}/contacts/{contact_id}/unsubscribe

**Missing:**
- ❌ POST /lists/{list_id}/import-contacts - Import contacts (bulk)
- ❌ POST /lists/{list_id}/contacts/add-interests - Add interests to contacts
- ❌ POST /lists/{list_id}/contacts/remove-interests - Remove interests from contacts
- ❌ POST /lists/{list_id}/contacts/tag - Tag multiple contacts
- ❌ POST /lists/{list_id}/contacts/untag - Untag multiple contacts
- ❌ POST /lists/{list_id}/contacts/{contact_id}/tag - Tag single contact
- ❌ POST /lists/{list_id}/contacts/{contact_id}/untag - Untag single contact
- ❌ GET /lists/{list_id}/exports - List contact exports
- ❌ POST /lists/{list_id}/exports - Create contact export
- ❌ GET /lists/{list_id}/exports/{export_id} - Get export details
- ❌ GET /lists/{list_id}/exports/{export_id}/download - Download export
- ❌ DELETE /lists/{list_id}/exports/{export_id} - Delete export
- ❌ GET /lists/{list_id}/segments/{segment_id}/contacts - List segment contacts

### ✅ List (36.4% - 4/11)

**Implemented:**
- ✅ `lists list` → GET /lists
- ✅ `lists get <id>` → GET /lists/{list_id}
- ✅ `lists create` → POST /lists
- ✅ `lists delete <id>` → DELETE /lists/{list_id}

**Missing:**
- ❌ PATCH /lists/{list_id} - Update list
- ❌ POST /lists/{list_id}/accept-policy - Accept list policy
- ❌ POST /lists/{list_id}/archive - Archive list
- ❌ GET /lists/{list_id}/forms - List subscription forms
- ❌ POST /lists/{list_id}/forms - Create subscription form
- ❌ GET /lists/{list_id}/forms/{form_id} - Get subscription form
- ❌ PATCH /lists/{list_id}/forms/{form_id} - Update subscription form
- ❌ DELETE /lists/{list_id}/forms/{form_id} - Delete subscription form
- ❌ POST /lists/{list_id}/forms/{form_id}/enable - Enable form
- ❌ POST /lists/{list_id}/forms/{form_id}/disable - Disable form

### ✅ Webhook (100% - 6/6) ✨ COMPLETE

**Implemented:**
- ✅ `webhooks list` → GET /webhooks
- ✅ `webhooks get <id>` → GET /webhooks/{webhook_id}
- ✅ `webhooks create` → POST /webhooks
- ✅ `webhooks update <id>` → PATCH /webhooks/{webhook_id}
- ✅ `webhooks archive <id>` → POST /webhooks/{webhook_id}/archive
- ✅ `webhooks unarchive <id>` → POST /webhooks/{webhook_id}/unarchive

### ✅ Sender (57.1% - 4/7)

**Implemented:**
- ✅ `senders list` → GET /brands/default/senders
- ✅ `senders get <id>` → GET /brands/default/senders/{sender_id}
- ✅ `senders create` → POST /brands/default/senders
- ✅ `senders delete <id>` → DELETE /brands/default/senders/{sender_id}

**Missing:**
- ❌ PATCH /brands/default/senders/{sender_id} - Update sender
- ❌ POST /brands/default/senders/confirm-email - Confirm sender email
- ❌ POST /brands/default/senders/{sender_id}/resend-confirmation-email - Resend confirmation

### ⚪ Transactional Email (0% - 0/12) - OUT OF SCOPE

**Note:** Transactional email endpoints are managed through dedicated workflows and are out of scope for CLI implementation.

**Excluded:**
- ⚪ POST /emails - Send transactional email
- ⚪ GET /logs/emails - Show email activity logs
- ⚪ GET /reports/emails - Show email stats
- ⚪ GET /lists/{list_id}/transactional-email-templates - List templates
- ⚪ POST /lists/{list_id}/transactional-email-templates - Create template
- ⚪ GET /lists/{list_id}/transactional-email-templates/{id} - Get template
- ⚪ PATCH /lists/{list_id}/transactional-email-templates/{id} - Update template
- ⚪ DELETE /lists/{list_id}/transactional-email-templates/{id} - Delete template
- ⚪ POST /lists/{list_id}/transactional-email-templates/{id}/render - Render template
- ⚪ POST /lists/{list_id}/transactional-email-templates/{id}/send - Send from template
- ⚪ POST /lists/{list_id}/transactional-email-templates/{id}/send-test - Send test
- ⚪ GET /email-group-ids - List email group IDs
- ⚪ PATCH /email-group-ids/{group_id} - Edit email group ID

### ❌ Template (0% - 0/6)

**Missing:**
- ❌ GET /templates - List templates
- ❌ POST /templates - Create template
- ❌ GET /templates/{template_id} - Get template
- ❌ PATCH /templates/{template_id} - Update template
- ❌ DELETE /templates/{template_id} - Delete template
- ❌ GET /templates/{template_id}/render - Render template

### ❌ Workflow (0% - 0/14)

**Missing:**
- ❌ GET /workflows - List workflows
- ❌ POST /workflows - Create workflow
- ❌ GET /workflows/{workflow_id} - Get workflow
- ❌ PATCH /workflows/{workflow_id} - Update workflow
- ❌ DELETE /workflows/{workflow_id} - Delete workflow
- ❌ POST /workflows/{workflow_id}/activate - Activate workflow
- ❌ POST /workflows/{workflow_id}/deactivate - Deactivate workflow
- ❌ POST /workflows/{workflow_id}/lock - Lock workflow
- ❌ POST /workflows/{workflow_id}/unlock - Unlock workflow
- ❌ GET /workflows/{workflow_id}/actions - List actions
- ❌ POST /workflows/{workflow_id}/actions - Create action
- ❌ GET /workflows/{workflow_id}/actions/{action_id} - Get action
- ❌ PATCH /workflows/{workflow_id}/actions/{action_id} - Update action
- ❌ DELETE /workflows/{workflow_id}/actions/{action_id} - Delete action
- ❌ GET /workflows/{workflow_id}/actions/{action_id}/links - Get action links
- ❌ GET /workflows/{workflow_id}/actions/{action_id}/render - Render action
- ❌ POST /workflows/{workflow_id}/actions/{action_id}/send-test - Send test action

### ❌ Report (0% - 0/11)

**Missing:**
- ❌ GET /reports/accounts/self - My account report
- ❌ GET /reports/accounts/{account_id} - Account report
- ❌ GET /reports/campaigns/{campaign_id} - Campaign report
- ❌ GET /reports/campaigns/{campaign_id}/links - Campaign links report
- ❌ GET /reports/lists/{list_id} - List report
- ❌ GET /reports/campaigns-exports - List campaign exports
- ❌ POST /reports/campaigns-exports - Create campaign export
- ❌ GET /reports/campaigns-exports/{export_id} - Get campaign export
- ❌ DELETE /reports/campaigns-exports/{export_id} - Delete campaign export
- ❌ GET /reports/campaigns-exports/{export_id}/download - Download campaign export
- ❌ GET /reports/workflows/{workflow_id}/actions/{action_id} - Action report

### ❌ Segment (0% - 0/5)

**Missing:**
- ❌ GET /lists/{list_id}/segments - List segments
- ❌ POST /lists/{list_id}/segments - Create segment
- ❌ GET /lists/{list_id}/segments/{segment_id} - Get segment
- ❌ PATCH /lists/{list_id}/segments/{segment_id} - Update segment
- ❌ DELETE /lists/{list_id}/segments/{segment_id} - Delete segment

### ❌ Interest (0% - 0/5)

**Missing:**
- ❌ GET /lists/{list_id}/interests - List interests
- ❌ POST /lists/{list_id}/interests - Create interest
- ❌ GET /lists/{list_id}/interests/{interest_name} - Get interest
- ❌ PATCH /lists/{list_id}/interests/{interest_name} - Update interest
- ❌ DELETE /lists/{list_id}/interests/{interest_name} - Delete interest

### ❌ Custom Attribute (0% - 0/4)

**Missing:**
- ❌ GET /lists/{list_id}/custom-attributes - List custom attributes
- ❌ POST /lists/{list_id}/custom-attributes - Create custom attribute
- ❌ GET /lists/{list_id}/custom-attributes/{name} - Get custom attribute
- ❌ DELETE /lists/{list_id}/custom-attributes/{name} - Delete custom attribute

### ❌ Tags (0% - 0/5)

**Missing:**
- ❌ GET /tags - List contact tags
- ❌ POST /tags - Create contact tag
- ❌ GET /tags/{tag} - Show contact tag
- ❌ PATCH /tags/{tag} - Edit contact tag
- ❌ DELETE /tags/{tag} - Delete contact tag

### ✅ Email API v2 (42.9% - 3/7) - HIGH PRIORITY

**Implemented:**
- ✅ `emails send` → POST /v2/emails - Submit an email
- ✅ `emails get <email-id>` → GET /v2/emails/{email_id} - Retrieve a submitted email
- ✅ `emails render <email-id>` → GET /v2/emails/{email_id}/render - Render a submitted email

**Missing:**
- ❌ GET /v2/logs/emails - Show Email API activity logs
- ❌ GET /v2/reports/emails - Show Email API statistics
- ❌ GET /logs/emails-summary - Show Email API activity summary
- ❌ GET /email-tags - List Email Tags

### ❌ Logs & Exports (0% - 0/10) - MEDIUM PRIORITY

**Missing:**
- ❌ GET /logs/campaigns/{campaign_id} - Show campaign logs
- ❌ GET /logs/campaigns/{campaign_id}/exports - List campaign log exports
- ❌ POST /logs/campaigns/{campaign_id}/exports - Create campaign log export
- ❌ GET /logs/campaigns/{campaign_id}/exports/{export_id}/download - Download export
- ❌ GET /logs/lists/{list_id} - Show list logs
- ❌ GET /logs/lists/{list_id}/exports - List list log exports
- ❌ POST /logs/lists/{list_id}/exports - Create list log export
- ❌ GET /logs/lists/{list_id}/exports/{export_id}/download - Download export
- ❌ GET /logs/workflows/{workflow_id}/actions/{action_id} - Show action logs
- ❌ GET /email-tags - List email tags

---

## Roadmap & Priorities

### 🎯 Phase 1: Core Features (v0.1.0 - v0.2.0) ✅ COMPLETE
- ✅ Campaigns (basic CRUD)
- ✅ Lists (basic CRUD)
- ✅ Contacts (basic CRUD)
- ✅ Senders (basic CRUD)
- ✅ Webhooks (complete)

### 🎯 Phase 2: High Priority Features (v0.3.0 - v0.4.0) ✅ COMPLETE
- ✅ Email API v2 (submit, retrieve, render) - Core endpoints complete
- ✅ Campaign lifecycle (archive, suspend, resume, cancel) - Complete

### 🎯 Phase 3: Essential Features (Current - v0.5.0+)
**High Priority:**
- 📋 Email API v2 logs and stats (remaining endpoints)
- 📋 Templates (CRUD + render)
- 📋 Segments (CRUD)
- 📋 Contact tags and interests
- 📋 Custom attributes
- 📋 Reports (campaigns, lists, accounts)
- 📋 Logs and exports (campaigns, lists, contacts)

### 🎯 Phase 4: Advanced Features (v0.6.0+)
**Medium Priority:**
- 📋 Workflows and automation
- 📋 Sub-accounts management
- 📋 User management
- 📋 Forms
- 📋 Suppressed emails
- 📋 DKIM management
- 📋 Domain configuration

### 🎯 Phase 5: Nice-to-Have (v1.0.0+)
**Low Priority:**
- 📋 Tasks
- 📋 Campaign blueprints
- 📋 Workflow blueprints
- 📋 System emails
- 📋 MFA management

### ⚪ Out of Scope
**Not Planned:**
- ⚪ Transactional Email endpoints (managed through workflows)

---

## Quick Wins (Easy to Implement)

These endpoints would significantly improve coverage with minimal effort:

1. **Campaign lifecycle** (6 endpoints, simple POST requests):
   - archive, unarchive, cancel, suspend, resume, reschedule

2. **List management** (2 endpoints):
   - PATCH /lists/{list_id} - Update list
   - POST /lists/{list_id}/archive - Archive list

3. **Sender completion** (2 endpoints):
   - PATCH /brands/default/senders/{sender_id} - Update sender
   - POST /brands/default/senders/{sender_id}/resend-confirmation-email

4. **Contact tags** (2 endpoints):
   - POST /lists/{list_id}/contacts/{contact_id}/tag
   - POST /lists/{list_id}/contacts/{contact_id}/untag

5. **Basic reporting** (3 endpoints):
   - GET /reports/campaigns/{campaign_id}
   - GET /reports/lists/{list_id}
   - GET /reports/accounts/self

**Total Quick Wins:** 15 endpoints = **~10% coverage boost** with minimal code

---

## Coverage Goals

| Version | Target Coverage | Focus Areas |
|---------|----------------|-------------|
| v0.2.0 | 18% ✅ | Core CRUD operations |
| v0.3.0 | 30% | Campaign lifecycle + reporting |
| v0.4.0 | 45% | Transactional emails + templates |
| v0.5.0 | 60% | Segments + workflows basics |
| v0.6.0 | 75% | Advanced features |
| v1.0.0 | 90%+ | Complete coverage |

---

*Generated: 2025-10-08*
*CLI Version: 0.2.0*
*API Version: Latest (149 endpoints)*
