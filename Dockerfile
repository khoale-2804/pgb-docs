FROM node:24-alpine

# su-exec drops from root to the image's `node` user (uid 1000 = host user)
# after dependency install, so files Keystatic writes are host-user-owned.
RUN apk add --no-cache su-exec git

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app
EXPOSE 4321

ENTRYPOINT ["docker-entrypoint.sh"]
