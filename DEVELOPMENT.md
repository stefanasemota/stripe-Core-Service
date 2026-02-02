# ⚡️ Developer Guide (Post-Holiday Stefan Edition)

Welcome back! Here is how you get productive in 5 minutes.

## 🏗 Architecture (Onion)

We use **Onion Architecture** to separate high-level logic from Stripe details.
- **`src/core/`**: PURE interfaces/models. No imports from `stripe`.
- **`src/infrastructure/`**: The dirty work. Direct calls to `stripe` SDK.
- **`StripeService.ts`**: The Facade. It just delegates calls to Infrastructure.

**The Golden Rules:**
1.  **75-Line Rule**: No file > 75 lines. Split it up.
2.  **No Direct Imports**: `Core` never imports `Stripe`.

## 🧪 Testing (Vitest)

We enforce **>80% Coverage**. If you break it, CI breaks.

### Quick Commands
| Command | Action |
| :--- | :--- |
| `npm test` | Runs all tests (Fast). |
| `npm run test:coverage` | Runs tests + Generates Coverage Report. |

### How to maintain coverage
- If you add a mocked method in an Adapter, **add a test** in `src/__tests__`.
- If you add a branch (if/else), **cover both sides**.

## 🚢 The /ship Command

When you are ready to deploy:

1.  **Commit your changes**.
2.  Run the release script:

```bash
npm run release
```

**What it does:**
1.  Runs `npm test` (Must pass).
2.  Runs `npm run build` (Must verify types).
3.  Bumps version (Patch).
4.  Tags and Pushes to `origin dev`.

**Go forth and code!** 🚀
