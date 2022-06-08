if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace("/m")
    console.log(true)
}
window.addEventListener("load", async function() {
    const thumbnailContainer = document.getElementById("thumbnail-container")

    var videos = await fetch("/getVids")
    videos = await videos.json()

    videos.forEach(async VData => {
        const AContainer = document.createElement("a")
        AContainer.style.flexDirection = "column"
        AContainer.href = "/watch?v=" + VData.VId
        AContainer.style.alignItems = "flex-start"

        // thumbnail
        const thumbImg = document.createElement("img")
        thumbImg.src = "/getThumbnail?v=" + VData.VId
        thumbImg.style.width = "290px"

        // title
        const text = document.createElement("font")
        text.innerText = VData.VTitle

        AContainer.appendChild(thumbImg)
        AContainer.appendChild(text)
        thumbnailContainer.appendChild(AContainer)
    });
})