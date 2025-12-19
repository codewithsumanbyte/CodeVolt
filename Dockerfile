# Use the official Bun image
FROM oven/bun:latest AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run Prisma generate to ensure client is ready (if needed during build)
RUN bun run db:generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user? 
# For simplicity with SQLite volumes, running as root in container is often easier to debug 
# but less secure. We'll stick to default for now, or ensure permissions.
# Creating directories for persistence
RUN mkdir -p /app/uploads && mkdir -p /app/prisma

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy prisma directory for SQLite database
COPY --from=builder /app/prisma ./prisma

# Expose the port
EXPOSE 3000

# IMPORTANT: For platforms like Railway/Fly, you need to mount a volume to /app/uploads and /app/prisma 
# to persist data.

CMD ["bun", "server.js"]
