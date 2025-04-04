FROM node:20-alpine AS builder
EXPOSE 3000
WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]