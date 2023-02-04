FROM node:lts-alpine

RUN mkdir -p /app/alt-src
WORKDIR /app/alt-src

COPY package*.json ./
RUN npm install
COPY . . 

EXPOSE 8081

CMD ["node", "src/index.js"]