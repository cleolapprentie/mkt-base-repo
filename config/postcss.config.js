const IS_BUILD = process.env.BUILD === 'true'
const projectName = process.env.PROJECT

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
        `./${projectName}/public/**/*.html`,
        `./${projectName}/src/**/*.html`,
        `./${projectName}/src/**/*.vue`
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