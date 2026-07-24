# Quickstart

Ominode exposes an **OpenAI-compatible API**. Any client, SDK, or tool that supports the OpenAI API works by changing two things: the base URL and the API key.

| Setting | Value |
| --- | --- |
| Base URL | `https://ominode.com/v1` |
| API key | Your token from **Console → Tokens** (starts with `sk-`) |
| Auth header | `Authorization: Bearer sk-...` |

## curl

```bash
curl https://ominode.com/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain rate limits in one sentence."}
    ],
    "stream": false
  }'
```

## Python (openai SDK)

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://ominode.com/v1",
    api_key="sk-YOUR_KEY",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(resp.choices[0].message.content)
```

### Streaming

```python
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a haiku about APIs."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

## Node.js (openai SDK)

```bash
npm install openai
```

```js
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://ominode.com/v1',
  apiKey: 'sk-YOUR_KEY',
})

const resp = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
})
console.log(resp.choices[0].message.content)
```

## Using other providers

The same endpoint routes to every provider. To use a different vendor's model, just change the `model` name — no new SDK or credentials needed:

```python
resp = client.chat.completions.create(
    model="claude-sonnet-4-5",  # or "gemini-2.5-pro", etc.
    messages=[{"role": "user", "content": "Hello!"}],
)
```

Run `GET /v1/models` with your key to see everything available to your account — see [Models](/models).

## Anthropic-native endpoint

Tools built for the Anthropic Messages API (such as Claude Code) can point at Ominode directly:

| Setting | Value |
| --- | --- |
| Base URL | `https://ominode.com` (no `/v1` suffix) |
| Auth | `Authorization: Bearer sk-...` or `x-api-key: sk-...` |

Requests to `/v1/messages` are relayed in the native Claude format.

## Framework integrations

Any framework that accepts a custom OpenAI base URL works out of the box:

- **LangChain**: `ChatOpenAI(base_url="https://ominode.com/v1", api_key="sk-...")`
- **LlamaIndex**: set `OpenAI(api_base=...)` / environment variables
- **Generic tools**: set `OPENAI_BASE_URL=https://ominode.com/v1` and `OPENAI_API_KEY=sk-...`
