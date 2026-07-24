# Billing & Pricing

## How charging works

Ominode is prepaid and usage-based:

1. You top up your balance in advance (credit card / payment methods shown at **Console → Top Up**).
2. Each API request is metered by token usage (prompt tokens + completion tokens).
3. The charge is debited from your balance when the request completes.

Internally, balances are tracked in **quota units**, where **$1.00 = 500,000 quota**. The console displays everything in USD, so you normally never need to think about quota units.

## Price formula

The price of a request is:

```
charge = tokens_used × model_price × group_multiplier
```

- **Model price**: the per-token price of the model, published on the pricing page.
- **Group multiplier**: a per-account coefficient shown on the pricing page as your group's ratio.

## Groups

Every account belongs to a **group** (e.g. `default`). Your group determines:

- which models you can access, and
- the multiplier applied to the base model price.

You can see your current group on the pricing page or your profile. Higher-volume accounts may be eligible for a group with a lower multiplier — contact support if you expect sustained high usage.

## Usage records

Every request produces a log entry under **Console → Logs** with:

- model, prompt/completion tokens, and the exact charge
- request time and latency

The **Dashboard** shows aggregated spend over time.

## Rate limits and balance safety

- If your balance is insufficient for a request, the API returns an error and nothing is charged — see [Error Codes](/error-codes).
- Streaming and long-running requests may reserve (pre-charge) an estimated amount and settle the difference when the request finishes; any over-charge is automatically refunded to your balance.
- Charges are never negative: if usage accounting reports less than the reservation, the difference is returned.

## Refunds

Unused balance is generally non-refundable except where required by law. If you believe you were charged incorrectly, open a ticket with the request ID from your logs.
