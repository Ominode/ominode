# Ominode docs site — VitePress static build served by Caddy.

FROM oven/bun:1 AS build
WORKDIR /site
COPY package.json bun.lock* ./
RUN bun install
COPY . .
RUN bun run build

FROM caddy:2-alpine
COPY --from=build /site/.vitepress/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
