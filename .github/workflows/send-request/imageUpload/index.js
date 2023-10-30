import { google } from 'googleapis';

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
  } catch (error) {
    console.error('이미지를 업로드 하는 도중 에러 발생!');
    console.error(error);
  }
};
