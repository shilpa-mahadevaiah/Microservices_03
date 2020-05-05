# Use the official image as a parent image
FROM node:current-slim
USER root


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN chmod a+x /usr/src/app/wait-for-it.sh

RUN npm install

#EXPOSE 9222

CMD ["npm", "start"]
