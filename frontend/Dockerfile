FROM node:fermium

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get upgrade -y
RUN apt-get -y autoremove
RUN apt-get install -y libtool pkg-config build-essential autoconf automake

COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g envify browserify

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000 6080
CMD ["/bin/sh"]
# CMD npm run build && npm start
