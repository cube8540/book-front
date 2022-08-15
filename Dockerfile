FROM nginx:1.21.0

RUN apt-get update && apt-get install -y unzip wget && apt-get install -y vim

COPY dist/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
ADD *.conf /etc/nginx/conf.d