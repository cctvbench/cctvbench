#!/usr/bin/env bash
# Usage: ./deploy.sh staging|production
# Targets come from .env (see .env.example); nothing deployment-specific is committed.
set -euo pipefail

[ -f .env ] || { echo "Missing .env (copy .env.example and fill it in)"; exit 1; }
set -a; source .env; set +a

: "${CCTVBENCH_AWS_PROFILE:?set in .env}"
: "${CCTVBENCH_AWS_REGION:?set in .env}"

deploy() {
  local build_dir="$1" bucket="$2" distribution_id="$3"

  # Content-hashed assets first (immutable), so freshly synced HTML never references missing files
  aws --profile "$CCTVBENCH_AWS_PROFILE" s3 sync "$build_dir/_astro" "s3://$bucket/_astro" --delete --region "$CCTVBENCH_AWS_REGION" \
    --cache-control "public,max-age=31536000,immutable"
  # HTML + unhashed public assets; --exclude also spares that prefix from --delete
  aws --profile "$CCTVBENCH_AWS_PROFILE" s3 sync "$build_dir" "s3://$bucket/" --delete --region "$CCTVBENCH_AWS_REGION" \
    --exclude "_astro/*" \
    --cache-control "public,max-age=0,s-maxage=86400,must-revalidate"
  aws --profile "$CCTVBENCH_AWS_PROFILE" cloudfront create-invalidation --distribution-id "$distribution_id" --paths "/*" >/dev/null
}

case "${1:-}" in
  staging)
    : "${CCTVBENCH_STAGING_BUCKET:?set in .env}" "${CCTVBENCH_STAGING_DISTRIBUTION_ID:?set in .env}"
    pnpm test
    pnpm build:staging
    deploy dist-staging "$CCTVBENCH_STAGING_BUCKET" "$CCTVBENCH_STAGING_DISTRIBUTION_ID"
    echo "✓ Deployed staging -> s3://$CCTVBENCH_STAGING_BUCKET"
    ;;
  production)
    : "${CCTVBENCH_PROD_BUCKET:?set in .env}" "${CCTVBENCH_PROD_DISTRIBUTION_ID:?set in .env}"
    pnpm test
    pnpm build
    deploy dist "$CCTVBENCH_PROD_BUCKET" "$CCTVBENCH_PROD_DISTRIBUTION_ID"
    echo "✓ Deployed production -> s3://$CCTVBENCH_PROD_BUCKET"
    ;;
  *)
    echo "Usage: $0 staging|production"
    exit 1
    ;;
esac
