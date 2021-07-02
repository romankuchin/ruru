

This map is based on Mapbox and Web.GL. Most parts are written in React and compiled into Javascript. Files are served by Node.js.


## Requirements

In order to run the map, you will have to aquire an API key from Mapbox. It is free: http://mapbox.com. You will have to provide this key to the container that runs the UI. 

## Build (takes around 15 minutes)

    sudo docker build -t ruru-frontend .

## Run

Don't forget to set your token.

    sudo docker run -d -p 3000:3000 -p 127.0.0.1:6080:6080 -e MAPBOX_TOKEN='token_here' ruru-frontend
