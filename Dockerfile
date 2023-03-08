FROM node:16.15.0-alpine

COPY ./src /opt/openai-slack-bot/src
COPY ./package.json /opt/openai-slack-bot/
COPY ./yarn.lock /opt/openai-slack-bot/

ENV OPENAI_API_KEY=""
ENV SLACK_BOT_TOKEN=""
ENV SLACK_SIGNING_SECRET=""
ENV SLACK_APP_TOKEN=""
ENV OPENAI_CHAT_NUM_OF_MESSAGES=""
ENV OPENAI_CHAT_TTL=""
ENV LOG_LEVEL="info"

WORKDIR /opt/openai-slack-bot

RUN yarn install --production && yarn cache clean

CMD ["yarn", "start"]
