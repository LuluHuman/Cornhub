// Mobile Check
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace("/" + window.location.search)
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
        AContainer.style.marginBottom = "50px"
            // thumbnail
        const thumbImg = document.createElement("img")
        thumbImg.src = "/getThumbnail?v=" + VData.VId
        thumbImg.style.width = "100%"


        // title
        const text = document.createElement("font")
        text.innerText = VData.VTitle

        AContainer.appendChild(thumbImg)
        AContainer.appendChild(text)
        thumbnailContainer.appendChild(AContainer)
    });
})