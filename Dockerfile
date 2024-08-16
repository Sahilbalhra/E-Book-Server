# Build stage
FROM node:18-alpine AS builder

# Install required Alpine packages
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Set environment to production
ENV NODE_ENV=production

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Set correct permissions
RUN chown -R node:node /app && chmod -R 755 /app

# Switch to non-root user
USER node

# Expose the application port
EXPOSE 5513

# Start the application
CMD ["node", "dist/index.js"]  # Adjust the path to your actual entry point
