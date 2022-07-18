FROM node:16-alpine

WORKDIR /srv/torcher

COPY .env .
COPY Makefile .
COPY package.json .
COPY ./shared shared
COPY ./server server

RUN yarn

ENV PORT 3030

CMD ["node", "server/index.js"]
