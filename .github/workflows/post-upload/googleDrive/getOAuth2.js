import { google } from 'googleapis';

// 구글 드라이브 접근을 위해 OAuth2 인증을 하는 함수
export const getOAuth2Client = async (clientID, clientSecret, redirectURL) => {
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
export const getDriveAccess = (oauth2Client) => {
  return google.drive({
    version: 'v3',
    auth: oauth2Client,
  });
};
