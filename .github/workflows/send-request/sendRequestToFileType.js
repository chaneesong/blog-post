import axios from 'axios';

const MODIFIED = 'M';
const ADDED = 'A';

const sendRequestToFileType = async (type, header, body) => {
  try {
    const postData = { ...header, content: body };
    let res;
    if (type === MODIFIED) {
      res = await axios.patch(
        `${process.env.SERVER_URL}/posts/${postData.title}`,
        postData
      );
    } else if (type === ADDED) {
      res = await axios.post(`${process.env.SERVER_URL}/posts`, postData);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  return res;
};

export default sendRequestToFileType;
