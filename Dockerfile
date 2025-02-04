# Estágio de build
FROM node:18-alpine as build-stage

WORKDIR /app

# Definir argumento de build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copiar todo o código fonte
COPY . .

# Instalar dependências
RUN npm install -g @quasar/cli
RUN npm install

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine as production-stage

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos de build
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Verificar se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
