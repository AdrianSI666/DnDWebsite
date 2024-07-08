FROM node:20
WORKDIR /usr/app
COPY src /usr/app/src
COPY public /usr/app/public
COPY tsconfig.json /usr/app/tsconfig.json
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
COPY build /usr/app/build
RUN npm ci --ignore-scripts
ENV PORT=8093
EXPOSE 8093
CMD ["npm", "start"]