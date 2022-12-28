# openai-slack-bot
A OpenAI Slack bot inspired from [@kvzhuang](https://gist.github.com/kvzhuang)
Orignial source code: https://gist.github.com/kvzhuang/357b83499d3edcc099512d47a4a1b646

## Functions
Ask bot something...

<img width="693" alt="image" src="https://user-images.githubusercontent.com/6816342/209771710-0943aba3-2c56-4f5c-92d5-c60f8ac67ec7.png">

Generate image:
```
/gen_image [prompt]
```
<img width="693" alt="image" src="https://user-images.githubusercontent.com/6816342/209779765-bd0892e9-fded-4a80-9d7c-4c0b3933accb.png">


## Prerequisites

### OpenAI
Get OpenAI API key... of course.

### Slack
1. Visit [Slack API](https://api.slack.com/apps), create new app and install to your workspace.
2. [Optional] Go to `Socket Mode` page, and turn on.
3. Go to `OAuth & Permissions`. In `Scopes > Bot Token Scopes`, add these scopes below:
![image](https://user-images.githubusercontent.com/6816342/209769237-52a1cae1-3d75-43e6-8f90-5e1250cfe947.png)
4. In `Event Subscriptions`, enable Events and subscribe user bot event `app_mention`:
![image](https://user-images.githubusercontent.com/6816342/209769765-b38c19bf-f2d8-4225-82f8-bf8934b4b88b.png)
5. In `Slash Commands`, add `/gen_image` command:
![image](https://user-images.githubusercontent.com/6816342/209769980-5a618c3f-8c07-4023-b036-ad026f792329.png)
6. Get Keys, create `.env` file at root project folder and copy these keys into `.env`:
  * `SLACK_SIGNING_SECRET`: Basic Information > App Credentials > Signing Secret
  * `SLACK_BOT_TOKEN`: OAuth & Permissions > Bot User OAuth Token
  * `SLACK_APP_TOKEN`: Basic Information > App-Level Tokens, click token name and get token.
  * `OPENAI_API_KEY`

```bash
→ cat .env
OPENAI_API_KEY=xxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxx
SLACK_SIGNING_SECRET=xxxxxx
SLACK_APP_TOKEN=xapp-xxxxxx
```

## Get Started

```
yarn install
yarn start
```

If you want to use docker:
```
docker-compose up
```
