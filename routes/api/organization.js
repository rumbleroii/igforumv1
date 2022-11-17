const router = require("express").Router();

const Organization = require("../../models/Organization.js");

router.post("/register", async (req, res) => {
  const { name, email, avatar } = req.body;

  if (
    !email.includes("@student.nitw.ac.in") &&
    !email.includes("@nitw.ac.in")
  ) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Sign in through Institute Email" }] });
  }

  let organization = await Organization.findOne({ name });
  if (organization) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Organization Already Exists" }] });
  }

  organization = await Organization.findOne({ email });
  if (organization) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Organization Already Exists" }] });
  }

  organization = new Organization({
    name,
    email,
    avatar,
  });

  await organization.save();
  return res.status(200).json({
    msg: "Organization created",
    organization: organization,
  });
});

router.delete("/delete/:id", async (req, res) => {
  const organization = await Organization.findById(req.params.id);

  if (!organization) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Organization not found" }] });
  }

  await Organization.deleteOne({ _id: req.params.id });
  return res.status(200).json({ msg: "Organization Deleted successfully" });
});

module.exports = router;
