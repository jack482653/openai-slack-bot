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

#### Use App Manifest

You can easily create a pre-configured Slack app by [click this link](https://api.slack.com/apps?new_app=1&manifest_yaml=display_information%3A%0A%20%20name%3A%20OpenAI%20Chat%0A%20%20description%3A%20An%20OpenAI%20Slack%20bot%0Afeatures%3A%0A%20%20app_home%3A%0A%20%20%20%20home_tab_enabled%3A%20false%0A%20%20%20%20messages_tab_enabled%3A%20true%0A%20%20%20%20messages_tab_read_only_enabled%3A%20false%0A%20%20bot_user%3A%0A%20%20%20%20display_name%3A%20OpenAI%20Chat%0A%20%20%20%20always_online%3A%20true%0A%20%20slash_commands%3A%0A%20%20%20%20-%20command%3A%20%2Fgen_image%0A%20%20%20%20%20%20description%3A%20Generate%20image%20from%20OpenAI%0A%20%20%20%20%20%20usage_hint%3A%20%22%5Ba%20white%20siamese%20cat%5D%22%0A%20%20%20%20%20%20should_escape%3A%20false%0Aoauth_config%3A%0A%20%20scopes%3A%0A%20%20%20%20user%3A%0A%20%20%20%20%20%20-%20files%3Awrite%0A%20%20%20%20bot%3A%0A%20%20%20%20%20%20-%20app_mentions%3Aread%0A%20%20%20%20%20%20-%20chat%3Awrite%0A%20%20%20%20%20%20-%20chat%3Awrite.customize%0A%20%20%20%20%20%20-%20chat%3Awrite.public%0A%20%20%20%20%20%20-%20commands%0A%20%20%20%20%20%20-%20files%3Awrite%0A%20%20%20%20%20%20-%20im%3Ahistory%0Asettings%3A%0A%20%20event_subscriptions%3A%0A%20%20%20%20bot_events%3A%0A%20%20%20%20%20%20-%20app_mention%0A%20%20%20%20%20%20-%20message.im%0A%20%20interactivity%3A%0A%20%20%20%20is_enabled%3A%20true%0A%20%20org_deploy_enabled%3A%20false%0A%20%20socket_mode_enabled%3A%20true%0A%20%20token_rotation_enabled%3A%20false).

This is done by Slack App Manifest. You can also manually copy the manifest below, and paste while creating Slack app.

```yaml
display_information:
  name: OpenAI Chat
  description: An OpenAI Slack bot
features:
  app_home:
    home_tab_enabled: false
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: OpenAI Chat
    always_online: true
  slash_commands:
    - command: /gen_image
      description: Generate image from OpenAI
      usage_hint: "[a white siamese cat]"
      should_escape: false
oauth_config:
  scopes:
    user:
      - files:write
    bot:
      - app_mentions:read
      - chat:write
      - chat:write.customize
      - chat:write.public
      - commands
      - files:write
      - im:history
settings:
  event_subscriptions:
    bot_events:
      - app_mention
      - message.im
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```

#### Manual

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
  - `OPENAI_CHAT_NUM_OF_MESSAGES`: Number of messages bot will cache. It's used for appending previous conversioations when calling chat completions API. MUST BE EVEN. Default value: 2.
  - `OPENAI_CHAT_TTL`: The duration of time (second) that messages will be kept. Default value: null (keep forever).
  - `OPENAI_CHAT_SYSTEM_MESSAGE`: First messsage to help set the behavior of the assistant. Default value: null.

Your `.env` file should look like this:

```
OPENAI_API_KEY=xxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxx
SLACK_SIGNING_SECRET=xxxxxx
SLACK_APP_TOKEN=xapp-xxxxxx
OPENAI_CHAT_NUM_OF_MESSAGES=4
OPENAI_CHAT_TTL=1200
OPENAI_CHAT_SYSTEM_MESSAGE="You are a helpful assistant."
```

## Getting Started

To get started with the bot, follow these steps:

1. Install the necessary dependencies by running `yarn install`
2. Start the bot by running `yarn start`

Alternatively, you can use docker by running `docker-compose up`.
