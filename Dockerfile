# HumanTic Frontend + Backend Container
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci --only=production

# Copy project files
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "run", "start"]