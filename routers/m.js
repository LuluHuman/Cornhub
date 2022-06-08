module.exports = (tokenDB) => {
		const { requireFromDB, channels, getRaw, vids } = require("./../db.js")		
		const pathToVideoData = "/video/video-data/"
	
		const path = require("path")
		const fs = require("fs")
		const Cookies = require('cookies')
		const { Router } = require('express');
		const router = Router();
		router.get("/",(req,res) => {
        res.sendFile(path.join(__dirname + "./../Client/mHtml/index.html"))
		})

		router.get("/watch",async (req,res) => {	
					const vData = await requireFromDB(pathToVideoData + req.query.v + ".json")
					if (!vData) return res.sendFile(path.join(__dirname + "./../Client/404video.html"))
					const cookies = new Cookies(req, res)
					const CId = tokenDB.get(cookies.get("token"))
			
					if (vData.private && vData.VChannel != CId) return res.sendFile(path.join(__dirname + "./../Client/403video.html"))
			
					const header = this.formHeader(vData)
					const fileToSend = fs.readFileSync(path.join(__dirname,"./../Client/mHtml/watch.html"), { encoding: 'utf8', flag: 'r' });
					res.send(fileToSend.replace("<!-- $META-TAGS -->", header))
		})
		
		router.get("/c/*",async (req,res) => {
					const profile = !await requireFromDB("/profile/" + req.query.c + ".json")
					if (profile) return res.sendFile(path.join(__dirname + "./../Client/404.html"))
					
	        res.sendFile(path.join(__dirname + "./../Client/mHtml/c.html"))
		})

		router.get("/upload",(req,res) => {
				const cookies = new Cookies(req, res)
				const CId = tokenDB.get(cookies.get("token"))
				if(!CId) return res.redirect("https://cornhub.mason-bot.xyz/OAuth")
        res.sendFile(path.join(__dirname + "./../Client/mHtml/upload.html"))
		})
	
		return router
}

exports.formHeader = (vData) => {
	return `<head>
					<meta name="theme-color" content="#dd8844">
					<meta property="og:site_name" content="CornHub">
					<meta property="og:url" content="https://cornhub.mason-bot.xyz/watch?v=${vData.VId}">
					<meta property="og:title" content="${vData.VTitle}">
					<meta property="og:image" content="https://cornhub.mason-bot.xyz/getThumbnail?v=${vData.VId}">
					<meta property="og:image:width" content="480"/>
					<meta property="og:image:height" content="360"/>
					<meta property="og:description" content="${vData.VTitle} - CornHub">
					<meta property="og:type" content="video.other">
					<meta property="og:video:url" content="https://cornhub.mason-bot.xyz/embed?v=${vData.VId}">
					<meta property="og:video:secure_url" content="https://cornhub.mason-bot.xyz/embed?v=${vData.VId}">
					<meta property="og:video:type" content="text/html">
					<meta property="og:video:width" content="1280">
					<meta property="og:video:height" content="720">
					<meta property="og:updated_time" content="1652606441076">
					<meta property="fb:app_id" content="487691059200686">
					<meta name="twitter:card" content="player">
					<meta property="twitter:url" content="https://cornhub.mason-bot.xyz/watch?v=${vData.VId}">
					<meta property="twitter:title" content="${vData.VTitle}">
					<meta property="twitter:description" content="${vData.VTitle} - CornHub">
					<meta property="twitter:image" content="https://cornhub.mason-bot.xyz/getThumbnail?v=${vData.VId}">
					<meta property="twitter:player" content="https://cornhub.mason-bot.xyz/embed?v=${vData.VId}">
					<meta property="twitter:player:width" content="1280">
					<meta property="twitter:player:height" content="720">
					</head>`
}