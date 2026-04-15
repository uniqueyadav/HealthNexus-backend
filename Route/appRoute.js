const express = require('express');
const appModel = require('../Model/appModel');
const appRoute = express.Router();

appRoute.post('', async(req, res) => {
    try {
        await appModel.create(req.body);
        res.json({ "msg": "Success" })
    } catch (error) {
        res.json("error", error)

    }
});
appRoute.get('', async(req, res) => {
    try {
        const app = await appModel.find().populate("pid").populate('did');
        res.json({ "msg": "Success", "value": app });
    } catch (error) {
        res.json("error".error)
    }
});
appRoute.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await appModel.findByIdAndUpdate(id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json("error", error);
    }
});
appRoute.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await appModel.findByIdAndDelete(id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json("error", error);
    }
});
appRoute.get('/p/:pid', async(req, res) => {
    try {
        const pid = req.params.pid;
        const app = await appModel.find({ pid: pid }).populate("pid").populate('did');
        res.json({ "msg": "Success", value: app });
    } catch (error) {
        res.json("error".error)
    }
});
appRoute.get('/d/:did', async(req, res) => {
    try {
        const did = req.params.did;
        const app = await appModel.find({ did: did }).populate("pid").populate('did');
        res.json({ "msg": "Success", value: app });
    } catch (error) {
        res.json("error".error)
    }
});
appRoute.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const app = await appModel.findById(id).populate("pid").populate('did');
        res.json({ "msg": "Success", value: app });
    } catch (error) {
        res.json("error", error)
    }
});
appRoute.get('/doctor/:did', async(req, res) => {
    try {
        // did (Doctor ID) ke basis par saare appointments find karo
        const appointments = await AppointmentModel.find({ did: req.params.did })
            .populate('pid', 'name') // Patient ka naam nikalne ke liye populate
            .sort({ date: 1 }); // Date wise sort

        res.json({ msg: "Success", value: appointments });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching appointments" });
    }
});


module.exports = appRoute;