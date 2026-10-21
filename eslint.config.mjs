import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...expoConfig,
  {
    ignores: [
      'legacy/**',
      'node_modules/**',
      '.expo/**',
      'pocketbase/pb_data/**',
      'pocketbase/pb_migrations/**',
      'pocketbase/seed.js',
      'pocketbase/start.js',
      'pocketbase/setup-collections.js',
    ],
  },
];
