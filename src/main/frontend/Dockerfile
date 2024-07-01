FROM node:18.17.0-alpine3.18
WORKDIR /src
COPY package.json .
RUN npm ci
COPY . .
EXPOSE 8093
CMD ["npm", "start"]