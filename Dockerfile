FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package*.json pnpm-lock.yaml* ./

# Copy source code
COPY . .

# Build the application
RUN pnpm install
RUN pnpm build

EXPOSE 3000

# Use production start instead of dev
CMD ["pnpm", "start"]