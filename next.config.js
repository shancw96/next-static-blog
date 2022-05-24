module.exports = (phase, { defaultConfig, }) => {
  return {
    webpack: (config, { dev, isServer, }) => {
      // config.resolve.mainFields = [ 'module', 'main', ];
      return config;
    },
  };
};