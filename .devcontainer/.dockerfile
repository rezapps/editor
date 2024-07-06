FROM alpine:latest

RUN apk add --no-cache --virtual .dev-dependencies \
    zsh \
    ca-certificates \
    git \
    tzdata \
    build-base \
    nodejs-current

RUN corepack enable pnpm
  
WORKDIR /workspace

COPY . .

RUN pnpm add -g typescript
