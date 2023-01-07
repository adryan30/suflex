FROM node:hydrogen-alpine AS builder

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install
COPY . ./
RUN yarn build

FROM node:hydrogen-alpine

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/prisma /app/prisma


EXPOSE 3000
CMD [ "yarn" ,"start:prod" ]
