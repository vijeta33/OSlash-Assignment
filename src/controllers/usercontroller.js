const userModel = require("../models/userModel.js")
const jwt = require('jsonwebtoken')


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } 
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const RegisterUser = async function (req, res) {
    try {
        let userdetails = req.body
        let userCreated = await userModel.create(userdetails)
        res.status(201).send({ status: true, data: userCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const login = async function (req, res) {


    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "enter a valid request body" });
        }

        const { email, password } = requestBody;

        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "enter an email" });
            return;
        }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "enter a password" });
            return;
        }

        if (!(password.length >= 8 && password.length <= 15)) {        
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
        }
        const user = await userModel.findOne({ email: email, password: password });  

        if (!user) {
            res.status(401).send({ status: false, msg: " Either email or password incorrect" });
            return;
        }

        const token = jwt.sign({
           userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 30
        }, 'login')

        res.header("x-api-key", token);
        
        res.status(201).send({ status: true, msg: "successful login", token: { token } });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}




module.exports.RegisterUser = RegisterUser
module.exports.login = login

