// Mobile Check
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace((window.location.pathname).replace("m/",""))
	console.log(true)
}
window.addEventListener("load", async function() {
    const profile = document.getElementById("profile")
		const thumbnailContainer = document.getElementById("thumbnail-container")
		const cId = document.location.pathname.replace("/m/c/","")
		try{
				var userData = await fetch("/getUser?c="+cId)
				userData = await userData.json()
		}
		catch(err){document.body.innerHTML = "<iframe src='/404.html' style='width: 100%;height: 100%;position: fixed;'>"}
		
		profile.children[0].src = userData.ChannelPicture
		profile.children[1].innerText = userData.ChannelName
		userData.PublishedVids.forEach(async VId => {
			//
				var title = await fetch("/getTitle?v="+VId)
				title = await title.text()
			
        const vidElement = document.createElement("div")
				vidElement.style.display = "flex"
			//
        const ThumbnailRedirect = document.createElement("a")
				ThumbnailRedirect.href = "/m/watch?v=" + VId
				ThumbnailRedirect.style.margin = "1em"
				
        const thumbImg = document.createElement("img")
        thumbImg.src = "/getThumbnail?v=" + VId
        thumbImg.style.width = "130px"

				const titleDiv =  document.createElement("div")

        const TitleRedirect = document.createElement("a")
				TitleRedirect.href = "/m/watch?v=" + VId

        const titleElement = document.createElement("h4")
				titleElement.style.width = '160px'
				titleElement.innerText = title
				
				vidElement.appendChild(ThumbnailRedirect)			
				ThumbnailRedirect.appendChild(thumbImg)
				vidElement.appendChild(titleDiv)
				titleDiv.appendChild(TitleRedirect)
				TitleRedirect.appendChild(titleElement)
        thumbnailContainer.appendChild(vidElement)
    });
})

