const nodeMailer= require("nodemailer")



module.exports = async (email, subject, text) => {
    try {
        let transporter = nodeMailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.USER, // generated ethereal user
                pass: process.env.PASS, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log(email,12);
        console.log("hygh");
        console.log(info.messageId)
    } catch (error) {
        console.log("something went wrong")
        console.log(error)
    }
}