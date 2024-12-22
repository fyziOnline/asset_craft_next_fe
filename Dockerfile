# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

#if .env not found then copy .env.example to .env
RUN test -f .env || cp .env.example .env

RUN yarn build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js next.config.js
RUN yarn next -v

EXPOSE 3002

CMD ["yarn", "start"]