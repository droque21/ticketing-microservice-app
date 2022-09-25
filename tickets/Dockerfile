FROM node:18.9-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]