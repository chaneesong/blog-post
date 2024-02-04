import { google } from 'googleapis';

// 구글 드라이브 접근을 위해 권한을 얻는 함수
export const getGoogleDriveAccess = async (googleDriveAPICredentials) => {
  const credentials = JSON.parse(googleDriveAPICredentials);
  // const credentials = JSON.parse(process.env.GOOGLE_DRIVE_API_CREDENTIALS);
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive.file']
  );

  const drive = google.drive({ version: 'v3', auth });

  return drive;
};
