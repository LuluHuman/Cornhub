// Mobile Check
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace("/m/upload")
}

var file = null

window.addEventListener("load", async function() {
		document.getElementById("public").checked = true
		document.querySelector('input[type="file"]').addEventListener('change', function() {
				if (this.files && this.files[0]) {
					if (!this.files[0].type.includes("video")) return document.getElementById("titleH4").style.display = "block"
					file = this.files[0]
					document.getElementById("upload").removeAttribute("disabled")
					document.getElementById("title").value = this.files[0].name
				}
		});
})
function upload(){
				const arrow = document.getElementById("arrow")
				arrow.children[0].style.borderLeftWidth = "15px"
				arrow.children[1].style.width = "15px"
				setTimeout(()=>{
						arrow.children[0].style.borderLeftWidth = "35px"
						arrow.children[1].style.width = "35px"
						arrow.style.left = "37%"
				},500)
				const formData = new FormData()
				formData.append('file1', file)

				const private = document.getElementById("private").checked
				const title = document.getElementById("title").value
				fetch(`/upload?title=${title}&private=${private}`, {
						method: "POST",
						body: formData
				}).then(async res => {
						arrow.children[0].style.borderLeftWidth = "21px"
						arrow.children[1].style.width = "21px"
						arrow.style.left = "75%"
						console.log("Request complete! response:", res);
						const id = await res.text()
						setTimeout(()=>{
							window.location.href = "https://cornhub.mason-bot.xyz/watch?v="+id
						},100)
				});
}