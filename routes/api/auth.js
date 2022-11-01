const router = require('express').Router();

const Organization = require("../../models/Organization.js");
const User = require("../../models/User.js");

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const {
    email,
    isOrganization
  } = req.body;

  if (!email.includes("@student.nitw.ac.in") && !email.includes("@nitw.ac.in")) {
    return res.status(400).json({ errors: [{ msg: "Sign in through Institute Email" }] });
  }

  let instance = {};

  if(isOrganization){
    instance = await Organization.findOne({ email });
    console.log("ler");
  } else {
    instance = await User.findOne({ email });
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
    if (err) throw err;
    res.status(200).json({ msg:"Token Created", token });
  })
})

// Logout is frontend

module.exports = router;
