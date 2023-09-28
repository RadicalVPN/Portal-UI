FROM node:lts-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest AS final
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/portal


EXPOSE 80