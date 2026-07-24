# Models

## Listing available models

The model catalog is available through the standard OpenAI models endpoint:

```bash
curl https://ominode.com/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

The response contains every model your account's group has access to. If a model you expect is missing, it is either not offered on the platform or not enabled for your group — see [Billing & Pricing](/billing#groups).

## Checking prices

Per-model pricing is published inside the console at **ominode.com → Pricing** (visible without logging in). Prices are expressed per 1M tokens, split into input (prompt) and output (completion) where the upstream provider differentiates them.

## Model naming

Model names follow the upstream providers' canonical IDs, for example:

- OpenAI: `gpt-4o`, `gpt-4o-mini`, `o3`, ...
- Anthropic: `claude-sonnet-4-5`, `claude-opus-4-8`, ...
- Google: `gemini-2.5-pro`, `gemini-2.5-flash`, ...

Send the name exactly as listed in `/v1/models` or on the pricing page.

## Capability notes

- **Streaming**: supported for chat models via `"stream": true`. Not every upstream supports usage reporting in streams; where it isn't available, token usage is estimated.
- **Vision / audio / tools**: passed through to providers that support them. Check the provider's own documentation for parameter details — Ominode relays these fields transparently.
- **Context limits**: enforced upstream. Requests exceeding a model's context window return an error from the provider.
