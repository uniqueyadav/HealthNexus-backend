const express = require('express');
const regModel = require('../Model/regModel');
regRoute = express.Router();
const nodemailer = require('nodemailer');
regRoute.get('', async(req, res) => {

    try {
        const doc = await regModel.find();
        res.json({ "msg": "Success", "value": doc });
    } catch (error) {
        res.json({ "msg": error });
    }

});

// Change Password - Patient
regRoute.post('/change-password', async(req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        const user = await regModel.findById(id);

        if (!user) {
            return res.json({ msg: "User Not Found" });
        }

        if (user.password !== oldPassword) {
            return res.json({ msg: "Old Password Incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ msg: "Password Updated Successfully" });

    } catch (error) {
        res.json({ msg: error.message });
    }
});

regRoute.get('/getuser/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const user = await regModel.findById(id);

        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        res.json({ msg: "Success", data: user });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

regRoute.post('/login', async(req, res) => {
    try {
        let { email, password } = req.body;


        email = email.trim().toLowerCase();

        console.log("👉 Email received:", email);
        console.log("👉 Password received:", password);

        const ad = await regModel.findOne({ email: email });
        console.log("👉 Found in DB:", ad);

        if (!ad) {
            return res.json({ msg: "Not Found" });
        }

        if (ad.password === password) {
            return res.json({ msg: "Success", "id": ad._id });
        } else {

            return res.json({ msg: "Invalid credentials" });
        }

    } catch (error) {
        console.error("👉 Error:", error);
        res.json({ msg: error.message });
    }
});

regRoute.get('/:id', async(req, res) => {
    try {
        const doc = req.params.id;
        await regModel.findById(id);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
regRoute.post('', async(req, res) => {
    try {
        await regModel.create(req.body);
        sendMail(req.body.email, "Registration Successfully ", `Welcome to healthnexus🎉\n Hello ${req.body.name} \n Registration was Successful \n Thankyou for Joining HealthNexus \n Password ${req.body.password} \n Number ${req.body.number}`)
        res.json({ msg: "Success" });
    } catch (error) {
        if (error.code === 11000) {
            res.json({ msg: "Duplicate", field: Object.keys(error.keyPattern)[0] });
        } else {
            res.json({ msg: "Error", error });
        }
    }
});

const sendMail = async(to, subject, message) => {
    try {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transport.sendMail({
            from: `"HealthNexus" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: message
        });

        console.log("Mail sent Successfully ✅");

    } catch (error) {
        console.log("Error during mail ❌", error);
    }
};

regRoute.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await regModel.findByIdAndUpdate(id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
regRoute.delete('/:id', async(req, res) => {
        try {
            const id = req.params.id;
            await regModel.findByIdAndDelete(id);
            res.json({ "msg": "Success" });
        } catch (error) {
            res.json({ "msg": error });
        }
    })
    //  Send OTP
regRoute.post('/forgot-password', async(req, res) => {
    try {
        const { email } = req.body;

        const user = await regModel.findOne({ email });

        if (!user) {
            return res.json({ msg: "User Not Found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        await sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

        res.json({ msg: "OTP Sent to Email" });

    } catch (error) {
        res.json({ msg: error.message });
    }
});
// Verify OTP & Reset Password
regRoute.post('/reset-password', async(req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await regModel.findOne({ email });

        if (!user) return res.json({ msg: "User Not Found" });

        if (user.otp !== otp) {
            return res.json({ msg: "Invalid OTP" });
        }

        if (user.otpExpire < Date.now()) {
            return res.json({ msg: "OTP Expired" });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.json({ msg: "Password Reset Successfully" });

    } catch (error) {
        res.json({ msg: error.message });
    }
});
module.exports = regRoute;