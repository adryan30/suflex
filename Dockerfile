FROM node:hydrogen-alpine

WORKDIR /app
ENV PORT=3000
ENV NODE_ENV=development
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install
COPY . ./
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start:dev" ] 
