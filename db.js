const axios = require("axios")
exports.channels = async() => {
    const data = await axios.get("https://cornhubcdn.felicity1l1.repl.co/channels")
        .catch(error => {
            debugger
            if (error.status == 404) {
                return undefined
            }
        })
    return data.data
}
exports.vids = async() => {
    const data = await axios.get("https://cornhubcdn.felicity1l1.repl.co/vids")
    return data.data
}
exports.requireFromDB = async(path) => {
    try {
        const data = await axios.get("https://cornhubcdn.felicity1l1.repl.co" + path)
            .catch(error => {
                debugger
                if (error.status == 404) {
                    return undefined
                }
            })

        if (!data) return undefined
        return data.data
    } catch (err) {
        console.log(err)
    }
}

exports.addProfile = (ChannelId, UserInfo) => {
    axios.post(`https://cornhubcdn.felicity1l1.repl.co/vids?id=${ChannelId}&name=${UserInfo.names[0].unstructuredName}&pfp=${UserInfo.photos[0].url}&email=${UserInfo.photos[0].url}`)
}