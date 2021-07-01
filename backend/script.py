import IP2Location
import socket
import zmq

BUFF_SIZE = 1024

IP2LocObj = IP2Location.IP2Location("IP2LOCATION-LITE-DB5.IPV6.BIN")

context = zmq.Context()
zmq_sock = context.socket(zmq.PUB)
zmq_sock.connect("tcp://172.17.0.1:6080")

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("0.0.0.0", 5000))


def receive(socket):
    global BUFF_SIZE
    data = b""
    while True:
        received, src = socket.recvfrom(BUFF_SIZE)
        data += received
        if len(received) < BUFF_SIZE:
            break
    return data, src


def valid_ip(ip):
    try:
        socket.inet_aton(ip)
        return True
    except socket.error:
        return False


def process_ip(ip):
    data = ip.strip().replace('"', "")

    if not valid_ip(data):
        return

    if src[0].startswith("10.242"):
        dc = "fra"
    else:
        dc = "ord"
    rec = IP2LocObj.get_all(data)
    json_body = {
        "source_country": rec.country_long,
        "source_countrycode": rec.country_short,
        "source_city": rec.city,
        "source_lat": rec.latitude,
        "source_long": rec.longitude,
        "source_asn": 55,
        "source_as": "55",
        "source_proxy_type": "-",
        "destination_country": dc_data[dc]["country"],
        "destination_countrycode": dc_data[dc]["country_code"],
        "destination_city": dc_data[dc]["city"],
        "destination_lat": dc_data[dc]["lat"],
        "destination_long": dc_data[dc]["long"],
        "destination_asn": 666,
        "destination_as": "666",
        "destination_proxy_type": "-",
        "latency_internal": 10,
        "latency_external": 10,
        "latency_total": 20,
    }
    zmq_sock.send_json(json_body)


dc_data = {
    "ord": {
        "lat": 41.748923,
        "long": -88.0745617,
        "city": "Chicago",
        "country": "United States of America",
        "country_code": "US",
    },
    "fra": {
        "lat": 50.1494327,
        "long": 8.7883346,
        "city": "Frankfurt",
        "country": "Germany",
        "country_code": "DE",
    },
}


while True:
    data, src = receive(sock)
    data = data.decode("utf-8").split()
    for ip in data:
        process_ip(ip)
