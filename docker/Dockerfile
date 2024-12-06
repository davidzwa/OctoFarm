FROM node:18-bookworm-slim AS build-client

WORKDIR /client

COPY client/.yarn/releases .yarn/releases

RUN yarn set version berry

COPY client/package.json client/yarn.lock client/.yarnrc.yml ./
COPY ./server/ /server/
COPY ./package.json /package.json

RUN yarn install --immutable

COPY client/ ./
RUN yarn run build 

FROM node:18-bookworm-slim AS production
WORKDIR /app/server/

RUN apt-get update && apt-get install -y ca-certificates curl

RUN yarn global add pm2
COPY server/.yarn/releases /app/server/.yarn/releases
RUN yarn set version berry

COPY ./server/ /app/server/
COPY --from=build-client /client/dist/. /app/server/assets/.
RUN yarn workspaces focus --all --production

COPY README.md LICENSE.txt .dockerignore ./

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["bash", "/usr/local/bin/entrypoint.sh"]