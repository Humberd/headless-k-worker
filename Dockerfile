FROM node:10.15-alpine

ARG BUILD_ID
ENV BUILD_ID ${BUILD_ID}

RUN apk --update add \
		tzdata \
	&& cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
	&& apk del tzdata

WORKDIR /usr/app/src

COPY ./package.json ./package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN npm ci

COPY . .

ENTRYPOINT ["npm", "start"]
