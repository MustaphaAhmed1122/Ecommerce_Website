//From Gmail
import nodemailer from "nodemailer";
async function SendEmail({
  to = [],
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.G_Email,
      pass: process.env.G_Password,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.Appname} 👻 <${process.env.G_Email}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
  });
  return info.rejected.length ? false : true;
}

//From Outlock
// import nodeoutlook from "nodejs-nodemailer-outlook";
// async function SendEmail({
//   to = [],
//   cc,
//   bcc,
//   subject,
//   text,
//   html,
//   attachments = [],
// } = {}) {
//   nodeoutlook.sendEmail({
//     auth: {
//       user: process.env.outlock_Email,
//       pass: process.env.outlock_Password,
//     },
//     from: process.env.outlock_Email,
//     to,
//     subject,
//     html,
//     text,
//     attachments,
//     onError: (e) => console.log(e),
//     onSuccess: (i) => console.log(i),
//   });
// }

export default SendEmail;
