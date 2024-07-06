FROM alpine:latest

RUN apk add --no-cache --virtual .dev-dependencies \
    zsh \
    git \
    build-base \
    nodejs
  
WORKDIR /workspace

COPY . .
