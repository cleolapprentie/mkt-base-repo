const IS_BUILD = process.env.BUILD === 'true'
const projectBaseUrl = process.env.PROJECT_BASE_URL

const postcss = {
  plugins: [
    require('autoprefixer')({
      grid: 'autoplace'
    })
  ]
}

if (IS_BUILD) {
  postcss.plugins.push(
    require('@fullhuman/postcss-purgecss')({
      content: [
        `${projectBaseUrl}/public/**/*.html`,
        `${projectBaseUrl}/src/**/*.html`,
        `${projectBaseUrl}/src/**/*.vue`
      ],
      defaultExtractor (content) {
        const contentWithoutStyleBlocks = content.replace(
          /<style[^]+?<\/style>/gi,
          ''
        )
        return (
          contentWithoutStyleBlocks.match(
            /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
          ) || []
        )
      },
      safelist: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*/
      ]
    })
  )
}

module.exports = postcss