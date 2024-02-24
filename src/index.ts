import express from 'express';
import { writeFileSync } from 'node:fs';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  return res.sendStatus(200);
});

app.post('/', (req, res) => {
  writeFileSync('output.log', req.body.test);
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
