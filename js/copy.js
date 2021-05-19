export default () => {
  function addCopy(e) {
    let txt = ""
    e.preventDefault() // 取消默认的复制事件
    const copyText = window.getSelection().toString()
    txt = `${copyText}\n作者：zhengqipeng\n原文：${window.location.href}\n著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`
    const clipboardData = e.clipboardData || window.clipboardData
    clipboardData.setData('text', txt)
  }
  document.addEventListener("cut", e => {
    addCopy(e)
  })
  document.addEventListener("copy", e => {
    addCopy(e)
  })
}
