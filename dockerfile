FROM node:20.9.0-alpine3.17

WORKDIR /usr/src/bot

RUN apk update && apk add --no-cache python3 py3-pip git
RUN git init && git clone -b bot_discord_dev https://github.com/Spydey-27/ZaGot.git 

WORKDIR /usr/src/bot/ZaGot


RUN pip install --upgrade pip && pip install -r requirements.txt
RUN npm install


CMD ["tail", "-f", "/dev/null"]
