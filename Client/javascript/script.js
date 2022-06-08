console.log(`
███  █████  ███████ ███ 
██  ██   ██ ██       ██ 
██  ███████ ███████  ██ 
██  ██   ██      ██  ██ 
███ ██   ██ ███████ ███ 
`)

function menuButtonClick() {
    const sideBar = document.getElementById("side-bar")
    if (sideBar.style.display == "none") {
        sideBar.style.display = "block"
    } else {
        sideBar.style.display = "none"
    }
}

(async () => {
		var userData = await fetch("/OAuth/validateToken")
		userData = await userData.json()

		const accountsCentre = document.getElementById("accounts-centre")
		if(!userData.ChannelId) return

		accountsCentre.innerHTML = `
						<a style="margin-right: inherit;" href="/upload">
								<span class="material-symbols-outlined" title="Upload video">
								upload
								</span>
						</a>
						<img src="${userData.ChannelPicture}" style="width: 30px; border-radius: 100%; cursor:pointer;" onclick="toggleAccDrop()" title="Profile">
						<div id="account-dropdown" style="border-bottom: 1px solid #ffffff1a;padding: 16px;flex-direction: column;background: #202020;position: absolute;top: 4vw;right: 2vw;z-index: 1; display: none;">
						    <div style=" border-bottom: 1px solid #ffffff1a; padding: 16px; display: flex; flex-direction: row; ">
						        <img src="${userData.ChannelPicture}" style="width: 30px; border-radius: 100%; margin-right: 16px; ">
						        <b>
						            ${userData.ChannelName}
						        </b>
						    </div>
								<div>
										<a href="/c/${userData.ChannelId}">
													<div class="acc-dd-col">
															<span class="material-symbols-outlined">account_box</span> Your Channel
													</div>
										</a>
										<a href="/OAuth/signout">
													<div class="acc-dd-col">
															<span class="material-symbols-outlined">login</span>Sign Out
													</div>
										</a>
								</div>
						</div>
`
})()

function toggleAccDrop() {
	const doc = document.getElementById("account-dropdown")

	if(doc.style.display == "none"){
		doc.style.display = "flex"
	}else{
		doc.style.display = "none"
	}
}