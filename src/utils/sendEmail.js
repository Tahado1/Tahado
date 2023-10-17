import nodemailer from 'nodemailer';

async function sendEmail({to='',subject='',message='',attachments=[]}={}){
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.SENDER_EMAIL,
            pass:process.env.SENDER_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
          }
    })
    let info = await transporter.sendMail({
        from: `"Thado Egypt" <${process.env.SENDER_EMAIL}>`, 
        to,
        subject,
        html:message,
        attachments
    });
    if(info.accepted.length){
        return true;

    }
    return false
}

export default sendEmail