FROM node:16.4-alpine3.14

WORKDIR /usr/apps

COPY package-lock.json .
COPY package.json .
COPY server.js .
COPY src .

RUN ls -alR ./*

RUN npm install

COPY . .


EXPOSE 8080

CMD ["npm", "run", "start"]
