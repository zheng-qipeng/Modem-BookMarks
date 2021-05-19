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
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = "/modem-bookmarks/js/canvas-nest.js"
        // script.setAttribute('color', '0,0,0')
        script.setAttribute('opacity', '0.7')
        script.setAttribute('zIndex', '10')
        script.setAttribute('count', '18')
        document.body.appendChild(script)
        setTimeout(function () {
            document.getElementsByTagName('canvas')[document.getElementsByTagName('canvas').length - 1].style.pointerEvents = 'none'
        }, 1000)
    }
}
