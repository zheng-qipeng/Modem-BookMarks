import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import documentTitle from './public/js/document-title' // 变换标题
import canvas from './public/js/canvas' // 流动的canvas点
import copy from './public/js/copy' // 复制操作

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 或 客户端
}) => {
  // ...做一些其他的应用级别的优化
  Vue.use(Element)

  try { // 防止编译的时候报错
    documentTitle()
    canvas()
    copy()
  } catch (e) {
    // console.error(e.message, '???')
  }
}
