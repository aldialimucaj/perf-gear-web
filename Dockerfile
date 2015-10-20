FROM node:latest
ADD . /perf-gear
WORKDIR /perf-gear
RUN npm install
CMD npm start
