const express = require('express');
const prescriptionRoute = express.Router();
const prescriptionModel = require('../Model/prescriptionModel');

// ✅ 1. Add New Prescription
prescriptionRoute.post('/add', async(req, res) => {
    try {
        const { appId, pid, did, medicines, advice } = req.body;

        // Basic Validation
        if (!appId || !pid || !did || !medicines || medicines.length === 0) {
            return res.status(400).json({ msg: "Please provide all required fields (App ID, Patient ID, Doctor ID, and Medicines)" });
        }

        const newPrescription = new prescriptionModel({
            appId,
            pid,
            did,
            medicines,
            advice
        });

        await newPrescription.save();
        res.status(201).json({ msg: "Success", value: newPrescription });
    } catch (err) {
        console.error("Error adding prescription:", err);
        res.status(500).json({ msg: "Server Error while saving prescription" });
    }
});

// ✅ 2. Get Prescriptions for a Specific Patient
// Use this in Patient Dashboard to show their history
prescriptionRoute.get('/patient/:pid', async(req, res) => {
    try {
        console.log("Searching prescriptions for Patient ID:", req.params.pid);

        // Pehle bina populate ke check karte hain
        const data = await prescriptionModel.find({ pid: req.params.pid })
            // .populate('did', 'name spe')  <-- Isse abhi ke liye comment kar do
            // .populate('appId', 'date time') <-- Isse bhi comment kar do
            .sort({ createdAt: -1 });

        console.log("Prescriptions found:", data);
        res.json({ msg: "Success", value: data });
    } catch (err) {
        console.error("BACKEND CRASH ERROR:", err); // Ye terminal mein error dikhayega
        res.status(500).json({ msg: "Error fetching records", detail: err.message });
    }
});

// ✅ 3. Get Prescriptions given by a Specific Doctor
// Use this in Doctor Dashboard to see history of prescriptions they've issued
prescriptionRoute.get('/doctor/:did', async(req, res) => {
    try {
        const data = await prescriptionModel.find({ did: req.params.did })
            .populate('pid', 'name number') // Gets Patient name and contact
            .sort({ createdAt: -1 });

        res.json({ msg: "Success", value: data });
    } catch (err) {
        console.error("Error fetching doctor prescriptions:", err);
        res.status(500).json({ msg: "Error fetching history" });
    }
});

module.exports = prescriptionRoute;