FROM node:16

# Basic node.js setup
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
#RUN npm run build

# ECA specific stuff
RUN mkdir testing # test folder that hasn't been properly deprecated yet

CMD ["bash", "start.sh"]