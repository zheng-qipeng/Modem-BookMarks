module.exports = {
  title: 'modem-bookmarks',
  description: 'zhengqipeng',
  base: '/modem-bookmarks/',
  head: [
    ['link', { rel: 'icon', href: '/image/favicon.ico' }],
  ],
  host: '0.0.0.0', // dev server 的主机名
  port: 8080, // dev server 的端口
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'modem-bookmarks',
      description: '种一棵树最好的时间是十年前  其次是现在'
    },
    '/en/': {
      lang: 'en-US',
      title: 'modem-bookmarks',
      description: 'The best time to plant a tree is twenty years ago  The second-best time is now'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        // 多语言下拉菜单的标题
        selectText: '语言',
        // 该语言在下拉菜单中的标签
        label: '中文',
        // 编辑链接文字
        editLinkText: '在 GitHub 上编辑此页',
        serviceWorker: {
          updatePopup: {
            message: "发现新内容",
            buttonText: "刷新"
          }
        },
        // 当前 locale 的 algolia docsearch 选项
        algolia: {},
        nav: require('./nav'),
        sidebar: require('./sidebar').inferSiderbars(), // 自动生成一个仅仅包含了当前页面标题（headers）链接的侧边栏
        lastUpdated: '上次更新', // string | boolean
      },
      // =============================================== English
      '/en/': {
        selectText: 'Languages',
        label: 'English(暂时不更//)',
        editLinkText: 'Edit this page on GitHub',
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        algolia: {},
        nav: require('./navEn'),
        sidebar: require('./sidebarEn').inferSiderbars(),
        lastUpdated: 'Last Updated', // string | boolean
      }
    },
    sidebarDepth: 2,
    // displayAllHeaders: true, // 默认值：false
    repo: 'zheng-qipeng/modem-bookmarks',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true
  },
  markdown: {
    lineNumbers: undefined, // 是否在每个代码块的左侧显示行号
    externalLinks: { target: '_blank', rel: 'noopener noreferrer' } // 这个键值对将会作为特性被增加到是外部链接的 <a> 标签上，默认的选项将会在新窗口中打开一个该外部链接
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@pubilc': './pubilc'
  //     }
  //   }
  // },
  // evergreen: true, // 如果你的对象只有那些 “常青树” 浏览器，你可以将其设置成 true，这将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills，同时会带来更快的构建速度和更小的文件体积
  plugins: [
    "vuepress-plugin-cat", // 小猫
    '@vuepress/active-header-links', // 页面滚动时自动激活侧边栏链接的插件(官方)
    '@vuepress/back-to-top' // back-to-top 插件(官方)
  ]
}
