# Advanced Usage

This section covers advanced techniques for power users, including scripting, automation, and CI/CD integration.

## In This Section

### [Scripting & Automation](./scripting-automation.md)
Use the CLI in shell scripts and automated workflows.

### [JSON Piping](./json-piping.md)
Process CLI output with `jq`, `grep`, and other command-line tools.

### [Batch Operations](./batch-operations.md)
Efficiently perform bulk operations on contacts, campaigns, and other resources.

### [CI/CD Integration](./ci-cd-integration.md)
Integrate the CLI into continuous integration and deployment pipelines.

## Overview

The Cakemail CLI is designed to be scriptable and automation-friendly. This section explores advanced techniques for:

- **Automating repetitive tasks**
- **Processing output programmatically**
- **Building complex workflows**
- **Integrating with CI/CD pipelines**

## Advanced Techniques

### Exit Codes
The CLI returns appropriate exit codes for scripting:
- `0` - Success
- `1` - Error

### Output Parsing
JSON output can be parsed with `jq`:
```bash
cakemail -f json campaigns list | jq '.data[0].name'
```

### Error Handling
Handle errors gracefully in scripts:
```bash
if ! cakemail campaigns get 123; then
  echo "Campaign not found"
  exit 1
fi
```

### Environment Variables
Configure the CLI without modifying scripts:
```bash
export CAKEMAIL_OUTPUT_FORMAT=compact
cakemail campaigns list
```

## Use Cases

- **Scheduled campaign sending** via cron
- **Contact import automation** from CRM exports
- **Report generation** on a schedule
- **Template deployment** in CI/CD
- **Multi-account management** in scripts

## Next Steps

Start with [Scripting & Automation](./scripting-automation.md) to learn scripting basics.
