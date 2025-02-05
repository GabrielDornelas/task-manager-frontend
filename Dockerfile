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

CMD ["npm", "run", "dev"]
