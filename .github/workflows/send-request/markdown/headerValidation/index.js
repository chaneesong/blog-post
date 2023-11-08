import getExistingTitles from './getExistingTitles.js';
import { DELETED } from '../../utils/getCommitState.js';

// 헤더의 이상유무를 확인하는 함수
const checkHeaderValidity = (fileType, header) => {
  if (fileType === DELETED) return;

  const { title, category } = header;
  const existingTitles = getExistingTitles();

  // 중복 타이틀을 확인
  if (existingTitles.filter((el) => el === title).length > 1) {
    console.error(`Error: Duplicate title found in ${file}`);
    process.exit(1);
  }

  // 카테고리가 하나인지 확인
  const categoryCount = category.split(',').length;
  if (categoryCount > 1) {
    console.error(`Error: Multiple categories found in ${file}`);
    process.exit(1);
  }
};

export default checkHeaderValidity;
