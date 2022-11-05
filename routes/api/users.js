const router = require('express').Router();

const User = require("../../models/User.js");
const Profile = require("../../models/Profile.js");

const upload = require('../../config/imageUploader.js');

const orgauth = require("../../middleware/orgauth");

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
      return res.status(400).json({ errors: [{ msg: "User Already Exists" }] });
    }

    user = await User.findOne({ email });
    if( user ){
      return res.status(400).json({ errors: [{ msg: "User Already Exists" }] });
    }

    user = await User.findOne({ phoneNo });
    if( user ){
        return res.status(400).json({ errors: [{ msg: "Phone No Already Exists" }] });
    }

    try {
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
    } catch ( err ){
      console.log(err);
    }
})

router.delete('/delete/:id', orgauth, async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }

    await User.deleteOne({ _id : req.params.id });
    await Profile.remove(user);
    return res.status(200).json({ msg: "User Deleted successfully" });
})


router.post('/upload', upload.single('image'), async (req, res) => {
  return res.status(200).json({ msg: "File Uploaded", path : req.file.path });
})

module.exports = router;
