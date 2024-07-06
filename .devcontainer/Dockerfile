FROM alpine:latest

RUN apk add --no-cache --virtual .dev-dependencies \
    zsh \
    ca-certificates \
    git \
    build-base \
    nodejs
  
WORKDIR /workspace

COPY . .

RUN npm add -g typescript
