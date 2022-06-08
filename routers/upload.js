module.exports = (tokenDB) => {
	
		const path = require("path")
		const fs = require("fs")
		const Cookies = require('cookies')
		const { Router } = require('express');
		const multer = require("multer");
		const router = Router();

		var storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, path.join(__dirname, "./../upload_cache"))
			},
			filename: function (req, file, cb) {
				cb(null, req.query.title+path.extname(file.originalname))
			}
		})
		var upload = multer({ storage: storage })
	
		router.get("/",(req,res) => {
				const cookies = new Cookies(req, res)
				const CId = tokenDB.get(cookies.get("token"))
				if(!CId) return res.redirect("https://cornhub.mason-bot.xyz/OAuth")
        res.sendFile(path.join(__dirname + "./../Client/html/upload.html"))
		})
		router.post(
			"/",
			upload.single("file1" /* name attribute of <file> element in your form */),
			async (req, res) => {
				const cookies = new Cookies(req, res)
				const CId = tokenDB.get(cookies.get("token"))
				const id = await require("./../upload.js")(CId,req.query.private)
				console.log(CId)
		
					res
						.status(200)
						.contentType("text/plain")
						.end(id);
			}
		);

	return router
}