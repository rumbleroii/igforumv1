const router = require('express').Router();

const auth = require("../../middleware/auth");

// User profile
router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar', 'phoneNo']);
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        return res.status(200).json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get profile
router.get('/:id', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.param.id }).populate('user', ['name', 'avatar', 'phoneNo']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        return res.status(200).json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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
      linkedin,
      githubusername,
    } = req.body;


    let profileFields = {};

    if(firstname) profileFields.firstname = firstname;
    if(lastname) profileFields.lastname = lastname;
    if(degree) profileFields.degree = degree;
    if(branch) profileFields.branch = branch;
    if(year) profileFields.year = year;
    if(rollno) profileFields.rollno = rollno;
    if(regno) profileFields.regno = regno;
    if(hostel) profileFields.hostel = hostel;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(githubusername) profileFields.githubusername = githubusername;

    try {
      let profile = await Profile.findOne({user: req.body.id})

      if(profile){
          // Update Profile
          profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, { new: true })
          return res.json(profile)
      } else {
          profile = new Profile(profileFields);
      }

      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
})

// Remove Profile
router.delete('/', auth, async (req,res) => {
    try {

        await Profile.findOneAndRemove({ user: req.user.id })
        return res.status(200).json({msg: 'User deleted'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;
