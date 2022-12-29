# openai-slack-bot

A Slack bot that uses the OpenAI API to generate responses and images based on user prompts.

Inspired by [@kvzhuang](https://gist.github.com/kvzhuang). Original source code can be found [here](https://gist.github.com/kvzhuang/357b83499d3edcc099512d47a4a1b646).

This document is polished by ChatGPT :P .

## Functions

- Ask the bot a question and it will generate a response:

<img width="693" alt="image" src="https://user-images.githubusercontent.com/6816342/209771710-0943aba3-2c56-4f5c-92d5-c60f8ac67ec7.png">

- Generate an image based on a prompt:
```
/gen_image [prompt]
```
<img width="693" alt="image" src="https://user-images.githubusercontent.com/6816342/209779765-bd0892e9-fded-4a80-9d7c-4c0b3933accb.png">

## Prerequisites

### OpenAI

- Obtain an OpenAI API key.

### Slack

1. Create a new app and install it to your workspace through the [Slack API](https://api.slack.com/apps).
2. Enable Socket Mode on the `Socket Mode` page.
3. On the `OAuth & Permissions` page, add the following scopes to `Scopes > Bot Token Scopes`:

![image](https://user-images.githubusercontent.com/6816342/209769237-52a1cae1-3d75-43e6-8f90-5e1250cfe947.png)

4. Enable Events and subscribe to the `app_mention` user bot event on the `Event Subscriptions` page:

![image](https://user-images.githubusercontent.com/6816342/209769765-b38c19bf-f2d8-4225-82f8-bf8934b4b88b.png)

5. Add the `/gen_image` command on the `Slash Commands` page:

![image](https://user-images.githubusercontent.com/6816342/209769980-5a618c3f-8c07-4023-b036-ad026f792329.png)

6. Obtain the following keys and add them to a `.env` file at the root of the project directory:
  - `SLACK_SIGNING_SECRET`: found under `Basic Information > App Credentials > Signing Secret`
  - `SLACK_BOT_TOKEN`: found under `OAuth & Permissions > Bot User OAuth Token`
  - `SLACK_APP_TOKEN`: found under `Basic Information > App-Level Tokens`, click on the token name to obtain it
  - `OPENAI_API_KEY`

Your `.env` file should look like this:

```
OPENAI_API_KEY=xxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxx
SLACK_SIGNING_SECRET=xxxxxx
SLACK_APP_TOKEN=xapp-xxxxxx
```

## Getting Started

To get started with the bot, follow these steps:

1. Install the necessary dependencies by running `yarn install`
2. Start the bot by running `yarn start`

Alternatively, you can use docker by running `docker-compose up`.
