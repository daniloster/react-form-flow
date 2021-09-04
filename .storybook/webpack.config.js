module.exports = async ({ config }) => {
  const newConfig = {
    ...config,
    node: {
      fs: "empty",
    },
    devtool: 'source-map',
  };

  return newConfig;
};
