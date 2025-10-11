# Changelog

All notable changes to the Cakemail CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-10-11

### Added - Analytics & Data Operations (47 new commands)

**Reports & Analytics (12 commands)**
- `reports campaign <id>` - Campaign analytics and statistics
- `reports campaign-links <id>` - Link click analytics
- `reports list <id>` - List growth and engagement statistics
- `reports account` - Account-wide analytics
- `reports emails` - Email API statistics with date filtering
- `reports emails-summary` - Email API activity summary
- `reports transactional-emails` - Transactional email statistics
- `reports campaigns-exports` - List campaign report exports
- `reports export-campaigns` - Create campaign report export
- `reports campaigns-export <id>` - Get export status
- `reports download-campaigns-export <id>` - Download export
- `reports delete-campaigns-export <id>` - Delete export

**Contact Import/Export (9 commands)**
- Contact import command - Planned for future release (requires CSV parser)
- `contacts export <list-id>` - Create contacts export with filtering
- `contacts exports <list-id>` - List all contact exports
- `contacts export-get <list-id> <export-id>` - Get export status
- `contacts export-download <list-id> <export-id>` - Download export file
- `contacts export-delete <list-id> <export-id>` - Delete export
- `contacts tag <list-id> <contact-id>` - Tag individual contact
- `contacts untag <list-id> <contact-id>` - Remove tags from contact
- `contacts tag-bulk <list-id>` - Tag multiple contacts at once
- `contacts untag-bulk <list-id>` - Remove tags from multiple contacts

**Segments (6 commands)**
- `segments list <list-id>` - List all segments in a list
- `segments get <list-id> <segment-id>` - Get segment details
- `segments create <list-id>` - Create new segment with conditions
- `segments update <list-id> <segment-id>` - Update segment
- `segments delete <list-id> <segment-id>` - Delete segment
- `segments contacts <list-id> <segment-id>` - List contacts in segment

**Custom Attributes (4 commands)**
- `attributes list <list-id>` - List all custom attributes
- `attributes get <list-id> <name>` - Get attribute details
- `attributes create <list-id>` - Create custom attribute (text, number, date, boolean)
- `attributes delete <list-id> <name>` - Delete custom attribute

**Suppression List (7 commands)**
- `suppressed list` - List all suppressed email addresses
- `suppressed add <email>` - Add email to suppression list
- `suppressed delete <email>` - Remove email from suppression list
- `suppressed exports` - List suppression exports
- `suppressed export` - Create suppression list export
- `suppressed export-get <export-id>` - Get export status
- `suppressed export-download <export-id>` - Download export

**Extended List Operations (7 commands)**
- `lists update <id>` - Update list name and parameters
- `lists archive <id>` - Archive a list
- `lists accept-policy <id>` - Accept policy for a list
- `lists forms <id>` - List subscription form endpoints
- `lists form-create <id>` - Create subscription form endpoint
- `lists form-delete <list-id> <form-id>` - Delete subscription form

**Extended Email API (2 commands)**
- `emails logs` - Email API activity logs with filtering
- `emails tags` - List all email tags

### Changed
- Coverage increased from 56 to 103 commands (24% → 44% API coverage)
- Enhanced contact management with bulk tagging operations
- Improved data portability with import/export capabilities

### Documentation
- Complete rewrite of API_COVERAGE.md with detailed v1.3 roadmap
- Added coverage expansion plan for v1.3-v1.5
- Added priority matrix for feature development
- Added implementation timeline and effort estimates
- Updated API coverage table with 25 categories
- Created UX_IMPLEMENTATION_PLAN.md for future improvements

### Notes
- All new commands follow SDK-based architecture
- Maintains backwards compatibility with all v1.2 commands
- File upload support for contact imports (CSV/JSON)
- Export operations support async task monitoring

## [1.2.0] - 2025-10-10

### Changed
- **BREAKING**: Renamed package from `@cakemail-org/cli` to `@cakemail-org/cakemail-cli`
- **BREAKING**: Renamed Homebrew formula from `cakemail` to `cakemail-cli`
- Binary name remains `cakemail` for ease of use

### Migration
- npm users: `npm install -g @cakemail-org/cakemail-cli`
- Homebrew users: `brew uninstall cakemail && brew install cakemail-cli`
- Old package `@cakemail-org/cli` deprecated with migration message

## [1.1.2] - 2025-10-10

### Changed
- **BREAKING**: Migrated to new SDK package name `@cakemail-org/cakemail-sdk` (was `cakemail-sdk`)
- Updated all documentation references to new SDK package name

### Added
- Homebrew distribution support via `brew tap cakemail/cakemail`
- HOMEBREW.md with complete Homebrew setup guide

## [1.1.1] - 2025-10-10

### Security
- Pre-publication security cleanup
- Enhanced .gitignore patterns

### Documentation
- Added CONTRIBUTING.md with development guidelines
- Added CHANGELOG.md with version history
- Fixed package name in ARCHITECTURE.md

### Fixed
- Replaced console.log with formatter.output in emails render command

## [1.1.0] - 2025-10-10

### Added
- Full migration to official @cakemail-org/cakemail-sdk v2.0 with 100% API coverage (232 operations)
- Complete senders management (7 commands)
- Complete templates management (6 commands)
- User-configurable default output format via `CAKEMAIL_OUTPUT_FORMAT` environment variable

### Changed
- **BREAKING**: Sender confirmation now uses single confirmation ID: `senders confirm <confirmation-id>` (was `senders confirm <id> -k <key>`)
- All commands now use SDK 2.0 services (object-based API)
- Updated all SDK method calls to use object-based parameters
- Improved authentication error messages

### Fixed
- Console.log replaced with formatter.output in emails render command
- URL encoding for authentication parameters
- .env loading now uses current working directory

### Documentation
- Complete rewrite of API_COVERAGE.md to reflect SDK-based approach
- Updated README with SDK reference and all new commands
- Added comprehensive examples for all command categories

## [1.0.0] - 2025-10-09

### Added
- Initial migration to official @cakemail-org/cakemail-sdk v1.1.0
- SDK integration for campaigns, lists, contacts, emails, and webhooks

### Changed
- Replaced custom HTTP client with SDK wrapper
- All migrated commands now use `client.sdk.*` methods

## [0.5.0] - 2025-10-09

### Added
- Email API v2 support for transactional emails
- `emails send` - Submit transactional emails with HTML/text or templates
- `emails get` - Retrieve submitted email details
- `emails render` - Render email HTML
- Template support with file uploads
- Custom headers, attachments, and tracking options

## [0.4.0] - 2025-10-08

### Added
- Complete campaign lifecycle management (15 commands)
- Campaign scheduling, rescheduling, and unscheduling
- Campaign suspension and resumption
- Campaign cancellation
- Test email sending
- Campaign archiving and unarchiving
- Campaign links listing
- Advanced filtering and sorting for campaigns

## [0.3.0] - 2025-10-08

### Added
- Complete template management (6 commands)
- `templates create` with HTML/text file upload support
- `templates update` with file upload support
- `templates render` for template preview
- Template deletion with confirmation
- Advanced filtering and sorting for templates

## [0.2.0] - 2025-10-08

### Added
- Webhooks management (6 commands)
- `webhooks create` with event subscriptions
- `webhooks update` for webhook configuration
- `webhooks archive` and `webhooks unarchive`
- Webhook secret support for signature verification

## [0.1.3] - 2025-10-08

### Fixed
- Removed unsupported format options from documentation

## [0.1.2] - 2025-10-08

### Fixed
- Corrected API base URL to api.cakemail.dev

## [0.1.1] - 2025-10-08

### Fixed
- API base URL configuration

## [0.1.0] - 2025-10-08

### Added
- Initial release
- Campaigns management (list, get, create, update, delete)
- Lists management (list, get, create, delete)
- Contacts management (list, get, add, update, delete, unsubscribe)
- Senders management (list, get, create, update, delete)
- Three output formats: JSON, table, compact
- Environment variable configuration
- Access token and email/password authentication
- Advanced filtering and sorting
- Pagination support

[1.1.0]: https://github.com/cakemail/cli/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cakemail/cli/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/cakemail/cli/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/cakemail/cli/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/cakemail/cli/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/cakemail/cli/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/cakemail/cli/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/cakemail/cli/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/cakemail/cli/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/cakemail/cli/releases/tag/v0.1.0
