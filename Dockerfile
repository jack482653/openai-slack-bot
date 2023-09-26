FROM node:16.15.0-alpine

COPY ./src /opt/openai-slack-bot/src
COPY ./package.json /opt/openai-slack-bot/
COPY ./yarn.lock /opt/openai-slack-bot/

WORKDIR /opt/openai-slack-bot

RUN yarn install --production && yarn cache clean

CMD ["yarn", "start"]
