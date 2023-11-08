import { google } from 'googleapis';
import { createReadStream, readdirSync } from 'node:fs';
import { __dirname } from '../utils/getDirName';

// 구글 드라이브 접근을 위해 OAuth2 인증을 하는 함수
const getOAuth2Client = (clientID, clientSecret, redirectURL) => {
  const oauth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirectURL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// 구글 드라이브 접근 권한을 얻는 함수
const getDriveAccess = (oauth2Client) => {
  return google.drive({
    version: 'v3',
    auth: oauth2Client,
  });
};

// 디렉토리 이름을 바탕으로 구글 드라이브에 폴더를 만드는 함수
const createFolder = async (drive, imagePath) => {
  const { id } = await drive.files.create({
    requestBody: {
      name: imagePath,
      parents: [process.env.GOOGLE_DRIVE_ROOT_FOLDER],
      MimeType: 'application/vnd.google-apps.folder',
    },
  });

  return id;
};

// 디렉토리 내부에서 이미지명을 받아오는 함수
// 이미지를 보관하는 디렉토리 이름은 title과 같다.
const getImageName = (imagePath) => {
  return readdirSync(`${__dirname}/${imagePath}`);
};

// 이미지명과 확장자를 분리하는 함수
const parseImageName = (ImgName) => {
  const nameArr = ImgName.split('.');
  return {
    name: nameArr[0],
    ext: nameArr[1],
  };
};

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
    const oauth2Client = getOAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URL
    );
    const drive = getDriveAccess(oauth2Client);
    const folderId = createFolder(drive, imagePath);
    const imgIds = await uploadImageToDrive(drive, imagePath, folderId);
    return imgIds;
  } catch (error) {
    console.error('이미지를 업로드 하는 도중 에러 발생!');
    console.error(error);
  }
};
