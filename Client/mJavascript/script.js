var userData
window.addEventListener("load", async function() {
		(async () => {
				userData = await fetch("/OAuth/validateToken")
				userData = await userData.json()
			
				const accountsCentre = document.getElementById("accounts-centre")
				if(!userData.ChannelId) return
		
				accountsCentre.innerHTML = `<img src="${userData.ChannelPicture}" style="width: 40px; border-radius: 100%;" onclick="openAccountPage()"></img>`
		})()
})

function openAccountPage(){
	document.getElementById("AccountPage").innerHTML = `
<div style="display: flex;position: fixed;z-index: 2;">
    <div style="position: fixed;height: 100%;width: 100%;background-color: #202020;bottom: 0;">
        <div style="height: 7%;border-bottom: 1px solid #000000;display: flex;align-items: center;font-size: 1.5em;">
		<span class="material-symbols-outlined" style="margin: 14px;" onclick="closeAccountPage()">close</span>Account</div>
        <div style=" border-bottom: 1px solid #ffffff1a; padding: 16px; display: flex; flex-direction: row; ">
            <img src=${userData.ChannelPicture} style="width: 30px; border-radius: 100%; margin-right: 16px; ">
            <b>${userData.ChannelName}</b>

        </div>
        <div style="margin-left: 16px;">
						<a href="/m/upload" style="position: absolute;top: 100px;right: 30px;background: #d84;border-radius: 100%;width: 4em;height: 4em;">
								<div class="acc-dd-col" style="padding: 20px;">
										<span class="material-symbols-outlined">
												upload
										</span>
								</div>
						</a>
            <a href="/m/c/${userData.ChannelId}">
                <div class="acc-dd-col">
                    <span class="material-symbols-outlined" style="margin-right: 1em;">account_box</span> Your Channel
                </div>
            </a>
            <a href="/OAuth/signout">
                <div class="acc-dd-col">
                    <span class="material-symbols-outlined" style="margin-right: 1em;">login</span>Sign Out
                </div>
            </a>
        </div>
    </div>
</div>
`
}

function closeAccountPage(){
	document.getElementById("AccountPage").innerHTML = ""
}