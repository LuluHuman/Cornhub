// Mobile Check
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace("/m" + window.location.pathname)
}
window.addEventListener("load", async function() {
    const profile = document.getElementById("profile")
		const thumbnailContainer = document.getElementById("thumbnail-container")
		const cId = document.location.pathname.replace("/c/","")
		try{
				var userData = await fetch("/getUser?c="+cId)
				userData = await userData.json()
		}
		catch(err){document.body.innerHTML = "<iframe src='/404.html' style='width: 100%;height: 100%;position: fixed;'>"}
		
		profile.children[0].src = userData.ChannelPicture
		profile.children[1].innerText = userData.ChannelName
		userData.PublishedVids.forEach(async VId => {
				var title = await fetch("/getTitle?v="+VId)
				title = await title.text()
        const AContainer = document.createElement("a")
        AContainer.style.flexDirection = "column"
        AContainer.href = "/watch?v=" + VId
        AContainer.style.alignItems = "flex-start"

        // thumbnail
        const thumbImg = document.createElement("img")
        thumbImg.src = "/getThumbnail?v=" + VId
        thumbImg.style.width = "290px"

        // title
        const text = document.createElement("font")
        text.innerText = title

        AContainer.appendChild(thumbImg)
        AContainer.appendChild(text)
        thumbnailContainer.appendChild(AContainer)
    });
})