# FAQ

## Account

**How do I get an API key?**
Register at [ominode.com](https://ominode.com), then create a token under **Console → Tokens**. See [Getting Started](/getting-started).

**I lost my API key. Can you recover it?**
No. Keys are only shown once at creation. Delete the old token and create a new one.

**Can I set spending limits?**
Yes. Each token can have its own quota limit and expiry — useful for separating projects or giving limited access to a teammate.

## Billing

**Is there a subscription or monthly fee?**
No. Ominode is purely pay-as-you-go. Top up any amount and spend it at your own pace. Balance does not expire.

**Where do I see what I was charged?**
**Console → Logs** lists every request with tokens and cost. **Console → Dashboard** shows daily/aggregate spend.

**Why is the price different from the provider's list price?**
Prices include a group multiplier that covers routing, availability, and payment processing. Your multiplier is shown on the pricing page — see [Billing & Pricing](/billing).

## API

**Is Ominode compatible with the OpenAI SDK?**
Yes — set `base_url` to `https://ominode.com/v1` and use your Ominode key. No other changes needed. See the [Quickstart](/quickstart).

**Can I use it with Claude Code / Cursor / other coding tools?**
Yes. Any tool that lets you set a custom OpenAI (or Anthropic) base URL and API key works. For Anthropic-native tools, use `https://ominode.com` as the base URL with your key.

**Do you store my prompts?**
Requests are relayed to upstream providers to generate a response. Request metadata (model, tokens, cost, time) is logged for billing; see the privacy policy on [ominode.com](https://ominode.com) for details.

## Support

**Something's broken — what information should I send?**
The request ID (from the `X-Oneapi-Request-Id` response header or your logs), the model, the approximate time, and the error message.
