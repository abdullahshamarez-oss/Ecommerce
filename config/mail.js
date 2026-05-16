require(`dotenv`).config();

const nodemailer = require(`nodemailer`);

const transporter = nodemailer.createTransport({
    service:`gmail`,
    auth:{
        user: process.env.USER,
        pass: process.env.PASS
    }
})

const sendEmail = async( to , subject, text)=>{
    try{
        const mail =await transporter.sendMail({
            from: process.env.user,
            to,
            subject,
            text,
        });
    } catch(error){
        console.error(`Error: ${error.message}`);
    }
}

module.exports = {
    transporter,
    sendEmail
}