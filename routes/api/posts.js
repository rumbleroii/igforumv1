const router = require("express").Router();

const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

let baseDirCsv = path.join(__dirname, "/../../csv/");
let baseDirImages = path.join(__dirname, "../../images/");

const orgauth = require("../../middleware/orgauth");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Organization = require("../../models/Organization");
const Profile = require("../../models/Profile");

const upload = require("../../config/imageUploader.js");

const confirmMail = require("../../config/confirmMail.js");

// Get Post Timeline
router.get("/", orgauth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort("-date");

    if (!posts) {
      return res.status(403).json({
        msg: "No Posts",
      });
    } else {
      let postObj = [];

      for (var i = 0; i < posts.length; i++) {
        let {
          organization,
          title,
          body,
          img,
          likes,
          updated,
          id,
          registrants,
          deadline,
          waLink,
          venue,
          date,
        } = posts[i];

        organization = await Organization.findById(organization.toString());

        const instance = {
          organization: organization.name,
          title: title,
          body: body,
          img: img,
          likes: likes.length,
          updated: updated,
          _id: id,
          registrants: registrants.length,
          waLink: waLink,
          deadline: deadline,
          venue: venue,
          date: date,
        };

        postObj.push(instance);
      }
    }

    return res.status(200).json(postObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// Get Post Per Organization ( Client )
router.get("/org", orgauth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort("-date");

    if (!posts) {
      return res.status(403).json({
        msg: "No Posts",
      });
    } else {
      let postObj = [];

      for (var i = 0; i < posts.length; i++) {
        let {
          organization,
          title,
          body,
          img,
          likes,
          updated,
          id,
          registrants,
          deadline,
          waLink,
          venue,
          date,
        } = posts[i];

        if (organization.toString() === req.user.id) {
          organization = await Organization.findById(organization.toString());

          const instance = {
            organization: organization.name,
            title: title,
            body: body,
            img: img,
            likes: likes.length,
            updated: updated,
            _id: id,
            registrants: registrants.length,
            waLink: waLink,
            deadline: deadline,
            venue: venue,
            date: date,
          };

          postObj.push(instance);
        }
      }

      return res.status(200).json(postObj);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// Create Post
router.post("/", orgauth, upload.single("image"), async (req, res) => {
  const { title, body, deadline, waLink, venue, date } = JSON.parse(
    req.body.postDetails
  );

  let picPath;

  if (req.file) {
    picPath = "images/" + req.file.filename;
  } else {
    picPath = null;
  }

  const postField = {};

  postField.organization = req.user.id;
  if (title) postField.title = title;
  if (body) postField.body = body;
  if (picPath) postField.img = picPath;
  if (deadline) postField.deadline = deadline;
  if (waLink) postField.waLink = waLink;
  if (venue) postField.venue = venue;
  if (date) postField.date = date;

  console.log(date);

  // Creating Post
  const newPost = new Post(postField);
  try {
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// Update Post
router.put("/:id", orgauth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.organization.toString() !== req.user.id) {
      return res.status(400).json({ errors: "Not Authorized to edit" });
    }

    const { title, body, deadline, waLink, venue, date } = JSON.parse(
      req.body.postDetails
    );

    if (req.file) {
      picPath = "images/" + req.file.filename;
    } else {
      picPath = null;
    }
    const postUpdated = post;

    if (title) postUpdated.title = title;
    if (body) postUpdated.body = body;
    if (picPath) postUpdated.picPath = picPath;
    if (deadline) postUpdated.deadline = deadline;
    if (waLink) postUpdated.waLink = waLink;
    if (venue) postUpdated.venue = venue;
    if (date) postUpdated.date = date;

    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: {
          title: postUpdated.title,
          body: postUpdated.body,
          img: postUpdated.picPath,
          deadline: postUpdated.deadline,
          venue: postUpdated.venue,
          date: postUpdated.date,
          updated: true,
        },
      });

      return res.status(200).json({ msg: "Post Edited" });
    } else {
      return res.status(403).json({ msg: "You can only update posts by you" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
});

// Delete Post
router.delete("/:id", orgauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.organization.toString() !== req.user.id) {
      return res.status(400).json({ errors: "Not Authorized to delete" });
    }

    if (post.userId === req.body.userId) {
      await post.deleteOne({ _id: req.params.id });
      return res.status(200).json({ msg: "Post Deleted" });
    } else {
      return res.status(403).json({ msg: "Error During Deleting Post" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// Like and Dislike
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json({ msg: "The post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json({ msg: "The post has been disliked" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Register for event
router.put("/register/:id", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  let registrant = false;

  // checking is registerant is present

  if (post.registrants) {
    for (var i = 0; i < post.registrants.length; i++) {
      if (post.registrants[i].user.toString() === req.user.id) {
        registrant = true;
        break;
      }
    }
  }

  const user = await User.findById(req.user.id);

  if (!registrant) {
    await post.updateOne({ $push: { registrants: { user: user } } });
    const savedPost = await post.save();

    // Send Mail
    try {
      confirmMail(user.email, post)
        .then(() => {
          res
            .status(200)
            .json({ msg: "Registered for event", post: savedPost });
        })
        .catch((err) => {
          res.status(200).json({ msg: err });
        });
    } catch (err) {
      res.status(500).json({ msg: "Error Sending Email" });
    }
  } else {
    await post.updateOne({ $pull: { registrants: { user: user } } });
    const savedPost = await post.save();
    res.status(200).json({ msg: "Unregistered for event", post: savedPost });
  }
});

// Registerants of the event
router.get("/registrants/:id", orgauth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (post.organization.toString() !== req.user.id) {
    return res.status(400).json({ errors: "Not Authorized to view" });
  }

  let registrants = [];

  for (var i = 0; i < post.registrants.length; i++) {
    const user = await User.findById(post.registrants[i].user._id.toString());
    registrants.push(user);
  }

  res.status(200).json({ registrants: registrants });
});

// Download CSV
router.get("/download/:id", orgauth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (post.organization.toString() !== req.user.id) {
    return res.status(400).json({ errors: "Not Authorized to download" });
  }

  let registrants = [];

  for (var i = 0; i < post.registrants.length; i++) {
    const user = await User.findById(post.registrants[i].user._id.toString());
    const profile = await Profile.findOne({ user: user }).populate("user", [
      "name",
      "avatar",
      "phoneNo",
    ]);

    let name,
      email,
      phoneNo,
      firstname,
      lastname,
      rollno,
      regno,
      degree,
      branch,
      year;
    name = user.name;
    email = user.email;
    phoneNo = user.phoneNo.toString();

    firstname = lastname = rollno = regno = degree = branch = year = "";

    if (profile) {
      console.log("lol");
      if (profile.firstname) firstname = profile.firstname;
      if (profile.lastname) lastname = profile.lastname;
      if (profile.rollno) rollno = profile.rollno;
      if (profile.regno) regno = profile.regno;
      if (profile.degree) degree = profile.degree;
      if (profile.branch) branch = profile.branch;
      if (profile.year) year = profile.year;
    }

    const obj = {
      name: name,
      email: email,
      phoneNo: phoneNo,
      firstname: firstname,
      lastname: lastname,
      rollno: rollno,
      regno: regno,
      degree: degree,
      branch: branch,
      year: year,
    };

    registrants.push(obj);
  }

  const fileName = post.title.toString() + "_" + shortid.generate() + ".csv";
  const fileLocation = `${baseDirCsv}${fileName}`;

  await fs.open(fileLocation, "w", function (err) {
    if (err) console.log(err);
    console.log("File Created!");
  });

  const csvWriter = createCsvWriter({
    path: fileLocation,
    header: [
      "name",
      "email",
      "phoneNo",
      "firstname",
      "lastname",
      "rollno",
      "regno",
      "degree",
      "branch",
      "year",
    ].map((item) => ({ id: item, title: item })),
  });

  try {
    await csvWriter
      .writeRecords(registrants)
      .then(() => {
        console.log("Saved succesfully");
      })
      .catch((err) => {
        console.log("Save failed", err);
      });
  } catch (err) {
    console.log(err);
  }

  res.status(200).download(fileLocation);
});

module.exports = router;
