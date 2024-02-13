// 이미지명과 확장자를 분리하는 함수
export const parseImageName = (imgName) => {
  const splitedImgPath = imgName.split('.');
  const imgPath = splitedImgPath.join('.').slice(0, splitedImgPath.length - 1);
  console.log(
    'parseImageName',
    imgPath,
    splitedImgPath[splitedImgPath.length - 1]
  );
  return {
    name: imgPath,
    ext: splitedImgPath[splitedImgPath.length - 1],
  };
};
