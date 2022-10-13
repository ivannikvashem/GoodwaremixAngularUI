### STAGE 1: Build ###
FROM node:16 AS build

#BASEHREF specified in the config angular.json - change it accordingly API GW settings !!! todo!!!
ENV GOODWARE_UI_BASEHREF="/"

WORKDIR /app
COPY . .
RUN apt-get update && apt-get -y install mc
RUN npm install --force
RUN npm run ng -- build --configuration production --base-href $GOODWARE_UI_BASEHREF

### STAGE 2: Run ###
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/good-ware-angular-ui  /usr/share/nginx/html
EXPOSE 80
