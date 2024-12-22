# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

# Copy next.config.js explicitly into the build stage
COPY next.config.ts . 

RUN ls -l /app
COPY . .

#if .env not found then copy .env.example to .env
RUN test -f .env || cp .env.example .env

RUN yarn build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy next.config.js from the builder stage
COPY --from=builder /app/next.config.ts . 

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
RUN yarn next -v

EXPOSE 3002

CMD ["yarn", "start"]
