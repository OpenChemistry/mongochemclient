FROM node:12.8.0 AS build

COPY ./ /mongochemclient

RUN cd /mongochemclient && \
  npm install && \
  npm run build

FROM nginx

COPY docker/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /mongochemclient/build /usr/share/nginx/html
