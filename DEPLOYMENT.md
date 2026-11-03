# DEPLOYMENT.md — ominode Production Deployment (sg7)

Operational reference for the ominode production deployment. Read this before
touching the server. Project coding conventions are in `AGENTS.md`.

## Server: sg7

- SSH alias: `sg7` (defined in local `~/.ssh/config`)
- Host: `47.84.122.221`, user `root`
- Key: `~/MyCodes/aliyun_private_key/fourmeme.pem` (local machine only)
- Connect: `ssh sg7`

**This is a shared host.** It runs several unrelated projects. Only touch the
resources listed under "ominode Resources" below.

### Other tenants on sg7 (do not disturb)

| Resource | Notes |
|---|---|
| `chain-operate-bot` | Directory `/root/chain-operate-bot` + Docker container `chain-operate-bot` |
| `new-api` | Legacy directory `/root/new-api` (predecessor deployment, not containerized) |
| `ominode-docs` | Docs site container (`ghcr.io/chain-works/ominode-docs`), `127.0.0.1:3001` |
| `mysql` | Docker container `mysql` (MySQL 8.0.36) on `0.0.0.0:3306` — shared/other projects |
| `nginx` | Systemd service, host-level reverse proxy |
| Other dirs | `/root/data`, `/root/scripts`, `/root/ominode-backups`, `/root/miniconda3` |

## ominode Resources

| Item | Value |
|---|---|
| Deploy directory | `/root/ominode/` |
| Compose file | `/root/ominode/docker-compose.yml` (+ `.env` beside it, never print it) |
| Image | `ghcr.io/ominode/ominode:<commit-sha>` |
| App container | `ominode` — app port bound to `127.0.0.1:3000` only |
| DB container | `postgres` (postgres:15), internal only, named volume `pg_data` |
| Cache container | `redis` (redis:latest, `--requirepass`), internal only |
| Docker network | `ominode-network` (private; postgres/redis unreachable from host) |
| Health endpoint | `http://localhost:3000/api/status` → `{"success":true}` |
| Persistent data | `/root/ominode/data` (SQLite/upload data dir), `/root/ominode/logs` |

Required `.env` vars (in `/root/ominode/.env`): `POSTGRES_PASSWORD`,
`REDIS_PASSWORD`, `SESSION_SECRET` (required); `SYSTEM_NAME` (optional).

## Deployment Pipeline (preferred path)

Push to `main` on `github.com:Ominode/ominode` triggers
`.github/workflows/deploy-production.yml`:

1. Builds `linux/amd64` image, tags `ghcr.io/ominode/ominode:latest` and
   `...:<github.sha>`, pushes to GHCR.
2. SSHes to sg7 (secrets `SERVER_HOST`/`SERVER_USERNAME`/`SERVER_SSH_KEY`/
   `SERVER_DEPLOY_DIR`), snapshots the running image, rewrites the compose
   `image:` line to the new SHA tag, `docker compose pull && up -d`.
3. Health-checks `http://localhost:3000/api/status` for up to 60s.
4. On failure: restores `docker-compose.yml.bak`, redeploys the old image
   automatically.

To deploy a change: merge/push to `main` (or run the workflow manually via
`workflow_dispatch`). No server access needed for normal releases.

## Manual Operations (only when explicitly asked)

```bash
ssh sg7
cd /root/ominode
docker compose ps                 # status
docker compose logs -f ominode    # app logs
docker compose pull && docker compose up -d   # update to compose-pinned tag
```

Manual rollback (mirrors what CI does):

```bash
ssh sg7
cd /root/ominode
# pin image back to a known-good SHA tag
sed -i "s|image: .*/ominode:.*|image: ghcr.io/ominode/ominode:<good-sha>|" docker-compose.yml
docker compose pull && docker compose up -d
curl -sf http://localhost:3000/api/status   # verify {"success":true}
```

Server-side backups live in `/root/ominode-backups` — inspect before overwriting;
create a fresh backup before any risky manual operation.

## Safety Rules

- Never `docker rm -f` / restart containers other than `ominode`, `redis`,
  `postgres` — and even those only when the task requires it.
- Never edit host-level nginx config or the `mysql` container; they serve other
  projects.
- Never print or copy `/root/ominode/.env` or any secret values.
- Prefer the GitHub Actions pipeline over manual deploys; manual deploys bypass
  the automated health-check/rollback safety net.
