# github actions를 활용할 때 마지막 커밋 내용을 확인하는 로직이 있는데,
# 해당 로직을 act에서 활용하기 위해서는 commit이 필요하다.
# 직접 커맨드를 작성하기 보다 스크립트를 작성하여 push 전에 롤백 시킨다.
#!/bin/bash

# 현재 브랜치 가져오기
current_branch=$(git rev-parse --abbrev-ref HEAD)

# 현재 브랜치의 마지막 커밋 가져오기
last_commit=$(git rev-parse HEAD)

# GitHub에 푸시된 마지막 커밋 가져오기
remote_commit=$(git ls-remote origin -h refs/heads/$current_branch | cut -f1)

# 현재 브랜치의 로컬과 리모트 커밋이 다르면 리셋
if [ "$last_commit" != "$remote_commit" ]; then
  echo "GitHub에 푸시되지 않은 커밋을 발견했습니다. 리셋을 시작합니다."

  # 로컬과 리모트를 동기화
  git fetch

  # 로컬 브랜치 리셋
  git reset --soft origin/$current_branch

  git reset

  echo "리셋이 완료되었습니다."
else
  echo "GitHub에 푸시되지 않은 커밋이 없습니다."
fi
