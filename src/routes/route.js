const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const userController =require("../controllers/usercontroller")
const commonMw = require("../middleware/commonmw")
const linkController =require("../controllers/linkcontroller")






router.post('/users', userController.RegisterUser)
router.post('/login', userController.login)
router.post('/link', linkController.createlink )
router.get('/:userId/:urlCode',linkController.redirectlink)
router.get('/getlink',linkController.getlinkbysort)
//router.delete('/users/:userId', commonMw.authenticate, linkController.Deleteshortcut)







module.exports = router;