module.exports = async ({ config }) => {
  const newConfig = {
    ...config,
    devtool: 'source-map',
  };

  return newConfig;
};
