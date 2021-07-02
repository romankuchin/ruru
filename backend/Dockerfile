FROM python:3.9-alpine

WORKDIR /usr/src/app

COPY requirements.txt .

RUN apk update && apk add build-base libzmq musl-dev zeromq-dev
RUN pip install -r requirements.txt

RUN ["wget", "http://repo2.eu-central-1.pipedrive.com/binaries/ruru/IP2LOCATION-LITE-DB5.IPV6.BIN"]

COPY script.py .

EXPOSE 5000/udp

CMD [ "python", "script.py" ]
