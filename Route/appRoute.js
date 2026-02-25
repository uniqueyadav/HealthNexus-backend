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


module.exports = appRoute;