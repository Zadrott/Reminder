FROM node:current-alpine3.19 AS build
WORKDIR /server
COPY . .
RUN npm install
RUN npm run build

FROM node:current-alpine3.19 AS final
WORKDIR /server
COPY --from=build ./server/dist .
COPY package.json .
COPY package-lock.json .
RUN npm install --production
CMD [ "node", "server.js" ]
EXPOSE 80
