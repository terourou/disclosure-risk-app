FROM ubuntu:22.04

COPY config /config

RUN chmod +x /config/init.sh
RUN /config/init.sh
