const router = require('express').Router();


// Models
const Profile = require('../../models/Profile');


// Helper
const auth = require("../../middleware/auth");


// User profile
router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar', 'phoneNo']);
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        
        return res.status(200).json(profile);

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
});

// Get profile
router.get('/:id', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar', 'phoneNo']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        return res.status(200).json(profile);

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
});

// Update or Create Profile
router.post('/', auth, async (req, res) => {
    const {
      firstname,
      lastname,
      degree,
      branch,
      year,
      rollno,
      regno,
      hostel,
      linkedinusername,
      githubusername,
    } = req.body.data;


    let profileFields = {};

    profileFields.user = req.user.id;

    if(firstname) profileFields.firstname = firstname;
    if(lastname) profileFields.lastname = lastname;
    if(degree) profileFields.degree = degree;
    if(branch) profileFields.branch = branch;
    if(year) profileFields.year = year;
    if(rollno) profileFields.rollno = rollno;
    if(regno) profileFields.regno = regno;
    if(hostel) profileFields.hostel = hostel;
    if(linkedinusername) profileFields.linkedinusername = linkedinusername;
    if(githubusername) profileFields.githubusername = githubusername;

    try {
      let profile = await Profile.findOne({ user: req.user.id })


      if(profile !== null){
          // Update Profile
          profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, { new: true })
          await profile.save();
          return res.status(200).json({ msg: "Profile Updated", profile: profile });

      } else {
          profile = new Profile(profileFields);
      }

      await profile.save();
      return res.status(200).json({ msg: "Profile Created", profile: profile });
    } catch (err) {
      console.error(err.message)
      return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
})

// Remove Profile
router.delete('/', auth, async (req,res) => {
    try {

        await Profile.findOneAndRemove({ user: req.user.id })
        return res.status(200).json({msg: 'User Profile deleted'});

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
})

module.exports = router;
