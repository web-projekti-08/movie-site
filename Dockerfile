FROM node:18-alpine AS builder
WORKDIR /app

# Build frontend
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

# Install API production deps
COPY api/package*.json ./api/
RUN cd api && npm ci --only=production
COPY api ./api

FROM node:20-alpine
RUN apk add --no-cache nginx
WORKDIR /app

# Frontend static files served by nginx
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# API files
COPY --from=builder /app/api /app/api

# nginx config and entrypoint
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
