const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const sendResetPasswordEmail = async (email, resetToken) => {
    // create a transporter object to send email
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'email@example.com',
            pass: 'password'
        }
    });
    
    // set up email options
    let mailOptions = {
        from: '"Reset Password" <resetpassword@example.com>',
        to: email,
        subject: 'Reset Password',
        html: `<p>Hello,</p><p>You have requested to reset your password. Please click the link below to reset your password:</p><p><a href="http://example.com/reset-password?token=${resetToken}">Reset Password</a></p>`
    };
    
    // send email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
}

exports.signup = (req, res) => {
    // Validate the user input
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required'
        });
    }
  
    // Check if user with the same email already exists
    User.findOne({ email }).then((existingUser) => {
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User with that email already exists'
            });
        }
  
        // Hash the password
        bcrypt.hash(password, 10).then((hashedPassword) => {
            // Create new user
            const user = new User({
                name,
                email,
                password: hashedPassword
            });
  
            // Save the user to the database
            user.save().then((savedUser) => {
                res.status(201).json({
                    status: 'success',
                    user: savedUser
                });
            }).catch((err) => {
                res.status(500).json({
                    status: 'error',
                    message: 'Error saving the user to the database'
                });
            });
        });
    });
};
  
exports.login = (req, res) => {
    // Validate the user input
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required'
        });
    }

    // Check if user with the email exists
    User.findOne({ email }).then((existingUser) => {
        if (!existingUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User with that email does not exist'
            });
        }

        // Compare the password
        bcrypt.compare(password, existingUser.password).then((isMatched) => {
            if (isMatched) {
                // Generate a token
                // Send the token to the client
                return res.status(200).json({
                    status: 'success',
                    token: 'your_token_here'
                });
            } else {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Incorrect password'
                });
            }
        });
    });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // generate a reset token and expiration date
        const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 600000;
        await user.save();

        // send the reset password email
        await sendResetPasswordEmail(email, resetToken);

        res.status(200).json({ message: 'Reset password email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, token } = req.body;
    // reset password logic
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.user.id });
        
        if (!user) {
            return res.status(401).json({ msg: 'Invalid token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        sendResetPasswordEmail(req.body.email)
        res.status(200).json({ message: 'Email sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};