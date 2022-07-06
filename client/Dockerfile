FROM node:16

WORKDIR /chaty/client

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]