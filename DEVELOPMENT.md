# 🛠 Developer Guide

This document is intended for maintainers of the `@stefanasemota/stripe-core-service`. It covers the architecture, testing standards, and the release process.

## 🏗 Architecture (Onion Pattern)

The library follows the **Onion Architecture** to decouple core business logic from the infrastructure (Stripe SDK).

- **`src/core/`**: Contains pure TypeScript interfaces and models. No external dependencies (specifically no `stripe` SDK imports).
- **`src/infrastructure/`**: Contains adapters that implement core interfaces using the `stripe` SDK.
- **`StripeService.ts`**: The public Facade that aggregates and delegates to the internal adapters.

### The Golden Rules
1.  **75-Line Rule**: No file should exceed 75 lines of logic. If a file grows too large, split it into smaller, focused components.
2.  **Infrastructure Isolation**: The `Core` layer must never import from `stripe`. If you need a Stripe type in the Core, define a domain model or interface instead.

## 🧪 Testing (Vitest)

We enforce high quality through strict testing requirements.

- **Standard**: >80% Branch & Statement coverage required for all new code.
- **Current State**: 100% Coverage across all layers.

### Quick Commands
| Command | Description |
| :--- | :--- |
| `npm test` | Runs the test suite once (Fast mode). |
| `npm run test:coverage` | Runs tests and generates an LCOV report in `coverage/`. |

### Maintaining Quality
- Always mock the `stripe` SDK in Infrastructure tests.
- Mock the adapters in Facade tests to ensure isolation.
- Use `vi.fn()` for dependency injection verification.

## 🚢 Publishing & Shipping

We use a formalized `ship` command to ensure quality before code hits the repository.

### The `npm run ship` Workflow
When running `npm run ship`, the following happens automatically:
1.  **Verification**: Runs `npm test` to ensure no regressions.
2.  **Build**: Runs `npm run build` to verify TypeScript compilation and generate the `dist/` folder.
3.  **Push**: Pushes the current branch and all tags to `origin main`.

> [!IMPORTANT]
> Ensure your Git stage is clean before shipping. The command will fail if tests or build steps do not pass.

## 📄 Licensing & Philosophy
Build for the culture. Sabi for the world. Keep the core pure. 🚀
