---
id: 3
title: 컨테이너에 환경변수 주입 feat.Doppler
category: 개발 도구
tags: [환경변수, 보안]
---

## Intro

항상 파일로 관리하는 환경변수에 대한 고민이 많았다.  
개발 환경, Github Secrets, 배포 환경 ... 여러 군데에서 개별로 관리하다보니 한 군데에서 변경하면 다른 곳 모두 접속헤서 변경해줘야 하는 번거로움이 있었다. 그래서 통합 관리에 대해 고민하게 되었고, Doppler라는 비밀 통합 관리 서비스를 알게 되었다.  
사용해본 결과 굉장히 만족스러워서 공유하고 싶어서 이 글을 작성하게 되었다.

## Doppler란 무엇인가?

도플러는 비밀 관리 플랫폼으로 CLI 개발환경, 호스팅 플랫폼, CI/CD 툴 등에 걸쳐 전반적인 비밀을 동기화하기 위한 통합 기능으로 비밀 관리를 간소화하는 SecretOps 플랫폼이다.  
쉽게 말해, 모든 비밀을 하나로 통합해 관리하는 플랫폼 서비스라고 생각하는게 편하겠다.

나는 주로 Github Secrets와 Docker compose에 환경변수 주입을 사용했고, Github Secrets에 주입하는 방법은 클릭 몇 번이면 되므로 생략하고, Docker compose에 주입하는 방법을 공유하겠다.

## Docker Compose에 환경변수를 주입하는 방법

MacOS 환경을 사용했기 때문에 MacOS를 기준으로 설명하고, 초기 세팅 -> Dockerfile -> Docker Compose 순서로 진행하겠다.  

### 1. 초기 세팅

먼저 도플러 설치를 한다.

```bash
# 서명 확인을 위해 gnupg가 필요하다고 한다.
brew install gnupg
# 도플러 설치
brew install dopplerhq/cli/doppler
# 설치 확인
doppler --version
```

설치 후, 도플러에 로그인한다.

```bash
doppler login
```

위 명령어를 입력하면 로컬환경의 경우 브라우저가 열리고, 도플러에 로그인하면 된다.  
docker compose를 사용하려는 경우 여기까지만 세팅하면 되고, 로컬에서 직접 실행할 경우 아래까지 세팅해야한다.
이제 프로젝트 디렉토리로 이동하여 환경 변수 세팅을 진행한다.  

```bash
cd /원하는/디렉토리로/이동
doppler setup
```

명령어를 실행하면 아래와 같이 프로젝트에 대한 환경들이 나오는데 원하는 환경을 선택하면 된다.  

```bash
Selected only available project: blog
? Select a config:  [Use arrows to move, type to filter]
> dev_personal
  dev
  dev_client
  cicd
  prd
  prd_api
  prd_web
  secrets
```

환경까지 세팅했으면 이제 실행하면된다.  

```bash
# 실행 할 커맨드 앞에 doppler run --을 붙여주면 된다.
doppler run -- your-command-here
```

### 2. Dockerfile

컨테이너 런타임에 환경 변수를 주입하기 위해서는 이미지에 도플러를 설치해야한다.  
나는 node:18-alpine을 사용하여 nestjs를 빌드했기 때문에 이것을 바탕으로 설명한다.  
만약, 다른 이미지를 활용하려는 경우 아래에 링크에 들어가서 커맨드를 확인하도록 하자.  

[**Installation**](https://docs.doppler.com/docs/dockerfile)

```yaml
FROM node:18-alpine

RUN mkdir -p /server
WORKDIR /server
COPY . /server/

# 리눅스 배포판 별로 설치 방법이 다르니 꼭 확인하자.
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add doppler

RUN yarn

ENV HOST 0.0.0.0
EXPOSE 3030

CMD ["doppler", "run", "--", "yarn", "start"]
```

단일 컨테이너만 활용하는 경우 컨테이너 실행 시 DOPPLER_TOKEN을 환경 변수로 주입해주면 된다.  

```bash
docker run --rm -it \
  -e DOPPLER_TOKEN="$(doppler configs tokens create docker --max-age 1m --plain)" \
  docker-container
```

위의 `doppler configs tokens ~`의 경우 실행 시 환경 변수를 주입하기 위한 일회성 토큰을 발급 받는 것이다.  

### 3. Docker Compose

이미지에 도플러 설치가 끝났다면 이제 compose에서 각각의 컨테이너에 DOPPLER_TOKEN을 주기만 하면 된다.  
만약, 각각의 컨테이너가 모두 환경 변수를 사용하는 경우 다른 이름으로 넘겨주면 된다.  

```yaml
services:
  web:
    container_name: client
    build:
      context: ./blog-client
      dockerfile: Dockerfile.prd
    expose:
      - '3000'
    # 이 부분을 보면 api 또한 도플러 토큰을 사용하기 때문에 _WEB이 달려있는 것이 보일 것이다.
    environment:
      - DOPPLER_TOKEN=${DOPPLER_TOKEN_WEB}
    depends_on:
      - api

  api:
    container_name: server
    build:
      context: ./blog-server
      dockerfile: Dockerfile.prd
    expose:
      - '3030'
    environment:
      - DOPPLER_TOKEN=${DOPPLER_TOKEN_API}

```

이제 위와 같이 compose 파일을 작성했다면, `docker compose up` 명령어를 실행할 때, 토큰을 넘겨주면 된다.

```bash
# --project (api) --config (dev) 괄호 부분에 각각 자신에게 맞는 이름을 넣으면 된다.
DOPPLER_TOKEN_API="$(doppler configs tokens create --project api --config dev api-dev-token --plain --max-age 1m)" \
DOPPLER_TOKEN_WEB="$(doppler configs tokens create --project web --config dev web-dev-token --plain --max-age 1m)" \
docker compose -f compose.yml up
```

## Outro

위와 같이 한 번 설정하게 되면 더 이상 환경 변수를 추가하기 위해 직접 github에 접속해서 secrets를 변경하고, ssh로 EC2 접속해서 변경하고, 로컬에서 변경하는 귀찮은 짓을 하지 않고 도플러의 대시보드에서 모든 것을 관리할 수 있어서 편하다.  
또한, 파일을 실수로 삭제하거나 잃어버리는 등의 걱정도 하지 않을 수 있어 좋다.
