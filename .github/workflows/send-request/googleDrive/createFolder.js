// 디렉토리 이름을 바탕으로 구글 드라이브에 폴더를 만드는 함수
export const createFolder = async (drive, imagePath) => {
  const file = await drive.files.create({
    resource: {
      name: imagePath,
      parents: [process.env.GOOGLE_DRIVE_ROOT_FOLDER],
      MimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return file.data.id;
};
