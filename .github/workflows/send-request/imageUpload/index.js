import { google } from 'googleapis';
import { createReadStream, readdirSync } from 'node:fs';
import { __dirname } from '../utils/getDirName';

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

const getDriveAccess = (oauth2Client) => {
  return google.drive({
    version: 'v3',
    auth: oauth2Client,
  });
};

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

const getImageName = (imagePath) => {
  return readdirSync(`${__dirname}/${imagePath}`);
};

const parseImageName = (ImgName) => {
  const nameArr = ImgName.split('.');
  return {
    name: nameArr[0],
    ext: nameArr[1],
  };
};

const uploadImageToDrive = async (drive, imagePath, folderId) => {
  const responsePromises = [];

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

  return (await Promise.all(responsePromises)).map((res) => res.data.id);
};

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
