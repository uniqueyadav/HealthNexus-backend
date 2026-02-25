const express = require('express');
const newsModel = require('../Model/newsModel');
newsRoute = express.Router();
newsRoute.get('', async(req, res) => {

    try {
        const news = await newsModel.find();
        res.json({ "msg": "Success", "value": news });
    } catch (error) {
        res.json({ "msg": error });
    }

})
newsRoute.get('/:id', async(req, res) => {
    try {
        const news = req.params.id;
        await newsModel.findById(id);
        res.json({ "msg": "Success", "value": news });
    } catch (error) {
        res.json({ "msg": error });
    }
});



newsRoute.post('', async(req, res) => {
    try {
        await newsModel.create(req.body);
        res.json({ msg: "Success" });
    } catch (error) {
        if (error.code === 11000) {
            res.json({ msg: "Duplicate", field: Object.keys(error.keyPattern)[0] });
        } else {
            res.json({ msg: "Error", error });
        }
    }
});
newsRoute.put('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await newsModel.findByIdAndUpdate(id, req.body);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
newsRoute.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        await newsModel.findByIdAndDelete(id);
        res.json({ "msg": "Success" });
    } catch (error) {
        res.json({ "msg": error });
    }
})
module.exports = newsRoute;