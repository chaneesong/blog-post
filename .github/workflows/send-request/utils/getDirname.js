// __dirname을 사용하기 위해 정의
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const __dirname = path.dirname(process.cwd());
