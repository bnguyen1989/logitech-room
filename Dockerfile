#   React build stage
FROM node:16 as react-build
# ARG THREEKIT_PREVIEW_PUBLIC_TOKEN
# ENV THREEKIT_PREVIEW_PUBLIC_TOKEN ${THREEKIT_PREVIEW_PUBLIC_TOKEN}
WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build && cd server && npm install && npm run build

CMD [ "npm", "run", "start-server" ]
