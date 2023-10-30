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

export const uploadImage = async () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
    process.env;
  const oauth2Client = getOAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
  );
};
