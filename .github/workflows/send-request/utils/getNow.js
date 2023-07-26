const getNow = () => {
  const date = new Date();
  return new Date(date.setHours(date.getHours() + 9));
};

export default getNow;
