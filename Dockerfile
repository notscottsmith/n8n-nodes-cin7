# Use Node.js 22 Alpine as base image
FROM node:22-alpine AS builder

# Set working directory for building the custom node
WORKDIR /custom-node

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the custom node
RUN npm run build

# Start with the official n8n image
FROM n8nio/n8n:latest

# Switch to root to install custom node
USER root

# Create directory for custom nodes
RUN mkdir -p /usr/local/lib/node_modules

# Copy the built custom node from builder stage
COPY --from=builder /custom-node /usr/local/lib/node_modules/n8n-nodes-cin7

# Install the custom node globally
WORKDIR /usr/local/lib/node_modules/n8n-nodes-cin7
RUN npm install -g .

# Create a custom entrypoint script to ensure the node is loaded
RUN echo '#!/bin/sh' > /custom-entrypoint.sh && \
    echo 'export N8N_CUSTOM_EXTENSIONS="/usr/local/lib/node_modules/n8n-nodes-cin7"' >> /custom-entrypoint.sh && \
    echo 'exec "$@"' >> /custom-entrypoint.sh && \
    chmod +x /custom-entrypoint.sh

# Switch back to n8n user
USER node

# Set environment variables
ENV N8N_CUSTOM_EXTENSIONS="/usr/local/lib/node_modules/n8n-nodes-cin7"

# Use custom entrypoint
ENTRYPOINT ["/custom-entrypoint.sh"]

# Default command
CMD ["n8n"]