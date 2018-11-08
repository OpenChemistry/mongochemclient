FROM node:8.0 AS build

COPY ./ /mongochemclient

RUN cd /mongochemclient && \
  npm install && \
  npm run build

FROM nginx
COPY --from=build /mongochemclient/build /usr/share/nginx/html
