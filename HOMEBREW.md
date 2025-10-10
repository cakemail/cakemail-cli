# Homebrew Distribution Guide

This guide explains how to distribute the Cakemail CLI via Homebrew.

## Option 1: Homebrew Tap (Recommended for Organization Control)

A Homebrew tap allows you to maintain your own formula repository.

### Step 1: Create Tap Repository

1. Create a new GitHub repository named `homebrew-cakemail`:
   ```bash
   # Repository name MUST be: homebrew-cakemail
   # Full path will be: github.com/cakemail/homebrew-cakemail
   ```

2. Initialize the tap:
   ```bash
   mkdir homebrew-cakemail
   cd homebrew-cakemail
   git init
   ```

3. Add the formula:
   ```bash
   mkdir Formula
   cp ../cakemail-cli/cakemail.rb Formula/cakemail.rb
   ```

4. Create README:
   ```bash
   cat > README.md << 'EOF'
   # Cakemail Homebrew Tap

   Official Homebrew tap for Cakemail tools.

   ## Installation

   ```bash
   brew tap cakemail/cakemail
   brew install cakemail
   ```

   ## Available Formulas

   - `cakemail` - Official Cakemail CLI

   ## Documentation

   See https://github.com/cakemail/cakemail-cli for usage documentation.
   EOF
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "Add cakemail formula v1.1.1"
   git remote add origin git@github.com:cakemail/homebrew-cakemail.git
   git push -u origin main
   ```

### Step 2: Users Install via Tap

Users can then install with:
```bash
brew tap cakemail/cakemail
brew install cakemail
```

Or in one command:
```bash
brew install cakemail/cakemail/cakemail
```

### Step 3: Updating the Formula

When you release a new version:

1. Update the tarball URL and SHA256:
   ```bash
   # Get new tarball URL
   npm view @cakemail-org/cli@NEW_VERSION dist.tarball

   # Calculate SHA256
   curl -sL TARBALL_URL | shasum -a 256
   ```

2. Update `Formula/cakemail.rb`:
   ```ruby
   url "https://registry.npmjs.org/@cakemail-org/cli/-/cli-NEW_VERSION.tgz"
   sha256 "NEW_SHA256_HASH"
   ```

3. Update version in test:
   ```ruby
   assert_match "NEW_VERSION", shell_output("#{bin}/cakemail --version")
   ```

4. Commit and push:
   ```bash
   git add Formula/cakemail.rb
   git commit -m "Update cakemail to NEW_VERSION"
   git push
   ```

5. Users update with:
   ```bash
   brew update
   brew upgrade cakemail
   ```

## Option 2: Submit to homebrew-core (Official Homebrew)

To get your formula into the official Homebrew repository:

### Requirements

- Formula must be stable and well-maintained
- Package must be notable (significant user base)
- Must meet Homebrew's [Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae) criteria
- Should have 75+ GitHub stars (or 30+ forks)
- Should be established (not brand new)

### Submission Process

1. Test formula locally:
   ```bash
   brew install --build-from-source ./cakemail.rb
   brew test cakemail
   brew audit --strict cakemail
   ```

2. Fork homebrew-core:
   ```
   https://github.com/Homebrew/homebrew-core
   ```

3. Add formula and create PR:
   ```bash
   git clone https://github.com/YOUR_USERNAME/homebrew-core
   cd homebrew-core
   git checkout -b cakemail
   cp ../cakemail.rb Formula/cakemail.rb
   git add Formula/cakemail.rb
   git commit -m "cakemail 1.1.1 (new formula)"
   git push origin cakemail
   ```

4. Open PR to homebrew-core with:
   - Description of what the tool does
   - Why it should be in homebrew-core
   - Link to project homepage

**Note**: It may take time to get accepted. The tap approach (Option 1) gives you immediate distribution.

## Testing the Formula Locally

Before publishing, test the formula:

```bash
# Install from local formula
brew install --build-from-source ./cakemail.rb

# Test it works
cakemail --version
cakemail campaigns list

# Run formula tests
brew test cakemail

# Audit formula
brew audit --strict cakemail

# Uninstall when done testing
brew uninstall cakemail
```

## Current Formula

The formula in `cakemail.rb` is ready to use. It:

- ✅ Downloads from npm registry
- ✅ Uses SHA256 verification
- ✅ Declares Node.js dependency
- ✅ Installs binary correctly
- ✅ Includes version test

## Recommended Approach

**For immediate distribution**: Use Option 1 (Homebrew Tap)

1. Create `homebrew-cakemail` repository
2. Push the formula
3. Update README with installation instructions
4. Users can install immediately

**For wider reach**: Apply to homebrew-core later

Once the CLI is more established with community adoption, you can submit to homebrew-core for official inclusion.

## Automation

You can automate formula updates with GitHub Actions:

```yaml
# .github/workflows/update-homebrew.yml
name: Update Homebrew Formula

on:
  release:
    types: [published]

jobs:
  update-formula:
    runs-on: ubuntu-latest
    steps:
      - name: Update Homebrew tap
        run: |
          # Script to update formula with new version/SHA256
          # and push to homebrew-cakemail repo
```

## References

- [Homebrew Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Homebrew Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae)
- [How to Create Homebrew Tap](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap)
