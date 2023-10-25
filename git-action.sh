#!/bin/bash

success_file="success.txt"

>"$success_file"

(cd response && yarn start) >/dev/null 2>&1 &

ngrok start chaneesong >/dev/null 2>&1 &

sleep 5

ngrok_pid=$(ps aux | grep ngrok | grep start | awk '{print $2}')
nestjs_pid=$(lsof -PiTCP -sTCP:LISTEN | grep node | awk '{print $2}')

if [ -n "$ngrok_pid" ]; then
  echo "ngrok이 $ngrok_pid 에서 실행 중입니다."
else
  echo "ngrok 프로세스를 찾을 수 없습니다."
fi

if [ -n "$nestjs_pid" ]; then
  echo "nestjs 서버가 $nestjs_pid 에서 실행 중입니다."
else
  echo "nestjs 서버를 찾을 수 없습니다."
fi

event=$(fswatch -1 "$success_file")

if [ -s "$success_file" ]; then
  git pull origin main
  >"$success_file"
fi

kill -15 $ngrok_pid
kill -15 $nestjs_pid

echo "모든 동작이 완료되었습니다."
