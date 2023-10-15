import axios from 'axios';
import { ADDED, MODIFIED, DELETED } from '../utils/getCommitState.js';
import { injectId } from '../injectId/index.js';

const jwtToken = process.env.JWT;
axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

const sendRequestByFileType = async (type, header, body) => {
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
      injectId(res.data);
    } else if (type === DELETED) {
      res = await axios.delete(
        `${process.env.SERVER_URL}/posts/${postData.id}`
      );
    }
    return res;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default sendRequestByFileType;
