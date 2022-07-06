FROM node:16

WORKDIR /chaty/server

COPY package*.json ./
COPY tsconfig.json ./
COPY . .

RUN npm install
RUN npm run build

EXPOSE 9000

CMD ["npm", "start"]