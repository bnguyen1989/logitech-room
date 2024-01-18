FROM node:21-alpine

WORKDIR /usr/src/app

COPY . ./

RUN npm ci

RUN npm run build --scope=assets-configurator-service --include-filtered-dependencies

ENV PORT=8080
EXPOSE 8080
CMD ["node", "./services/assets-configurator-service/dist/server.js"]