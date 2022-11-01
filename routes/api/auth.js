const router = require('express').Router();

const Organization = require("../../models/Organization.js");
const User = require("../../models/User.js");

const jwt = require('jsonwebtoken');

const logger = require('../../logger');

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      isOrganization
    } = req.body;

    if (!email.includes("@student.nitw.ac.in") && !email.includes("@nitw.ac.in")) {
      return res.status(400).json({ error : { msg: "Sign in through Institute Email" } });
    }

    let instance = {};

    if(isOrganization){
      instance = await Organization.findOne({ email });
      logger.info("User is Organization");
    } else {
      instance = await User.findOne({ email });
      logger.info("User is not Organization");
    }

    if(!instance){
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user : {
        isOrganization : isOrganization,
        id : instance.id,
      }
    }

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn : 360000 }, (err, token) => {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          error : "Error during authentication ( JWT )"
        });
      }
       return res.status(200).json({
         msg:"Token Created", accessToken: token
       });
    })

  } catch ( err ) {
    logger.error(err);
    return res.status(500).json({
      error : "Server Error"
    })
  }
})

// Logout is frontend

module.exports = router;
