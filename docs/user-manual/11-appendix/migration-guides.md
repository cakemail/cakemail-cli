# Migration Guides

This section contains migration guides for major version upgrades of the Cakemail CLI.

## Available Migration Guides

### [Migration from v1.4 to v1.5](./migration-v1.4-to-v1.5.md)

**Released:** October 11, 2025

**Major Changes:**
- Profile System with three user profiles (developer, marketer, balanced)
- 6 new config management commands
- Interactive prompt system
- Profile-aware confirmations
- Global `--profile` and `--batch` flags
- Configuration storage in `~/.cakemail/config.json`

**Breaking Changes:** None - fully backward compatible

**Migration Effort:** Low - automatic credential migration, opt-in features

---

## Migration Best Practices

### Before Upgrading

1. **Review the changelog**
   - Read the [CHANGELOG.md](../../../../CHANGELOG.md) for the target version
   - Understand what's new and what changed
   - Check for breaking changes

2. **Backup your configuration**
   ```bash
   # Backup .env file
   cp ~/.cakemail/.env ~/.cakemail/.env.backup

   # Backup config.json (if exists)
   cp ~/.cakemail/config.json ~/.cakemail/config.json.backup
   ```

3. **Test in a non-production environment**
   - Try the new version in a test account
   - Verify your scripts still work
   - Understand new features before production use

### During Migration

1. **Follow the migration guide**
   - Each guide provides step-by-step instructions
   - Pay attention to "Breaking Changes" sections
   - Test as you go

2. **Update one thing at a time**
   - Don't change everything at once
   - Upgrade CLI version first
   - Adopt new features gradually

3. **Document changes**
   - Note what you changed
   - Update team documentation
   - Share findings with your team

### After Migration

1. **Verify everything works**
   - Run through your typical workflows
   - Test all scripts and automations
   - Check CI/CD pipelines

2. **Adopt new features**
   - Review what's new in the version
   - Gradually adopt features that benefit you
   - Update scripts to use new capabilities

3. **Stay informed**
   - Subscribe to release notifications
   - Follow the [GitHub repository](https://github.com/cakemail-org/cakemail-cli)
   - Check the [documentation changelog](./changelog.md) regularly

---

## Version Support

### Supported Versions

We support the latest major version and the previous major version:

- **v1.5.x** - Current, fully supported
- **v1.4.x** - Previous, security fixes only

### End of Life

When a version reaches end-of-life:
- No more updates or fixes
- Security vulnerabilities won't be patched
- Migration guide provided for upgrade path

We recommend staying on the latest version when possible.

---

## Getting Help

### Migration Issues

If you encounter issues during migration:

1. **Check the troubleshooting section** in the migration guide
2. **Review your configuration**: `cakemail config show`
3. **Test with default settings**: `cakemail config reset`
4. **Search existing issues**: [GitHub Issues](https://github.com/cakemail-org/cakemail-cli/issues)
5. **Create a new issue**: Provide version numbers and error messages

### Community Support

- **GitHub Discussions**: Ask questions and share tips
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and references

---

## Rollback Instructions

If you need to roll back to a previous version:

### Via Homebrew

```bash
# Uninstall current version
brew uninstall cakemail-cli

# Install specific version
brew install cakemail-cli@1.4
```

### Via npm

```bash
# Uninstall current version
npm uninstall -g @cakemail-org/cakemail-cli

# Install specific version
npm install -g @cakemail-org/cakemail-cli@1.4.0
```

### Restore Configuration

Refer to the "Rollback Plan" section in each migration guide for version-specific instructions.

---

## Version History

### v1.5.0 (Current)
- Profile System
- Interactive prompts
- Config management commands

### v1.4.0
- Seamless authentication
- Multi-tenant support
- Enhanced output formatting
- Smart defaults
- Progress indicators
- Interactive confirmations

### v1.3.0
- Analytics & reporting (47 commands)
- Contact import/export
- Segments management
- Custom attributes
- Suppression list

### v1.2.0
- Package rename to @cakemail-org/cakemail-cli

### v1.1.0
- Full SDK integration
- Senders management
- Templates management

### v1.0.0
- Initial SDK migration

---

## Next Steps

- Read the [Changelog](./changelog.md) for detailed release notes
- Review [Configuration Guide](../01-getting-started/configuration.md)
- Explore [Profile System](../02-core-concepts/profile-system.md)
