#!/bin/bash

# Setup script for expired downloads cleanup cron job

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up expired downloads cleanup cron job...${NC}"

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Generate a random cron secret if not already set
if [ -z "$CRON_SECRET" ]; then
    CRON_SECRET=$(openssl rand -hex 32)
    echo -e "${YELLOW}Generated CRON_SECRET: $CRON_SECRET${NC}"
    echo -e "${YELLOW}Add this to your .env file: CRON_SECRET=$CRON_SECRET${NC}"
fi

# Create the cron job entry
CRON_JOB="0 * * * * curl -H \"Authorization: Bearer \$CRON_SECRET\" http://localhost:3000/api/cleanup/expired-downloads"

# Check if crontab is available
if ! command -v crontab &> /dev/null; then
    echo -e "${RED}Error: crontab is not available. Please install cron first.${NC}"
    exit 1
fi

# Backup existing crontab
crontab -l > /tmp/crontab_backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo ""

# Add the new cron job if it doesn't exist
if crontab -l 2>/dev/null | grep -q "expired-downloads"; then
    echo -e "${YELLOW}Cron job for expired downloads already exists.${NC}"
else
    # Add the new cron job
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo -e "${GREEN}Cron job added successfully!${NC}"
fi

# Display current crontab
echo -e "${YELLOW}Current crontab:${NC}"
crontab -l

echo -e "${GREEN}Setup completed!${NC}"
echo -e "${YELLOW}The cleanup job will run every hour to remove expired downloads.${NC}"
echo -e "${YELLOW}Make sure your Next.js server is running for the job to work.${NC}"