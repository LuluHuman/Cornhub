module.exports = (tokenDB) => {
    const { requireFromDB, channels } = require("./../db.js")
    const { google } = require('googleapis');
    const { scopes, secrets } = require("./../google_OAuth/mainDat.json")
    const oauth2Client = new google.auth.OAuth2(secrets[0], secrets[1], secrets[2]);;
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    const path = require("path")
    const fs = require("fs")
    const { Router } = require('express');
    const bodyParser = require('body-parser')
    const people = google.people('v1');
    const Cookies = require('cookies')

    const router = Router();
    google.options({ auth: oauth2Client });
    router.use(bodyParser.json())


    router.get("/", (req, res) => {
        res.redirect(authorizeUrl)
    })

    router.get("/callback", async(req, res) => {
        if (!req.query) return res.sendCode(400)
        const { tokens } = await oauth2Client.getToken(req.query.code)
        oauth2Client.credentials = tokens;
        var UserInfo = await people.people.get({
            resourceName: 'people/me',
            personFields: 'photos,emailAddresses,names',
        });
        UserInfo = UserInfo.data
        var cookies = new Cookies(req, res)
        const token = this.makeToken()


        const time = Date.now() + (10 * 365 * 24 * 60 * 60)
        cookies.set('token', token, { httpOnly: false, expires: new Date(time) })
        var i = 0
        const channelsli = await channels()
        channelsli.forEach(async(channel) => {
            channel = await requireFromDB("/profile/" + channel)
            if (channel) {
                if (channel.OwnerEmail == UserInfo.emailAddresses[0].value) {
                    tokenDB.set(token, channel.ChannelId)
                    return
                } else {
                    i++
                }
            }
        })
        if (i == channelsli.length) {
            const ChannelId = this.makeId()
            require("./../db.js").addProfile(ChannelId, UserInfo)
            tokenDB.set(token, ChannelId)
        }
        res.redirect("/");
    })

    router.get("/validateToken", async(req, res) => {
        var cookies = new Cookies(req, res)
        const CId = tokenDB.get(cookies.get("token"))
        const UserData = await requireFromDB("/profile/" + CId + ".json")

        res.send(UserData)
    })
    router.get("/signout", (req, res) => {
        var cookies = new Cookies(req, res);
        delete tokenDB[cookies.get('token', { signed: true })]
        cookies.set('token', "LAMBSAUCE", { expires: new Date(Date.now()) });
        res.redirect('/');
    })
    return router
}

exports.makeToken = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    var charactersLength = characters.length;
    for (var i = 0; i < 30; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeId = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    var charactersLength = characters.length;
    for (var i = 0; i < 24; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}