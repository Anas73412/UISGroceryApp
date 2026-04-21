/**
 * Manual Android linking for @nozbe/watermelondb (see android/settings.gradle + app/build.gradle).
 * Disables CLI autolinking for this package on Android to avoid duplicate native registration.
 */
module.exports = {
  dependencies: {
    '@nozbe/watermelondb': {
      platforms: {
        android: null,
      },
    },
  },
};
