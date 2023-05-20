FROM node:16.15.0-alpine

COPY ./src /opt/openai-slack-bot/src
COPY ./package.json /opt/openai-slack-bot/
COPY ./yarn.lock /opt/openai-slack-bot/

ENV OPENAI_API_KEY=""
ENV OPENAI_BASE_PATH=""
ENV SLACK_BOT_TOKEN=""
ENV SLACK_SIGNING_SECRET=""
ENV SLACK_APP_TOKEN=""
ENV SLACK_APP_MENTION_QUOTE_USER_MESSAGE="false"
ENV OPENAI_CHAT_MODEL="gpt-3.5-turbo"
ENV OPENAI_CHAT_ENABLE_SUMMARIZE="false"
ENV OPENAI_CHAT_NUM_OF_MESSAGES=""
ENV OPENAI_CHAT_TTL=""
ENV LOG_LEVEL="info"

WORKDIR /opt/openai-slack-bot

RUN yarn install --production && yarn cache clean

CMD ["yarn", "start"]
