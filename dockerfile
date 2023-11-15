FROM node:latest

WORKDIR /usr/src/Zagot

COPY package*.json requirements.txt ./
RUN apt update && apt install -y python3-pip && pip3 install --upgrade pip && pip3 install -r requirements.txt
RUN npm install 

COPY . .

CMD ["node", "index.js"]
