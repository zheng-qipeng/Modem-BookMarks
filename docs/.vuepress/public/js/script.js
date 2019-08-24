
window.onload = function () {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = "../js/canvas-nest.js"
  // script.setAttribute('color', '0,0,0')
  script.setAttribute('opacity', '0.7')
  script.setAttribute('zIndex', '10')
  script.setAttribute('count', '18')
  document.body.appendChild(script)
  setTimeout(function () {
    document.getElementsByTagName('canvas')[0].style.pointerEvents = 'none'
  }, 666)
}