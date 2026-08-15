import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method!=='POST'){
        return res.status(405).json({error:'Method not allowed'});
    }
    try{
        const {name,email,subject,tripName='NewTrip',inviterName='creator',password=''} = req.body;

        // const {data,error}=await resend.emails.send({
        //     from: 'TripApp <onboarding@resend.dev>',
        //     to: process.env.NODE_ENV === 'development' ? 'sarchit0111@gmail.com' : email,
        //     subject:subject,
        //     html:`
        //     <div style='font-family: sans-serif; padding:20px;'>
        //     <h2>Hey ${name}! 👋</h2>
        //     <p>Cogratulations🥳 you have successfully signup. Welcome to the our platform <strong>SAJHEDAR</strong> and thamks a lot for joining us.</p>
        //     <p><strong>Your email:</strong> ${email}</p>
        //     <p><strong>Your Password:</strong> ${password}</p>
        //     <p style='padding-top:20px'></p>
        //     <p>Thankyou 😊</p>
        //     </div>
        //     `
        // });

        // if(error){
        //     return res.status(400).json({error});
        // }

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        })

        await transporter.sendMail({
            from:`'Sajhedar' <${process.env.SMTP_USER}`,
            to:email,
            subject:subject,
            html:`
            <div style='font-family: sans-serif; padding:20px;'>
            <h2>Hey ${name}! 👋</h2>
            <p>Cogratulations🥳 you have successfully signup. Welcome to the our platform <strong>SAJHEDAR</strong> and thanks a lot for joining us.</p>
            <p><strong>Your email:</strong> ${email}</p>
            <p><strong>Your Password:</strong> ${password}</p>
            <p style='padding-top:20px'></p>
            <p>Thankyou 😊</p>
            </div>
            `
        });

        return res.status(200).json({success:true,message:'Email sent successfully!'});
    }catch(e){
        return res.status(500).json({e});
    }
}