import express from 'express';
import { writeFileSync } from 'node:fs';
import axios from 'axios';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  writeFileSync('output.log', 'ok');
  return res.sendStatus(200);
});

app.post('/auth/login', async (req, res) => {
  const { id, password } = req.body;

  const result = await axios.post('http://localhost/api/auth/login', {
    id,
    password,
  });
  return res.status(200).send(result.data);
});

app.post('/posts', async (req, res) => {
  const config = { headers: { Authorization: req.headers.authorization } };
  const result = await axios.post(
    'http://localhost/api/posts',
    req.body,
    config
  );
  console.log(result.data);
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
