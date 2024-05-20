const { TokenExpiredError } = require("jsonwebtoken");
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const asynchandler = require("../middleware/asyncErrorhandler");
const Errorhandler = require("../utils/errorHandler");
const util = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { nextTick } = require("process");
const path = require('path');
const { error } = require("console");


// TOKEN FUNCTION CREATED
const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXP,
    });
};


// FOR SIGNUP USER
exports.signup = asynchandler(async (req, res, next) => {
    // FIRST USER CREATED
    
    const newUser = await User.create(req.body);
    // console.log(newUser.password);
    // console.log("def");

    // TOKEN CREATED CALLING
    const token = signToken(newUser._id);

    // RESPONSE OF SERVER SIDE
    res.status(201).json({
        status: " Success ",
        token, //TOKEN GIVEN TO CLIENT SIDE
        message: 'User Successfully SignUp',
    });
    return;
    
});

// FOR LOGIN USER

exports.login = asynchandler(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // CEHCK IF THE EMAIL ID AND PASSWORD IS GIVEN TO THE REQUEST BODY
    if (!email || !password) {
        const err = new Errorhandler("Provide the email and password to the body", 400);
        return next(err);
    }

    // CHECK THE USER IS EXIST IN DATABASE WITH GIVEN EMAIL

    const user = await User.findOne({ email }).select("+password");

    //COMPARE PSWD IN DB AND USER CHECK IF THE USER EXIST & PASSWORD MATCHES
    // const isMatch = await user.comparePasswrodIndb(password, user.password);


    if (!user || !(await user.comparePasswordIndb(password, user.password))) {
        const err = new Errorhandler("Incorrect email and password!", 400);
        return next(err);
    }
    // console.log(password +" = pswd");

    //CREATED TOKEN CALLING
    const token = signToken(user._id);

    res.status(200).json({
        status: " Success ",
        token,
        message: "Data is valid",
    });
});

// ALL PRTOECTION GIVEN TO THIS BELOW FUNCTION, BELOW THIS USED FOR IF USER IS LOGIN SO USER CAN ACCESS THE DATA
exports.protect = asynchandler(async (req, res, next) => {
    // 1> READ THE TOKEN & CHECK IF ITS EXIST IN Request Header
    const testToken = req.headers.authorization;;
    // const testToken = req.headers.Authorization;
    // console.log(testToken,"qwertyuiop");
    let token;
    if ((testToken) && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }
    if (!token) {
        next(new Errorhandler("You are not loggedin! "));
    }
    // 2> validate the token
    // console.log("abc");
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    // console.log(decodedToken);
    // 3> If the user is exists
    const user = await User.findById(decodedToken.id);
    // console.log(user);
    if (!user) {
        const err = new Errorhandler('The user with given token is does not valid', 401);
        next(err);
    }
    // 4> If the user is changed password
    const isPswdChanged = await user.isPasswordChanged(decodedToken.iat);
    // console.log(isPswdChanged);
    if (isPswdChanged) {
        const err = new Errorhandler("The password changed successfully please login again", 401);
        return next(err);
    } //iat stand for issue at token time
    // // 5> Allow user to access route
    req.user = user;
    next();
});

exports.forgotPassword = asynchandler(async (req, res, next) => {
    // 1> GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        // const err = new Errorhandler('Given email user is not exist in database', 404);
        res.status(400).json({
            message : "Given email user is not exist in database"
        });
    }
    //  2> GENERATE A RANDOM RESET TOKEN
    const resetToken = user.resetPasswordToken();
    // console.log(resetToken  +"token 1");
    await user.save({ validateBeforeSave: false });
    //  3> SEND THE TOKEN BACK TO THE USER EMAIL
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword?token=${resetToken}`;

    // const resetUrl = `${req.protocol}://${req.get('host')}/public/resetpassword.html`;
    const message = `we have recieved a password  reset request. please use the below link to reset your password\n\n${resetUrl}\n\n This link is valid only for 10 minutes`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request is received',
            message: message
        });
        // res.render('resetPassword')
        res.status(200).json({
            status: "success",
            message: 'password reset link send to the user mail'
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        user.save({ validateBeforeSave: false });
        const err = new Errorhandler('There was error in sending reset password email.please try again letter', 500);
        return next(err);
    }
    next();
});

exports.getResetPassword = asynchandler(async(req,res,next)=>{ 
    res.sendFile(path.join(__dirname, '../../public/resetpassword.html'));
});


exports.resetPassword = asynchandler(async (req, res, next) => {
    // 1> IF THE USER EXISTS WITH  THE GIVEN TOKEN & TOKEN HAS NOT DEFINE
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // console.log(token + " token 2");
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
        const err = new Errorhandler('Token is invald or has expired', 400);
        return next(err);
    }
    

    if (req.body.password.length < 8) {
        return res.status(400).json({message : "Password must be at least 8 characters long"})
    }
    // 2> RESETNG THE  USER PASSWORD
    
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.PasswordChangedAt = Date.now();

    user.save();
    // 3> AFTER THAT USER IS LOGIN AUTOMATICALLY

    const loginToken = signToken(user._id);

    res.status(200).json({
        status: " Success ",
        token: loginToken,
        message: "Data is valid",
    });
});
