# Changelog

All notable changes to the Cakemail CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
