const urlModel = require("../models/urlModel")
const shortid = require('shortid');
const baseUrl = 'http://localhost:3000'
const validUrl = require('valid-url')


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } 
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}



const createlink = async function (req, res) {
    try {
        if (!(Object.keys(req.body).length > 0)) { // Checking Body is not Empty
            res.status(400).send("No Url Found")
        }

        //const longUrl = req.body.longUrl
        let userbody = req.body
        let { longUrl, description, tags } = userbody

        //validation start
        if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(longUrl)) {
            if (!/(.com|.org|.co.in|.in|.co|.us)/.test(longUrl))
                return res.status(400).send({ status: false, message: `This is not a valid Url` });
        }
        if (!(longUrl.includes('//'))) {
            return res.status(400).send({ status: false, msg: 'Invalid longUrl' })
        }


        //validation end

        if (validUrl.isUri(longUrl)) { //used  valid url package
            const shortCode = shortid.generate();
            let checkUrl = await urlModel.findOne({ longUrl: longUrl })
            if (checkUrl) {
                return res.send({ message: " You already created Short Url for this Long Url :", data: checkUrl })

            } else {
                const shortUrl = baseUrl + '/' + shortCode;
                const storedData = { longUrl, shortUrl, urlCode: shortCode, description, tags }
                let savedData = await urlModel.create(storedData)
                res.status(200).send({ status: true, data: savedData })
            }
        } else {
            return res.status(400).send({ status: false, message: "Invalid Long Url" })
        }
    } catch (err) {
        res.status(500).send(err.message);
    }

}

const redirectlink = async function (req, res) {
    try {
        let userId = req.params.userId
        let urlCode = req.params.urlCode
        const Findurl = await urlModel.findOne({ _id: userId,urlCode:urlCode})
        if (Findurl) {
            return res.status(302).redirect(Findurl.longlink)
        } else {
            return res.status(404).send({ msg: "No url found" })
        }
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err)
    }

}


const getlinkbysort = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query;

        if (validator.isValidRequestBody(queryParams)) {
            const {UserId, shortUrl, description, createddate } = queryParams;

            if (validator.isValid(UserId)) {
                filterQuery['UserId'] = UserId
            }

            if (validator.isValid(shortUrl)) {
                filterQuery['shortUrl'] = shortUrl
            }

            if (validator.isValid(description)) {
                filterQuery['description'] = description
            }

            if (validator.isValid(createddate)) {
                filterQuery['createddate'] = createddate
            }
        }

        const link = await urlModel.find(filterQuery)

        return res.status(200).send({ status: true, message: 'list', data: link })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const Deleteshortcurt = async function (req, res) {
        try {
            let User = await urlModel.findOne({ _id: req.params.userId, isDeleted: false })
            if(!User){
                res.status(404).send({status:false,message:"user does not exist"})
            }
            let userId = req.params.userId
                let checking = await UrlModel.findOneAndUpdate({ _id: userId}, { isDeleted: true, deletedAt: Date() })
                if (checking) {
                    res.status(200).send({status:true,msg:"user details found"})
                } else {
                    res.status(404).send({ status: false, msg: "Invalid userId" })
                }
            
        } catch (err) {
            res.status(500).send({ status: false, message: err.message })
        }
    }



module.exports.createlink = createlink
module.exports.redirectlink = redirectlink
module.exports.getlinkbysort = getlinkbysort
module.exports.Deleteshortcut = Deleteshortcut