// next.config.js
module.exports = {
  // Enable static export for Next.js
  output: 'export',

  // Optional: Customize the build directory (where the build files are stored)
  distDir: 'build',

  // Optional: Customize Webpack configuration to support imports from the 'src' folder
  webpack: (config) => {
    config.resolve.modules.push(__dirname + '/src');  // Allows imports from the `src` folder
    return config;
  },
};
