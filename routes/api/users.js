const router = require('express').Router();

const User = require("../../models/User.js");

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    users : users
  })
})

router.post('/register', async (req, res) => {
    const {
      name,
      email,
      avatar,
      phoneNo
    } = req.body;

    if (!email.includes("@student.nitw.ac.in") && !email.includes("@nitw.ac.in")) {
      return res.status(400).json({ errors: [{ msg: "Sign in through Institute Email" }] });
    }

    let user = await User.findOne({ name });
    if( user ){
      return res.status(400).json({ errors: [{ msg: "Organization Already Exists" }] });
    }

    user = await User.findOne({ email });
    if( user ){
      return res.status(400).json({ errors: [{ msg: "Organization Already Exists" }] });
    }

   user = new User({
      name,
      email,
      avatar,
      phoneNo
    });

    await user.save();
    return res.status(200).json({
      msg : "User created",
      user: user
    });
})

router.delete('/delete/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }

    await User.deleteOne({ _id : req.params.id });
    return res.status(200).json({ msg: "User Deleted successfully" });
})


module.exports = router;
