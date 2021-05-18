export default () => {
    let title;
    // 监听 on visibility change 事件
    document.addEventListener('visibilitychange', () => {
        const title1 = `去哪，等着你了..`
        const title2 = '终于回来了啊啊..'
        if (document.title !== title1 && document.title !== title2) title = document.title
        if (document.hidden) {
            document.title = title1
        } else {
            document.title = title2
            const timer = setTimeout(() => {
                document.title = title
                clearTimeout(timer)
            }, 1000)
        }
    })
}
