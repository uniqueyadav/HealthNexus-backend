const express = require('express');
const doctorModel1 = require('../Model/doctorModel1');
const feedModel = require('../Model/feedModel');
const appModel = require('../Model/appModel');
doctorRoute = express.Router();
doctorRoute.get('', async(req, res) => {

    try {
        const doc = await doctorModel1.find();
        res.json({ "msg": "Success", "value": doc });
    } catch (error) {
        res.json({ "msg": error });
    }

});

doctorRoute.get('/stats/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const f = await feedModel.find({ "type": "Feedback", "uid": id });
        const s = await feedModel.find({ "type": "Suggestion", "uid": id });
        const c = await feedModel.find({ "type": "Complain", "uid": id });
        const a = await appModel.find({ "did": id });
        const pena = await appModel.find({ "status": "pending", "did": id });
        const coma = await appModel.find({ "status": "completed", "did": id });
        const cona = await appModel.find({ "status": "confirmed", "did": id });
        const cana = await appModel.find({ "status": "cancelled", "did": id });
        const stats = { "f": f.length, "s": s.length, "c": c.length, "a": a.length, "pena": pena.length, "coma": coma.length, "cona": cona.length, "cana": cana.length };
        res.json({ "msg": "Success", value: stats });
    } catch (error) {
        res.json({ "msg": error });
    }
});

// Change Password - Doctor
doctorRoute.post('/change-password', async(req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        const doctor = await doctorModel1.findById(id);

        if (!doctor) {
            return res.json({ msg: "Doctor Not Found" });
        }

        if (doctor.password !== oldPassword) {
            return res.json({ msg: "Old Password Incorrect" });
        }

        doctor.password = newPassword;
        await doctor.save();

        res.json({ msg: "Password Updated Successfully" });

    } catch (error) {
        res.json({ msg: error.message });
    }
});

doctorRoute.get('/:id', async(req, res) => {
    try {
        const doc = req.params.id;
        await doctorModel1.findById(id);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
});

doctorRoute.post('/login', async(req, res) => {
    try {
        let { email, password } = req.body;


        email = email.trim().toLowerCase();

        console.log("👉 Email received:", email);
        console.log("👉 Password received:", password);

        const ad = await doctorModel1.findOne({ email: email });
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

doctorRoute.post('', async(req, res) => {
    try {
        await doctorModel1.create(req.body);
        res.json({ msg: "Success" });
    } catch (error) {
        if (error.code === 11000) {
            res.json({ msg: "Duplicate", field: Object.keys(error.keyPattern)[0] });
        } else {
            res.json({ msg: "Error", error });
        }
    }
});
doctorRoute.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await doctorModel1.findByIdAndUpdate(id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
doctorRoute.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await doctorModel1.findByIdAndDelete(id);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
const nodemailer = require("nodemailer");
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
// Send OTP
doctorRoute.post('/forgot-password', async(req, res) => {
    try {
        const { email } = req.body;

        const user = await doctorModel1.findOne({ email });

        if (!user) {
            return res.json({ msg: "User Not Found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

        res.json({ msg: "OTP Sent to Email" });

    } catch (error) {
        res.json({ msg: error.message });
    }
});
// Verify OTP & Reset Password
doctorRoute.post('/reset-password', async(req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await doctorModel1.findOne({ email });

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
module.exports = doctorRoute;