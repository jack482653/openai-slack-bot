## v1.5.1 (2023-03-22)

### Fix

- **models/OpenAICommand.js**: debug log of getting cache value

## v1.5.0 (2023-03-19)

### Feat

- **models/OpenAICommand.js**: add prefix in key when accessing cache
- **events/ask.js**: ask the question in the thread
- **src/app.js**: summarize thread
- **src/app.js**: handle singal

### Refactor

- extract code
- adjust project src files structure

## v1.4.0 (2023-03-13)

## v1.4.0-beta.1 (2023-03-13)

### Feat

- **src/app.js**: send error message to slack

### Fix

- **openai/OpenAICommand.js**: fix summarize message

## v1.4.0-beta.0 (2023-03-13)

### Feat

- summarize last conversations if OPENAI_CHAT_ENABLE_SUMMARIZE is enabled

### Refactor

- **openai/OpenAICommand.js**: reoder function, add more debug logs around OpenAI API

## v1.3.2 (2023-03-08)

### Feat

- set log level at env and more debug logs

## v1.3.1 (2023-03-07)

### Fix

- **src/Cache.js**: don't throw error when key is undefined or null

## v1.3.0 (2023-03-06)

### Feat

- **src/app.js**: handle message event
- add logger

## v1.2.1 (2023-03-06)

### Fix

- rename src/Config.js -> src/config.js

## v1.2.0 (2023-03-06)

### Feat

- **src/app.js**: use chat(). Now response is based on previous conversations.
- **src/openai/OpenAICommand.js**: add chat(), which previous conversations is cached
- **src/Cache.js**: add cache

### Fix

- **src/app.js**: pass config when initializing OpenAICommand

### Refactor

- **src/openai/OpenAICommand.js**: remove testing log
- extract config.js
- **src/openai/OpenAICommand.js**: extract configurations.js
- **src/openai/OpenAICommand.js**: extract roles.js
- move code file to src folder

## v1.1.2 (2023-03-02)

### Fix

- **OpenAICommand.js**: fix config again QQ

## v1.1.1 (2023-03-02)

### Fix

- **OpenAICommand.js**: fix config

## v1.1.0 (2023-03-02)

### Feat

- **app.js**: add /fate command
- **app.js**: app_metion event use new gpt-3.5-turbo model
- **OpenAICommand.js**: add createChatCompletion() and createSingleChatCompletion(), which use new gpt-3.5-turbo model

## v1.0.0 (2022-12-28)

### Feat

- **app.js**: upload file to slack
- **OpenAICommand.js**: retrun base64 string
- **app.js**: add /gen_image command
- **OpenAICommand.js**: generate image
- **OpenAICommand.js**: add OpenAI Command class
- first commit

### Fix

- **app.js**: sharedPublicURL not work
- **app.js**: sharedPublicURL not work
- **app.js**: make permalink public
- **app.js**: block text
- **OpenAICommand.js**: getting choices from data
- **OpenAICommand.js**: code
- **OpenAICommand.js**: export module

### Refactor

- **app.js**: use OpenAICommand
