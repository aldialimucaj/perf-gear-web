FROM node:latest
ADD . /perf-gear-web
WORKDIR /perf-gear-web
RUN npm install
CMD NODE_ENV=docker npm start
EXPOSE 80