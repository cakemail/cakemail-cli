# Cakemail CLI - Documentation Hub

**Welcome to the Cakemail CLI documentation!**

---

## 📚 Documentation Types

### For Users
- **[User Manual](./user-manual/)** - Complete guide for using the CLI
- **[Quick Start](./user-manual/01-getting-started/quick-start.md)** - Get started in 5 minutes

### For Contributors
- **[Developer Docs](./developer/)** - Internal documentation for contributors
- **[Project Index](./developer/PROJECT_INDEX.md)** - Start here for contributing

### For Project Management
- **[Planning Docs](./planning/)** - Roadmaps and feature plans

---

## 🚀 Quick Links

### I want to...
- **Use the CLI** → [User Manual](./user-manual/)
- **Contribute code** → [Developer Docs](./developer/)
- **See what's planned** → [Backlog](./planning/BACKLOG.md)
- **See what's shipped** → [Changelog](../CHANGELOG.md)

---

## 📖 Documentation Structure

```
docs/
├── README.md (this file)          # Documentation hub
│
├── user-manual/                    # End-user documentation
│   ├── 01-getting-started/
│   ├── 02-core-concepts/
│   ├── 03-campaigns/
│   ├── ...
│   └── README.md
│
├── developer/                      # Contributor documentation
│   ├── PROJECT_INDEX.md           # Start here!
│   ├── ARCHITECTURE.md            # Code structure
│   ├── CONTRIBUTING.md            # How to contribute
│   ├── AUTH.md                    # Auth reference
│   └── DOCUMENTATION_SUMMARY.md   # How docs work
│
└── planning/                       # Project planning
    ├── BACKLOG.md                 # What's next (FUTURE)
    ├── API_COVERAGE.md            # API coverage tracking
    ├── UX_IMPLEMENTATION_PLAN.md  # UX roadmap
    ├── PROFILE_SYSTEM_PLAN.md     # Profile system design
    └── PROFILE_SYSTEM_TASKS.md    # Profile tasks

Root level:
├── README.md                       # Project README
├── CHANGELOG.md                    # Version history (PAST)
└── package.json                    # Package info
```

---

## 🗺️ Documentation Map

### User Journey
```
New User → README.md → User Manual → Quick Start → Commands
```

### Contributor Journey
```
New Contributor → PROJECT_INDEX.md → ARCHITECTURE.md → BACKLOG.md → Code
```

### Project Manager Journey
```
PM → BACKLOG.md → Planning Docs → CHANGELOG.md
```

---

## 📝 Documentation Standards

### User Manual
- **Audience:** CLI users (technical and non-technical)
- **Tone:** Helpful, example-driven, clear
- **Format:** Step-by-step guides with examples

### Developer Docs
- **Audience:** Contributors and maintainers
- **Tone:** Technical, precise, comprehensive
- **Format:** Reference docs with code examples

### Planning Docs
- **Audience:** Project team and stakeholders
- **Tone:** Strategic, decision-oriented
- **Format:** Roadmaps, priorities, timelines

---

## 🔄 Documentation Lifecycle

### When to Update

**After implementing a feature:**
1. Update [BACKLOG.md](./planning/BACKLOG.md) → Mark completed
2. Add to [CHANGELOG.md](../CHANGELOG.md) → [Unreleased] section
3. Update [User Manual](./user-manual/) → Add command guide
4. Update [README.md](../README.md) → If major feature

**Before a release:**
1. Move CHANGELOG [Unreleased] → [v1.X.0]
2. Archive BACKLOG completed items
3. Update version numbers everywhere
4. Review all docs for accuracy

**Quarterly:**
1. Review all documentation
2. Archive outdated plans
3. Update roadmaps
4. Clean up duplicates

---

## 🤝 Contributing to Docs

### User Manual
- Keep examples realistic
- Test all commands before documenting
- Include troubleshooting for common issues
- Cross-reference related commands

### Developer Docs
- Keep ARCHITECTURE.md updated with code changes
- Document all design decisions
- Update PROJECT_INDEX.md when adding docs
- Maintain cross-references

### Planning Docs
- Update BACKLOG.md weekly
- Sync CHANGELOG.md with releases
- Keep effort estimates realistic
- Document decisions and trade-offs

---

## 📞 Need Help?

- **For CLI usage:** Check [User Manual](./user-manual/)
- **For contributing:** Check [Developer Docs](./developer/)
- **For roadmap:** Check [Planning Docs](./planning/)
- **For bugs:** Open an issue on GitHub

---

**Last Updated:** 2025-10-11
**Maintained By:** François Lane
