const router = require('express').Router();

const orgauth = require("../../middleware/orgauth");

router.get('/', orgauth, async(req, res) => {
    return res.status(200).json({
        msg: "Token Verified"
    })
})

module.exports = router;