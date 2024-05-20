const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter your name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Enter your email '],
        lowercase: true,
        validate: [value => validator.isEmail(value), "Please Enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        // required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return value == this.password;
            },
            message: 'password and confirmpassword are not match!'
        }
    },
    PasswordChangedAt: Date,
    passwordResetToken : String,
    passwordResetTokenExpire : Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //Password is Convert palintext to ciphertext
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
});

// Compare password if user and store password in db
userSchema.methods.comparePasswordIndb = async (pswd,pswdDb)=>{
    return await bcrypt.compare(pswd, pswdDb);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if (this.PasswordChangedAt) {
        const pswdCahngedTimestamp = parseInt(this.PasswordChangedAt.getTime() / 1000,10);
        // console.log(pswdCahngedTimestamp,JWTTimestamp);

       return JWTTimestamp < pswdCahngedTimestamp;
    }
    return false;
}

userSchema.methods.resetPasswordToken = function(){
    // CREATETOKEN
    const resetToken = crypto.randomBytes(32).toString('hex');
    // ENCRYPT THE TOKEN FOR STORE IN THE DB.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // SET THE TOKEN EXPIRE_TIME
    this.passwordResetTokenExpire = Date.now + (10*60*1000);
    // console.log(resetToken , this.passwordResetToken);
    return resetToken;
}


const User = new mongoose.model('User', userSchema);

module.exports = User;