export default () => {
    // console.log(window.screen.width * window.devicePixelRatio)
    function IsPC () {
        let userAgentInfo = navigator.userAgent
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
        let flag = true
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false
                break
            }
        }
        return flag
    }
    if (IsPC()) {
        // 异步加载，避免编译报错
        import("canvas-nest.js").then(({default: CanvasNest}) => {
            new CanvasNest(document.body, {
                color: '0,0,0',
                pointColor: '0,0,0',
                opacity: '0.8',
                count: 18,
                zIndex: 10,
            })
            document.body.style.height = '100vh'
        })
    }
}
