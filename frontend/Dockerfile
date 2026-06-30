# Production Dockerfile for Next.js Frontend

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Set public environment variables at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3002/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy build artifacts and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose default Next.js port
EXPOSE 3000

CMD ["npm", "start"]
