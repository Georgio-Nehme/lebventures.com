FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Public vars are baked into the static bundle at build time
ARG PUBLIC_API_URL
ARG PUBLIC_COGNITO_POOL_ID
ARG PUBLIC_COGNITO_CLIENT_ID
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_COGNITO_POOL_ID=$PUBLIC_COGNITO_POOL_ID
ENV PUBLIC_COGNITO_CLIENT_ID=$PUBLIC_COGNITO_CLIENT_ID

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
