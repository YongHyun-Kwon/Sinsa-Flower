module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // 바뀐 TailwindCSS PostCSS 플러그인
    require('autoprefixer'),
  ],
};