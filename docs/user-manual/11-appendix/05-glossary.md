# Glossary

Definitions of key terms and concepts used in the Cakemail CLI documentation.

## A

**Account**
Your Cakemail account with associated plan, limits, and settings.

**API (Application Programming Interface)**
Interface that allows the CLI to communicate with Cakemail services.

**Attribute (Custom)**
Additional data fields you define to store custom contact information beyond email and name.

## B

**Batch Mode**
Non-interactive mode for running CLI commands in scripts without confirmation prompts.

**Bounce**
Failed email delivery. Can be hard (permanent) or soft (temporary).

**Bounce Rate**
Percentage of sent emails that bounced: (Bounces / Sent) × 100

## C

**Campaign**
An email message sent to a list or segment of contacts.

**Click Rate (CTR)**
Percentage of delivered emails where recipient clicked a link: (Unique Clicks / Delivered) × 100

**Click-to-Open Rate (CTOR)**
Percentage of email openers who clicked a link: (Unique Clicks / Unique Opens) × 100

**Contact**
An email subscriber in your lists with associated data.

**CSV (Comma-Separated Values)**
File format used for importing/exporting contact data.

**Custom Attribute**
See Attribute.

## D

**Deliverability**
Ability to successfully deliver emails to recipients' inboxes.

**Delivery Rate**
Percentage of emails successfully delivered: (Delivered / Sent) × 100

**Double Opt-In**
Subscription process requiring email confirmation before adding contact to list.

**Draft**
Campaign state before scheduling or sending.

## E

**Engagement**
Measure of how recipients interact with emails (opens, clicks).

**Export**
Process of downloading contact or campaign data from Cakemail.

## F

**Filter**
Query parameter to narrow results based on specific criteria.

**Format**
Output format for CLI commands (table, json, csv, compact).

## H

**Hard Bounce**
Permanent delivery failure (invalid email, domain doesn't exist).

**HTML**
Email content format supporting rich text, images, and styling.

## I

**Import**
Process of uploading contact data to Cakemail from external source.

**ISO Format**
Standard date format: YYYY-MM-DD (e.g., 2024-03-15).

## J

**JSON (JavaScript Object Notation)**
Data format used for structured data exchange and CLI output.

## K

**Key Result**
See KPI.

**KPI (Key Performance Indicator)**
Metric used to evaluate campaign success (open rate, click rate, etc.).

## L

**List**
Static collection of contacts you manage manually.

**List Health**
Measure of list quality based on active vs. inactive contacts.

## M

**Merge Tag**
Placeholder in email content replaced with contact-specific data (e.g., {{first_name}}).

**MRR (Monthly Recurring Revenue)**
Predictable revenue metric for subscription businesses.

## O

**Open**
Tracked event when recipient opens an email.

**Open Rate**
Percentage of delivered emails that were opened: (Unique Opens / Delivered) × 100

## P

**Pagination**
Dividing large result sets into pages for easier handling.

**Plain Text**
Email content without HTML formatting.

**Profile**
CLI behavior mode (developer, marketer, balanced) affecting output verbosity and confirmation prompts.

## Q

**Query**
Request to filter or search data using specific criteria.

**Quota**
Account limits for contacts, emails sent, etc.

## R

**Rate Limiting**
Restriction on number of API requests in a time period.

**Recipient**
Contact who receives a campaign.

## S

**Segment**
Dynamic group of contacts automatically updated based on conditions.

**Sender**
Verified email address used as campaign sender.

**Smart Default**
Automatic detection of list/sender when only one exists (v1.4.0+).

**Soft Bounce**
Temporary delivery failure (inbox full, server temporarily unavailable).

**Spam Complaint**
When recipient marks email as spam.

**Status**
State of contact (subscribed, unsubscribed, bounced) or campaign (draft, scheduled, sending, sent).

**Subject Line**
Email subject displayed in recipient's inbox.

## T

**Template**
Reusable email design with placeholders for content.

**Test Email**
Preview email sent before campaign launch.

**Transactional Email**
Automated, triggered email (receipts, notifications) vs. marketing campaigns.

**Tracking**
Monitoring email opens and link clicks via invisible pixels and wrapped URLs.

## U

**Unique Click**
First click by a specific contact (subsequent clicks not counted).

**Unique Open**
First open by a specific contact (subsequent opens not counted).

**Unsubscribe**
Action where contact opts out of receiving emails.

**Unsubscribe Rate**
Percentage of delivered emails resulting in unsubscribe: (Unsubscribes / Delivered) × 100

**UTC (Coordinated Universal Time)**
Standard time zone reference (timezone +00:00).

**UTM Parameters**
URL tracking parameters for Google Analytics (utm_source, utm_medium, utm_campaign).

## V

**Verification**
Process of confirming email address ownership for sender addresses.

## W

**Webhook**
HTTP callback that delivers real-time event notifications.

**Workflow**
Automated sequence of CLI commands for common tasks.

## Metric Formulas Quick Reference

| Metric | Formula |
|--------|---------|
| Delivery Rate | (Delivered / Total Recipients) × 100 |
| Bounce Rate | (Bounced / Total Recipients) × 100 |
| Open Rate | (Unique Opens / Delivered) × 100 |
| Click Rate (CTR) | (Unique Clicks / Delivered) × 100 |
| Click-to-Open Rate (CTOR) | (Unique Clicks / Unique Opens) × 100 |
| Unsubscribe Rate | (Unsubscribes / Delivered) × 100 |
| Spam Rate | (Spam Complaints / Delivered) × 100 |

## Industry Benchmarks

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| Delivery Rate | ≥ 95% | ≥ 97% | ≥ 99% |
| Open Rate | 15-20% | 20-25% | > 25% |
| Click Rate | 2-3% | 3-5% | > 5% |
| Unsubscribe Rate | < 0.5% | < 0.3% | < 0.2% |
| Bounce Rate | < 5% | < 3% | < 2% |
| Spam Rate | < 0.1% | < 0.05% | < 0.01% |

*Note: Benchmarks vary by industry, audience, and email type.*
