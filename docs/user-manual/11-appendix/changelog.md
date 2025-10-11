# Documentation Changelog

This changelog tracks updates to the user manual documentation. For CLI feature changes, see the [main project CHANGELOG.md](../../../../CHANGELOG.md).

---

## [Documentation v1.5.0] - 2025-10-11

### Added

**Profile System Documentation**
- New guide: [Profile System](../02-core-concepts/profile-system.md) - Complete coverage of the three user profiles
- Updated [Configuration Guide](../01-getting-started/configuration.md) - Profile management and `~/.cakemail/config.json`
- New command reference: [Config Commands](../09-command-reference/config.md) - All 6 profile management commands
- Updated [Authentication Guide](../01-getting-started/authentication.md) - First-time auth flow with profile selection

**Interactive Features Documentation**
- Updated [Quick Start Guide](../01-getting-started/quick-start.md) - Interactive campaign creation examples
- Updated [Campaign Basics](../04-campaign-management/campaigns-basics.md) - Interactive resource selection
- Updated all command references - Interactive confirmation behavior by profile

**Migration Guide**
- New guide: [Migration v1.4 to v1.5](./migration-v1.4-to-v1.5.md) - Complete upgrade path

### Updated
- Main README version reference: 1.4.0 → 1.5.0
- All command references updated with `--profile` and `--batch` flag documentation
- Configuration priority documentation updated to include profile settings

### CLI Features Documented
From [CHANGELOG v1.5.0](../../../../CHANGELOG.md#150---2025-10-11):
- Three user profiles (developer, marketer, balanced)
- 6 profile management commands
- Interactive prompt system
- Profile-aware confirmations
- Global `--profile` and `--batch` flags
- Configuration storage in `~/.cakemail/config.json`

---

## [Documentation v1.4.0] - 2025-10-11

### Added

**Enhanced Output & Visual Features**
- Updated [Output Formats Guide](../01-getting-started/output-formats.md) - JSON syntax highlighting, status badges, relative dates
- Updated [Error Handling Guide](../02-core-concepts/error-handling.md) - Enhanced error messages with suggestions

**Multi-Tenant & Account Management**
- Updated [Accounts Guide](../02-core-concepts/accounts.md) - Multi-tenant support and account switching
- Updated [Authentication Guide](../01-getting-started/authentication.md) - Interactive authentication prompts

**Smart Features Documentation**
- New guide: [Smart Defaults](../02-core-concepts/smart-defaults.md) - Auto-detection of lists and senders
- Updated [Batch Operations Guide](../08-advanced-usage/batch-operations.md) - Progress indicators

**Interactive Confirmations**
- Updated all delete command documentation across 12 command reference files
- Added confirmation behavior, danger levels, and `--force` flag usage

### CLI Features Documented
From [CHANGELOG v1.4.0](../../../../CHANGELOG.md#140---2025-10-11):
- Seamless interactive authentication
- 5 account management commands
- Enhanced output formatting (status badges, colors, relative dates)
- Smart resource auto-detection (14 commands)
- Progress indicators for long operations
- Interactive confirmations for destructive operations (13 commands)
- Enhanced error handling and validation

---

## Documentation Standards

### Version Alignment
Documentation version numbers align with CLI releases. Each documentation update covers the features introduced in the corresponding CLI version.

### Update Process
When a new CLI version is released:
1. Review the main [CHANGELOG.md](../../../../CHANGELOG.md)
2. Identify features requiring documentation updates
3. Create or update relevant documentation files
4. Add entry to this changelog
5. Update version reference in main [README](../README.md)

### Documentation Structure
- **Getting Started** - Installation, authentication, configuration, quick start
- **Core Concepts** - Fundamental concepts and behaviors
- **Feature Guides** - Detailed guides for specific features (3-7 sections)
- **Command Reference** - Complete command documentation (9 sections)
- **Advanced Usage** - Scripting, automation, CI/CD
- **Troubleshooting** - Common issues and solutions
- **Appendix** - Changelog, migration guides, glossary

### Cross-References
Documentation includes cross-references to:
- Main project CHANGELOG.md for technical details
- Related documentation sections for deeper coverage
- Command reference for specific command usage
- Troubleshooting guides for common issues

---

## Getting Help

- **User Manual**: [Main README](../README.md)
- **CLI Changelog**: [CHANGELOG.md](../../../../CHANGELOG.md)
- **GitHub Issues**: Report documentation issues or request improvements
- **API Documentation**: [Cakemail API Docs](https://api.cakemail.com)
