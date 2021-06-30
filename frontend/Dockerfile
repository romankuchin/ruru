FROM node:carbon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y libtool pkg-config build-essential autoconf automake
RUN apt-get install -y libzmq3-dev

COPY package.json /usr/src/app/
RUN npm install

RUN npm install -g envify browserify

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000 3001 6080

CMD echo $MAPBOX_TOKEN && npm run build && npm start
