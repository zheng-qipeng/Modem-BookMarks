
# Vue跨域解决方案之jsonp

## 1. 写在前面的话

  自打 vue-resouse 不再更新之后，它在全家桶中的身份已经被 axios 替代了。作为一个 vue-resourse 的忠实支持者，最初我是拒绝的。但是经过实际尝试之后，还是逃不开 “真香” 理论。确实，axios 能够作为干掉“原配”的第三者，是有自己独特优势的。当然今天来的目的不是为了给大家吹嘘 axios 有多牛逼，而是想说说 axios 中存在的问题----跨域。

## 2. axios 不支持跨域 

  ​众所周知，axios 虽然在各方面表现都是很优秀的，但是却不支持跨域。具体原因，官方没有给出解释。但是我猜呢，应该是因为一般 axios 是与 vue 配合使用，而 webpack 又是可以配置 proxyTable 来解决跨域问题的。所以它根本没有必要实现跨域。但是貌似这种设定对菜鸟兄弟来说就太蛋疼了..

## 3. 解决方式 -- jsonp

​	 莫非除了配置 proxyTable 之外没有别的方案来解决跨域了吗？答案是否定的，我们可以使用 jsonp 来解决。要了解详细文档的可以看下面的链接：[https://github.com/webmodules/jsonp](https://github.com/webmodules/jsonp)

## 4. 使用步骤

​	 根据官网介绍，使用方式极其简单

1. 安装

  ```javascript
  npm i jsonp --save
  ```

2. 引用

  ```javascript
  import jsonp from 'json'
  ```

3. 调用方法

  ```javascript
  // url: 请求的路径（只支持 get 方式）
  // options: 请求参数
  // fn: 请求后的回调函数
  //	参数：
  //		err: 异常信息
  //		data: 服务器响应数据
  jsonp(url, options, fn)
  ```

## 5. 应用案例 

​	以下是一段请求天气的代码：

```javascript
	import jsonp from 'jsonp'
	let url = 'https://api.asilu.com/weather/?city=%E5%B9%BF%E5%B7%9E'
    // const xhr = new XMLHttpRequest()
    // xhr.open('get', url)
    // xhr.send()
    // xhr.onreadystatechange = function () {
    //   if (this.readyState === 4) {
    //     console.log(xhr.responseText)
    //   }
    // }
    jsonp(url, {}, (err, data) => {
      console.log(data)
    })
```

## 6. 源码分析

​	 好，现在已经完美的解决了问题。但是新的问题又来了：这玩意是怎么实现的，跟之前 ajax 中的跨域是一样的么？就在这个强烈的好奇心中，我打开了它的源码。突然发现，源码不到 一百句！所以给大伙分享一下它的代码，并且附上本人理解的注释

```javascript
/**
 * Module dependencies
 */

//  引入一个第三包 debug（用来起调试作用）
var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

// 暴露 jsonp 给外部使用
module.exports = jsonp;

/**
 * Callback index.
 */
// 定义一个数字
var count = 0;

/**
 * Noop function.
 */

 // 定义一个空函数，为将来清空函数作准备
function noop(){}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

 // 定义 Jsonp 方法
function jsonp(url, opts, fn){
  // 判断 opts 是否是一个方法，说明第二个参数也可以传方法，这里会自动识别
  if ('function' == typeof opts) {
    //如果opts的类型是function，则把opts赋给fn，然后opts设为空对象
    fn = opts;
    opts = {};
  }
  // 判断第二个参数是否存在，不存在设置为空对象
  if (!opts) opts = {};

  // 检查对象中是否存在 prefix 属性： 没有设置默认值为 __jp
  var prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  // 定义一个 id，即函数名，将来使用 script 跨域之后在服务端执行的函数名称
  var id = opts.name || (prefix + (count++));

  // 判断对象中是否有参数，如果没有默认参数为 callback
  var param = opts.param || 'callback';
  // 判断对象中是否有延迟执行时间，如果没有默认延迟执行时间为 60 s
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  // js 中的转码方法: encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
  var enc = encodeURIComponent;
  // 得到文档的 script 标签，如果没有，取 head 标签
  var target = document.getElementsByTagName('script')[0] || document.head;
  // 定义 sciprt 用于跨域
  var script;
  // 定义 timer， 将来发送请求定时器
  var timer;

  // 判断是否有延迟执行时间
  if (timeout) {
    // 有的话，在这段时间之后执行
    timer = setTimeout(function(){
      // 清除之前的跨域痕迹
      cleanup();
      // 超时设置，如果响应超时，则原先添加的script标签，置window[id]为空对象，清除timer计时器，抛出错误
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  // 清除跨域痕迹
  function cleanup(){
    // 清除跨域的 script 标签
    if (script.parentNode) script.parentNode.removeChild(script);
    // 将跨域后执行的函数设置为空函数
    window[id] = noop;
    // 清除定时器
    if (timer) clearTimeout(timer);
  }

  // 清除痕迹、取消对jsonp模块的使用
  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }

  // 给 window 添加一个跨域之后的执行函数
  window[id] = function(data){
    // 输出 data 信息
    debug('jsonp got', data);
    // 清除跨域痕迹
    cleanup();
    // 执行回调函数 返回数据
    if (fn) fn(null, data);
  };

  // add qs component
  // 拼接请求的 url
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  // 清除 ?& 关键字
  url = url.replace('?&', '?');

  // 调试输出 url
  debug('jsonp req "%s"', url);

  // create script
  
  // 创建跨域脚本
  script = document.createElement('script');
  // 设置脚本路径
  script.src = url;
  // 将脚本添加到 head 中
  target.parentNode.insertBefore(script, target);

  // 清除 跨域痕迹
  return cancel;
}
```

## 7. 总结

+ jsonp 是一个单独处理跨域的第三方包

+ 使用方法为： 

  ```javascript
  /* 主要的函数，它有三个参数，可以只传两个参数，即省掉 opts
    1. url 请求地址的url
    2. opts {
        param 与后端约定请求的字段名称，默认是callback 
        prefix  指定回调函数params的回调句柄前缀，默认为__jp
        name 指定回调函数的句柄 默认是__jp+数字
        timeout 设定一个响应时间，默认为60000ms，如果在设定设计内没有响应，则会提交error
      }
    3. fn 请求事件的回调函数，负责接受data响应数据和请求失败的err信息
  */
  jsonp(url, opts, fn)
  ```
