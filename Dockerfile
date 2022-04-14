FROM python:3.9.12-alpine3.14
ENV PYTHONUNBUFFERED=1
RUN apk update && apk add postgresql-dev jpeg-dev zlib-dev
RUN apk add --update --no-cache --virtual .tmp gcc libc-dev linux-headers
COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN apk del .tmp

RUN mkdir /webserver
COPY . /webserver
WORKDIR /webserver
COPY ./scripts /scripts

RUN chmod +x /scripts/*

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN mkdir -p /vol/web/react


RUN adduser -D user
RUN chown -R user:user /vol/web/static
RUN chown -R user:user /vol/web/media
RUN chown -R user:user /vol/web/react
RUN chmod -R 755 /vol/web

USER user









