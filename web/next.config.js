module.exports = {
    webpack: (config, { isServer, dev }) => {
      if (dev) {
        config.watchOptions.poll = 300;
      }
      return config;
    },
  };
  