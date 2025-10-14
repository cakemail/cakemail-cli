# Cakemail CLI Documentation Standard

ABOUTME: Documentation standard defining structure, style, and conventions for the Cakemail CLI user manual.
ABOUTME: Based on exhaustive analysis of GitHub CLI manual as reference model.

## Table of Contents

1. [Information Architecture](#information-architecture)
2. [Command Reference Structure](#command-reference-structure)
3. [Writing Style & Tone](#writing-style--tone)
4. [Formatting Conventions](#formatting-conventions)
5. [Section Standards](#section-standards)
6. [Examples & Code Blocks](#examples--code-blocks)
7. [What NOT to Do](#what-not-to-do)

---

## Information Architecture

### Manual Organization (Top Level)

The manual follows a progressive disclosure pattern from beginner to advanced:

1. **Getting Started** - Installation, authentication, first steps
2. **Core Concepts** - Fundamental understanding required for effective use
3. **Feature Sections** (3-8) - Organized by user workflow/domain (Email, Campaigns, Contacts, etc.)
4. **Advanced Usage** - Power user techniques, scripting, automation
5. **Command Reference** - Complete technical reference
6. **Troubleshooting** - Problem resolution
7. **Appendix** - Supporting materials (changelog, glossary, etc.)

### Navigation Hierarchy

```
Manual Root (README.md)
├── Section Folders (numbered 01-11)
│   ├── Section README.md (overview + links)
│   └── Topic Articles (individual .md files)
└── Command Reference
    ├── Command Reference README.md (index)
    └── Command Group Files (e.g., campaigns.md, contacts.md)
```

### Organization Principles

- **Workflow-Centric**: Group by what users want to accomplish, not by API structure
- **Progressive Complexity**: Simple → Intermediate → Advanced → Reference
- **Clear Hierarchy**: Maximum 3 levels deep (Section → Topic → Subsection)
- **Consistent Numbering**: Use 01-11 prefix for sections to enforce ordering
- **Single Responsibility**: Each article covers ONE concept or command group

---

## Command Reference Structure

### Command Group Article Template

Every command group article (e.g., `campaigns.md`, `interests.md`) MUST follow this exact structure:

```markdown
# [Resource] Commands

[One-line description of what this resource does] (version if applicable).

## Overview

[2-3 paragraph explanation of the resource and why it exists]

**Available Commands:**
- [`resource command`](#resource-command) - Brief description
- [`resource command2`](#resource-command2) - Brief description

**Key Features:**
- Feature 1
- Feature 2
- Feature 3

**Use Cases:**
- Use case 1
- Use case 2
- Use case 3

---

## resource command

[One-line description of what this command does]

### Usage

```bash
cakemail resource command [arguments] [options]
```

### Arguments

- `<required-arg>` - Description (required)
- `[optional-arg]` - Description (optional - explain default behavior)

### Options

- `-s, --short <value>` - Description
- `-f, --flag` - Boolean flag description

### Examples

**[Descriptive scenario name]:**
```bash
$ cakemail resource command args
```

**Output:**
```
[Show actual terminal output]
```

**[Another scenario]:**
```bash
$ cakemail resource command --flag
```

### Notes

- Important detail about behavior
- Edge case or limitation
- Related considerations

---

[Repeat for each command]

---

## Common Workflows

### Workflow 1: [Descriptive Name]

```bash
# Step 1 comment
cakemail command1

# Step 2 comment
cakemail command2
```

---

## [Additional Sections as Needed]

### Best Practices
### Troubleshooting
### Integration with Other Commands
### Comparison with Related Features

```

### Required Sections (All Commands)

Every command documentation MUST include:

1. **Title** - Command name as H1
2. **One-line description** - Imperative form, starts with verb
3. **Usage** - Exact syntax with square brackets for optional args
4. **Arguments** - Required vs optional explicitly marked
5. **Options** - All flags with short and long forms
6. **Examples** - Minimum 2, showing different scenarios with actual output

### Optional Sections (Use When Relevant)

- **Notes** - Important behavioral details, edge cases
- **See Also** - Links to related commands
- **Aliases** - If command has aliases
- **Environment Variables** - If command respects env vars
- **Configuration** - If command uses config values

### Mandatory for Complex Commands

If command has ANY of these characteristics, include these sections:

- **Interactive flow** → Document each prompt/choice
- **Multiple modes** → Show each mode separately with examples
- **Security implications** → Add warnings and best practices
- **Destructive operations** → Add clear warnings, show confirmation prompts
- **Profile-specific behavior** → Show output for different profiles

---

## Writing Style & Tone

### Voice Guidelines

**DO:**
- Use imperative mood for instructions: "Create a campaign", "List contacts"
- Use declarative for descriptions: "This command lists all campaigns"
- Use active voice: "The CLI validates input" not "Input is validated by the CLI"
- Address the user as "you" when explaining behavior
- Write in present tense: "The command returns..." not "The command will return..."

**DON'T:**
- Use passive voice unnecessarily
- Use future tense ("will list") when present works ("lists")
- Use overly formal language ("utilize" → "use", "in order to" → "to")
- Use conversational filler ("basically", "just", "simply")

### Sentence Structure

- **Keep it short**: Aim for 15-20 words per sentence
- **One idea per sentence**: Don't chain multiple concepts
- **Front-load important information**: Start with the main point
- **Use parallel structure**: "Create, update, and delete" not "Create, updating, and delete"

### Technical Terminology

- **Be consistent**: Pick one term and stick with it throughout all docs
- **Define on first use**: Explain technical terms when first mentioned in a section
- **Use standard terms**: Prefer industry-standard terminology (e.g., "pagination" not "paging")
- **Format consistently**:
  - Commands: `cakemail command`
  - Options/flags: `--flag` or `-f`
  - Arguments: `<required>` or `[optional]`
  - API endpoints: `/api/v1/resource`
  - Variables: `variable_name`

### Tone Characteristics

From GitHub CLI manual analysis:

- **Professional but Approachable**: Technical but not intimidating
- **Concise**: Every word earns its place
- **Practical**: Focus on what users need to accomplish
- **Clear**: Eliminate ambiguity
- **Instructional**: Direct guidance over explanation

---

## Formatting Conventions

### Headers

```markdown
# H1 - Article Title Only (once per file)
## H2 - Major Sections
### H3 - Subsections
#### H4 - Rarely Used (avoid if possible)
```

**Rules:**
- Only ONE H1 per file (the article title)
- Use H2 for major sections (commands, workflows)
- Use H3 for subsections within commands (Usage, Arguments, Examples)
- Avoid H4+ (restructure if needed)
- Use sentence case: "Command reference" not "Command Reference"

### Lists

**Unordered Lists:**
```markdown
- Item 1
- Item 2
  - Nested item (use 2 spaces)
- Item 3
```

**Ordered Lists:**
```markdown
1. First step
2. Second step
3. Third step
```

**Rules:**
- Use hyphens `-` for unordered lists (not asterisks or plus)
- Use consistent indentation (2 spaces for nesting)
- Keep list items parallel in structure
- Don't mix ordered and unordered at same level

### Code Formatting

**Inline Code:**
- Commands: `cakemail campaigns list`
- Flags: `--format json`
- Values: `table`, `json`, `compact`
- File paths: `/path/to/file`
- Variables: `account_id`

**Code Blocks:**
```markdown
```bash
cakemail command --flag value
```
```

**Rules:**
- Always specify language for syntax highlighting
- Use `bash` for command examples
- Use `json` for JSON output
- Use `text` or no language for plain terminal output
- Show prompts with `$` for user commands

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
```

**When to Use Tables:**
- Comparing multiple items (commands, options, features)
- Quick reference information
- Showing output format

**When NOT to Use Tables:**
- Long descriptions (use lists instead)
- Complex nested data (use examples instead)
- Anything that wraps awkwardly

### Emphasis

- **Bold** for UI elements, important terms, warnings
- *Italics* for emphasis (use sparingly)
- `Code formatting` for technical terms, commands, values

**DON'T:**
- Use ALL CAPS for emphasis (except in warnings: `WARNING:`)
- Mix multiple emphasis styles (`**_bold italic_**` is excessive)
- Overuse bold (loses impact)

---

## Section Standards

### Overview Section (Command Group Articles)

**Purpose**: Orient readers to what the command group does and why it exists.

**Structure:**
1. What the resource is (1-2 sentences)
2. Why it matters / common use cases (1 paragraph)
3. Available Commands list with anchors
4. Key Features (3-5 bullet points)
5. Use Cases (3-5 realistic scenarios)

**Example:**
```markdown
## Overview

Interests are list-specific preferences that contacts can subscribe to. Unlike tags which are global, interests are specific to each list and are commonly used for newsletter preferences, topic subscriptions, and opt-in categories.

**Available Commands:**
- [`interests list`](#interests-list) - List all interests in a list
- [`interests create`](#interests-create) - Create a new interest

**Key Features:**
- List-specific (not global like tags)
- Support auto-detection when only one list exists
- Optional URL-friendly aliases
```

### Usage Section

**Always include:**
- Exact command syntax
- Square brackets `[optional]` for optional arguments
- Angle brackets `<required>` for required arguments
- `[options]` placeholder for flags

**Example:**
```markdown
### Usage

```bash
cakemail interests create [list-id] --name <name> [options]
```
```

### Arguments Section

**Format:**
```markdown
### Arguments

- `<arg-name>` - Description (required)
- `[arg-name]` - Description (optional - default: value)
```

**Rules:**
- List in the order they appear in usage
- Mark required vs optional explicitly
- Explain default behavior for optional args
- Include data type if not obvious (e.g., "List ID (number)")

### Options Section

**Format:**
```markdown
### Options

- `-s, --short <value>` - Description
- `-f, --flag` - Boolean flag description
```

**Rules:**
- List short form first, then long form
- Show `<value>` if option takes an argument
- Omit `<value>` for boolean flags
- Alphabetize for long lists
- Group related options together

### Examples Section

**CRITICAL**: This is the most important section. Users learn by example.

**Structure for Each Example:**

```markdown
**[Descriptive scenario label]:**
```bash
$ cakemail command args
```

**Output:**
```
Actual terminal output here
```
```

**Rules:**
- Always start with a bold descriptive label
- Show the command with `$` prompt
- Show realistic output (not `<output>` placeholder)
- Progress from simple to complex
- Include minimum 2 examples, ideally 3-5
- Show different use cases, not just flag variations

**Example Types to Include:**
1. **Basic usage** - Simplest form
2. **Common scenario** - Real-world use case
3. **With options** - Show useful flags
4. **JSON output** - For Developer profile
5. **Error handling** - What happens when it fails

### Notes Section

**When to include:**
- Important behavioral details not obvious from usage
- Edge cases or limitations
- Performance considerations
- Related concepts users should know

**Format:**
```markdown
### Notes

- First important note
- Second consideration
- Related detail
```

### Workflow Sections

**Purpose**: Show how multiple commands work together.

**Structure:**
```markdown
## Common Workflows

### Workflow 1: [Descriptive Name]

```bash
# Step 1: Brief explanation
cakemail command1

# Step 2: What this does
cakemail command2 | cakemail command3
```
```

**Include:**
- Comments explaining each step
- Realistic multi-step scenarios
- Piping and composition examples
- Error handling considerations

---

## Examples & Code Blocks

### Command Examples

**Show Real Terminal Interaction:**

```markdown
**Create with confirmation:**
```bash
$ cakemail campaigns delete 123
```

**Output:**
```
⚠ Delete campaign 'Summer Sale'?
  This action cannot be undone

Delete campaign? (y/N): y

✓ Campaign deleted successfully
```
```

**Rules:**
- Include `$` prompt for user commands
- Show multi-line output as it appears
- Include prompts and confirmation dialogs
- Show success/error symbols (✓, ✗, ⚠)
- Use realistic IDs and names, not placeholders

### JSON Output Examples

```markdown
**Developer profile:**
```bash
$ cakemail --profile developer interests list
```

**Output:**
```json
{
  "data": [
    {"id": 1, "name": "Product Updates", "alias": "updates"}
  ]
}
```
```

**Rules:**
- Show actual valid JSON (not pseudo-JSON)
- Format with proper indentation (2 spaces)
- Include relevant fields only (don't show everything)
- Use realistic values

### Multi-Step Examples

```markdown
**Complete workflow:**
```bash
# Create the campaign
$ cakemail campaigns create \
  --name "Newsletter" \
  --list-id 123

✓ Campaign created: ID 456

# Schedule it
$ cakemail campaigns schedule 456 \
  --date "2025-10-15 09:00"

✓ Campaign scheduled for Oct 15, 2025 at 9:00 AM
```
```

**Rules:**
- Use line continuation `\` for long commands
- Show output after each command
- Include comments explaining the flow
- Number steps if order matters

---

## What NOT to Do

### ❌ Anti-Patterns in Structure

**DON'T duplicate information across sections:**

```markdown
❌ BAD:
## campaigns list

List all campaigns.

### Description
This command lists all campaigns.

### Usage
Use this command to list campaigns:
```bash
cakemail campaigns list
```

✅ GOOD:
## campaigns list

List all campaigns for the current account.

### Usage
```bash
cakemail campaigns list [options]
```
```

**DON'T create deeply nested sections:**

```markdown
❌ BAD:
# Campaigns
## Campaign Management
### Managing Campaigns
#### List Campaigns
##### campaigns list command

✅ GOOD:
# Campaign Commands
## campaigns list
```

**DON'T split related information awkwardly:**

```markdown
❌ BAD:
## campaigns create

Create a campaign.

[15 pages of other content]

## campaigns create options
[Options documented far from the command]

✅ GOOD:
## campaigns create

Create a campaign.

### Usage
### Arguments
### Options
[Everything together]
```

### ❌ Anti-Patterns in Writing

**DON'T use vague placeholders:**

```markdown
❌ BAD:
```bash
cakemail campaigns create --name <name>
```

Output: <output will be shown here>

✅ GOOD:
```bash
$ cakemail campaigns create --name "Summer Sale"
```

**Output:**
```
✓ Campaign created successfully
  ID: 456
  Name: Summer Sale
```
```

**DON'T explain what users can already see:**

```markdown
❌ BAD:
The above command creates a campaign with the name option set to the value you specified and outputs the result showing the campaign was created.

✅ GOOD:
[Let the example speak for itself, or add meaningful context]
This creates a draft campaign ready for content and scheduling.
```

**DON'T use uncertain language:**

```markdown
❌ BAD:
This might return a list of campaigns, possibly in table format.
You should probably use the --force flag.

✅ GOOD:
Returns all campaigns in table format (default).
Use `--force` to skip the confirmation prompt.
```

**DON'T use conversational filler:**

```markdown
❌ BAD:
So basically, you just simply need to run the command, and it will go ahead and create the campaign for you.

✅ GOOD:
Run the command to create a campaign.
```

### ❌ Anti-Patterns in Examples

**DON'T show incomplete output:**

```markdown
❌ BAD:
```bash
$ cakemail campaigns list
```
[output truncated]
...

✅ GOOD:
```bash
$ cakemail campaigns list
```

**Output:**
```
┌────┬──────────────┬──────────┐
│ ID │ Name         │ Status   │
├────┼──────────────┼──────────┤
│ 1  │ Summer Sale  │ draft    │
│ 2  │ Welcome      │ sent     │
└────┴──────────────┴──────────┘
```
```

**DON'T show only the happy path:**

```markdown
❌ BAD:
Only showing successful examples with no errors or edge cases

✅ GOOD:
Include examples of:
- Success cases
- Common errors
- Edge cases (empty lists, missing args)
```

**DON'T use fake data poorly:**

```markdown
❌ BAD:
```bash
$ cakemail campaigns get 999999
Campaign: asdfasdf
Status: foo
```

✅ GOOD:
```bash
$ cakemail campaigns get 456
Campaign: Summer Sale 2025
Status: draft
```
```

### ❌ Anti-Patterns in Formatting

**DON'T mix code formatting styles:**

```markdown
❌ BAD:
Run `cakemail campaigns list` or **cakemail campaigns list** or cakemail campaigns list

✅ GOOD:
Run `cakemail campaigns list`
```

**DON'T overuse emphasis:**

```markdown
❌ BAD:
**This is _VERY_ `important`!!!** You **MUST** use the **`--force`** **flag**!

✅ GOOD:
Use the `--force` flag to skip confirmation.

**Warning:** This action cannot be undone.
```

**DON'T use inconsistent header capitalization:**

```markdown
❌ BAD:
## Usage Instructions
### how to use this
## IMPORTANT NOTES

✅ GOOD:
## Usage
### Arguments
## Important notes
```

### ❌ Anti-Patterns in Organization

**DON'T organize by technical implementation:**

```markdown
❌ BAD:
- API v1 Commands
- API v2 Commands
- Database Operations
- HTTP Endpoints

✅ GOOD:
- Campaign Management
- Contact Management
- Email Operations
```

**DON'T create orphan pages:**

```markdown
❌ BAD:
File exists but isn't linked from parent README or any other page

✅ GOOD:
Every page is discoverable through the navigation hierarchy
```

**DON'T create redundant READMEs:**

```markdown
❌ BAD:
docs/user-manual/README.md (lists everything)
docs/user-manual/09-command-reference/README.md (lists same commands)
docs/user-manual/09-command-reference/campaigns.md (lists campaign commands again)

✅ GOOD:
docs/user-manual/README.md (high-level TOC)
docs/user-manual/09-command-reference/README.md (command index with brief descriptions)
docs/user-manual/09-command-reference/campaigns.md (full documentation)
```

---

## Quality Checklist

Before publishing any documentation, verify:

### Structure
- [ ] File follows the standard template for its type
- [ ] All required sections are present
- [ ] Sections appear in the standard order
- [ ] Headers use consistent capitalization
- [ ] Navigation links are correct and working

### Content
- [ ] One-line description is clear and starts with a verb
- [ ] Usage syntax is exact and unambiguous
- [ ] All arguments and options are documented
- [ ] At least 2 realistic examples with actual output
- [ ] Examples progress from simple to complex

### Writing
- [ ] Active voice used throughout
- [ ] Imperative mood for instructions
- [ ] Present tense for descriptions
- [ ] No conversational filler
- [ ] Technical terms defined on first use
- [ ] Consistent terminology

### Formatting
- [ ] Commands formatted as `inline code`
- [ ] Code blocks specify language
- [ ] Examples show `$` prompt
- [ ] JSON properly formatted
- [ ] Tables align properly
- [ ] Emphasis used sparingly and consistently

### Examples
- [ ] Show realistic data (not placeholders)
- [ ] Include actual terminal output
- [ ] Show both success and error cases
- [ ] Demonstrate real-world scenarios
- [ ] Include profile-specific variations where relevant

### Cross-References
- [ ] All links use production URL format
- [ ] All links tested and working
- [ ] Link destinations exist
- [ ] No "Next Steps" or "Related" navigation sections (removed for external publication)

---

## Link Format Standard

### Production URL Format

All internal links in the documentation MUST use the production URL format:

```markdown
[Link Text](/en/cli/[category]/[article]/)
```

### URL Construction Rules

1. **Base Path**: All URLs start with `/en/cli/`

2. **Category**: Directory name without number prefix
   - File: `01-getting-started/` → URL: `/en/cli/getting-started/`
   - File: `09-command-reference/` → URL: `/en/cli/command-reference/`

3. **Article**: Filename without number prefix and without `.md` extension
   - File: `02-authentication.md` → URL: `authentication/`
   - File: `15-tags.md` → URL: `tags/`

4. **Trailing Slash**: Always include trailing `/` for URLs without anchors
   - ✅ `/en/cli/getting-started/authentication/`
   - ❌ `/en/cli/getting-started/authentication`

5. **Anchors**: When linking to specific sections, omit trailing slash before anchor
   - ✅ `/en/cli/command-reference/contacts#contacts-list`
   - ❌ `/en/cli/command-reference/contacts/#contacts-list`

### Examples

**File Structure → Production URL:**

```
docs/user-manual/
├── 01-getting-started/
│   ├── 02-authentication.md     → /en/cli/getting-started/authentication/
│   └── 04-configuration.md      → /en/cli/getting-started/configuration/
├── 02-core-concepts/
│   ├── 02-profile-system.md     → /en/cli/core-concepts/profile-system/
│   └── 03-smart-defaults.md     → /en/cli/core-concepts/smart-defaults/
└── 09-command-reference/
    ├── 03-lists.md              → /en/cli/command-reference/lists/
    ├── 04-contacts.md           → /en/cli/command-reference/contacts/
    └── 15-tags.md               → /en/cli/command-reference/tags/
```

**Link Examples:**

```markdown
# Good - Production format
[Authentication](/en/cli/getting-started/authentication/)
[Profile System](/en/cli/core-concepts/profile-system/)
[Lists Commands](/en/cli/command-reference/lists/)
[contacts list](/en/cli/command-reference/contacts#contacts-list)

# Bad - Relative paths (do not use)
[Authentication](../01-getting-started/02-authentication.md)
[Profile System](./02-profile-system.md)
```

### Special Cases

**README Files**: README.md files map to the category root

```
docs/user-manual/
├── README.md                    → /en/cli/
└── 01-getting-started/
    └── README.md                → /en/cli/getting-started/
```

**Command Reference Links**: Command group articles are always under `/command-reference/`

```markdown
# All command groups
[Config Commands](/en/cli/command-reference/config/)
[Contacts Commands](/en/cli/command-reference/contacts/)
[Tags Commands](/en/cli/command-reference/tags/)
```

### Validation

All internal links should be validated to ensure:
1. **Destination file exists**: The target file is present in the documentation
2. **URL format is correct**: Follows the production URL pattern
3. **No relative paths**: All links use absolute `/en/cli/` format

**Note**: Anchor validation is not required during pre-publication as markdown platforms auto-generate anchors from headers. As long as the destination file exists and contains the referenced header, the anchor will work.

---

## Maintenance Guidelines

### Pre-Release Documentation Standards

For documentation intended for external publication (before official release):

**DO NOT INCLUDE:**
- ❌ Version numbers (v1.4.0, v1.5.0, etc.) - Remove all version annotations
- ❌ "Next Steps" sections - Navigation sections are removed for external platforms
- ❌ "Related Topics" sections - Cross-linking handled by documentation platform
- ❌ "Related Sections" sections - Platform provides navigation
- ❌ Changelog files - Not relevant pre-release
- ❌ Migration guides - No previous versions to migrate from
- ❌ Section README.md files - Only keep main README.md

**RATIONALE:**
- Documentation will be published on a platform that provides its own navigation
- Version references are not meaningful pre-release
- Cleaner, more focused content without redundant navigation

### Version Changes (Post-Release)

When adding new features after release:
1. Add version indicator: `(v1.6.0+)` in first mention
2. Update command reference README
3. Update parent section README if adding new capabilities
4. Add to changelog

### Deprecations

When deprecating features:
1. Mark as deprecated with version: `(deprecated in v1.7.0)`
2. Explain what to use instead
3. Keep documentation for 2 major versions
4. Add to migration guide

### Updates

When updating existing docs:
1. Verify all examples still work
2. Update version numbers if behavior changed (post-release only)
3. Check all links still valid
4. Update "Last updated" if file has one

---

## Reference Models

### GitHub CLI Manual Strengths (Apply These)

✅ **Clear hierarchy**: Commands → Subcommands → Examples
✅ **Consistent structure**: Every command page follows same pattern
✅ **Minimal verbosity**: Direct and to the point
✅ **Practical examples**: Show real usage, not abstract syntax
✅ **Progressive disclosure**: Simple → Advanced
✅ **Scannable format**: Easy to find specific information

### GitHub CLI Manual Differences (Cakemail Adaptations)

**GitHub CLI**: Minimal workflow documentation
**Cakemail CLI**: Extensive workflow sections showing multi-command scenarios

**GitHub CLI**: No profile system
**Cakemail CLI**: Show profile-specific behavior prominently

**GitHub CLI**: Simple confirmation patterns
**Cakemail CLI**: Detailed confirmation and interactive flow documentation

**GitHub CLI**: Limited troubleshooting
**Cakemail CLI**: Comprehensive troubleshooting sections

---

## Conclusion

This standard ensures:
- **Consistency**: All documentation follows same patterns
- **Usability**: Users can quickly find what they need
- **Clarity**: Information is unambiguous and actionable
- **Completeness**: All necessary information is present
- **Maintainability**: Easy to update and extend

When in doubt, ask:
1. "Is this how GitHub CLI would document it?"
2. "Can a user accomplish their task with just this information?"
3. "Is every word necessary?"
4. "Would I understand this if I were new to the CLI?"

If the answer to any is "no", revise.
