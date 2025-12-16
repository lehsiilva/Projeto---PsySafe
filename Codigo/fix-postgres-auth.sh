#!/bin/bash

echo "🔧 PostgreSQL Authentication Fix Script"
echo "========================================"
echo ""

# Backup current pg_hba.conf
echo "📋 Backing up pg_hba.conf..."
sudo cp /etc/postgresql/16/main/pg_hba.conf /etc/postgresql/16/main/pg_hba.conf.backup
echo "✅ Backup created at: /etc/postgresql/16/main/pg_hba.conf.backup"
echo ""

# Add local peer authentication for postgres user
echo "🔧 Updating pg_hba.conf to allow local connections..."
sudo bash -c 'cat > /etc/postgresql/16/main/pg_hba.conf << EOF
# PostgreSQL Client Authentication Configuration File
# ===================================================

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             postgres                                peer
local   all             all                                     peer

# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256

# Allow replication connections from localhost
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256
EOF'

echo "✅ pg_hba.conf updated"
echo ""

# Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql
sleep 2

if pg_isready > /dev/null 2>&1; then
    echo "✅ PostgreSQL restarted successfully"
else
    echo "❌ PostgreSQL failed to restart"
    exit 1
fi
echo ""

# Set postgres password
echo "🔑 Setting postgres user password to 'postgres'..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

if [ $? -eq 0 ]; then
    echo "✅ Password set successfully"
else
    echo "❌ Failed to set password"
    exit 1
fi
echo ""

# Test connection
echo "🧪 Testing connection..."
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -c "SELECT 'Connection successful!' as status;"

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ PostgreSQL is now configured!"
    echo "=========================================="
    echo ""
    echo "Credentials:"
    echo "  Username: postgres"
    echo "  Password: postgres"
    echo ""
    echo "You can now:"
    echo "  1. Create the database: createdb -h localhost -U postgres psysafe"
    echo "  2. Run the seed script: cd backend && ./seed-database.sh"
    echo "  3. Start the backend: cd backend && mvn spring-boot:run"
    echo ""
else
    echo "❌ Connection test failed"
    exit 1
fi
