FROM node:10.13.0 AS build

COPY ./ /mongochemclient
RUN npm --version
RUN cd /mongochemclient && \
  npm install && \
  npm run build

FROM nginx
COPY --from=build /mongochemclient/build /usr/share/nginx/html
