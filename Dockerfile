FROM node:10.15-alpine

ARG BUILD_ID
ENV BUILD_ID ${BUILD_ID}

WORKDIR /usr/app/src

COPY ./package.json ./package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN npm ci

COPY . .

ENTRYPOINT ["npm", "start"]
