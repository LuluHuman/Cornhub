// Mobile Check
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace("/watch" + window.location.search)
}
// Varables
var paused = false
var pauseUpdateProg = false
var url = window.location.pathname
var v = document.URL.split(url)[1].replace("? ", " ").split("=")[1]
var player, button, source, changet

// When Load
window.addEventListener("load", async function() {
    // Varable asignment
    player = document.getElementById("video_player")
    button = document.getElementById("play_button")
    source = document.createElement("source")
    changet = document.getElementById("primary-bar")
    source.src = "/raw?v=" + v
    player.appendChild(source)

    player.wrapper = document.getElementById("player_wrapper")
    player.controls = document.getElementById("player_controls")

    var md = await fetch("/md?v=" + v)
    md = await md.json()

    document.title = md.VTitle + " | CornHub"
    document.getElementById("title").innerText = md.VTitle
    document.getElementById("ctitle").children[0].innerText = md.VTitle
	
    var uploader = await fetch("/getUser?c=" + md.VChannel)
    uploader = await uploader.json()
		document.getElementById("uploader").href = "/c/" + uploader.ChannelId
		document.getElementById("uploader").children[0].src = uploader.ChannelPicture
		document.getElementById("uploader").children[1].innerText =  uploader.ChannelName

	
		if(md.private){
			const tagDiv = document.createElement("div")
			tagDiv.style.display = "flex"
			tagDiv.style.alignItems  = "center"
			tagDiv.style.backgroundColor = "#303030"
			tagDiv.style.width = "fit-content"
			tagDiv.style.padding = "2px 6px"
			const span = document.createElement("span")
			span.className = "material-symbols-outlined"
			span.innerText = "lock"
			
			const spanText = document.createElement("span")
			spanText.innerText = "Private"
			
			tagDiv.appendChild(span)
			tagDiv.appendChild(spanText)
			document.getElementById("title").appendChild(tagDiv)
		}
    startplayer();

    // Events
    // -Player events
    player.onplay = () => {
        button.innerText = "pause"
				button.style.fontVariationSettings = '\'FILL\' 0'
    };

    player.onpause = () => {
        button.innerText = "play_arrow"
				button.style.fontVariationSettings = '\'FILL\' 1'
				setTimeout(()=>{
	        if (paused) return
	        document.getElementById("player_controls").style.opacity = 0
				},2000)
    }

    player.onended = () => {
        player.controls.style.opacity = 1
    }

    player.ontimeupdate = () => {
        var ScurrentTime = parseInt(player.currentTime.toString().split(".")[0])
        var McurrentTime = 0
        var Sduration = parseInt(player.duration.toString().split(".")[0])
        var Mduration = 0

        McurrentTime = Math.round(ScurrentTime / 60)
        Mduration = Math.round(Sduration / 60)
        ScurrentTime = ScurrentTime % 60
        Sduration = Sduration % 60

        if (ScurrentTime < 10) {
            ScurrentTime = "0" + ScurrentTime
        }
        if (Sduration < 10) {
            Sduration = "0" + Sduration
        }
        if (!pauseUpdateProg) {
            changet.style.width = (player.currentTime / player.duration) * 100 + "% "
        }
        document.getElementsByTagName("font")[0].innerText = `${McurrentTime}:${ScurrentTime} / ${Mduration}:${Sduration}`
    }

		const chPH = document.getElementById("ch-prog-hover")
    chPH.onmouseleave = () => {
        pauseUpdateProg = false
        changet.style.width = (player.currentTime / player.duration) * 100 + "% "
    }
    chPH.onmousemove = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        changet.style.width = x + "px"
        pauseUpdateProg = true
    }
    chPH.onmouseup = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        player.pause()
        player.currentTime = player.duration * (x / rect.width)
        console.log(x / rect.width)
        if (!paused) player.play()
    }
});

var fs = false
function fullscreen() {
    const wrapper = document.getElementById("wrapper")
    if (!fs) {
        fs = true
				document.getElementById("vid-info").style.display = "none"
				document.getElementById("ctitle").style.display = "block"
        wrapper.requestFullscreen()
    } else {
        fs = false
        document.exitFullscreen();
				document.getElementById("vid-info").style.display = "block"
				document.getElementById("ctitle").style.display = "none"
    }
}

function startplayer() {
    player.controls = false;
    player.play().catch((err) => {
        paused = true
    })
}

function toggleVid() {
    if (paused == true) {
        paused = false
        player.play()
    } else {
        paused = true
        player.pause()
    }
}

function showCont() {
	if (document.getElementById("player_controls").style.opacity == 0){
			 document.getElementById("player_controls").style.opacity = 1
	}else{
			 document.getElementById("player_controls").style.opacity = 0
	}
}

var checkInterval  = 50.0
var lastPlayPos    = 0
var currentPlayPos = 0
var rotate = 0
var bufferingDetected = false

setInterval(checkBuffering, checkInterval)
function checkBuffering() {
		var player = document.getElementById("video_player")
		var bufferShow = document.getElementById("bufferShow")
    currentPlayPos = player.currentTime

    var offset = (checkInterval - 20) / 1000

    // if no buffering is currently detected,
    // and the position does not seem to increase
    // and the player isn't manually paused...
    if (currentPlayPos < (lastPlayPos + offset)) {
				rotate += 5
				bufferShow.children[0].style.transform = `rotate(${rotate}deg)`
				if(!player.paused){
						bufferShow.style.display = "flex"
		        bufferingDetected = true
				}
    }

    // if we were buffering but the player has advanced,
    // then there is no buffering
    if (bufferingDetected && currentPlayPos > (lastPlayPos + offset) && !player.paused) {
				bufferShow.style.display = "none"
				bufferShow.children[0].style.transform = `rotate(0deg)`
        bufferingDetected = false
    }
    lastPlayPos = currentPlayPos
}