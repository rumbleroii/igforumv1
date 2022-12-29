const router = require("express").Router();


// Modules
const User = require("../../models/User.js");


// Helper
const jwt = require("jsonwebtoken");

// const nodemailer = require('nodemailer');

router.post("/login", async (req, res) => {
  try {

    const { email } = req.body.data;

    if (
      !email.includes("@student.nitw.ac.in") &&
      !email.includes("@nitw.ac.in")
    ) {
      console.log("Wrong Email");
      return res.status(400).json({ msg: "Sign in through Institute Email" });
    }

    const instance = await User.findOne({ email });
    
    if (!instance) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Organization / User does not exists" }] });
    }

    const payload = {
      user: {
        id: instance.id,
        isOrganization: instance.isOrganization
      },
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ errors: [{ msg: "Server Error ( JWT )" }] });
        }
        return res.status(200).json({
          msg: "Token Created",
          accessToken: token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
