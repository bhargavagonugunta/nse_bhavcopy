# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npx tsc

# Stage 2: Production Runtime
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist
# Copy source files if needed by some dynamic path, but usually compiled is enough.
# However, .env example or other assets?
# Copying .env handling (note: .env is usually ignored, provided at runtime)

# Create downloads directory
RUN mkdir -p downloads

# Run the scraper using compiled JS
CMD ["node", "dist/index.js"]

