const router = require("express").Router();

const Organization = require("../../models/Organization.js");
const User = require("../../models/User.js");

const jwt = require("jsonwebtoken");

// const OrganizationList = [
//   "ig-nitw@student.nitw.ac.in",
//   "csea@student.nitw.ac.in"
// ]

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body.toLowerCase();

    if (
      !email.includes("@student.nitw.ac.in") &&
      !email.includes("@nitw.ac.in")
    ) {
      console.log("Wrong Email");
      return res.status(400).json({ msg: "Sign in through Institute Email" });
    }

    let instance = {};
    let isOrganization = false;

    instance = await Organization.findOne({ email });
    if (instance) {
      isOrganization = true;
    } else if (!isOrganization && !instance) {
      instance = await User.findOne({ email });
    }

    if (!instance) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Organization / User does not exists" }] });
    }

    const payload = {
      user: {
        isOrganization: isOrganization,
        id: instance.id,
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

// Logout is frontend

module.exports = router;
