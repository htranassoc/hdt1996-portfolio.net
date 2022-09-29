FROM nginxinc/nginx-unprivileged:1-alpine

USER root

RUN apk update \
    && apk add openssl socat
    
RUN mkdir -p /vol/static
RUN mkdir -p /vol/media
RUN mkdir -p /vol/react
RUN mkdir -p /vol/videos
RUN mkdir -p /etc/nginx/certs
RUN mkdir -p /cache/nginx

COPY ./data/media /vol/media

RUN chown -R nginx:nginx /vol/static
RUN chown -R nginx:nginx /vol/media
RUN chown -R nginx:nginx /vol/react
RUN chown -R nginx:nginx /vol/videos

RUN chmod -R 755 /vol
USER nginx