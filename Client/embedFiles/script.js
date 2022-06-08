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


    player.controls = false;

    var md = await fetch("/md?v=" + v)
    md = await md.json()

    document.getElementById("ctitle").children[0].innerText = md.VTitle
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
    }

    player.onended = () => {
        paused = true
        document.getElementById("player_controls").style.opacity = 1
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

    player.wrapper.onmouseenter = () => {
        document.getElementById("player_controls").style.opacity = 1
    }

    player.wrapper.onmouseleave = () => {
        if (paused) return
        document.getElementById("player_controls").style.opacity = 0
    }
    document.getElementById("ch-prog-hover").onmouseenter = () => {
        document.getElementById("progress-marker").style.width = "1vw"
        document.getElementById("progress-marker").style.height = "1vw"
    }
    document.getElementById("ch-prog-hover").onmouseleave = () => {
        document.getElementById("progress-marker").style.width = "0vw"
        document.getElementById("progress-marker").style.height = "0vw"

        pauseUpdateProg = false
        changet.style.width = (player.currentTime / player.duration) * 100 + "% "
    }
    document.getElementById("ch-prog-hover").onmousemove = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        changet.style.width = x + "px"
        pauseUpdateProg = true
    }
    document.getElementById("ch-prog-hover").onmouseup = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        player.pause()
        player.currentTime = player.duration * (x / rect.width)
        console.log(x / rect.width)
        if (!paused) player.play()
    }

    // -Mouse on Volume Events
    document.getElementById("vol_ctrl").onmouseenter = () => {
        const volume = document.getElementById("change_vol")
        volume.style.display = "block"
    }

    document.getElementById("vol_ctrl").onmouseleave = () => {
        setTimeout(() => {
            const volume = document.getElementById("change_vol")
            volume.style.display = "none"
        }, 100);
    }
});


document.onkeydown = function(event) {
    // console.log(event.keyCode)
		const reverse = [9,8,7,6,5,4,3,2,1,0]
		if(event.keyCode >= 48 && event.keyCode <= 57){
			player.currentTime = player.duration * ( ( reverse[57 -event.keyCode] * 10) / 100)
			console.log()
		}
    switch (event.keyCode) {
        case 32:
            event.preventDefault();
            toggleVid()
            break;
        case 75:
            event.preventDefault();
            toggleVid()
            break;
        case 70:
            fullscreen()
            break;
        case 77:
            toggleMute()
            break;
    }
};


var fs = false

function fullscreen() {
    const wrapper = document.getElementById("player_wrapper")
    if (!fs) {
        fs = true
        wrapper.requestFullscreen()
    } else {
        fs = false
        document.exitFullscreen();
    }
}

function startplayer() {
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
        document.getElementById("player_controls").style.opacity = 1
    }
}

function change_vol() {
    player.volume = document.getElementById("change_vol").value;
    if (document.getElementById("change_vol").value == 0) {
        document.getElementById("vol_img").innerHTML = "volume_off"
    } else {
        document.getElementById("vol_img").innerHTML = "volume_up"
    }
}

function toggleMute() {
    if (player.volume > 0) {
        player.volume = 0
        document.getElementById("change_vol").value = 0
        document.getElementById("vol_img").innerText = "volume_off"
    } else {
        player.volume = 1
        document.getElementById("change_vol").value = 1
        document.getElementById("vol_img").innerText = "volume_up"
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