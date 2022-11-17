
const memberAuth = require('../Models/authModel');
const sendEmail = require('../utilities/email')
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');


let maxAge = 3*24*60*60
const createjwt = (id)=>{
    return jsonwebtoken.sign({id},process.env.SECRET,{
        expiresIn:maxAge
    })
 };

const memberSignUp = async(req,resp)=>{
try {
    // const data = await 
    console.log(req.body);
    const memberRegestered = await memberAuth.create(req.body);
    const id = memberRegestered._id;
    //generate token and pass the cookie inside.
    const tk = createjwt(id);
    resp.cookie("kyusdamember",tk,{httpOnly:true,maxAge: maxAge* 1000});
    resp.status(200).json({
        status:'success',
        email:memberRegestered.email,
        tk
    })
    console.log(memberRegestered);
} catch (error) {
    console.log(error);
    resp.status(404).json({
        status:'failure',
       error
    })
}
}

const memberSignin = async(req,resp)=>{
    try{
const {email,password} = req.body;
const loggedMember = await memberAuth.login(email,password);
console.log(loggedMember);
const id = loggedMember._id;
const tk = createjwt(id);
resp.cookie("kyusdamember",tk,{httpOnly:true,maxAge: maxAge* 1000});
resp.status(200).json({
    status:'success',
    email:loggedMember.email,
    tk
})
}catch(err){
resp.status(404).json({
    status:'failure',
    err
})
    }
}
const memberResetToken = async(req,resp)=>{
try
{
    const {email} = req.body;
    console.log(email);
    //generate a token from methods
let getMember = await memberAuth.findOne({email})
const tokenGen = await getMember.resetToken();
console.log(tokenGen);
 //save to database
 await getMember.save({validateBeforeSave:false});
 const resetUrl = 
`${req.protocol}://localhost:3000/resetPassword`;
console.log(resetUrl);
const message = 
`sorry,we heard you lost your password, don't worry click here to reset it:`
    await sendEmail({
        email:getMember.email,
        subject:'your reset token ,expires in the next 1hr (60min)',
        url:resetUrl,
        message:message
    })
    resp.status(200).json({
    status:'success',
    resetToken:tokenGen,
    message
})
}catch(err){
    resp.status(404).json({
        status:'failure',
        err
    })
}
}

const resetPassword = async(req,resp)=>{
    const tk = req.params.token
    console.log(req.body,'values include');
    console.log(tk);
    try{
        const hashToken = crypto.createHash('sha256').update(tk).digest('hex');
        console.log(hashToken);
    //     let getMember = await memberAuth.findOne({
    // passwordresetToken:hashToken, 
    // resetTokenexpires:{$gt:Date.now()}});
    // console.log(getMember);
    const getMember = await memberAuth.findOne({
        passwordresetToken:hashToken,
        resetTokenexpires:{$gt:Date.now()}})
    console.log(getMember);
    if(getMember){
        getMember.password = req.body.password;
        getMember.passwordConfirm = req.body.passwordConfirm;
        getMember.resetTokenSetAt = Date.now();
        getMember.passwordresetToken = undefined;
        getMember.resetTokenexpires = undefined;
        await getMember.save()
        resp.status(200).json({
        status:'success',
        message:'password updated succesfully',
        redirect:'signIn'
    })
    }
    }catch(err){
    resp.status(404).json({
        status:"fail",
        err
    })
    }
}



module.exports = {memberSignUp,memberSignin,
    memberResetToken,resetPassword};