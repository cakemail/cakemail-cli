# Cakemail CLI - Project Index

**🎯 START HERE for project onboarding and context**

---

## 📖 Quick Orientation

**What is this?** Official CLI for the Cakemail email marketing platform
**Current Version:** 1.4.0
**Status:** Active development
**Language:** TypeScript
**Distribution:** npm, Homebrew

---

## 🗺️ Documentation Map

### For New AI/Contributors (Read First)

1. **[README.md](../../README.md)** - Project overview, installation, basic usage
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code structure, design patterns, technical decisions
3. **[CHANGELOG.md](../../CHANGELOG.md)** - Version history, what's been built (PAST)
4. **[BACKLOG.md](../planning/BACKLOG.md)** - What's planned next (FUTURE)

**Read these 4 files to understand the entire project.**

---

### Documentation Structure

```
/docs/
├── README.md                      # Documentation hub
├── developer/                     # ← YOU ARE HERE
│   ├── PROJECT_INDEX.md          # This file (start here!)
│   ├── ARCHITECTURE.md           # Code structure
│   ├── CONTRIBUTING.md           # How to contribute
│   ├── AUTH.md                   # Auth reference
│   └── DOCUMENTATION_SUMMARY.md  # How docs work
├── planning/
│   ├── BACKLOG.md               # What's next (SINGLE SOURCE OF TRUTH)
│   ├── API_COVERAGE.md          # API coverage tracker
│   ├── UX_IMPLEMENTATION_PLAN.md # UX roadmap
│   ├── cakemail-profile-system-plan.md
│   ├── PROFILE_SYSTEM_TASKS.md
│   └── archive/                 # Historical docs
└── user-manual/                 # End-user documentation
```

---

### Planning & Roadmap Documents

These documents inform BACKLOG.md:

| Document | Purpose | Status | Should Read? |
|----------|---------|--------|--------------|
| **[BACKLOG.md](../planning/BACKLOG.md)** | Master task list - SINGLE SOURCE OF TRUTH | ✅ Active | **YES - Start here for "what's next"** |
| [API_COVERAGE.md](../planning/API_COVERAGE.md) | API command coverage tracker | ✅ Active | YES - for API feature work |
| [UX_IMPLEMENTATION_PLAN.md](../planning/UX_IMPLEMENTATION_PLAN.md) | Detailed UX roadmap (v1.4-v1.7) | ✅ Active | YES - for UX feature work |
| [cakemail-profile-system-plan.md](../planning/cakemail-profile-system-plan.md) | Profile system design doc | ✅ Active | YES - if working on profiles |
| [PROFILE_SYSTEM_TASKS.md](../planning/PROFILE_SYSTEM_TASKS.md) | Profile system task breakdown | ✅ Active | YES - if implementing profiles |

---

### Reference Documents

| Document | Purpose | Should Read? |
|----------|---------|--------------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines | If contributing |
| [AUTH.md](./AUTH.md) | Authentication design | If working on auth |
| [DOCUMENTATION_SUMMARY.md](./DOCUMENTATION_SUMMARY.md) | How docs work together | If confused about docs |

---

### Historical Documents (Archive)

| Document | Purpose | Status |
|----------|---------|--------|
| [RELEASE_v1.3.0.md](../planning/archive/RELEASE_v1.3.0.md) | v1.3.0 release notes | ✅ Shipped |
| [RELEASE_CHECKLIST_v1.3.0.md](../planning/archive/RELEASE_CHECKLIST_v1.3.0.md) | v1.3.0 checklist | ✅ Complete |
| [cakemail-cli-ux-improvements.md](../planning/archive/cakemail-cli-ux-improvements.md) | Early UX brainstorming | Superseded |

**Note:** These are historical. Check [CHANGELOG.md](../../CHANGELOG.md) for complete version history.

---

## 🔄 Relationship Between Key Documents

```
┌─────────────────────────────────────────────────────────────┐
│                        README.md                             │
│           "What is this project? How do I use it?"          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE.md                          │
│           "How is the code organized? Why?"                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      CHANGELOG.md ← → BACKLOG.md            │
│                   PAST ← → FUTURE                           │
│   "What we built"        "What we're building next"         │
└─────────────────────────────────────────────────────────────┘
                              ↓
      ┌─────────────────────┬─────────────────────┬───────────────────┐
      │                     │                     │                   │
      ↓                     ↓                     ↓                   ↓
┌──────────────┐  ┌────────────────────┐  ┌──────────────────┐  ┌────────────┐
│API_COVERAGE  │  │ UX_IMPLEMENTATION  │  │  PROFILE_SYSTEM  │  │  AUTH.md   │
│    .md       │  │     _PLAN.md       │  │    _PLAN.md      │  │            │
│              │  │                    │  │                  │  │            │
│ "API work"   │  │  "UX work"         │  │ "Profile work"   │  │ "Auth ref" │
└──────────────┘  └────────────────────┘  └──────────────────┘  └────────────┘
                              ↓
                  ┌───────────────────────┐
                  │ PROFILE_SYSTEM_TASKS  │
                  │       .md             │
                  │                       │
                  │ "Detailed tasks"      │
                  └───────────────────────┘
```

---

## 🎯 "What Should I Work On?" Decision Tree

```
START HERE → Read BACKLOG.md
                 ↓
       ┌─────────┴─────────┐
       ↓                   ↓
   Need context?      Ready to code?
       ↓                   ↓
   Read these:         Check status:
   - ARCHITECTURE      - BACKLOG.md shows priority
   - CHANGELOG         - Find 🔴 CRITICAL or 🟡 HIGH items
   - Relevant plan     - Pick a task
       ↓                   ↓
   Pick work type:     Read detailed plan:
       ↓                   ↓
   ┌───┴───┬───────┬──────┴────┐
   ↓       ↓       ↓           ↓
API work  UX work  Profile   Other
   ↓       ↓       ↓           ↓
Read:    Read:    Read:      Read:
API_     UX_      PROFILE_   CONTRIB
COVERAGE IMPL     SYSTEM_    UTING.md
.md      _PLAN    PLAN.md
         .md      +TASKS.md
```

---

## 📝 Document Lifecycle & Maintenance

### CHANGELOG.md ← → BACKLOG.md Synchronization

**The Rule:**
- **CHANGELOG.md** = Past (what shipped)
- **BACKLOG.md** = Future (what's planned)
- When something ships → Move from BACKLOG → CHANGELOG

**Process:**

1. **Planning Phase** (now)
   - Feature is in BACKLOG.md with status: NOT STARTED
   - CHANGELOG.md doesn't mention it yet

2. **Development Phase**
   - Feature in BACKLOG.md status: IN PROGRESS
   - Still not in CHANGELOG.md

3. **Completion Phase**
   - Feature in BACKLOG.md status: ✅ COMPLETED
   - Add to CHANGELOG.md under "Unreleased" section

4. **Release Phase**
   - Remove from BACKLOG.md (or mark ✅ DONE)
   - Move CHANGELOG.md "Unreleased" → versioned section (e.g., [1.5.0])

**Example Flow:**

```markdown
# BACKLOG.md (Week 1)
### Natural Date Parsing
**Status:** NOT STARTED
**Priority:** HIGH

# BACKLOG.md (Week 2)
### Natural Date Parsing
**Status:** IN PROGRESS
**Priority:** HIGH

# BACKLOG.md (Week 3)
### Natural Date Parsing
**Status:** ✅ COMPLETED
**Priority:** HIGH

# CHANGELOG.md (Week 3)
## [Unreleased]
### Added
- Natural date parsing with chrono-node

# BACKLOG.md (Week 4 - after release)
### Natural Date Parsing
**Status:** ✅ SHIPPED (v1.5.0)
[Can be removed from BACKLOG now]

# CHANGELOG.md (Week 4 - after release)
## [1.5.0] - 2025-10-20
### Added
- Natural date parsing with chrono-node
```

---

## 🔍 Finding Information Fast

### "How do I...?"

| Question | Answer |
|----------|--------|
| ...understand what this project does? | [README.md](../../README.md) |
| ...understand the codebase structure? | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| ...see what's been built? | [CHANGELOG.md](../../CHANGELOG.md) |
| ...see what's planned? | [BACKLOG.md](../planning/BACKLOG.md) |
| ...know what to work on next? | [BACKLOG.md](../planning/BACKLOG.md) → Priority Matrix |
| ...understand a specific feature plan? | [UX_IMPLEMENTATION_PLAN.md](../planning/UX_IMPLEMENTATION_PLAN.md) or [API_COVERAGE.md](../planning/API_COVERAGE.md) or [PROFILE_SYSTEM_PLAN.md](../planning/cakemail-profile-system-plan.md) |
| ...implement a feature? | [ARCHITECTURE.md](./ARCHITECTURE.md) + feature plan + existing code |
| ...test changes? | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| ...release a version? | [CONTRIBUTING.md](./CONTRIBUTING.md) + [CHANGELOG.md](../../CHANGELOG.md) |

---

## 🤖 AI Onboarding Checklist

If you're an AI assistant continuing work on this project:

### Phase 1: Context Gathering (10 min)
- [ ] Read [PROJECT_INDEX.md](./PROJECT_INDEX.md) (this file) - 2 min
- [ ] Skim [README.md](../../README.md) - 2 min
- [ ] Skim [ARCHITECTURE.md](./ARCHITECTURE.md) - 3 min
- [ ] Read [CHANGELOG.md](../../CHANGELOG.md) v1.4.0 section - 2 min
- [ ] Scan [BACKLOG.md](../planning/BACKLOG.md) priority matrix - 1 min

**You now have 80% of context needed.**

### Phase 2: Task Selection (5 min)
- [ ] Read [BACKLOG.md](../planning/BACKLOG.md) in detail - 3 min
- [ ] Identify current focus area from user
- [ ] Read relevant detailed plan ([API_COVERAGE.md](../planning/API_COVERAGE.md) or [UX_IMPLEMENTATION_PLAN.md](../planning/UX_IMPLEMENTATION_PLAN.md) or [PROFILE_SYSTEM_PLAN.md](../planning/cakemail-profile-system-plan.md)) - 2 min

**You now know what to work on.**

### Phase 3: Implementation (varies)
- [ ] Review existing similar commands in src/commands/
- [ ] Check [ARCHITECTURE.md](./ARCHITECTURE.md) for patterns
- [ ] Implement following existing conventions
- [ ] Update [BACKLOG.md](../planning/BACKLOG.md) status (NOT STARTED → IN PROGRESS)

### Phase 4: Completion
- [ ] Update [BACKLOG.md](../planning/BACKLOG.md) (IN PROGRESS → ✅ COMPLETED)
- [ ] Add to [CHANGELOG.md](../../CHANGELOG.md) under [Unreleased]
- [ ] Verify with npm run build

---

## 📊 Current Project State (as of 2025-10-11)

**Version:** 1.4.0
**Commands:** 108 / 232 (46% API coverage)

**Recently Completed:**
- ✅ Enhanced output formatting (JSON highlighting, status badges, pagination)
- ✅ Smart defaults (auto-detect resources)
- ✅ Interactive confirmations (delete operations)
- ✅ Multi-tenant account support
- ✅ Progress indicators

**Current Focus:**
- Deciding between: API coverage expansion vs Profile system vs UX quick wins

**See [BACKLOG.md](../planning/BACKLOG.md) for complete status and next steps.**

---

## 🚀 Quick Start for Contributors

### 1. Setup
```bash
git clone <repo>
cd cakemail-cli
npm install
npm run build
```

### 2. Understand codebase
```bash
# Read these 4 files:
cat README.md
cat docs/developer/ARCHITECTURE.md
cat CHANGELOG.md | head -100
cat docs/planning/BACKLOG.md | head -100
```

### 3. Pick a task
```bash
grep "NOT STARTED" docs/planning/BACKLOG.md
# Pick one, read relevant plan document
```

### 4. Implement
```bash
# Follow patterns in src/commands/
# Update docs/planning/BACKLOG.md status
# Add to CHANGELOG.md
```

### 5. Test & Submit
```bash
npm run build
# Manual testing
# Git commit & push
```

---

## 🔧 Maintenance Tasks

### Weekly
- [ ] Review [BACKLOG.md](../planning/BACKLOG.md) priorities
- [ ] Update task statuses
- [ ] Move completed items to [CHANGELOG.md](../../CHANGELOG.md)

### Before Each Release
- [ ] Verify [CHANGELOG.md](../../CHANGELOG.md) is complete
- [ ] Archive completed BACKLOG items
- [ ] Update version numbers
- [ ] Update [PROJECT_INDEX.md](./PROJECT_INDEX.md) current state

### Quarterly
- [ ] Review all documentation for accuracy
- [ ] Archive outdated planning docs
- [ ] Update priority matrix in [BACKLOG.md](../planning/BACKLOG.md)
- [ ] Clean up duplicate/obsolete docs

---

## 📞 Questions?

- **For users:** See [README.md](../../README.md)
- **For contributors:** See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **For architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **For roadmap:** See [BACKLOG.md](../planning/BACKLOG.md)
- **For anything else:** Check this index first

---

**Last Updated:** 2025-10-11
**Maintained By:** François Lane
**Next Review:** When v1.4.0 decisions are finalized

