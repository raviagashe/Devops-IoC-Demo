FROM node:16.4-alpine3.14

WORKDIR /usr/apps

COPY package*.json .
COPY server.js .
COPY src .

RUN npm install

COPY node_modules .


EXPOSE 8080

CMD ["npm", "run", "start"]
