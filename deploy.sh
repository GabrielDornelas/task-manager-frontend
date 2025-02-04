#!/bin/bash

# Carregar variáveis de ambiente
source .env

# Build da imagem Docker
docker build -t task-manager-frontend:latest .

# Parar container existente se houver
docker stop task-manager-frontend || true
docker rm task-manager-frontend || true

# Executar novo container
docker run -d \
  --name task-manager-frontend \
  -p 80:80 \
  -e VITE_API_URL=${VITE_API_URL} \
  task-manager-frontend:latest 