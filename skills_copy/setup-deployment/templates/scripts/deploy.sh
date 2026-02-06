#!/bin/bash
# ============================================
# Deploy Script - VPS Deployment
# ============================================
# This script is executed on the VPS to deploy
# the application. It handles:
# - Database backup
# - Image pulling
# - Container updates
# - Health checks
# - Cleanup
#
# Usage: ./deploy.sh [dev|prod]
# ============================================

set -e

# ==========================================
# Configuration
# ==========================================
ENV="${1:-dev}"
PROJECT_NAME="{{PROJECT_NAME}}"
DEPLOY_PATH="{{DEPLOY_PATH}}"
COMPOSE_FILE="docker-compose.${ENV}.yml"
BACKUP_DIR="${DEPLOY_PATH}/backups"
BACKUP_RETENTION_DAYS=7
HEALTH_CHECK_RETRIES=30
HEALTH_CHECK_INTERVAL=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==========================================
# Functions
# ==========================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Backup database
backup_database() {
    log_info "Creating database backup..."

    mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="${BACKUP_DIR}/backup-${ENV}-$(date +%Y%m%d-%H%M%S).sql"

    if docker compose -f "$COMPOSE_FILE" ps db --status running -q 2>/dev/null; then
        docker compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
        gzip "$BACKUP_FILE"
        log_info "Backup created: ${BACKUP_FILE}.gz"

        # Cleanup old backups
        find "$BACKUP_DIR" -name "backup-${ENV}-*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS} -delete
        log_info "Old backups cleaned up (older than ${BACKUP_RETENTION_DAYS} days)"
    else
        log_warn "Database not running, skipping backup"
    fi
}

# Pull new images
pull_images() {
    log_info "Pulling new images..."
    docker compose -f "$COMPOSE_FILE" pull
}

# Deploy containers
deploy_containers() {
    log_info "Deploying containers..."
    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    docker compose -f "$COMPOSE_FILE" exec -T backend alembic upgrade head
}

# Health check
health_check() {
    log_info "Running health checks..."

    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        if curl -sf "http://localhost:{{BACKEND_PORT}}/health" > /dev/null 2>&1; then
            log_info "Health check passed!"
            return 0
        fi

        log_warn "Health check attempt $i/${HEALTH_CHECK_RETRIES} failed, waiting..."
        sleep $HEALTH_CHECK_INTERVAL
    done

    log_error "Health check failed after ${HEALTH_CHECK_RETRIES} attempts"
    return 1
}

# Cleanup old images
cleanup_images() {
    log_info "Cleaning up old images..."
    docker image prune -af --filter "until=168h"
}

# ==========================================
# Main
# ==========================================

cd "$DEPLOY_PATH"

log_info "Starting deployment for environment: ${ENV}"
log_info "Project: ${PROJECT_NAME}"
log_info "Path: ${DEPLOY_PATH}"

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "Compose file not found: ${COMPOSE_FILE}"
    exit 1
fi

# Execute deployment steps
backup_database
pull_images
deploy_containers
run_migrations

if health_check; then
    cleanup_images
    log_info "Deployment successful!"
else
    log_error "Deployment failed - health check did not pass"
    log_warn "You may want to rollback to a previous image"
    exit 1
fi
