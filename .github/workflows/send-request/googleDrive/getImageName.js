import fs from 'node:fs';

// 디렉토리 내부에서 이미지명을 받아오는 함수
// 이미지를 보관하는 디렉토리 이름은 title과 같다.
export const getImageName = (imagePath) => {
  return fs.readdirSync(`${__dirname}/${imagePath}`);
};
