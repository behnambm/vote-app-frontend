FROM node:alpine

WORKDIR /app

RUN npm install -g npm@latest

RUN npm install pm2@latest -g

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD pm2-runtime start npm --name 'next-app' -- start 
