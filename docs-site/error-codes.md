# Error Codes

Ominode returns standard HTTP status codes with a JSON error body:

```json
{
  "error": {
    "message": "insufficient user quota",
    "type": "new_api_error",
    "code": "insufficient_user_quota"
  }
}
```

Every response also carries an `X-Oneapi-Request-Id` header — include this ID when contacting support.

## Common errors

| Status | Code | Meaning | What to do |
| --- | --- | --- | --- |
| 401 | `invalid_api_key` | Token missing, malformed, or disabled | Check the `Authorization` header; verify the token in **Console → Tokens** |
| 403 | `token_group_not_allowed` | Model not available to your token's group | Use a model your group can access, or remove the token's group restriction |
| 402 / 400 | `insufficient_user_quota` | Balance too low for the request | Top up your balance |
| 429 | `rate_limit_exceeded` | Too many requests in a short window | Back off and retry with exponential delay |
| 400 | `model_not_found` / `do_request_failed` | Unknown model name | Check spelling against `GET /v1/models` |
| 400 | `context_length_exceeded` | Input longer than the model's context window | Shorten the input or pick a larger-context model |
| 500 | `sensitive_words_detected` | Prompt matched the platform's content filter | Rephrase the prompt |
| 500/502 | `channel_error`, `do_request_failed` | Upstream provider failed or timed out | Retry; persistent failures with the same request ID should be reported |

## Retry guidance

- **429 and 5xx**: safe to retry with exponential backoff (e.g. 1s → 2s → 4s, up to ~5 attempts).
- **4xx (except 429)**: do not retry blindly — fix the request first.
- Failed requests are not charged. For streaming requests, only the tokens actually generated are billed.

## Streaming stalls

If a stream opens but produces no output for a long period, the connection has a server-side inactivity timeout. Close it and retry. If it happens repeatedly on the same model, try another model or report the request ID.
