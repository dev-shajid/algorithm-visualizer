# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json (lock file optional)
COPY package.json ./

# Install dependencies (fallback if lock file is missing)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN pnpm build


# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json (lock file optional)
COPY package.json ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

# Set environment to production
ENV NODE_ENV=production

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
