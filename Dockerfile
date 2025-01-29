FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g @quasar/cli && npm install

RUN quasar build
CMD ["quasar", "dev"]
