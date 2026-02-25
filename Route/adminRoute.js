const express = require('express');
const adminModel = require('../Model/adminModel');
const doctorModel1 = require('../Model/doctorModel1');
const regModel = require('../Model/regModel');
const feedModel = require('../Model/feedModel');
const newsModel = require('../Model/newsModel');
const appModel = require('../Model/appModel');
const adminRoute = express.Router();

adminRoute.get('/', (req, res) => {
    res.send("Hello Admin Route");
});

adminRoute.get('/stats', async(req, res) => {
    try {
        const d = await doctorModel1.find();
        const p = await regModel.find();
        const f = await feedModel.find({ "type": "Feedback" });
        const s = await feedModel.find({ "type": "Suggestion" });
        const c = await feedModel.find({ "type": "Complain" });
        const n = await newsModel.find();
        const a = await appModel.find();
        const pena = await appModel.find({ "status": "pending" });
        const coma = await appModel.find({ "status": "completed" });
        const cona = await appModel.find({ "status": "confirmed" });
        const cana = await appModel.find({ "status": "cancelled" });
        const stats = { "d": d.length, "p": p.length, "f": f.length, "s": s.length, "c": c.length, "n": n.length, "a": a.length, "pena": pena.length, "coma": coma.length, "cona": cona.length, "cana": cana.length };
        res.json({ "msg": "Success", value: stats });
    } catch (error) {
        res.json({ "msg": error });
    }
});

adminRoute.post('/login', async(req, res) => {
    try {
        let { email, password } = req.body;


        email = email.trim().toLowerCase();

        console.log("👉 Email received:", email);
        console.log("👉 Password received:", password);

        const ad = await adminModel.findOne({ email: email });
        console.log("👉 Found in DB:", ad);

        if (!ad) {
            return res.json({ msg: "Not Found" });
        }

        if (ad.password === password) {
            return res.json({ msg: "Success" });
        } else {

            return res.json({ msg: "Invalid credentials" });
        }

    } catch (error) {
        console.error("👉 Error:", error);
        res.json({ msg: error.message });
    }
});



module.exports = adminRoute;