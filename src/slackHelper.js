const pagination = (func, params, key) => {
  const limit = 1000;
  const options = {
    limit,
    cursor: undefined,
  };
  const results = [];
  const loop = async () => {
    const res = await func({ ...params, ...options });
    results.push(...res[key]);

    const { response_metadata } = res;
    if (response_metadata && response_metadata.next_cursor) {
      options.cursor = response_metadata.next_cursor;
      await loop();
    }
  };
  return loop().then(() => results);
};

module.exports = {
  pagination,
};
