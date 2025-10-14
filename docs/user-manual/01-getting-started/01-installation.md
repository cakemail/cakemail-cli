# Installation

This guide covers the different ways to install the Cakemail CLI on your system.

## Prerequisites

Before installing the Cakemail CLI, ensure you have:

- **Node.js 18.0.0 or higher** installed on your system
- **npm** (comes with Node.js) or **Homebrew** (for macOS/Linux users)

### Check Node.js Version

```bash
node --version
```

If Node.js is not installed or the version is below 18.0.0, download it from [nodejs.org](https://nodejs.org/).

## Installation Methods

Choose the installation method that best suits your needs:

### Method 1: Homebrew (Recommended for macOS/Linux)

Homebrew provides the easiest installation and update experience on macOS and Linux.

#### Step 1: Tap the Cakemail Repository

```bash
brew tap cakemail-org/cakemail
```

#### Step 2: Install the CLI

```bash
brew install cakemail-cli
```

#### Step 3: Verify Installation

```bash
cakemail --version
```

You should see the version number (e.g., `1.4.0`).

#### Updating via Homebrew

To update to the latest version:

```bash
brew update
brew upgrade cakemail-cli
```

#### Uninstalling via Homebrew

To remove the CLI:

```bash
brew uninstall cakemail-cli
```

---

### Method 2: npm (Global Installation)

Install the CLI globally using npm to make it available system-wide.

#### Install Command

```bash
npm install -g @cakemail-org/cakemail-cli
```

#### Verify Installation

```bash
cakemail --version
```

#### Updating via npm

To update to the latest version:

```bash
npm update -g @cakemail-org/cakemail-cli
```

#### Uninstalling via npm

To remove the CLI:

```bash
npm uninstall -g @cakemail-org/cakemail-cli
```

---

### Method 3: npx (No Installation Required)

Use `npx` to run the CLI without installing it. This is useful for:

- **One-time use** or infrequent usage
- **Testing** before committing to an installation
- **CI/CD pipelines** where you want the latest version

#### Run Commands with npx

```bash
npx @cakemail-org/cakemail-cli --version
npx @cakemail-org/cakemail-cli campaigns list
```

**Note**: Commands will take slightly longer to execute since npx downloads the package each time (or uses a cache).

---

## Choosing the Right Method

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **Homebrew** | macOS/Linux daily users | Easy updates, system integration | macOS/Linux only |
| **npm global** | Cross-platform daily users | Works on all platforms | Requires npm knowledge |
| **npx** | Occasional use, CI/CD | No installation needed | Slower execution |

## Post-Installation

After installing, you need to configure authentication. Continue to [Authentication](/en/cli/getting-started/authentication/) to set up your credentials.

## Troubleshooting Installation Issues

### Homebrew: Formula Not Found

If you get "formula not found" error:

```bash
# Make sure you tapped the repository
brew tap cakemail-org/cakemail

# Update Homebrew
brew update

# Try installing again
brew install cakemail-cli
```

### npm: Permission Denied

If you get permission errors on macOS/Linux:

```bash
# Option 1: Use a Node version manager (recommended)
# Install nvm: https://github.com/nvm-sh/nvm

# Option 2: Change npm's default directory
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

# Option 3: Use sudo (not recommended)
sudo npm install -g @cakemail-org/cakemail-cli
```

### Node.js Version Too Old

If you see "requires node >=18.0.0" error:

1. Check your version: `node --version`
2. Update Node.js from [nodejs.org](https://nodejs.org/)
3. Or use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
# Install Node 18 or higher
nvm install 18
nvm use 18
```

### Command Not Found After Installation

If `cakemail` command is not found:

**For npm installation:**
```bash
# Check if npm global bin is in your PATH
npm config get prefix

# Add to PATH in ~/.zshrc or ~/.bashrc
export PATH="$PATH:$(npm config get prefix)/bin"
```

**For Homebrew:**
```bash
# Homebrew should automatically link the command
# If not, try:
brew link cakemail-cli
```

## Verifying Your Installation

Run these commands to ensure everything is working:

```bash
# Check version
cakemail --version

# View help
cakemail --help

# List available commands
cakemail help
```

If all commands work, your installation is complete!

