### STAGE 1: Build ###
FROM node:16 AS build

#ENV DELIVERY_API_URL="http://delivery_srv:3000/api"
#ENV DELIVERY_UI_NAME="DeliveryMix"
#ENV ENV="production"

#BASEHREF specified in the config angular.json - change it accordinately with API GW settings !!! todo!!!
ENV GOODWARE_UI_BASEHREF="/"

WORKDIR /app
COPY . .
RUN apt-get update && apt-get -y install mc
RUN npm install --force
RUN npm run ng -- build --prod --base-href $GOODWARE_UI_BASEHREF

### STAGE 2: Run ###
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/good-ware-angular-ui  /usr/share/nginx/html
EXPOSE 80
