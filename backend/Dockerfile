FROM python:3.9-alpine

WORKDIR /usr/src/app

COPY requirements.txt .

RUN apk update && apk add build-base libzmq musl-dev zeromq-dev
RUN pip install -r requirements.txt

COPY script.py .

EXPOSE 5000
COPY IP2LOCATION-LITE-DB5.IPV6.BIN .

CMD [ "python", "script.py" ]
