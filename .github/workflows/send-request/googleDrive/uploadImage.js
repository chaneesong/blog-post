import { createReadStream, existsSync } from 'node:fs';
import { getGoogleDriveAccess } from './getGoogleAccessToken.js';
import { createFolder } from './createFolder.js';
import { parseImageName } from './parseImageName.js';
import { getImageName } from './getImageName.js';

// 구글 드라이브로 이미지를 업로드 하는 함수
const uploadImageToDrive = async (drive, imagePath, folderId) => {
  const responsePromises = [];
  const imageIds = {};

  const imgNames = getImageName(imagePath);

  for (let imgName of imgNames) {
    const { ext } = parseImageName(imgName);
    const responsePromise = drive.files.create({
      requestBody: {
        name: imgName,
        parents: [folderId],
        MimeType: `image/${ext}`,
      },
      media: {
        MimeType: `image/${ext}`,
        body: createReadStream(`${imagePath}/${imgName}`),
      },
    });
    responsePromises.push(responsePromise);
  }

  (await Promise.all(responsePromises)).forEach(
    (res) => (imageIds[res.data.name] = res.data.id)
  );

  return imageIds;
};

// 이미지를 업로드 하는 함수 로직
export const uploadImage = async (fileName) => {
  const googleDriveAPICredentials = process.env.GOOGLE_DRIVE_API_CREDENTIALS;
  const splitedImgPath = fileName.split('.');
  const imgPath = splitedImgPath.reduce((a, c) => {
    return a + c;
  }, '');

  if (!existsSync(imgPath)) return null;

  try {
    const drive = await getGoogleDriveAccess(googleDriveAPICredentials);
    const folderId = await createFolder(drive, imgPath);
    const imgIds = await uploadImageToDrive(drive, imgPath, folderId);
    return imgIds;
  } catch (error) {
    console.error('image upload error.');
    console.error(error);
  }
};
