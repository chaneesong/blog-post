---
title: TEST FILE
category: 알고리즘
tags: [leetcode]
---

### [125. Vaild Palindrome](https://leetcode.com/problems/valid-palindrome/)

## 문제 설명

모든 대문자를 소문자로 변환하고, 영어와 숫자가 아닌 문자는 제거한 뒤 앞뒤로 읽어도 똑같은 문장은 팰린드롬이다.  
문자열 s가 주어질 때, 팰린드롬이면 true를 아니라면 false를 리턴하라.

## 해결 방법

![solve](sample/test.png)

1. 대문자를 소문자로 변환한다.
2. 영어와 숫자가 아닌 문자는 제거한다.
3. 팰린드롬인지 확인한다.

## 풀이 코드

```typescript
export function isPalindrome(s: string): boolean {
  const lowerString = s.toLowerCase();
  const newString = lowerString.replace(/[^0-9|a-z]/gi, "");

  for (let i = 0; i < Math.floor(newString.length / 2); i++) {
    if (newString[i] !== newString[newString.length - 1 - i]) return false;
  }
  return true;
}
```

![solve](sample/test.png)

먼저, 문자열 전체를 `toLowerCase` 메서드를 활용해 모두 소문자로 변경한다.  
그 후 `replace`와 정규식을 활용해 숫자와 영어가 아닌 모든 문자를 제거한다.  
마지막으로 팰린드롬 여부를 판단하기 위해 문자열을 순회하며, 양쪽 끝의 문자가 같은지 비교한다.  
이 때, 중요한 점은 반복문을 끝까지 도는게 아니라 절반만 도는 것이다.

## 테스트 코드

```typescript
import { describe, expect, test } from "@jest/globals";
import { isPalindrome } from ".";

describe("Valid Palindrome", () => {
  test("Palindrome Module", () => {
    expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true);
    expect(isPalindrome("race a car")).toBe(false);
    expect(isPalindrome(" ")).toBe(true);
  });
});
```

[문제 풀이 코드](https://github.com/chaneesong/algorithm/tree/main/typescript/String-Manipulation/vaild-palindrome)
