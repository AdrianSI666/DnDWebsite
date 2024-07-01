FROM node:20
WORKDIR /usr/app
COPY . /usr/app
COPY package.json /usr/app/package.json
RUN npm ci
COPY . .
EXPOSE 8093
CMD ["npm", "start"]