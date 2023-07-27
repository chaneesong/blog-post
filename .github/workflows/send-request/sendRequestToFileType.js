import axios from 'axios';
import 'dotenv/config';

const MODIFIED = 'M';
const ADDED = 'A';

const sendRequestToFileType = async (type, header, body) => {
  const postData = { ...header, body };
  let res;
  console.log('----------------sendRequest------------------');
  console.log(postData);
  console.log('server', process.env);
  // if (type === MODIFIED) {
  //   res = await axios.patch(process.env.SERVER_URL + '/posts', postData);
  // } else if (type === ADDED) {
  //   res = await axios.post(process.env.SERVER_URL + '/posts', postData);
  // }
  // // console.log(res);
  // return res;
};

export default sendRequestToFileType;
