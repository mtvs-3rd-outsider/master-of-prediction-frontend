/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {}, // PostCSS Import 플러그인
    'tailwindcss': {}, // TailwindCSS 플러그인
    'autoprefixer': {}, // Autoprefixer 플러그인
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false, // 프로덕션 빌드 시에만 cssnano 사용
  },
};

export default config;