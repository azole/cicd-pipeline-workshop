# Simple Web

Just for CICD pipeline workshop

## Environment

- NodeJS v22

## How to run

```bash
npm install

cp .env.example .env
# edit .env

node src/server.js
```

```bash
npm install -g pm2

pm2 start src/server.js

pm2 restart src/server.js
```

### API

- GET /
- GET /db

## How to lint & Prettier

```bash
./node_modules/.bin/eslint .

./node_modules/.bin/prettier --write .
```

## How to test

```bash
./node_modules/.bin/mocha --reporter spec

# Generate HTML reporter
./node_modules/.bin/mocha --reporter mochawesome

# Generate Code Coverage Report
./node_modules/.bin/nyc --reporter=html ./node_modules/.bin/mocha --reporter mochawesome
```

# Workshop Credit

這次 workshop 的設計要歸功於:

- SRE 班導師 John 及 Mao-Lin，SRE 班助教、學員
  - Workshop 內容大多來自於 SRE 班 M6 模組的課程設計
  - 學員在課堂上的討論與分享
- [DevOps Taiwan 社群](https://www.facebook.com/story.php?story_fbid=802770251955920&id=100066688574865&rdid=k9wrg13zgN7KeEM8)的艦長與助教、測試學員們
  - DevOps Days Taipei 2024 - [【DevOps入門班】一條龍工程師無法完成的 DevOps Pipeline 體驗工作坊](https://devopsdays.tw/2024/session-page/3054) 擔任這個工作坊的助教，獲得許多設計上的靈感，
- SRE 班助教 [Ed](https://github.com/flyingdog1310) 協助 Reivew
