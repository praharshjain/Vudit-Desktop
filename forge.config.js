const pkg = require('./package.json');
let packagerConfig = pkg.build;
packagerConfig.asar = true;
module.exports = {
  packagerConfig: packagerConfig,
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-pkg',
      config: {
        keychain: 'my-secret-ci-keychain'
      }
    }
  ],
};
