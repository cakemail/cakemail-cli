# Cakemail CLI Test Suite

## Overview

This is a **hybrid test suite** combining fast mocked tests with real API integration tests, providing comprehensive coverage of all 136 commands.

## Test Strategy: Hybrid Approach ⭐

We use **two complementary testing strategies**:

### 1. **Mocked E2E Tests** (Fast - 90% of tests)
- ✅ Execute real CLI binary
- ✅ Mock API responses with nock
- ✅ Test command logic, output formatting, error handling
- ✅ Run in ~seconds (no network calls)
- 🎯 Use for: Unit-style testing of all commands

### 2. **Real API Integration Tests** (Slow - 10% of tests)
- ✅ Make actual HTTP requests to Cakemail API
- ✅ Test real authentication flow
- ✅ Test actual data creation/modification
- ✅ Test full command lifecycle
- 🎯 Use for: Critical paths and end-to-end validation

## Current Status

✅ **Phase 1 Complete: Hybrid Test Infrastructure**
- Test framework setup (Vitest)
- Mocked E2E tests with nock
- Real API integration tests
- Helper utilities (CLI runner, API mocking)
- Environment configuration (.env.test)
- First 26 tests (20 mocked + 6 integration)

### Test Results
- **Mocked E2E Tests**: 20 tests created
- **Integration Tests**: 6 tests created (skipped without credentials)
- **Total Coverage**: Campaigns command group (both mocked and real API)

## Setup

### For Mocked Tests (Fast)
No setup required! Just run:
```bash
npm test
```

### For Integration Tests (Real API)
1. Copy environment template:
   ```bash
   cp .env.test.example .env.test
   ```

2. Edit `.env.test` and add your test credentials:
   ```bash
   CAKEMAIL_TEST_EMAIL=your-test@example.com
   CAKEMAIL_TEST_PASSWORD=your-test-password
   ```

3. Run integration tests:
   ```bash
   npm run test:integration
   ```

⚠️ **Important**: Use a TEST account, not production! Integration tests create/modify/delete data.

## Test Architecture

```
tests/
├── e2e/                    # End-to-end CLI tests (20/136 commands)
│   └── campaigns.test.ts   # ✅ Created (20 tests)
├── integration/            # API integration tests
├── unit/                   # Unit tests for utilities
├── helpers/
│   ├── cli-runner.ts       # ✅ CLI execution helper
│   └── mock-api.ts         # ✅ API mocking utilities
└── fixtures/               # ✅ Test data
```

## Running Tests

### Mocked Tests (Fast)
```bash
# Run all mocked E2E tests
npm run test:e2e

# Run specific test file
npx vitest run tests/e2e/campaigns.test.ts

# Watch mode (during development)
npm run test:watch
```

### Integration Tests (Real API)
```bash
# Run all integration tests
npm run test:integration

# Run specific integration test
npx vitest run tests/integration/campaigns-real-api.test.ts
```

### Combined
```bash
# Run ALL tests (mocked + integration)
npm test

# Run with coverage report
npm run test:coverage

# CI/CD mode (with JUnit reporter)
npm run test:ci
```

## Test Coverage Goals

| Category | Commands | Tests | Status |
|----------|----------|-------|--------|
| Campaigns | 15 | 20 | 🟡 In Progress |
| Lists | 10 | 0 | ⚪ Pending |
| Contacts | 12 | 0 | ⚪ Pending |
| Templates | 8 | 0 | ⚪ Pending |
| Senders | 7 | 0 | ⚪ Pending |
| Webhooks | 5 | 0 | ⚪ Pending |
| Tags | 5 | 0 | ⚪ Pending |
| Interests | 7 | 0 | ⚪ Pending |
| Transactional Templates | 12 | 0 | ⚪ Pending |
| Logs | 3 | 0 | ⚪ Pending |
| Reports | 12 | 0 | ⚪ Pending |
| Segments | 6 | 0 | ⚪ Pending |
| Attributes | 4 | 0 | ⚪ Pending |
| Suppressed | 7 | 0 | ⚪ Pending |
| Account | 5 | 0 | ⚪ Pending |
| Emails | 8 | 0 | ⚪ Pending |
| Config | 6 | 0 | ⚪ Pending |
| **Total** | **136** | **20** | **15%** |

## Next Steps

### Immediate (Fix Failing Tests)
1. ✅ Install test dependencies
2. ✅ Create test infrastructure
3. ✅ Write first 20 E2E tests
4. 🔄 Fix nock/SDK integration issue
5. ⚪ Get all 20 campaigns tests passing

### Phase 2: Core Commands (Weeks 3-6)
- Lists commands (10 tests)
- Contacts commands (12 tests)
- Templates commands (8 tests)
- Senders commands (7 tests)
- Webhooks commands (5 tests)

### Phase 3: New Features (Weeks 7-8)
- Tags commands (5 tests)
- Interests commands (7 tests)
- Transactional templates (12 tests)
- Logs commands (3 tests)

### Phase 4: Advanced (Weeks 9-10)
- Reports & analytics (12 tests)
- Segments (6 tests)
- Attributes (4 tests)
- Profile system (15 tests)
- Interactive features (20 tests)

## Writing Tests

### Example Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { runCLISuccess, parseJSONOutput } from '../helpers/cli-runner';
import { mockCampaignsList } from '../helpers/mock-api';

describe('campaigns list', () => {
  it('should list campaigns in JSON format', async () => {
    mockCampaignsList([
      { id: 1, name: 'Test Campaign', status: 'draft' }
    ]);

    const result = await runCLISuccess(['campaigns', 'list']);

    expect(result.exitCode).toBe(0);
    const output = parseJSONOutput(result.stdout);
    expect(output.data).toHaveLength(1);
  });
});
```

### Testing Patterns

1. **Command Execution**: Test that command runs without error
2. **Output Formats**: Test JSON, table, and compact formats
3. **Options**: Test all flags and parameters
4. **Error Handling**: Test API errors (401, 404, 500, etc.)
5. **Profile Support**: Test with developer/marketer/balanced profiles
6. **Interactive Features**: Test prompts and confirmations

## Troubleshooting

### "Cannot find module" errors
```bash
npm run build
```

### "HTTP request not mocked" errors
Check that mock API is properly set up in test setup.

### Tests timing out
Increase timeout in vitest.config.ts:
```typescript
testTimeout: 60000 // 60 seconds
```

## Contributing

When adding new commands:
1. Create corresponding test file in `tests/e2e/`
2. Add at least 5 tests per command:
   - Basic execution
   - Output formats (3 tests)
   - Error handling
3. Update coverage table in this README
4. Ensure all tests pass before committing

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every commit to main
- Scheduled nightly runs

Coverage reports are published to:
- Pull request comments
- GitHub Actions artifacts
- Coverage dashboard (TBD)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [CLI Testing Guide](https://github.com/testing-library/cli-testing-library)
