import { createReadStream } from 'node:fs';
import { getOAuth2Client, getDriveAccess } from './getOAuth2.js';
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
export const uploadImage = async (imagePath) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
    process.env;
  try {
    const oauth2Client = await getOAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URL
    );
    const drive = getDriveAccess(oauth2Client);
    const folderId = await createFolder(drive, imagePath);
    const imgIds = await uploadImageToDrive(drive, imagePath, folderId);
    return imgIds;
  } catch (error) {
    console.error('이미지를 업로드 하는 도중 에러 발생!');
    console.error(error);
  }
};
