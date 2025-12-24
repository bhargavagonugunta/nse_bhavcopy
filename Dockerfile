# Use official Playwright image (includes dependencies)
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

# Set working directory
WORKDIR /app

# Install Google Chrome (required for 'channel: chrome')
RUN npx playwright install chrome

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including typescript and ts-node)
RUN npm install

# Copy source code
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Run the scraper
CMD ["npx", "ts-node", "src/index.ts"]
