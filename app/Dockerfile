FROM node:21 AS build
ARG ENV=production
WORKDIR /tmp/build
COPY . /tmp/build

RUN npm install && \
    export NODE_ENV=$ENV && \
    npm run build:dist

FROM nginxinc/nginx-unprivileged:1.25
COPY --from=build /tmp/build/dist /usr/share/nginx/html
