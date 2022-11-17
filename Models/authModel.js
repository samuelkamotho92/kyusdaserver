const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const authSchema = new Schema(
    {
        firstName:{
            type:String,
            required:[true,'please enter your firstname']
        },
        lastName:{
            type:String,
            required:[true,'please enter your lastname']
        },
        email:{
            type:String,
            required:[true,'please enter your email'],
            validate:[isEmail,'please enter a valid email'],
            lowerCase:true,
            unique:true
        },
        registration:{
            type:String,
            required:[true,'please enter your registration number'],
            minlength:[10,'please enter a minlength of 10'],
            unique:true
        },
        course:{
            type:String,
            required:[true,'please enter your course']
        },
        year:{
            type:Number,
            required:[true,'please enter year of study']
        },
        password:{
            type:String,
            required:[true,'please enter your password'],
            minlength:[8,'please enter 8 or more characters']
        },
        passwordConfirm:{
            type:String,
            required:[true,"please enter password confirm"],
            validate:{
                validator:function(el){
                    return el === this.password
                },
                message:`Enter the correct password confirmation`
            }
        },
        role:{
            type:String,
            enum:["member","elder","admin"],
            default:"member"
        },
        passwordresetToken:String,
        resetTokenSetAt:Date,
        resetTokenexpires:Date

    }
)
//hash password
authSchema.pre("save",async function(next){
    if(!this.isModified("password")){
next()
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    this.passwordConfirm = undefined;
    next();
})

//login member
authSchema.statics.login = async function (email,password) {
    const member = await this.findOne({email}); 
    if(member)
    {
  const auth = await bcrypt.compare(password,member.password);
  if(auth){
 return member;
  }
  throw Error("incorrect password");
    }
    throw Error("incorrect email");
  }


  //send the reset Token
  authSchema.methods.resetToken = async function(email){
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordresetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetTokenexpires= Date.now() + 60 * 60 * 1000;
    console.log(token, this.passwordresetToken);
    return token
    }





const authModel = mongoose.model('member',authSchema);
module.exports = authModel;