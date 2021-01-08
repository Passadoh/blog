// Load variables from `.env` as soon as possible
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const {getBlogUrl, toPlainText} = require('./src/lib/helpers')
const clientConfig = require('./client-config')

const isProd = process.env.NODE_ENV === 'production'
const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'Frank\'s Blog',
    description: 'Hier schrijf ik over legal en tech.',
    siteUrl: process.env.GATSBY_HOME_PAGE + '/'
  },
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        ...clientConfig.sanity,
        token: process.env.SANITY_READ_TOKEN,
        watchMode: !isProd,
        overlayDrafts: !isProd
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'img',
        path: path.join(__dirname, 'src', 'assets', 'img')
      }
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Ubuntu:400,300,500,700',
          'Raleway:300,400,400i,700'
        ],
        display: 'swap'
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /icons/
        }
      }
    },
    {
      resolve: 'gatsby-transform-portable-text',
      options: {
        extendTypes: [{typeName: 'SanityPost', contentFieldName: 'body'}]
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({query: {allSanityPost}}) => {
              return allSanityPost.edges.map(edge => {
                const description = toPlainText(edge.node._rawExcerpt)
                const path = getBlogUrl(edge.node.publishedAt, edge.node.slug.current)
                return Object.assign({}, {
                  title: edge.node.title,
                  description: description,
                  date: edge.node.publishedAt,
                  url: process.env.GATSBY_HOME_PAGE + path,
                  guid: edge.node.slug.current
                })
              })
            },
            query: `
            {
                allSanityPost(filter: {slug: {current: {ne: null}}, publishedAt: {ne: null}}, sort: {order: DESC, fields: publishedAt}) {
                  edges {
                    node {
                      id
                      title
                      publishedAt
                      _rawExcerpt(resolveReferences: {maxDepth: 5})
                      slug {
                        current
                      }
                    }
                  }
                }
              }
            `,
            output: '/feeds/rss.xml',
            title: "Frank's RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: '^/blog/'
            // optional configuration to specify external rss feed, such as feedburner
            // link: 'https://feeds.feedburner.com/gatsby/blog'
          }
        ]
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp'
  ]
}
