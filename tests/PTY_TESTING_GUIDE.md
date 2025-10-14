# PTY Testing Guide: Simulating Real Users

## What is PTY Testing?

**PTY (Pseudo-Terminal)** creates a **real terminal session** for your CLI, exactly like when a user runs your command.

### What You Get:
- ✅ **Real terminal** - Just like `ssh` or Terminal.app
- ✅ **Colors** - ANSI escape codes work
- ✅ **Spinners** - Ora spinners animate
- ✅ **Interactive prompts** - Can respond to inquirer/prompts
- ✅ **Ctrl+C handling** - Test signal handling
- ✅ **Terminal size** - Responsive layouts

### What Makes It Special:
Unlike `execa` (subprocess), PTY gives your CLI a **real TTY (teletypewriter)**, which means:
- `process.stdout.isTTY === true`
- Colors don't get stripped
- Progress bars and spinners work
- You can test exactly what users see

---

## Installation

```bash
npm install --save-dev node-pty express @types/express
```

**Note**: `node-pty` requires build tools and has specific Node version requirements:
- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: `python3`, `make`, `g++`
- **Windows**: Visual Studio Build Tools
- **Node Version**: Currently supports Node 18.x and 20.x (Node 22+ may have compatibility issues)

**⚠️ If node-pty fails to build**: Use Node 18 LTS or Node 20 LTS. Node 24+ is too new and may not be supported yet.

```bash
# Switch to Node 20 (recommended)
nvm install 20
nvm use 20
npm install
```

---

## Quick Start

### 1. Files Already Created

✅ `tests/helpers/mock-server.ts` - Mock API server
✅ `tests/helpers/pty-runner.ts` - PTY helper functions
✅ `tests/pty/campaigns.test.ts` - Example PTY test
✅ `tests/pty-test-example.ts` - Interactive examples

### 2. Run the Example

```bash
# Build CLI first
npm run build

# Run PTY test
npx vitest tests/pty/campaigns.test.ts
```

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│ Test Process (Vitest)                   │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ Mock HTTP Server                   │ │
│  │ http://localhost:RANDOM_PORT       │ │
│  │                                    │ │
│  │ POST /token → Auth                 │ │
│  │ GET  /campaigns → Mock data        │ │
│  │ ...                                │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ PTY (Real Terminal)                │ │
│  │                                    │ │
│  │   $ node dist/cli.js campaigns list│ │
│  │   ↓                                │ │
│  │   - Fetching campaigns... ⠋       │ │
│  │   ↓                                │ │
│  │   ┌────┬─────────┬────────┐       │ │
│  │   │ ID │ Name    │ Status │       │ │
│  │   ├────┼─────────┼────────┤       │ │
│  │   │ 1  │ Test    │ draft  │       │ │
│  │   └────┴─────────┴────────┘       │ │
│  │                                    │ │
│  │   (Makes HTTP requests to mock)   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Key Differences from Current Tests

| Feature | Current (execa) | PTY Testing |
|---------|----------------|-------------|
| Terminal | ❌ No TTY | ✅ Real TTY |
| HTTP Mocks | ❌ Nock (doesn't work) | ✅ Real HTTP Server |
| Colors | ❌ Stripped | ✅ ANSI codes visible |
| Spinners | ❌ Don't work | ✅ Fully animated |
| Interactive | ❌ No | ✅ Yes |
| User Experience | ⚠️ Partial | ✅ Exact |

---

## Usage Examples

### Basic Test

```typescript
import { runPTYSuccess } from '../helpers/pty-runner';

it('should list campaigns', async () => {
  const { output, exitCode } = await runPTYSuccess(
    ['campaigns', 'list'],
    { mockServerPort }
  );

  expect(exitCode).toBe(0);
  expect(output).toContain('Test Campaign');
});
```

### Test JSON Output

```typescript
it('should output JSON', async () => {
  const { cleanOutput } = await runPTYSuccess(
    ['-f', 'json', 'campaigns', 'list'],
    { mockServerPort }
  );

  const data = JSON.parse(cleanOutput);
  expect(data.data).toHaveLength(2);
});
```

### Test Colors

```typescript
it('should show colored output', async () => {
  const { output } = await runPTYSuccess(
    ['campaigns', 'list'],
    { mockServerPort, enableColors: true }
  );

  // Check for ANSI escape codes
  expect(output).toMatch(/\u001b\[3\d+m/); // Color codes
});
```

### Test Spinners

```typescript
it('should show spinner while loading', async () => {
  const { output } = await runPTYSuccess(
    ['campaigns', 'list'],
    { mockServerPort }
  );

  // Check for loading message
  expect(output).toContain('Fetching campaigns');
});
```

### Test Interactive Prompts

```typescript
import { createInteraction } from '../helpers/pty-runner';

it('should handle interactive input', async () => {
  const interaction = createInteraction([
    { prompt: 'List name:', response: 'My List\r' },
    { prompt: 'Language:', response: 'en\r' }
  ]);

  const { output } = await runPTYSuccess(
    ['lists', 'create'],
    {
      mockServerPort,
      interactive: true,
      onData: interaction.handler
    }
  );

  expect(output).toContain('My List');
  expect(output).toContain('created');
});
```

### Test Error Handling

```typescript
import { runPTYFailure } from '../helpers/pty-runner';

it('should handle not found errors', async () => {
  const { output, exitCode } = await runPTYFailure(
    ['campaigns', 'get', '999'],
    { mockServerPort }
  );

  expect(exitCode).toBe(1);
  expect(output).toMatch(/not found/i);
});
```

---

## Converting Existing Tests

### Before (with execa and nock)

```typescript
import { runCLISuccess } from '../helpers/cli-runner';
import { mockCampaignsList } from '../helpers/mock-api';
import nock from 'nock';

it('should list campaigns', async () => {
  mockCampaignsList([/* data */]);

  const result = await runCLISuccess(['campaigns', 'list']);
  // ❌ This fails - nock doesn't work with subprocess
});
```

### After (with PTY and mock server)

```typescript
import { runPTYSuccess } from '../helpers/pty-runner';

it('should list campaigns', async () => {
  // Mock server already running in beforeAll
  const result = await runPTYSuccess(
    ['campaigns', 'list'],
    { mockServerPort }
  );
  // ✅ Works! Real HTTP to mock server
});
```

### Migration Checklist

For each test file:
1. ✅ Remove nock imports
2. ✅ Remove mock setup (e.g., `mockCampaignsList()`)
3. ✅ Import PTY helpers instead
4. ✅ Use `mockServerPort` from `beforeAll`
5. ✅ Update assertions to use `cleanOutput`

---

## Mock Server Customization

### Adding New Endpoints

Edit `tests/helpers/mock-server.ts`:

```typescript
export function createMockAPI(): Express {
  const app = express();

  // Your new endpoint
  app.get('/my-endpoint', (req, res) => {
    res.json({ data: 'your mock data' });
  });

  return app;
}
```

### Testing Error Scenarios

```typescript
// In mock-server.ts
app.get('/campaigns/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Special IDs trigger errors
  if (id === 999) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (id === 888) {
    return res.status(500).json({ error: 'Server error' });
  }

  res.json({ id, name: `Campaign ${id}` });
});

// In test
it('should handle 404', async () => {
  const { exitCode } = await runPTYFailure(
    ['campaigns', 'get', '999'], // Magic ID triggers 404
    { mockServerPort }
  );

  expect(exitCode).toBe(1);
});
```

### Dynamic Responses

```typescript
// Track state in mock server
let campaignsData = [
  { id: 1, name: 'Campaign 1' }
];

app.post('/campaigns', (req, res) => {
  const newCampaign = {
    id: campaignsData.length + 1,
    ...req.body
  };
  campaignsData.push(newCampaign);
  res.status(201).json(newCampaign);
});

app.get('/campaigns', (req, res) => {
  res.json({ data: campaignsData });
});
```

---

## Tips & Best Practices

### 1. Use `cleanOutput` for Assertions

```typescript
// ❌ BAD: Raw output has ANSI codes
expect(result.output).toContain('Campaign');

// ✅ GOOD: Clean output strips ANSI
expect(result.cleanOutput).toContain('Campaign');
```

### 2. Test Colors Separately

```typescript
// Test functionality
expect(result.cleanOutput).toContain('success');

// Test presentation
it('should show green for success', async () => {
  const { output } = await runPTYSuccess(
    ['campaigns', 'create', ...],
    { enableColors: true }
  );
  expect(output).toMatch(/\u001b\[32m/); // Green
});
```

### 3. Set Reasonable Timeouts

```typescript
const { output } = await runPTYSuccess(
  ['campaigns', 'list'],
  {
    mockServerPort,
    timeout: 5000 // 5 seconds (default is 10s)
  }
);
```

### 4. Debug with onData

```typescript
const { output } = await runPTYSuccess(
  ['campaigns', 'list'],
  {
    mockServerPort,
    onData: (data) => console.log('[PTY]', data) // Debug output
  }
);
```

### 5. Clean Up PTY Processes

```typescript
afterEach(() => {
  // PTY helper already kills process
  // But if you create custom PTY:
  if (customPty) {
    customPty.kill();
  }
});
```

---

## Common Issues

### Issue: "Cannot find module 'node-pty'"

**Solution**: Install native dependencies
```bash
# macOS
xcode-select --install
npm install node-pty

# Ubuntu/Debian
sudo apt-get install python3 make g++
npm install node-pty

# Windows
npm install --global windows-build-tools
npm install node-pty
```

### Issue: Tests timeout

**Solution**: Increase timeout or check mock server
```typescript
const result = await runPTYSuccess(args, {
  mockServerPort,
  timeout: 30000 // 30 seconds
});
```

### Issue: Can't parse JSON output

**Solution**: Use `-f json` flag
```typescript
const result = await runPTYSuccess(
  ['-f', 'json', 'campaigns', 'list'], // Force JSON
  { mockServerPort }
);
```

### Issue: Colors don't show

**Solution**: Enable colors explicitly
```typescript
const result = await runPTYSuccess(args, {
  mockServerPort,
  enableColors: true // Enable ANSI colors
});
```

---

## Performance

### Speed Comparison

| Test Type | Speed | Tests/Second |
|-----------|-------|--------------|
| Direct Import + nock | 🚀 Very Fast | 50-100 |
| PTY + Mock Server | ⚡ Fast | 10-20 |
| Integration (Real API) | 🐌 Slow | 1-5 |

### Optimization Tips

1. **Reuse mock server** - Start once in `beforeAll`, not per test
2. **Parallel tests** - Vitest runs tests in parallel by default
3. **Disable colors** - Faster rendering without ANSI codes
4. **Short timeouts** - Fail fast on broken tests

---

## Next Steps

### Phase 1: Get One Test Working (30 min)
```bash
npm install node-pty @types/node-pty express @types/express
npm run build
npx vitest tests/pty/campaigns.test.ts -t "should list campaigns"
```

### Phase 2: Convert High-Priority Tests (2-3 hours)
- Convert campaigns tests (25 tests)
- Convert lists tests (30 tests)
- Convert contacts tests (48 tests)

### Phase 3: Convert Remaining Tests (3-4 hours)
- Convert senders tests (20 tests)
- Convert templates tests (24 tests)

### Total Effort: 6-8 hours
✅ **Result**: 147 tests simulating real user experience!

---

## Summary

**PTY Testing gives you**:
- ✅ Real terminal simulation
- ✅ HTTP mocks that work (real server)
- ✅ Test colors, spinners, interactivity
- ✅ Exact user experience verification

**Perfect for**:
- E2E testing CLI behavior
- Verifying user-facing features
- Testing error messages and formatting
- Ensuring professional UX

**Start with**: `tests/pty/campaigns.test.ts` example! 🚀
