#!/bin/sh
set -e

# Default ports
: ${PORT:=3000}
API_PORT=3001

# Make nginx listen on the platform PORT
sed -i "s/listen 3000;/listen ${PORT};/g" /etc/nginx/nginx.conf

# Start API on API_PORT
export PORT=${API_PORT}
cd /app/api
node src/index.js &

# Start nginx (foreground)
nginx -g 'daemon off;'
