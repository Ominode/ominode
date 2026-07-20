#!/usr/bin/env bash
# PostgreSQL backup for the ominode Docker Compose deployment.
#
# Dumps the database from the running postgres container, compresses it and
# prunes backups older than RETENTION_DAYS.
#
# Usage:
#   ./bin/backup-db.sh [backup_dir]
#
# Environment overrides:
#   RETENTION_DAYS   days to keep backups        (default: 14)
#   PG_CONTAINER     postgres container name     (default: postgres)
#   PG_USER          database user               (default: root)
#   PG_DB            database name               (default: ominode)
#
# Cron example (daily at 03:17, keeps 14 days):
#   17 3 * * * /path/to/deploy/bin/backup-db.sh /path/to/deploy/backups >> /var/log/ominode-backup.log 2>&1
#
# Restore:
#   gunzip -c backups/ominode-YYYYMMDD-HHMMSS.sql.gz | docker exec -i postgres psql -U root -d ominode
set -euo pipefail

BACKUP_DIR="${1:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
PG_CONTAINER="${PG_CONTAINER:-postgres}"
PG_USER="${PG_USER:-root}"
PG_DB="${PG_DB:-ominode}"

mkdir -p "$BACKUP_DIR"
TS="$(date +%Y%m%d-%H%M%S)"
FILE="$BACKUP_DIR/ominode-$TS.sql.gz"

echo "[$(date '+%F %T')] dumping $PG_DB from container $PG_CONTAINER ..."
docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" | gzip > "$FILE"

# Remove backups older than the retention window
find "$BACKUP_DIR" -name 'ominode-*.sql.gz' -type f -mtime +"$RETENTION_DAYS" -delete

echo "[$(date '+%F %T')] backup written: $FILE ($(du -h "$FILE" | cut -f1))"
