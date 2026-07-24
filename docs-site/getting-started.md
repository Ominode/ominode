# Getting Started

This guide takes you from zero to your first API call in about five minutes.

## 1. Create an account

Register at [ominode.com](https://ominode.com). If email verification is enabled, confirm your email address before continuing.

## 2. Top up your balance

Ominode is prepaid. Go to **Console → Top Up** and add credit to your account. Your balance is shown in USD and is debited per request based on token usage — see [Billing & Pricing](/billing).

::: tip Redemption codes
If you received a redemption code, redeem it under **Console → Top Up → Redeem**. The credit is added to your balance instantly.
:::

## 3. Create an API key

1. Open **Console → Tokens**.
2. Click **Add Token**, give it a name (e.g. `dev-laptop`), and optionally set an expiry and a model whitelist.
3. Copy the key. It starts with `sk-` and is shown **only once** — store it somewhere safe.

Treat API keys like passwords. Anyone with your key can spend your balance.

## 4. Make your first request

```bash
curl https://ominode.com/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

A successful response looks like a standard OpenAI chat completion. You're ready to integrate — continue to the [Quickstart](/quickstart) for SDK examples.

## What's next

- [Quickstart](/quickstart) — curl, Python, and Node.js examples
- [Models](/models) — how to list available models and check prices
- [Billing & Pricing](/billing) — how charges are calculated
- [Error Codes](/error-codes) — what to do when a request fails
