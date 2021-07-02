Simple python script that enriches IP info and forwards it to fronend via zmq.

Takes IPs on UDP input in this format.

```
dst_ip
src_ip
src_ip
src_ip
...
```

Might be more than one src_ip.

## Build

    sudo docker build -t ruru-backend .
