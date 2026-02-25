const express = require('express');
const feedModel = require('../Model/feedModel');
feedRoute = express.Router();

feedRoute.post('', async(req, res) => {
    try {
        const feed = await feedModel.create(req.body);
        await feed.populate('uid');
        res.json({ "msg": "Success" });
    } catch (error) {

        res.json({ msg: "Error", error });
    }

});

feedRoute.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await feedModel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
});

feedRoute.get('/u/:uid', async(req, res) => {
    try {
        const feed = await feedModel.find({ "uid": req.params.uid }).populate('uid');
        res.json({ "msg": "Success", value: feed })
    } catch (error) {
        res.json("error", error)
    }

});



feedRoute.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await feedModel.findByIdAndDelete(id).populate('uid');
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
});

feedRoute.get('', async(req, res) => {
    try {
        const feed = await feedModel.find().populate('uid');
        res.json({ "msg": "Success", "value": feed });
    } catch (error) {
        res.json({ "msg": error });
    }

});



feedRoute.get('/:id', async(req, res) => {
    try {
        const feed = req.params.id;
        await feedModel.findById(id).populate('uid');
        res.json({ "msg": "Success", "value": feed });
    } catch (error) {
        res.json({ "msg": error });
    }
});



module.exports = feedRoute;