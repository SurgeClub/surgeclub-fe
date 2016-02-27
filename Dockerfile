FROM node:5.1.1

# cache npm install when package.json hasn't changed
WORKDIR /tmp
ADD package.json package.json
RUN npm install
RUN npm install -g pm2

RUN mkdir /surge-fe
RUN cp -a /tmp/node_modules /surge-fe

WORKDIR /surge-fe
ADD . /surge-fe/

ENV NODE_ENV production

RUN npm run build

# upload js and css
WORKDIR /surge-fe/build

# go back to /surge-fe
WORKDIR /surge-fe

ENV NODE_PATH "./src"
ENV HOST 127.0.0.1
ENV PORT 8000

EXPOSE 8000
CMD ["pm2", "start", "./bin/server.js", "--no-daemon", "-i", "0"]
