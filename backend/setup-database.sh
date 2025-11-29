#!/bin/bash

# Setup script for Focusly MySQL Database
# This script will help you set up the MySQL database and run migrations

echo "=== Focusly Database Setup ==="
echo ""

# Step 1: Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with the following content:"
    echo ""
    echo "DATABASE_URL=\"mysql://root:YOUR_PASSWORD@localhost:3306/focusly\""
    echo "JWT_SECRET=\"your-secret-key-here\""
    echo "JWT_EXPIRE=\"30d\""
    echo "PORT=5000"
    echo ""
    exit 1
fi

echo "✓ .env file found"
echo ""

# Step 2: Create database
echo "Creating 'focusly' database..."
echo "Please enter your MySQL root password when prompted:"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS focusly;"

if [ $? -eq 0 ]; then
    echo "✓ Database 'focusly' created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

echo ""

# Step 3: Run Prisma migration
echo "Running Prisma migration..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✓ Migration completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

echo ""

# Step 4: Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✓ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "You can now:"
echo "1. Start your backend server: npm start"
echo "2. View your database: npx prisma studio"
echo ""
