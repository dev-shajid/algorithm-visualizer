# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy the entire project for build
COPY . .

# Build the Next.js app
RUN pnpm build


# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only required files for runtime
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy Next.js build output from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

# Optional: set NODE_ENV for better performance
ENV NODE_ENV=production

# Next.js serves on port 3000 by default
EXPOSE 3000

# Run Next.js in production mode
CMD ["pnpm", "start"]
