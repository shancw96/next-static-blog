FROM node:18-alpine as build
WORKDIR /app

COPY . /app/

# dependence install
RUN yarn config set registry=https://registry.npmmirror.com \
    && yarn install

# Building App
RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]