FROM node:20.9.0-alpine3.17

WORKDIR /usr/src/bot

RUN apk update && apk add --no-cache python3 py3-pip git curl

# Clone the repository
RUN git init \
    && git clone -b bot_discord_dev https://github.com/Spydey-27/ZaGot.git

# Install kubectl
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x ./kubectl \
    && mv ./kubectl /usr/local/bin/kubectl

# Change working directory
WORKDIR /usr/src/bot/ZaGot

# Pull the latest changes
RUN git pull

# Make the script executable
RUN chmod +x recup_env.sh

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

#COPY config /root/.kube/config

# Install Node.js dependencies
RUN npm install

# Define the command to run your application
CMD ["tail", "-f", "/dev/null"]