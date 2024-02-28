#!/bin/bash

express_timeout=10
ngrok_timeout=10
server_running=false



yarn start >output.log 2>&1 &

while [ $express_timeout -gt 0 ]; do
  echo 'express 서버 실행중 ...'
  if curl -s http://localhost:8080 >/dev/null; then
    server_running=true
    break
  fi

  sleep 1
  ((express_timeout--))
done

express_pid=$(lsof -PiTCP -sTCP:LISTEN | grep node | awk '{print $2}')

if [ "$server_running" = true ]; then
  echo "express 서버가 $express_pid 에서 실행 중입니다."
else
  echo "express 서버 실행을 실패했습니다."
  exit 1
fi

ngrok start blog >/dev/null 2>&1 &

while [ $ngrok_timeout -gt 0 ]; do
  echo 'ngrok 실행중 ...'
  if curl -s http://localhost:8080 >/dev/null; then
    server_running=true
    break
  fi

  sleep 1
  ((ngrok_timeout--))
done

ngrok_pid=$(ps aux | grep ngrok | grep start | awk '{print $2}')

if [ "$server_running" = true ]; then
  echo "ngrok이 $ngrok_pid 에서 실행 중입니다."
else
  echo "ngrok 서버 실행을 실패했습니다."
  kill -15 $express_pid
  exit 1
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" == "main" ]; then
  git branch dev
  git checkout dev
fi

git add .
git commit -m '미리보기'
git push origin dev

event=$(fswatch -1 "output.log")

kill -15 $ngrok_pid
kill -15 $express_pid

echo "모든 동작이 완료되었습니다."
