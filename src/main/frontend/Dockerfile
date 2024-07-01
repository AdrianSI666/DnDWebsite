FROM node:18.17.0-alpine3.18
COPY package.json .
RUN npm ci
COPY . .
EXPOSE 8093
CMD ["npm", "start"]