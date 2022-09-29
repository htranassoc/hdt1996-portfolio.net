FROM python:3.9.12-alpine3.14
ENV PYTHONUNBUFFERED=1
RUN apk update && apk add postgresql-dev jpeg-dev zlib-dev
RUN apk add bash dos2unix


RUN mkdir /webserver
COPY ./web_services /webserver
WORKDIR /webserver

RUN apk add --update --no-cache --virtual .tmp gcc libc-dev linux-headers g++
RUN pip3 install -r /webserver/requirements.txt
RUN apk del .tmp

RUN chmod +x /webserver/entrypoint.sh
RUN dos2unix /webserver/entrypoint.sh
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN mkdir -p /vol/web/react


RUN adduser -D user
RUN chown -R user:user /vol/web/static
RUN chown -R user:user /vol/web/media
RUN chown -R user:user /vol/web/react
RUN chmod -R 755 /vol/web

USER user









