const nodemailer = require("nodemailer");

const user = "IGForum_DontReply@outlook.com";
const pass = "igforum1@";

module.exports = async (reciverMail, post) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  const message = {
    from: user,
    to: reciverMail,
    subject: "Confirmation Mail",
    text: `Thank you for registering for the ${post.title}, Please join the WA Link attached below`,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
      return info.response;
    }
  });
};
