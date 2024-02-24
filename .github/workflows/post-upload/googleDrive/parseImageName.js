// 이미지명과 확장자를 분리하는 함수
export const parseImageName = (imgName) => {
  const splitedImgPath = imgName.split('.');
  const imgPath = splitedImgPath.slice(0, splitedImgPath.length - 1).join('.');

  return {
    name: imgPath,
    ext: splitedImgPath[splitedImgPath.length - 1],
  };
};
