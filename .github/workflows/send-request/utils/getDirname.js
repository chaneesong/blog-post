// __dirname을 사용하기 위해 정의
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
