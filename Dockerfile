FROM php

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY . /usr/src/app/
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y locales locales-all
ENV LANGUAGE ru_RU.UTF-8
ENV LANG ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8

EXPOSE 8182
ENV TZ Europe/Moscow

ENTRYPOINT php -S localhost:8182