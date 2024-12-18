# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Production
FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

EXPOSE 3002

CMD ["yarn", "start"]