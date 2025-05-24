#!/bin/bash

set -e

# Load env variables from back/.env
set -a
if [ -f back/.env ]; then
  source back/.env
  set +a
else
  echo "ERROR: back/.env file not found!"
  exit 1
fi

# Container name should match docker-compose service name
DB_CONTAINER_NAME="${DB_HOST}"

echo "Checking if database '$LOG_DB_DATABASE' exists in container '$DB_CONTAINER_NAME'..."

# Check if database exists
DB_EXISTS=$(docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
  psql -U "$LOG_DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$LOG_DB_DATABASE';")

if [ "$DB_EXISTS" = "1" ]; then
  echo "Database '$LOG_DB_DATABASE' already exists. Skipping creation."
else
  echo "Creating database '$LOG_DB_DATABASE'..."
  docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
    psql -U "$LOG_DB_USER" -d postgres -c "CREATE DATABASE \"$LOG_DB_DATABASE\";"

  echo "Granting all privileges on '$LOG_DB_DATABASE' to user '$LOG_DB_USER'..."
  docker exec -e PGPASSWORD="$LOG_DB_PASSWORD" -u postgres "$DB_CONTAINER_NAME" \
    psql -U "$LOG_DB_USER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"$LOG_DB_DATABASE\" TO \"$LOG_DB_USER\";"

  echo "Database created and permissions granted."
fi
