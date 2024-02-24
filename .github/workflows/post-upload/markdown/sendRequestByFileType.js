import axios from 'axios';
import { ADDED, MODIFIED, DELETED } from '../utils/getCommitState.js';

const jwtToken = process.env.JWT;
axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

// 커밋 타입을 바탕으로 서버에 생성|수정|삭제 요청을 보내는 함수
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
    } else if (type === DELETED) {
      res = await axios.delete(
        `${process.env.SERVER_URL}/posts/${postData.id}`
      );
    }
    return res.data;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default sendRequestByFileType;
