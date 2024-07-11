FROM node:20-alpine

WORKDIR /srv/torcher

COPY .env .
COPY Makefile .
COPY package.json .
COPY ./build build
COPY ./shared shared
COPY ./server server

RUN yarn

ENV PORT 3030

CMD ["node", "server/index.js"]
