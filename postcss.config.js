module.exports = {
  plugins: [
    require('tailwindcss'),
    require('tailwindcss/nesting'),
    require('autoprefixer'),
    ...(process.env.JEKYLL_ENV == 'production'
      ? [require('cssnano')({ preset: 'default' })]
      : []),
  ]
}
