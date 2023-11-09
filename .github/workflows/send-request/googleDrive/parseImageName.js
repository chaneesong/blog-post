// 이미지명과 확장자를 분리하는 함수
export const parseImageName = (ImgName) => {
  const nameArr = ImgName.split('.');
  return {
    name: nameArr[0],
    ext: nameArr[1],
  };
};
