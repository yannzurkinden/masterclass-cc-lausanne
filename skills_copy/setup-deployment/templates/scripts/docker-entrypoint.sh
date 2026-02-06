#!/bin/bash
# ============================================
# Docker Entrypoint - Frontend Runtime Config
# ============================================
# This script allows runtime configuration of
# the frontend by replacing environment variable
# placeholders in the built files.
#
# Usage in Dockerfile:
#   COPY docker-entrypoint.sh /docker-entrypoint.sh
#   RUN chmod +x /docker-entrypoint.sh
#   ENTRYPOINT ["/docker-entrypoint.sh"]
#   CMD ["nginx", "-g", "daemon off;"]
# ============================================

set -e

# ==========================================
# Runtime Environment Variables
# ==========================================
# Add variables that need to be configurable at runtime
# These will replace BUILD_TIME_* placeholders in the JS

# Example: Replace placeholder with actual API URL
if [ -n "$RUNTIME_API_URL" ]; then
    echo "Configuring API URL: $RUNTIME_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec \
        sed -i "s|BUILD_TIME_API_URL|$RUNTIME_API_URL|g" {} \;
fi

# Example: Replace placeholder with feature flags
if [ -n "$RUNTIME_FEATURES" ]; then
    echo "Configuring features: $RUNTIME_FEATURES"
    find /usr/share/nginx/html -type f -name "*.js" -exec \
        sed -i "s|BUILD_TIME_FEATURES|$RUNTIME_FEATURES|g" {} \;
fi

# ==========================================
# Generate runtime config file
# ==========================================
# Alternative approach: generate a config.js file at runtime

cat > /usr/share/nginx/html/runtime-config.js << EOF
// Runtime configuration - generated at container start
window.__RUNTIME_CONFIG__ = {
    API_URL: "${RUNTIME_API_URL:-}",
    FEATURES: "${RUNTIME_FEATURES:-}",
    VERSION: "${VERSION:-unknown}",
    BUILD_TIME: "${BUILD_TIME:-unknown}"
};
EOF

echo "Runtime configuration generated"

# ==========================================
# Start nginx
# ==========================================
exec "$@"
