# Base image for all stages
FROM node:20-alpine AS base
WORKDIR /app

# 1. Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# 2. Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git
RUN npm run build:nobump

# 3. Runner stage (final image)
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
